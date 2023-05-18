import pandas as pd
import numpy as np
import string
import re
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
from nltk.corpus import wordnet
from nltk import pos_tag
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from date import is_room_available

mongo_url = "mongodb+srv://rifaiiaya202:Ayarifaii@cluster0.edtrdfl.mongodb.net/test"
client = MongoClient(mongo_url)
db = client['hotel']
collection = db['conversation']

stopwords_list = stopwords.words('english')

lemmatizer = WordNetLemmatizer()


def my_tokenizer(doc):
    words = word_tokenize(doc)

    pos_tags = pos_tag(words)

    non_stopwords = [w for w in pos_tags if not w[0].lower() in stopwords_list]

    non_punctuation = [
        w for w in non_stopwords if not w[0] in string.punctuation]

    lemmas = []
    for w in non_punctuation:
        if w[1].startswith('J'):
            pos = wordnet.ADJ
        elif w[1].startswith('V'):
            pos = wordnet.VERB
        elif w[1].startswith('N'):
            pos = wordnet.NOUN
        elif w[1].startswith('R'):
            pos = wordnet.ADV
        else:
            pos = wordnet.NOUN

        lemmas.append(lemmatizer.lemmatize(w[0], pos))

    return lemmas


tfidf_vectorizer = TfidfVectorizer(tokenizer=my_tokenizer)

# Use find() method to get all documents in the collection
data = collection.find({}, {"_id": 0})

# # Extract all questions from the list of dictionaries
all_questions = [d['Question '] for d in data]

# # Transform the list of questions into a tuple and pass it to fit_transform()
tfidf_matrix = tfidf_vectorizer.fit_transform(all_questions)

data = list(collection.find({}, {"_id": 0}))
# Convert the list of dictionaries to a Pandas DataFrame
data_df = pd.DataFrame(data)


class Item():
    def __init__(self, question, answer, link, similarity):
        self.question = question
        self.answer = answer
        self.link = link
        self.similarity = similarity


def ask_question(question) -> Item:
    query_vect = tfidf_vectorizer.transform([question])
    similarity = cosine_similarity(query_vect, tfidf_matrix)
    max_similarity = np.argmax(similarity, axis=None)
    text = data_df.iloc[max_similarity]['Answer']
    pattern = r'http[s]?://[^ ]+'
    link = re.findall(pattern, text)

    return Item(data_df.iloc[max_similarity]['Question '],
                data_df.iloc[max_similarity]['Answer'],
                link,
                similarity[0, max_similarity])


def test(question) -> Item:
    if ask_question(question).similarity < 1:
        return print("")
    return ask_question(question)


app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/{question}")
async def create_item(question: str):
    return test(question)


@app.get("/room/{room_type}/{check_in_date}/{check_out_date}")
async def check_room_availability(room_type: str, check_in_date: str, check_out_date: str):
    return is_room_available(room_type, check_in_date, check_out_date)




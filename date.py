from datetime import datetime
from pymongo import MongoClient


def is_room_available(room_type, check_in_date, check_out_date):
    # Connect to MongoDB
    client = MongoClient("mongodb+srv://rifaiiaya202:Ayarifaii@cluster0.edtrdfl.mongodb.net/test")
    db = client["hotel"]
    collection = db["book"]

    # Convert input dates to datetime objects
    check_in_date = datetime.strptime(check_in_date, "%Y-%m-%d")
    check_out_date = datetime.strptime(check_out_date, "%Y-%m-%d")

    # Query MongoDB for overlapping bookings
    overlapping_bookings = collection.find({
        "typeofchl": room_type,
        "$or": [
            {"dateIn": {"$lt": check_out_date}, "dateOut": {"$gt": check_in_date}},
            {"dateIn": {"$gte": check_in_date, "$lte": check_out_date}},
        ]
    })

    # Check if there are any overlapping bookings
    if len(list(overlapping_bookings)) > 0:
        return False  # Room is not available
    else:
        return True  # Room is available
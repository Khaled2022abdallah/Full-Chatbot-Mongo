// Collapsible
var coll = document.getElementsByClassName("collapsible");

for (let i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function () {
    this.classList.toggle("active");

    var content = this.nextElementSibling;

    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
}

function getTime() {
  let today = new Date();
  hours = today.getHours();
  minutes = today.getMinutes();

  if (hours < 10) {
    hours = "0" + hours;
  }

  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  let time = hours + ":" + minutes;
  return time;
}

// Gets the first message
function firstBotMessage() {
  let firstMessage = "Welcome To Blue Jay Hotel";
  document.getElementById("botStarterMessage").innerHTML =
    '<p class="botText"><span>' + firstMessage + "</span></p>";

  let time = getTime();

  $("#chat-timestamp").append(time);
  document.getElementById("userInput").scrollIntoView(false);
}

firstBotMessage();

function getHardResponse(userText) {
  return fetch(`http://127.0.0.1:8000/${userText}`)
    .then((response) => response.json())
    .then((data) => {
      const answer = data.answer;
      const link = data.link[0]; // Assuming there is only one link in the array
      // Remove the link from the answer
      const linkPattern = /http[s]?:\/\/\S+/;
      const cleanedAnswer = answer.replace(linkPattern, '');

      let botHtml = '<p class="botText"><span>' + cleanedAnswer.trim() + "</span></p>";
      if (link) {
        botHtml += '<p class="botText"><span>Link: <a href="' + link + '" target="_blank">' + link + '</a></span></p>';
      }
      $("#chatbox").append(botHtml);

      document.getElementById("chat-bar-bottom").scrollIntoView(true);

      return cleanedAnswer.trim(); //  Return only the cleaned answer
    })
    .catch((error) => {
      console.error(error);
    });
}




// Get references to the input and button elements
const inputValue = document.getElementById("textInput");
const apiButton = document.getElementById("chat-icon");
const responseContainer = document.getElementById("chat-bar-bottom");

/* // Add a click event listener to the button
apiButton.addEventListener("click", () => {
  // Get the value from the input element
  const value = inputValue.value;

  // Make the API request using fetch
  fetch(`http://127.0.0.1:8000/${value}`)
    .then((response) => response.json())
    .then((data) => {
      // Get the "answer" property from the API response
      const answer = data.answer;

      // Display the answer in the response container element
      responseContainer.textContent = `The answer is ${answer}`;
    })
    .catch((error) => {
      // Handle any errors that occur during the API request
      console.error(error);
    });
});*/

//Gets the text text from the input box and processes it
function getResponse() {
  let userText = $("#textInput").val();

  if (userText == "") {
    userText = "I love Code Palace!";
  }

  let userHtml = '<p class="userText"><span>' + userText + "</span></p>";

  $("#textInput").val("");
  $("#chatbox").append(userHtml);
  document.getElementById("chat-bar-bottom").scrollIntoView(true);

  setTimeout(() => {
    getHardResponse(userText);
  }, 1000);
}

// Handles sending text via button clicks
function buttonSendText(sampleText) {
  let userHtml = '<p class="userText"><span>' + sampleText + "</span></p>";

  $("#textInput").val("");
  $("#chatbox").append(userHtml);
  document.getElementById("chat-bar-bottom").scrollIntoView(true);
}

function sendButton() {
  getResponse();
  // console.log("hiii");
  //getBotResponse();
}

function heartButton() {
  buttonSendText("Heart clicked!");
}
// Press enter to send a message
$("#textInput").keypress(function (e) {
  if (e.which == 13) {
    getResponse();
  }
});

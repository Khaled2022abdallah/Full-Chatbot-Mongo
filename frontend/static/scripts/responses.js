// function getBotResponse(input) {
//   // Add a click event listener to the button
//   apiButton.addEventListener("click", () => {
//     // Get the value from the input element
//     const value = inputValue.value;

//     // Make the API request using fetch
//     let c = `http://127.0.0.1:8000/${value}`;
//     console.log(c);
//     fetch(c)
//       .then((response) => response.json())
//       .then((data) => {
//         // Get the "answer" property from the API response
//         const answer = data.answer;

//         // Display the answer in the response container element
//         responseContainer.textContent = `The answer is ${answer}`;
//       })
//       .catch((error) => {
//         // Handle any errors that occur during the API request
//         console.error(error);
//       });
//   });
// }

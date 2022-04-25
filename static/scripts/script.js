function $(element) {
  // Return the Element object of the corresponding element.
  return document.querySelector(element)
}

// Check if the current page is the trivia.
if ($("#trivia")) {
  // Initialise Socket.IO.
  let socket = io()

  let correct

  // Listen to clicks on the answer buttons.
  document.querySelectorAll("#trivia #answers button").forEach(item =>
    item.addEventListener("click", event => {
      if (event.target.innerText == correct) {
        // Make the selected button green.
        event.target.classList.add("green")
      } else {
        // Make the selected button red.
        event.target.classList.add("red")

        document.querySelectorAll("#trivia #answers button").forEach(element => {
          if (element.innerText == correct) {
            // Make the correct button green.
            element.classList.add("green")
          }
        })
      }

      // Disable all buttons.
      document.querySelectorAll("#trivia #answers button").forEach(item =>
        item.disabled = true
      )

      // Send the answer to the socket after half a second.
      setTimeout(function() {
        socket.emit("answer", event.target.innerText)
      }, 500)
    })
  )

  socket.on("connection", length =>
    // Update the amount of players.
    $("#trivia #connected").innerHTML = `<span></span>${length} players`
  )

  socket.on("trivia", trivia => {
    // Update the trivia's question.
    $("#trivia #question").innerText = trivia.question

    // Update the trivia's correct answer.
    correct = trivia.correct_answer

    document.querySelectorAll("#trivia #answers button").forEach((item, index) => {
      // Remove the result of the previously selected answer.
      item.classList.remove("green")
      item.classList.remove("red")

      // Enable all buttons.
      item.disabled = false

      // Update the trivia's answers.
      item.innerText = trivia.answers[index]
    })
  })
}
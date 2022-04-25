function $(element) {
  // Return the Element object of the corresponding element.
  return document.querySelector(element)
}

// Check if the current page is the trivia.
if ($("#trivia")) {
  // Initialise Socket.IO.
  let socket = io()

  // Listen to clicks on the answer buttons.
  document.querySelectorAll('#trivia #answers button').forEach(item =>
    item.addEventListener("click", event => {
      // Send the answer to the socket.
      socket.emit("answer", event.target.textContent)

      // Darken the selected button.
      event.target.classList.add("selected")

      // Disable all buttons.
      document.querySelectorAll("#trivia #answers button").forEach(item =>
        item.disabled = true
      )
    })
  )

  socket.on("connection", length =>
    // Update the amount of players.
    $("#trivia #connected").innerText = `${length} players`
  )

  socket.on("trivia", trivia => {
    // Update the trivia's question.
    $("#trivia #question").innerText = trivia.question

    // Update the trivia's correct answer.
    $("#trivia #answers #correct").innerText = trivia.correct_answer

    document.querySelectorAll("#trivia #answers button").forEach((item, index) => {
      // Unselect the previously selected button.
      item.classList.remove("selected")

      // Enable all buttons.
      item.disabled = false

      // Update the trivia's incorrect answers.
      if (index > 0) {
        item.innerText = trivia.incorrect_answers[index - 1 ]
      }
    })
  })
}
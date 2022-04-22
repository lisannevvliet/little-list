function $(element) {
  // Return the Element object of the corresponding element.
  return document.querySelector(element)
}

// Initialise Socket.IO.
let socket = io()

// Check if the current page is the chat.
if ($("#chat")) {
  $("#chat form").addEventListener("submit", event => {
    // Prevent the page from reloading.
    event.preventDefault()
  
    // Send the message to the socket.
    socket.emit("message", {
      message: $("#chat input").value,
      nickname: $("#nickname").textContent
    })
  
    // Clear the input value.
    $("#chat input").value = ""
  })
  
  socket.on("message", message => {
    // Add the incoming message to the list.
    $("ul").appendChild(Object.assign(document.createElement('li'), {
      textContent: `${message.message} ${message.nickname}`
    }))
  
    // Scroll to the bottom of the list.
    $("ul").scrollTop = $("ul").scrollHeight
  })
  
  $("#chat form").addEventListener("keypress", function() {
    // Tell the socket that the user has stopped typing after 3 seconds.
    setTimeout(function() {
      socket.emit("done-typing")
    }, 3000)
  
    // Tell the socket that the user is typing.
    socket.emit("typing", $("#nickname").textContent)
  })
  
  socket.on("typing", nickname =>
    // Fill the typing indicator with text.
    $("#typing").textContent = `${nickname} is typing...`
  )
  
  socket.on("done-typing", () =>
    // Empty the typing indicator.
    $("#typing").textContent = ""
  )
}
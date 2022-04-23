function $(element) {
  // Return the Element object of the corresponding element.
  return document.querySelector(element)
}

function add(message, name, styling) {
  // Add the message to the list.
  $("ul").appendChild(Object.assign(document.createElement("li"), {
    className: styling,
    innerHTML: `<div>
      <img src="images/placeholder.png">
      <p>${name}</p>
    </div>
    <div id="message">${message}</div>`
  }))

  // Scroll to the bottom of the list.
  $("ul").scrollTop = $("ul").scrollHeight
}

// Initialise Socket.IO.
let socket = io()

// Check if the current page is the chat.
if ($("#chat")) {
  $("#chat form").addEventListener("submit", event => {
    // Detect if the browser is on a mobile device.
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      // Close the keyboard after submit.
      document.activeElement.blur()
    }
    
    // Prevent the page from reloading.
    event.preventDefault()
  
    // Send the message to the socket.
    socket.emit("message", {
      message: $("#chat input").value,
      name: $("#name").textContent
    })

    // Add the message to the list.
    add($("#chat input").value, "", "self")
  
    // Clear the input value.
    $("#chat input").value = ""
  })
  
  socket.on("message", message => {
    // Check if the message does not come from the user itself.
    if (message.name != $("#name").textContent) {
      // Add the message to the list.
      add(message.message, message.name, "")
    }
  })
  
  $("#chat form").addEventListener("keypress", function() {
    // Tell the socket that the user has stopped typing after 3 seconds.
    setTimeout(function() {
      socket.emit("done-typing")
    }, 3000)
  
    // Tell the socket that the user is typing.
    socket.emit("typing", $("#name").textContent)
  })
  
  socket.on("typing", name => {
    // Check if the user itself is not the one typing.
    if (name != $("#name").textContent) {
      // Fill the typing indicator with text.
      $("#typing").textContent = `${name} is typing...`
    }
  })
  
  socket.on("done-typing", () =>
    // Empty the typing indicator.
    $("#typing").textContent = ""
  )
}
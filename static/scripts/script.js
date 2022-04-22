let socket = io()
let messages = document.querySelector('section ul')
let input = document.querySelector('input')

document.querySelector('form').addEventListener('submit', event => {
  event.preventDefault()
  if (input.value) {
    socket.emit('message', input.value)
    input.value = ''
  }
})

socket.on('message', message => {
  messages.appendChild(Object.assign(document.createElement('li'), { textContent: message }))
  messages.scrollTop = messages.scrollHeight
})

document.querySelector('form').addEventListener("keypress", function() {
  setTimeout(function() { socket.emit("done-typing") }, 3000)
  socket.emit("typing")
})

socket.on("typing", () =>
  document.querySelector("#typing").textContent = "Someone is typing..."
)

socket.on("done-typing", () =>
  document.querySelector("#typing").textContent = ""
)
let socket = io()
let itemList = document.querySelector('form fieldset')
let textInput = document.querySelector('input[type="text"]')

document.querySelector('form').addEventListener('submit', event => {
  event.preventDefault()
  if (textInput.value) {
    socket.emit('item', textInput.value)
    textInput.value = ''
  }
})

socket.on('item', item => {
  let html = document.createElement('li')
  html.appendChild(Object.assign(document.createElement('input'), { 
    id: item,
    type: "checkbox"
  }))
  html.appendChild(Object.assign(document.createElement('label'), { 
    textContent: item,
    htmlFor: item
  }))

  itemList.appendChild(html)

  itemList.scrollTop = itemList.scrollHeight

  // Add event listener.
  let createdItem = document.querySelector(`#${item}`)
  createdItem.addEventListener("change", _event => {
    if (createdItem.checked) {
      socket.emit("checked", createdItem.id)
    } else {
      socket.emit("unchecked", createdItem.id)
    }
  })
})

socket.on("checked", item => {
  console.log(item + " is checked (client-side).")
  let changedItem = document.querySelector(`#${item}`)

  if (!changedItem.checked) {
    changedItem.checked = true;
  }
})

socket.on("unchecked", item => {
  console.log(item + " is unchecked (client-side).")
  let changedItem = document.querySelector(`#${item}`)

  if (changedItem.checked) {
    changedItem.checked = false;
  }
})

textInput.addEventListener("keypress", function() {
  setTimeout(function() { socket.emit("doneTyping") }, 3000)
  socket.emit("typing")
})

socket.on("typing", () =>
  document.querySelector("#typing").textContent = "Someone is typing..."
)

socket.on("doneTyping", () =>
  document.querySelector("#typing").textContent = ""
)
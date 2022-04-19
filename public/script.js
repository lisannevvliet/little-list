let socket = io()
let items = document.querySelector('form fieldset')
let textInput = document.querySelector('input[type="text"')

document.querySelector('form').addEventListener('submit', event => {
  event.preventDefault()
  if (textInput.value) {
    socket.emit('item', textInput.value)
    textInput.value = ''
  }
})

socket.on('item', item => {
  console.log('test')


  items.appendChild(Object.assign(document.createElement('input'), { 
    id: item,
    type: "checkbox"
  }))
  items.appendChild(Object.assign(document.createElement('label'), { 
    textContent: item,
    htmlFor: item
  }))

  items.scrollTop = items.scrollHeight
})

document.querySelector("#item").addEventListener("change", event => {
  if (event.target.checked === true) {
    // console.log(`${event.target.parentElement.textContent.trim()} is ${event.target.checked}`)
    socket.emit("checked", event.target.parentElement.textContent.trim())
  }

  if (event.target.checked === false) {
    // console.log(`${event.target.parentElement.textContent.trim()} is ${event.target.checked}`)
    socket.emit("unchecked", event.target.parentElement.textContent.trim())
  }
})

socket.on("checked", item => {
  console.log("Something is checked (client-side).")
})

socket.on("unchecked", item => {
  console.log("Something is unchecked (client-side).")
})
let socket = io()
let messages = document.querySelector('section ul')
let textInput = document.querySelector('input[type="text"]')

document.querySelector('form').addEventListener('submit', event => {
  event.preventDefault()
  if (input.value) {
    socket.emit('message', input.value)
    input.value = ''
  }
})

socket.on('message', item => {
  item.appendChild(Object.assign(document.createElement('li'), { textContent: item }))
  item.scrollTop = item.scrollHeight
})
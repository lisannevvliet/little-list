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
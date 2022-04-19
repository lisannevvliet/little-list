let socket = io()
let itemList = document.querySelector('form fieldset')
let textInput = document.querySelector('input[type="text"')

document.querySelector('form').addEventListener('submit', event => {
  event.preventDefault()
  if (textInput.value) {
    socket.emit('item', textInput.value)
    textInput.value = ''
  }
})

socket.on('item', item => {
  itemList.appendChild(Object.assign(document.createElement('input'), { 
    id: item,
    type: "checkbox"
  }))
  itemList.appendChild(Object.assign(document.createElement('label'), { 
    textContent: item,
    htmlFor: item
  }))

  itemList.scrollTop = itemList.scrollHeight

  //Add eventlistener
  let createdItem = document.querySelector(`#${item}`)
  createdItem.addEventListener("change", event => {
    if (createdItem.checked) {
      socket.emit("checked", createdItem.id)
    } else {
      socket.emit("unchecked", createdItem.id)
    }
  })
})

socket.on("checked", item => {
  console.log(item +" is checked (client-side).")
})

socket.on("unchecked", item => {
  console.log(item +" is unchecked (client-side).")
})
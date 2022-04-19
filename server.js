/*
https://socket.io/get-started/chat
*/
const express = require('express')
const app = express()
const http = require('http').createServer(app)
const path = require('path')
const io = require('socket.io')(http)
const port = process.env.PORT || 4242

app.use(express.static(path.resolve('public')))

io.on('connection', (socket) => {
  console.log('a user connected')

  socket.on('item', (item) => {
    io.emit('item', item)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })

  socket.on("checked", (item) => {
    console.log("Something is checked (server-side).")
    io.emit("checked", item)
  })

  socket.on("unchecked", (item) => {
    console.log("Something is unchecked (server-side).")
    io.emit("unchecked", item)
  })
})

http.listen(port, () => {
  console.log('listening on port ', port)
})

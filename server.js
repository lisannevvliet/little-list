/*
https://socket.io/get-started/chat
*/
const express = require('express')
const app = express()
const http = require('http').createServer(app)
const path = require('path')
const io = require('socket.io')(http)
require('dotenv').config()
const port = process.env.PORT || 8000

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
    console.log(item + " is checked (server-side).")
    io.emit("checked", item)
  })

  socket.on("unchecked", (item) => {
    console.log(item + " is unchecked (server-side).")
    io.emit("unchecked", item)
  })

  socket.on("typing", () => {
    io.emit("typing")
  })

  socket.on("doneTyping", () => {
    io.emit("doneTyping")
  })
})

http.listen(port, () => {
  console.log('listening on port ', port)
})

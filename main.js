// Import Dotenv.
require("dotenv").config()
// Import Express.
const express = require("express")
// Initialise Express.
const app = express()
// Create an HTTP server.
const server = require("http").createServer(app)
// Import and initialise Socket.IO.
const io = require("socket.io")(server)
// Import Handlebars.
const handlebars = require("express-handlebars")

// Render static files.
app.use(express.static("static"))

// Set the view engine to Handlebars.
app.engine("handlebars", handlebars.engine())
app.set("view engine", "handlebars")

io.on("connection", (socket) => {
  console.log("A user connected.")

  socket.on("message", (message) => {
    io.emit("message", message)
  })

  socket.on("disconnect", () => {
    console.log("User disconnected.")
  })
})

// Set and log the port for the HTTP server.
server.listen(process.env.PORT, () => {
  console.log(`HTTP server running at http://localhost:${process.env.PORT}.`)
})

// Listen to all GET requests on /.
app.get("/", (_req, res) => {
  // Load the index page.
  res.render("index")
})
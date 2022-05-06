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
// Import node-fetch.
const fetch = require("node-fetch")
// Import entities to decode HTML entities.
const entities = require("entities")

// Render static files.
app.use(express.static("static"))

// Set the view engine to Handlebars and import the helpers.
app.engine("handlebars", handlebars.engine({ helpers: require("./helpers") }))
app.set("view engine", "handlebars")

// Parse incoming requests.
app.use(express.urlencoded({
    extended: true
}))

let trivia
let answers = []
let connected = []

let name = ""
let category = "any"
let category_url = ""
let difficulty = "any"
let difficulty_url = ""

io.on("connection", (socket) => {
    if (trivia == undefined) {
        // Get the trivia from the API.
        fetch(`https://opentdb.com/api.php?amount=1${category_url}${difficulty_url}`)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            // Decode the trivia's question.
            data.results[0].question = entities.decodeHTML(data.results[0].question)

            // Decode the trivia's correct answer.
            data.results[0].correct_answer = entities.decodeHTML(data.results[0].correct_answer)

            // Decode the trivia's incorrect answers.
            data.results[0].incorrect_answers.forEach((element, index) => {
                data.results[0].incorrect_answers[index] = entities.decodeHTML(element)
            })

            // Add an array of randomized answers.
            data.results[0].answers = [data.results[0].correct_answer].concat(data.results[0].incorrect_answers).sort(function() {
                return 0.5 - Math.random()
            })

            // Emit the trivia.
            io.emit("trivia", data.results[0])

            // Save the most recent trivia.
            trivia = data.results[0]

            // Clear the answers.
            answers = []
        })
    } else {
        // Emit the existing trivia.
        io.emit("trivia", trivia)
    }

    socket.on("name", (name) => {
        // Add the name, connection ID and score to the list of connected clients.
        connected.push([name, socket.id, 0])

        // Emit the names, connection IDs and scores of the connected clients.
        io.emit("names", connected)
    })

    socket.on("disconnect", () => {
        // Remove the name and connection ID from the list of connected clients.
        connected.forEach((element, index) => {
            if (element[1] == socket.id) {
                connected.splice(index, 1)
            }
        })

        // Remove the answer from the list of answers.
        answers.forEach((element, index) => {
            if (element[1] == socket.id) {
                answers.splice(index, 1)
            }
        })

        // Emit the names, connection IDs and scores of the connected clients.
        io.emit("names", connected)
    })

    socket.on("correct", () => {
        // Update the score within the list of connected clients.
        connected.forEach((element, index) => {
            if (element[1] == socket.id) {
                connected[index][2]++
            }
        })

        // Sort the list of connected clients based on the score (descending).
        connected.sort(function(a, b) {
            return b[2] - a[2]
        })

        // Emit the names, connection IDs and scores of the connected clients.
        io.emit("names", connected)
    })

    socket.on("answer", (answer) => {
        io.emit("answer", answer)

        answers.push([answer, socket.id])

        if (answers.length == connected.length) {
            // Get the trivia from the API.
            fetch(`https://opentdb.com/api.php?amount=1${category_url}${difficulty_url}`)
                .then((response) => {
                    return response.json()
                })
                .then((data) => {
                    // Decode the trivia's question.
                    data.results[0].question = entities.decodeHTML(data.results[0].question)

                    // Decode the trivia's correct answer.
                    data.results[0].correct_answer = entities.decodeHTML(data.results[0].correct_answer)

                    // Decode the trivia's incorrect answers.
                    data.results[0].incorrect_answers.forEach((element, index) => {
                        data.results[0].incorrect_answers[index] = entities.decodeHTML(element)
                    })

                    // Add an array of randomized answers.
                    data.results[0].answers = [data.results[0].correct_answer].concat(data.results[0].incorrect_answers).sort(function() {
                        return 0.5 - Math.random()
                    })

                    // Emit the trivia.
                    io.emit("trivia", data.results[0])

                    // Save the most recent trivia.
                    trivia = data.results[0]

                    // Clear the answers.
                    answers = []
                })
        }
    })

    socket.on("change", () => {
        // Get the trivia from the API.
        fetch(`https://opentdb.com/api.php?amount=1${category_url}${difficulty_url}`)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                // Decode the trivia's question.
                data.results[0].question = entities.decodeHTML(data.results[0].question)

                // Decode the trivia's correct answer.
                data.results[0].correct_answer = entities.decodeHTML(data.results[0].correct_answer)

                // Decode the trivia's incorrect answers.
                data.results[0].incorrect_answers.forEach((element, index) => {
                    data.results[0].incorrect_answers[index] = entities.decodeHTML(element)
                })

                // Add an array of randomized answers.
                data.results[0].answers = [data.results[0].correct_answer].concat(data.results[0].incorrect_answers).sort(function() {
                    return 0.5 - Math.random()
                })

                // Emit the trivia.
                io.emit("trivia", data.results[0])

                // Emit the category and difficulty.
                io.emit("change", {
                    category: category,
                    difficulty: difficulty
                })

                // Save the most recent trivia.
                trivia = data.results[0]

                // Clear the answers.
                answers = []
            })
    })

    socket.on("message", (message) => {
        io.emit("message", {
            message: message.message,
            name: message.name,
            id: message.id,
            time: message.time
        })
    })

    socket.on("typing", (typing) => {
        io.emit("typing", {
            name: typing.name,
            id: typing.id
        })
    })
    
    socket.on("done-typing", () => {
        io.emit("done-typing")
    })
})

// Set and log the port for the HTTP server.
server.listen(process.env.PORT, () => {
    console.log(`HTTP server running at http://localhost:${process.env.PORT}.`)
})

// Listen to all GET requests on /.
app.get("/", (_req, res) => {
     // Load the enrollment page.
     res.render("enrollment")
})

// Listen to all POST requests on /.
app.post("/", (req, res) => {
    // Fill the name.
    if (req.body.name) {
        name = req.body.name
    }

    // Change the category.
    if (req.body.category) {
        if (req.body.category == "any") {
            category_url = ""
        } else {
            category_url = `&category=${req.body.category}`
        }

        category = req.body.category
    }

    // Change the difficulty.
    if (req.body.difficulty) {
        if (req.body.difficulty == "any") {
            difficulty_url = ""
        } else {
            difficulty_url = `&difficulty=${req.body.difficulty}`
        }

        difficulty = req.body.difficulty
    }
    
    // Load the trivia page with the name, category and difficulty.
    res.render("trivia", {
        name: name,
        category: category,
        difficulty: difficulty
    })
})
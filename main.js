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
app.engine("handlebars", handlebars.engine({
    helpers: require("./helpers")
}))
app.set("view engine", "handlebars")

// Parse incoming requests.
app.use(express.urlencoded({
    extended: true
}))

let trivia
let answers = []
let clients = []

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
            data.results[0].incorrect_answers.forEach((incorrect_answer, index) => {
                data.results[0].incorrect_answers[index] = entities.decodeHTML(incorrect_answer)
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

    socket.on("client", (client) => {
        // Add the name, connection ID and score to the list of connected clients.
        clients.push([client, socket.id, 0])

        // Emit the names, connection IDs and scores of the connected clients.
        io.emit("clients", clients)
    })

    socket.on("disconnect", () => {
        // Remove the name and connection ID from the list of connected clients.
        clients.forEach((client, index) => {
            if (client[1] == socket.id) {
                clients.splice(index, 1)
            }
        })

        // Remove the answer from the list of answers.
        answers.forEach((answer, index) => {
            if (answer == socket.id) {
                answers.splice(index, 1)
            }
        })

        // Emit the names, connection IDs and scores of the connected clients.
        io.emit("clients", clients)

        // Array for the names of clients who have not answered yet.
        let waiting = []

        // Add the names of clients who have not answered yet to the array.
        clients.forEach((client) => {
            if (!answers.includes(client[1])) {
                waiting.push(client[0])
            }
        })

        // Emit the names of clients who have not answered yet.
        io.emit("waiting", waiting)

        if (answers.length == clients.length) {
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
                    data.results[0].incorrect_answers.forEach((incorrect_answer, index) => {
                        data.results[0].incorrect_answers[index] = entities.decodeHTML(incorrect_answer)
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

    socket.on("answer", (correct) => {
        if (correct) {
            // Update the score within the list of connected clients.
            clients.forEach((client, index) => {
                if (client[1] == socket.id) {
                    clients[index][2]++
                }
            })

            // Sort the list of connected clients based on the score (descending).
            clients.sort(function(a, b) {
                return b[2] - a[2]
            })

            // Emit the names, connection IDs and scores of the connected clients.
            io.emit("clients", clients)
        }

        answers.push(socket.id)

        // Array for the names of clients who have not answered yet.
        let waiting = []

        // Add the names of clients who have not answered yet to the array.
        clients.forEach((client) => {
            if (!answers.includes(client[1])) {
                waiting.push(client[0])
            }
        })

        // Emit the names of clients who have not answered yet.
        io.emit("waiting", waiting)
        
        if (answers.length == clients.length) {
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
                    data.results[0].incorrect_answers.forEach((incorrect_answer, index) => {
                        data.results[0].incorrect_answers[index] = entities.decodeHTML(incorrect_answer)
                    })

                    // Add an array of randomized answers.
                    data.results[0].answers = [data.results[0].correct_answer].concat(data.results[0].incorrect_answers).sort(function() {
                        return 0.5 - Math.random()
                    })

                    // Execute after a second, so that the client has time to see whether their answer was correct.
                    setTimeout(() => {
                        // Emit the trivia.
                        io.emit("trivia", data.results[0])

                        // Save the most recent trivia.
                        trivia = data.results[0]

                        // Clear the answers.
                        answers = []
                    }, 1000)
                })
        }
    })

    socket.on("options", (options) => {
        // Change the category.
        if (options.category != "") {
            if (options.category == "any") {
                category_url = ""
            } else {
                category_url = `&category=${options.category}`
            }

            category = options.category
        }

        // Change the difficulty.
        if (options.difficulty != "") {
            if (options.difficulty == "any") {
                difficulty_url = ""
            } else {
                difficulty_url = `&difficulty=${options.difficulty}`
            }

            difficulty = options.difficulty
        }

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
                data.results[0].incorrect_answers.forEach((incorrect_answer, index) => {
                    data.results[0].incorrect_answers[index] = entities.decodeHTML(incorrect_answer)
                })

                // Add an array of randomized answers.
                data.results[0].answers = [data.results[0].correct_answer].concat(data.results[0].incorrect_answers).sort(function() {
                    return 0.5 - Math.random()
                })

                // Emit the trivia.
                io.emit("trivia", data.results[0])

                // Emit the category and difficulty.
                io.emit("options", {
                    category: category,
                    difficulty: difficulty
                })

                // Save the most recent trivia.
                trivia = data.results[0]

                // Clear the answers.
                answers = []
            })
    })

    socket.on("typing", (client) => {
        io.emit("typing", {
            name: client.name,
            id: client.id,
            typing: client.typing
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
    
    // Load the trivia page with the name, category and difficulty.
    res.render("trivia", {
        name: name,
        category: category,
        difficulty: difficulty
    })
})
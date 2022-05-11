function $(element) {
    // Return the Element object of the corresponding element.
    return document.querySelector(element)
}

// Check if the current page is the trivia.
if ($("#trivia")) {
    // Initialise Socket.IO.
    let socket = io()

    let answer
    let answered

    // Send the name to the socket.
    socket.emit("client", $("h1").textContent)

    // Listen to clicks on the answer buttons.
    document.querySelectorAll("#trivia #answers button").forEach((element) => {
        element.addEventListener("click", (event) => {
            // Set the answered status to true.
            answered = true
            // Set the correct variable to incorrect by default.
            let correct = false

            if (event.target.innerText == answer) {
                // Make the selected button green.
                event.target.classList.add("green")

                // Change the correct variable to true if the answer is right.
                correct = true
            } else {
                // Make the selected button red.
                event.target.classList.add("red")

                document.querySelectorAll("#trivia #answers button").forEach((element) => {
                    if (element.innerText == answer) {
                        // Make the correct button green.
                        element.classList.add("green")
                    }
                })
            }

            // Disable all buttons.
            document.querySelectorAll("#trivia #answers button").forEach((element) =>
                element.disabled = true
            )

            // Send the answer to the socket.
            socket.emit("answer", correct)
        })
    })

    socket.on("waiting", (waiting) => {
        // Show the overlay if the client has answered and is not the last one who does so.
        if (answered && waiting.length > 0) {
            // Execute after a second, so that the client has time to see whether their answer was correct.
            setTimeout(() => {
                if (waiting.length == 1) {
                    // Fill the typing indicator with text.
                    $("#overlay div p").innerText = `Waiting for ${waiting[0]}.`
                } else {
                    // Fill the typing indicator with text.
                    $("#overlay div p").innerText = `Waiting for ${waiting.slice(0, -1).join(", ")} and ${waiting.slice(-1)}.`
                }

                $("#overlay").classList.add("show")
            }, 1000)
        }
    })

    // Submit the form upon a change in the category dropdown.
    $("#category select").onchange = () => {
        // Tell the socket that the trivia category changed.
        socket.emit("options", {
            category: $("#category select").value,
            difficulty: ""
        })
    }

    // Submit the form upon a change in the difficulty dropdown.
    $("#difficulty select").onchange = () => {
        // Tell the socket that the trivia difficulty changed.
        socket.emit("options", {
            category: "",
            difficulty: $("#difficulty select").value
        })
    }

    socket.on("options", (options) => {
        // Select the correct category and difficulty.
        $("#category select").value = options.category
        $("#difficulty select").value = options.difficulty
    })

    socket.on("clients", (clients) => {
        // Update the amount of clients.
        $("#trivia #connected").innerHTML = `<span></span>${clients.length} online`

        // Clear the list.
        $("#players ul").innerHTML = ""

        clients.forEach((client) => {
            // Add the client to the list.
            $("#players ul").appendChild(Object.assign(document.createElement("li"), {
                innerHTML: `${client[0]} <span id="score">${client[2]}</span>`
            }))
        })
    })

    socket.on("trivia", (trivia) => {
        // Hide the overlay.
        $("#overlay").classList.remove("show")

        // Set the answered status to false.
        answered = false
        
        // Update the trivia's question.
        $("#trivia #question").innerText = trivia.question

        // Check if the retrieved trivia is the same as the one shown.
        if (answer != trivia.correct_answer) {
            // Update the trivia's correct answer.
            answer = trivia.correct_answer

            // Randomize the answers.
            trivia.answers.sort(function() {
                return 0.5 - Math.random()
            })
        }

        document.querySelectorAll("#trivia #answers button").forEach((element, index) => {
            // Remove the result of the previously selected answer.
            element.classList.remove("green")
            element.classList.remove("red")
            
            // Show all buttons.
            element.classList.remove("hide")

            // Enable all buttons.
            element.disabled = false

            // Update the trivia's answers.
            element.innerText = trivia.answers[index]

            // Hide the last two buttons if there are only two answers.
            if (trivia.answers.length == 2 && index > 1) {
                element.classList.add("hide")
            }
        })
    })

    // Keep track of who sent the most recent message.
    let last = ""

    function add(message, name, id, time, self) {
        let styling = ""
        
        if (self) {
            styling = "self"
        } else {
            // Stop showing the name and image when someone sends two or more messages in a row.
            if (last == id) {
                styling = "multiple"
            }
        }
        
        // Add the message to the list.
        $("#chat ul").appendChild(Object.assign(document.createElement("li"), {
            className: styling,
            innerHTML: `<p id="name">${name}</p>
            <div id="message">
                <p>${message}</p>
                <p id="time">${time}</p>
            </div>`
        }))

        // Scroll to the bottom of the list.
        $("#chat ul").scrollTop = $("#chat ul").scrollHeight

        last = id
    }

    $("#chat form").addEventListener("keypress", () => {
        // Tell the socket that the client is typing.
        socket.emit("typing", {
            name: $("h1").textContent,
            typing: true
        })

        // Tell the socket that the client has stopped typing after 3 seconds.
        setTimeout(() => {
            socket.emit("typing", {
                name: $("h1").textContent,
                typing: false
            })
        }, 3000)
    })
    
    socket.on("typing", (typing) => {
        let names = []

        // Add the names of other typing clients to the array above.
        typing.forEach((client) => {
            if (client[1] != socket.id) {
                names.push(client[0])
            }
        })

        if (names.length == 0) {
            // Empty the typing indicator.
            $("#typing").innerText = ""
        } else if (names.length == 1) {
            // Fill the typing indicator with text.
            $("#typing").innerText = `${names[0]} is typing...`
        } else {
            // Fill the typing indicator with text.
            $("#typing").innerText = `${names.slice(0, -1).join(", ")} and ${names.slice(-1)} are typing...`
        }
    })

    $("#chat form").addEventListener("submit", (event) => {        
        // Prevent the page from reloading.
        event.preventDefault()

        // Get the current time.
        const time = new Date().toLocaleTimeString("nl-NL", {
            hour: "numeric",
            minute: "numeric"
        })
    
        // Send the message to the socket.
        socket.emit("message", {
            message: $("#chat input").value,
            name: $("h1").textContent,
            time: time
        })

        // Add the message to the list.
        add($("#chat input").value, $("h1").textContent, socket.id, time, true)
    
        // Clear the input value.
        $("#chat input").value = ""
    })
    
    socket.on("message", (message) => {
        // Check if the message does not come from the client itself.
        if (message.id != socket.id) {
            // Add the message to the list.
            add(message.message, message.name, message.id, message.time, false)
        }
    })
}
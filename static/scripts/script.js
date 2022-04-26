function $(element) {
    // Return the Element object of the corresponding element.
    return document.querySelector(element)
}

// Check if the current page is the trivia.
if ($("#trivia")) {
    // Initialise Socket.IO.
    let socket = io()

    let correct

    // Listen to clicks on the answer buttons.
    document.querySelectorAll("#trivia #answers button").forEach((item) => {
        item.addEventListener("click", (event) => {
            if (event.target.innerText == correct) {
                // Make the selected button green.
                event.target.classList.add("green")
            } else {
                // Make the selected button red.
                event.target.classList.add("red")

                document.querySelectorAll("#trivia #answers button").forEach((element) => {
                    if (element.innerText == correct) {
                        // Make the correct button green.
                        element.classList.add("green")
                    }
                })
            }

            // Disable all buttons.
            document.querySelectorAll("#trivia #answers button").forEach((item) =>
                item.disabled = true
            )

            // Send the answer to the socket after half a second.
            setTimeout(function() {
                socket.emit("answer", event.target.innerText)
            }, 500)
        })
    })

    socket.on("connection", (length) => {
        // Update the amount of players.
        $("#trivia #connected").innerHTML = `<span></span>${length} players`
    })

    socket.on("trivia", (trivia) => {
        // Update the trivia's question.
        $("#trivia #question").innerText = trivia.question

        // Update the trivia's correct answer.
        correct = trivia.correct_answer

        document.querySelectorAll("#trivia #answers button").forEach((item, index) => {
            // Remove the result of the previously selected answer.
            item.classList.remove("green")
            item.classList.remove("red")

            // Enable all buttons.
            item.disabled = false

            // Update the trivia's answers.
            item.innerText = trivia.answers[index]
        })
    })

    // Keep track of who sent the most recent message.
    let last = ""

    function add(message, name, time, self) {
        let styling = ""
        
        if (self) {
            styling = "self"
        } else {
            // Stop showing the name and image when someone sends two or more messages in a row.
            if (last == name) {
                styling = "multiple"
            }
        }
        
        // Add the message to the list.
        $("ul").appendChild(Object.assign(document.createElement("li"), {
            className: styling,
            innerHTML: `<div id="user">
                <img src="images/placeholder.png">
                <p>${name}</p>
            </div>
            <div id="message">
                <p>${message}</p>
                <p id="time">${time}</p>
            </div>`
        }))

        // Scroll to the bottom of the list.
        $("ul").scrollTop = $("ul").scrollHeight

        last = name
    }

    $("#trivia form").addEventListener("submit", (event) => {
        // Detect if the browser is on a mobile device.
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            // Close the keyboard after submit.
            document.activeElement.blur()
        }
        
        // Prevent the page from reloading.
        event.preventDefault()

        // Get the current time.
        const time = new Date().toLocaleTimeString("nl-NL", {
            hour: "numeric",
            minute: "numeric"
        })
    
        // Send the message to the socket.
        socket.emit("message", {
            message: $("#trivia input").value,
            name: $("h1").textContent,
            time: time
        })

        // Add the message to the list.
        add($("#trivia input").value, $("h1").textContent, time, true)
    
        // Clear the input value.
        $("#trivia input").value = ""
    })
    
    socket.on("message", (message) => {
        // Check if the message does not come from the user itself.
        if (message.name != $("h1").textContent) {
            // Add the message to the list.
            add(message.message, message.name, message.time, false)
        }
    })
    
    $("#trivia form").addEventListener("keypress", function() {
        // Tell the socket that the user has stopped typing after 3 seconds.
        setTimeout(function() {
            socket.emit("done-typing")
        }, 3000)
    
        // Tell the socket that the user is typing.
        socket.emit("typing", $("h1").textContent)
    })
    
    socket.on("typing", (name) => {
        // Check if the user itself is not the one typing.
        if (name != $("h1").textContent) {
            // Fill the typing indicator with text.
            $("#typing").textContent = `${name} is typing...`
        }
    })
    
    socket.on("done-typing", () => {
        // Empty the typing indicator.
        $("#typing").textContent = ""
    })
}
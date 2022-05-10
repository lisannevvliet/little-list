# Real-Time Web

## Table of contents
- [Description](#description)
- [Poster](#poster)
- [Live demo](#live-demo)
- [Installation](#installation)
- [User guide and features](#user-guide-and-features)
- [External data source](#external-data-source)
- [Data life cycle](#data-life-cycle)
- [Checklist](#checklist)
- [Sources](#sources)
- [License](#license)

## Description
<!-- Start out with a title and a description -->
<!-- ☝️ replace this description with a description of your own work -->

## Poster
<!-- Add a nice image here at the end of the week, showing off your shiny frontend 📸 -->

## Live demo
https://live-trivia-rtw.herokuapp.com/

## Installation
To view, visit the [Heroku app](https://live-trivia-rtw.herokuapp.com/). To make local modifications, clone the repository and edit the files in an IDE.

## User guide and features
<!-- ...but how does one use this project? What are its features 🤔 -->

## External data source
The external data source that is featured in this project is the [Open Trivia DB](https://opentdb.com). From this API, the following properties are used:

- amount
- category
- difficulty

The request may look like `https://opentdb.com/api.php?amount=1&category=18&difficulty=easy`. The following is a possible reponse:

```
{
	"response_code": 0,
	"results": [
		{
			"category": "Science: Computers",
			"type": "multiple",
			"difficulty": "easy",
			"question": "If you were to code software in this language you&#039;d only be able to type 0&#039;s and 1&#039;s.",
			"correct_answer": "Binary",
			"incorrect_answers": [
				"JavaScript",
				"C++",
				"Python"
			]
		}
	]
}
```

## Data life cycle
![](https://user-images.githubusercontent.com/90243819/167636818-363c1211-bd84-4857-9d9f-9d9b6f9786d7.png)

## Checklist
The completed tasks can be found in the [commit messages](https://github.com/lisannevvliet/live-trivia/commits/main). The following tasks could not be completed in the set time frame, but would be nice to have.

- [ ] Support typing indicator for multiple users.
- [ ] Hide the correct answer in JavaScript.
- [ ] Implement modules in client-side JavaScript.
- [ ] Avoid duplicate questions in a session.
- [ ] Restore the chat upon re-entering.
- [ ] Implement [HTTPS](https://stackoverflow.com/questions/31156884/how-to-use-https-on-node-js-using-express-socket-io).
- [ ] Implement rooms to limit the amount of clients to 4.
- [ ] Add offline support to Socket.IO.
- [ ] Store data in Firebase.

## Sources
The only two sources I used are the [Socket.IO documentation](https://socket.io/get-started/chat) and [Stack Overflow](https://stackoverflow.com/questions/13766015/is-it-possible-to-configure-a-required-field-to-ignore-white-space), to forbid clients from submitting a chat message with only spaces.

## License
This project is licensed under the [GPL-3.0 license](https://github.com/lisannevvliet/real-time-web-2122/blob/main/LICENSE).

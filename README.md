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
Live Trivia is a real-time trivia quiz, to be played with friends and/or strangers. The category and difficulty of the trivia quiz can be changed. On the right, there is a list of online players and a chat. Everything is real-time, built with socket events.

## Poster
![](https://user-images.githubusercontent.com/90243819/167648302-b832fc30-5830-46ac-a4b3-d3febf00c9ec.png)
![](https://user-images.githubusercontent.com/90243819/167648313-c95f910b-4bbd-42d5-a0c7-322a8b401f47.png)

## Live demo
https://live-trivia-rtw.herokuapp.com/

## Installation
To view, visit the [Heroku app](https://live-trivia-rtw.herokuapp.com/). To make local modifications, clone the repository and edit the files in an IDE.

## User guide and features
To start Live Trivia, simply visit the website, enter a name and start playing! After choosing an answer, it will turn green if it is correct and red if it is not. Also, if the answer is incorrect, the correct answer will be shown. When waiting for other players to answer, a loading pop-up will appear with the names of the players everyone is waiting for. Only when all players have answered, the next question will appear. It is also possible to change the category and difficulty of the trivia quiz for all players. On the right, there is a list of online players and a chat. When another player is typing, a typing indicator will be shown in the chat. It will not be a problem if there are two people playing with an identical name. There is a limit on the amount of characters allowed in messages (as well as in names), to prevent misuse of the given bandwith. Upon the disconnection of a player, the game will stop waiting for an answer of that player, remove it from the list of online players and continue playing.

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

- [ ] Support typing indicator for multiple users typing at the same time.
- [ ] Do not store the correct answer in client-side JavaScript.
- [ ] Implement modules in client-side JavaScript.
- [ ] Avoid duplicate questions in a session.
- [ ] Restore the chat from localStorage upon re-entering.
- [ ] Use [HTTPS](https://stackoverflow.com/questions/31156884/how-to-use-https-on-node-js-using-express-socket-io) server instead of HTTP.
- [ ] Limit the amount of clients to 4 using rooms.
- [ ] Add offline support by listening to the corresponding socket event.
- [ ] Store data in a Firebase database.

## Sources
The only two sources I used are the [Socket.IO documentation](https://socket.io/get-started/chat) and [Stack Overflow](https://stackoverflow.com/questions/13766015/is-it-possible-to-configure-a-required-field-to-ignore-white-space), to forbid clients from submitting a chat message with only spaces.

## License
This project is licensed under the [GPL-3.0 license](https://github.com/lisannevvliet/real-time-web-2122/blob/main/LICENSE).

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

<!-- Maybe a table of contents here? 📚 -->

## Description
<!-- Start out with a title and a description -->
<!-- ☝️ replace this description with a description of your own work -->

## Poster
<!-- Add a nice image here at the end of the week, showing off your shiny frontend 📸 -->

## Live demo
https://real-time-web-2122.herokuapp.com/

<!-- Add a link to your live demo in Github Pages 🌐-->
<!-- replace the code in the /docs folder with your own, so you can showcase your work with GitHub Pages 🌍 -->

## Installation
<!-- How about a section that describes how to install this project? 🤓 -->

## User guide and features
<!-- ...but how does one use this project? What are its features 🤔 -->

## External data source
The external data source that is featured in this project is the [Open Trivia DB](https://opentdb.com). From this API, the following properties are used:

- amount
- category
- difficulty
- type

The request looks like `https://opentdb.com/api.php?amount=1&category=18&difficulty=easy&type=multiple`. The following is a possible reponse:

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

<!-- What external data source is featured in your project and what are its properties 🌠 -->

## Data life cycle
<!-- This would be a good place for your data life cycle ♻️-->

## Checklist
<!-- Maybe a checklist of done stuff and stuff still on your wishlist? ✅ -->

## Sources
<!-- We all stand on the shoulders of giants, please link all the sources you used in to create this project. -->

## License
This project is licensed under the [GPL-3.0 license](https://github.com/lisannevvliet/real-time-web-2122/blob/main/LICENSE).

<!-- How about a license here? When in doubt use GNU GPL v3. 📜  -->

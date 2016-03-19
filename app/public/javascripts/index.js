var App = function (options) {

	var questionIndex = -1;
	var questions = [];
	var answers = [];

	var init = function (){
		console.log("init");

		// vraag 1:
		questions.push([
			{
				img: "test.png",
				keyword: "ik-ben-man"
			},
			{
				img: "test.png",
				keyword: "ik-ben-vrouw"
			}
		]);

		// vraag 2:
		questions.push([
			{
				img: "test.png",
				keyword: "ik-ben-voor-de-mannen"
			},
			{
				img: "test.png",
				keyword: "ik-ben-voor-de-vrouwen"
			}
		]);

		// start vragenreeks:
		showNextQuestion();
	};

	var showNextQuestion = function () {
		questionIndex++;
		$('.questioncontainer').empty();



		if(questionIndex >= questions.length) {
			// was laatste vraag, overgaan tot POSTen van data:

			console.log('last question, POSTing');

			$.ajax({
				url: '/rest/answers',
				type: 'POST',
				data: JSON.stringify(answers),
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				async: false,
				success: function (res) {
					if(res.err) alert(res.err);
					console.log(res);
				}
			});

			return;
		}

		// gewoon volgnede vraag tonen:
		var currentQuestion = questions[questionIndex];
		showQuestion(currentQuestion);
	};


	var showQuestion = function (question) {
		// in de question zitten 2 of meerdere anwers:

		for (var i = 0; i < question.length; i++) {
			var answer = question[i];

			// bouw image DOM element from code:
			var $img = $(document.createElement('img'));
			$img.attr('src', '/images/' + answer.img);
			$img.attr('title', answer.keyword);
			$img.attr('data-keyword', answer.keyword); // keyword koppelen aan DOM-element om straks terug te kunnen opvragen.
			$img.addClass('answer-image');

			$img.on('click', handleImageClick);

			$('.questioncontainer').append($img);
		};
	};


	var handleImageClick = function (event) {
		var $img = $(event.target);
		if ($img.attr('data-keyword') != null) {
			var keyword = $img.attr('data-keyword'); // keyword zit in de attrbutes

			answers.push(keyword); // gewoon keywords toevoegen als answers:

			showNextQuestion();
		}
	};

	return {
		init: init
	};
};



$(function(){
	var app = new App();
	app.init();
});


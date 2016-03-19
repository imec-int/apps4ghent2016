var App = function (options) {

	var questionIndex = -1;
	var questions = [];
	var answers = [];

	var init = function (){
		console.log("init");

		// vraag 1:
		questions.push([
			{
				img: "female.png",
				keyword: "me:female"
			},
			{
				img: "male.png",
				keyword: "me:male"
			}
		]);

		// vraag 2:
		questions.push([
			{
				img: "openmind.png", //open.png voor sharon stone
				keyword: "openminded:true"
			},
			{
				img: "closedmind.png", //closed.png voor sharon stone
				keyword: "openminded:false"
			}
		]);

		// vraag 3:
		questions.push([
			{
				img: "Food-Vegan.png",
				keyword: "food:vegan"
			},
			{
				img: "Food-Hamburger.png",
				keyword: "food:hamburger"
			}
		]);

		questions.push([
			{
				img: "transport_bus.png",
				keyword: "transportation:bus"
			},
			{
				img: "transport_taxi.png",
				keyword: "transportation:taxi"
			}
		]);

		questions.push([
			{
				img: "rock.png",
				keyword: "music:gitar"
			},
			{
				img: "DJing.png",
				keyword: "music:clubbing"
			}
		]);

		questions.push([
			{
				img: "moon.png",
				keyword: "till:dusk"
			},
			{
				img: "sun.png",
				keyword: "till:dawn"
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
			$('.questioncontainer').hide();
			$('.thx').show();

			sendJSON('/rest/answers', answers, function (res) {
				if(res.err) alert(res.err);
				console.log(res);
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
			$img.attr('src', '/img/' + answer.img);
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

	var sendJSON = function (url, data, callback) {
		$.ajax({
			url: url,
			type: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			async: false,
			success: callback
		});
	};

	return {
		init: init
	};
};



$(function(){
	var app = new App();
	app.init();
});


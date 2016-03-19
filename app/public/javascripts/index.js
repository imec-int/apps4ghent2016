var App = function (options){

	var init = function (){
		console.log("init");

		buildForm();
	};



	var buildForm = function () {
		// form bouwen met https://github.com/powmedia/backbone-forms
		// zonder gebruik te maken van alle backbone-features:

		var someForm = new Backbone.Form({
			schema: {
				naam: {
					validators: ['required']
				},
				voornaam: {
					validators: ['required']
				},
				geboortedatum: {
					title: 'Geboortedatum',
					type: 'Date',
				},
				adres: {
					editorAttrs: {placeholder: "Straat + huisnummer (+ busnummer)"},
					validators: ['required']
				},
				postcode: {
					validators: ['required']
				},
				gemeente: {
					validators: ['required']
				},
				land: {
					type: 'Select',
					options: countries
				}
			},
			data: {
				land: 'België'
			},
			submitButton: "Bereken voor mij de ultieme vrijgezellenroute!"
		});

		$('.formcontainer').empty().append(someForm.render().el);


		someForm.on('submit', function (event) {
			event.preventDefault(); // nie posten!

			var errors = someForm.validate();
			if(errors) return;


			var data = someForm.getValue();
			data.geboortedatum = data.geboortedatum.getTime();
			$.put('/rest/sendata', data, function (data) {
				if(data.err) { return console.log(data.err); }
				console.log('data successfully posted to server!')
			});
		});
	}

	return {
		init: init
	};
};



$(function(){
	var app = new App();
	app.init();
});


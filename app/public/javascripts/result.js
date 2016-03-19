var App = function (options){

	var testData = [
		{
			id: 0,
			time: "17:00",
			type: "cafe",
			name: "De Dulle Griet",
			extra: "Vrijdagmarkt 50",
			location: {
				lon: 1.1111,
				lat: 2.2323424
			},
			travelTonext: {
				time: "12min",
				distance: "2.8km"
			}
		},
		{
			id: 1,
			time: "19:00",
			type: "restaurant",
			name: "Pizza Rustica",
			extra: "Sint-Pietersnieuwstraat 154",
			location: {
				lon: 1.1111,
				lat: 2.2323424
			},
			travelTonext: {
				time: "20min",
				distance: "4.8km"
			}
		},
		{
			id: 2,
			time: "22:00",
			type: "cafe",
			name: "Bar des amis",
			extra: "Vlasmarkt 5",
			location: {
				lon: 1.1111,
				lat: 2.2323424
			},
			travelTonext: null
		}
	];

	var init = function (){
		console.log("init Result");
		$('body').css("background-color", "#459BA9");
		createTimeline(testData);
	};



	var createTimeline = function (list) {
		// clear results
		$('.resultContainer').empty();
		// fill results on data
		for (var i = 0; i < list.length; i++) {
			var el = list[i];
			// create row
			$('.resultContainer').append("<div class='row place'><div class='col-md-2'><p class='time'>"+el.time+"</p></div><div class='col-md-1'><p class='icon glyphicon glyphicon-"+getIcon(el.type)+"'></p></div><div class='col-md-4'><p class='name'>"+el.name+"</p></div><div class='col-md-4'><p class='extra'>"+ el.extra+"</p></div></div>");

			// if travel obj
			if(el.travelTonext != null){
				$('.resultContainer').append("<div class='row route'><div class='col-md-1 dash'></div><div class='col-md-2'><p></p></div><div class='col-md-4'><p>"+ el.travelTonext.time + " Wandelen</p></div><div class='col-md-4'><p>"+ el.travelTonext.distance + "</p></div></div>")
			}
		};
	}

	var getIcon = function(type){
		switch(type){
			case "cafe":
				return "glass";
			case "restaurant":
				return "cutlery";
		}
		return "glass";
	}

	return {
		init: init
	};
};



$(function(){
	var app = new App();
	app.init();
});


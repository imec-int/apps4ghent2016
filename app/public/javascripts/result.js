var App = function (options){


	var init = function (results) {

		console.log("init Result", results);

		createTimeline(results);
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





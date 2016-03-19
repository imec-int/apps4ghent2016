#!/usr/bin/env node

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var googlemaps = require('googlemaps');
var key = require('./config').key;

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(favicon(__dirname + '/public/favicon.ico')); // uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

var publicConfig = {
	key: key,
	stagger_time:       1000, // for elevationPath
	encode_polylines:   false,
	secure:             true
};

var gmAPI = new googlemaps(publicConfig);



// var profile = {
// 	gender: 'f',
// 	orientation: 'f',
// 	openmindedness: 5, //0-5
// 	fond: 'pita',
// 	fitness: 5,
// 	bmi: 20,
// 	groupsize: 10,
// 	budget: 5, //0-5
// 	dance: true,
// 	beerprice: 5,
// 	nature: 'y',
// 	startinghour: 11,
// 	nightonly: false,
// 	pharmacy: true
// }



// gmAPI.placeSearch(params, function(err, result) {
// 	console.log(err);
// 	console.log(result);
// });


var params = {
	location: "51.054486, 3.725298",
	radius: 2000,
	rankby: 'distance',
	// keyword: 'pita'
	types: 'bar'
};

function getFirstResult(params, callback) {
	gmAPI.placeSearch(params, function(err, result) {
		if(err) return callback(err);
		var firstresult = result.results[0];
		// console.log(JSON.stringify(firstresult));
		var stop = {
			name: firstresult.name,
			address: firstresult.vicinity,
			location: firstresult.geometry.location
		}
		params.location = "" + stop.location.lat + ", " + stop.location.lng;
		return callback(null, stop);
	});
}



var profile = {
	gender: 'f',
	openmindedness: true,
	vegan: false,
	rich: 5,
	dance: true,
	nightonly: false,
};


function mapProfileToQuery(profile) {
	var resultArray = [];
	if(!profile.nightonly) {
		if(profile.gender === 'f') {
			params.types = 'beauty_salon';
		} else {
			params.types = 'pharmacy';
		}
		getFirstResult(params, function(err, result) {
			if(!err) resultArray.push(result);
		});
		if(profile.openmindedness === false) {
			params.types = 'church';
		} else {
			params.types = 'liquor_store';
		}
		getFirstResult(params, function(err, result) {
			if(!err) resultArray.push(result);			});
		if(profile.vegan) {
			params.types = 'restaurant';
			params.keyword = 'vegan';
		} else {
			params.types = 'restaurant';
			params.keyword = 'pita';
		}
		getFirstResult(params, function(err, result) {
			if(!err) resultArray.push(result);
		});
		if(profile.dance) {
			params.types = 'night_club';
		} else {
			params.types = 'bowling_alley';
		}
		getFirstResult(params, function(err, result) {
			if(!err) resultArray.push(result);
		});

		// NIGHTONLY
	} else {
		if(profile.vegan) {
			params.types = 'restaurant';
			params.keyword = 'vegan';
		} else {
			params.types = 'restaurant';
			params.keyword = 'pita';
		}
		getFirstResult(params, function(err, result) {
			if(!err) resultArray.push(result);
		});

		if(profile.gender === 'f') {
			params.types = 'bar';
		} else {
			params.types = 'bar';
		}
		getFirstResult(params, function(err, result) {
			if(!err) resultArray.push(result);
		});
		if(profile.openmindedness === false) {
			params.types = 'pharmacy';
		} else {
			params.types = 'liquor_store';
		}
		getFirstResult(params, function(err, result) {
			if(!err) resultArray.push(result);			});

		if(profile.dance) {
			params.types = 'night_club';
		} else {
			params.types = 'bowling_alley';
		}
		getFirstResult(params, function(err, result) {
			if(!err) resultArray.push(result);
		});
	}

}

mapProfileToQuery(profile);


app.get('/', function (req, res) {
	res.render('index', { title: 'Apps 4 Ghent 2016!' });
});

// de antwoorden komen nu hier toe:
app.post('/', function (req, res) {
	var answers = JSON.parse(req.body.answersAsJSON);
	console.log(answers);

	var results = [
		{
			id: 0,
			time: "17:00",
			type: "cafe",
			name: "Geen Resultaten",
			extra: "Vrijdagmarkt 50",
			location: {
				lon: 1.1111,
				lat: 2.2323424
			},
			travelTonext: {
				time: "12min",
				distance: "2.8km"
			}
		}
	]; //opvullen!!!

	res.render('result', { title: 'Apps 4 Ghent 2016!', results: results });
});


app.get('/testresults', function (req, res) {
	var results = [
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

	res.render('result', { title: 'Apps 4 Ghent 2016!', results: results });
});



app.post('/rest/answers', function (req, res) {
	var answers = req.body;

	console.log('hier zijn de antwoorden matthias, have fun:p', answers);

	// bvb:

	// answers = [ 'me:female',
	//   'openminded:false',
	//   'food:vegan',
	//   'transportation:taxi' ]

	// zie /public/javascripts/index.js voor meer opties ;-)

	// mogelijkheden:
	//
	// "me:female"
	// "me:male"
	// "interest:male"    -- new
	// "interest:female"  -- new
	// "openminded:true"
	// "openminded:false"
	// "food:vegan"
	// "food:hamburger"
	// "transportation:bus"
	// "transportation:taxi"
	// "music:guitar"    -- aangepast
	// "music:clubbing"
	// "start:morning"   -- new
	// "start:evening"   -- new
	// "end:morning"     -- aangepast
	// "end:evening"     -- aangepast

	// new:
	// "budget:big"
	// "budget:big"

	var profile = {
	gender: 'f',
	openmindedness: true,
	vegan: false,
	rich: 5,
	dance: true,
	nightonly: false,
};

if(answers[0] === 'me:female') profile.gender = 'f'; else profile.gender = 'm';
if(answers[1] === 'openminded:true') profile.openmindedness = true; else profile.openmindedness = false;
if(answers[2] === 'food:vegan') profile.vegan = true; else profile.vegan = false;
if(answers[3] === 'transportation:bus') profile.rich = false; else profile.rich = true;
if(answers[4] === 'music:clubbing') profile.dance = true; else profile.dance = false;
if(answers[5] === 'till:dawn') profile.nightonly = true; else profile.nightonly = false;


	res.json({err:0});
});








// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler:
app.use(function (err, req, res, next) {
	if(!err.status) err.status = 500;

	res.status(err.status);

	if(err.status == 404)
		return res.send(err.toString()); // 404 errors are not worth logging.

	if (app.get('env') === 'production'){
		console.log(err.stack); // log to console
		return res.send("An error occured: " + err.status); // don't log to user
	} else {
		next(err); // log to console and user
	}
});



var webserver = app.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + webserver.address().port);
});


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

var params = {
	location: "51.054486, 3.725298",
	radius: 2000,
	rankby: 'distance',
	// keyword: 'pita'
	types: 'bar'
};

var profile = {
	gender: 'f',
	orientation: 'f',
	openmindedness: 5, //0-5
	fond: 'pita',
	fitness: 5,
	bmi: 20,
	groupsize: 10,
	budget: 5, //0-5
	dance: true,
	beerprice: 5,
	nature: 'y',
	startinghour: 11,
	nightonly: false,
	pharmacy: true
}


// gmAPI.placeSearch(params, function(err, result) {
// 	console.log(err);
// 	console.log(result);
// });

function mapProfileToQuery(profile) {
	if(!profile.nightonly) {
		if(profile.gender === 'f') {
			// params.types = 'beauty_salon'
			gmAPI.placeSearch(params, function(err, result) {
				var firstresult = result.results[0];
				// console.log(JSON.stringify(firstresult));
				var stop = {
					name: firstresult.name,
					address: firstresult.vicinity,
					location: firstresult.geometry.location
				}
				console.log(stop);
			});
		}
	}

}

mapProfileToQuery(profile);


app.get('/', function (req, res) {
	res.render('index', { title: 'Apps 4 Ghent 2016!' });
});


app.get('/result', function(req, res) {
	res.render('result', { title: 'Apps 4 Ghent 2016!' });
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
	// "openminded:true"
	// "openminded:false"
	// "food:vegan"
	// "food:hamburger"
	// "transportation:bus"
	// "transportation:taxi"
	// "music:gitar"
	// "music:clubbing"
	// "till:dusk"
	// "till:dawn"



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


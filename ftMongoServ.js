var express = require('express');
var url = require('url');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var app = express();

// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var Users;
var Calendars;
var Events;


//put config url behind file to hide passwords and username
var mongoDBConnection = require('./db.ftSample.config');

console.log(mongoDBConnection.uri);

mongoose.connect(mongoDBConnection.uri);
mongoose.connection.on('open', function() {
	var Schema = mongoose.Schema;
	var CalendarSchema = new Schema( 
		{
			name: String,
			ownerId: Number,
			calendarId: Number
		},
	   {collection: 'calendars'}
	);
	Calendars = mongoose.model('Calendars', CalendarSchema);
	
	var eventSchema = new Schema( 
		{
			calendarId: Number,
			eventListId: Number,
			events: [ {
			   title: String,
			   description: String,
			   eventListId: Number,
			   //eventId listed as ID
			   id: Number,
			   privacy: String,
			   start: String
			}]
		},
	   {collection: 'events'}
	);
	
	
	Events = mongoose.model('Events', eventSchema);
	console.log('models have been created');
});


function getAllEvents(res){
	console.log("inside get all events");
	var query = Events.find({});
	query.exec(function (err, itemArray) {
 		res.json(itemArray);
	});
}

function getMyEvents(res){
	
	console.log("inside get my events");
	var query = Events.find({eventListId:1});
	query.exec(function (err, itemArray) {
		res.json(itemArray);
	});
}

function getFriendEvents(res){
	console.log("inside get friend events");
	var query = Events.find({eventListId:2});
	query.exec(function (err, itemArray) {
		res.json(itemArray);
	});
}



app.use('/', express.static('./apps/'));
app.use('/eventSources/', express.static('./eventsources'));

app.get('/events/all', function (req, res){
	console.log("get all events");
	getAllEvents(res);
});

app.get('/events/self', function (req, res){
	console.log("get my events");
	getMyEvents(res);
});

app.get('/events/friend', function (req, res){
	console.log("get friend events");
	getFriendEvents(res);
});


app.listen(80);
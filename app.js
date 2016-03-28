/**
 *  Bitcoin Price Twitter Bot
 *  Created for theindex.io
 *  
 *  Copyright Ansel Lindner <ansellindner@blockchainio.com>
 *  MIT License
 */

'use strict';

var fs = require('fs');
var c = require('./src/config');
var Twitter = require('twitter');
//var winston = require('winston');

// config the logger
// winston.add(winston.transports.File, { filename: './logs/tweet.log' });
// winston.remove(winston.transports.Console); // disable console log from winston

// twitter account settings
var client = new Twitter({
  consumer_key: c.CONSUMER_KEY,
  consumer_secret: c.CONSUMER_SECRET,
  access_token_key: c.ACCESS_TOKEN_KEY,
  access_token_secret: c.ACCESS_TOKEN_SECRET
});

// now we can pull in our functions
var func = require('./src/functions/functions.js');
var dbfunc = require('./src/functions/dbFunctions.js');
var tweetfunc = require('./src/functions/tweetFunctions.js');
var alertfunc = require('./src/functions/alertFunctions.js');
//var schedulefunc = require('./src/functions/scheduleFunctions.js');

// run the api request right away and callback to the other functions
dbfunc.init( function() {
	alertfunc.init();
	//schedulefunc.init();
});

// open stream to listen for specific things
client.stream('statuses/filter', {track: c.RESPOND_TO}, function(stream) {
	stream.on('data', function(tweet) {

		/**  
		 *	Variables
		 *
		 *	We build three objects
		 *  A data object parsed and formatted, a response object with tweet info,
		 *  	and a prices object
		 */
		var data = {};
		data.hashtags = func.parseHashtags(tweet.entities.hashtags);
		data.type = func.parseType(data.hashtags);
		data.details = func.parseDetails(data.hashtags, tweet.text);

		var response = {};
		response.screen_name = '@'+ tweet.user.screen_name;
		response.tweetid = tweet.id_str; // needed in js to respond to a tweet, tweet.id doesn't work
		response.date = tweet.created_at;

		// the api is called every minute in dbfunc.writeJSON() above and stored here
		// this has several benefits, much faster than calling the api and reduces # of calls
		var prices = JSON.parse(fs.readFileSync('./src/prices.json'));

		/**  
		 *	Routing the response
		 *
		 *  TODO - scan the db and send tweets when needed
		 */
		// alert can be string or false
		if (data.details.alert) {
			// insert into alerts table
			dbfunc.addAlert(response.screen_name, response.tweetid, data.details.crypto, data.details.currency, data.details.alert, function() {
				// send the tweet letting person know the alert is saved
				tweetfunc.alertConfirm(response, data);
			});

		// schedule can be string or false
		} else if (data.details.schedule) {
			// insert info scheduled table
			dbfunc.addSchedule(response.screen_name, data.details.crypto, data.details.currency, data.details.schedule, function() {
				// send the tweet letting person know the tweeting is scheduled
				tweetfunc.scheduledConfirm(response, data);
			});

		// if it's just a plain request for price
		} else if (prices) {
			tweetfunc.priceTweet(response, data, prices);
		}

	}); // stream.on && !error

	stream.on('error', function(error) {
		throw error;
	});

}); // client.stream

// ok, we are listening, no server needed!
console.log('Listening to twitter for '+ c.RESPOND_TO);
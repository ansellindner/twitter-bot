/**
 *  Bitcoin Price Twitter Bot
 *  Created for theindex.io
 *  
 *  Copyright Ansel Lindner <ansellindner@blockchainio.com>
 *  MIT License
 */

'use strict';

// Require a few things
var request = require('request');
var Twitter = require('twitter');
var c = require('./config');
var winston = require('winston');

// config the logger
// create file for the log
// winstom will log to console too unless disabled below
winston.add(winston.transports.File, { filename: './tweet.log' });
//winston.remove(winston.transports.Console);

// set up your twitter account settings
var client = new Twitter({
  consumer_key: c.CONSUMER_KEY,
  consumer_secret: c.CONSUMER_SECRET,
  access_token_key: c.ACCESS_TOKEN_KEY,
  access_token_secret: c.ACCESS_TOKEN_SECRET
});

// open stream to listen for specific things
client.stream('statuses/filter', {track: c.RESPOND_TO}, function(stream) {
	stream.on('data', function(tweet) {
		var incoming = tweet.user.screen_name;
		var date = tweet.created_at;
		var text = tweet.text;

		// log it
		console.log('Incoming tweet from @'+ tweet.user.screen_name);
		winston.log('info', incoming, {time: date, text: text});

		// grab the user name of the request
		var account = '@'+ tweet.user.screen_name;
		var tweetid = tweet.id_str;

		// send the response
		sendTweet(account, tweetid);

	});

	stream.on('error', function(error) {
		throw error;
	});
});

// send the response here
// this is currently set up for bitcoin price only
// TODO make it smart by taking in more of the request tweet
//   and responding with other prices/info
function sendTweet(account, tweetid) {
	request("http://theindex.io/api/btc/index.php", function(error, res, body) {
		//console.log(body);
		client.post('statuses/update', {
			in_reply_to_status_id: tweetid,
			status: account +' The price of #bitcoin is $' +body	
		}, function(error, tweet, response){
		    if (!error) {

		    	var outgoing = tweet.in_reply_to_screen_name;
		    	var date = tweet.created_at;
				var text = tweet.text;

		        // log it
				console.log('Sent response to @'+ tweet.user.screen_name);
				winston.log('info', outgoing, {time: date, text: text});
		    }
		});
	});
}

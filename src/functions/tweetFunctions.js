/**
 *  Bitcoin Price Twitter Bot
 *  tweetFunctions.js
 *  
 *  Copyright Ansel Lindner <ansellindner@blockchainio.com>
 *  MIT License
 */

'use strict';

var c = require('../config');
var Twitter = require('twitter');

// twitter account settings
var client = new Twitter({
	consumer_key: c.CONSUMER_KEY,
	consumer_secret: c.CONSUMER_SECRET,
	access_token_key: c.ACCESS_TOKEN_KEY,
	access_token_secret: c.ACCESS_TOKEN_SECRET
});

module.exports = {

	priceTweet: function(response, data, prices) {

		var type, price, text;
		type = data.details.crypto;

		if (data.details.crypto == 'bitcoin') {

			if (data.details.currency == 'EUR') {
				price = '\u20AC'+prices.btceur;
			} else {
				price = '$'+prices.btcusd;
			}
			console.log(response.screen_name +' the #'+ type +' price is '+ price);
			console.log('--------------------');
			text = response.screen_name +' the #'+ type +' price is '+ price;

		} else if (data.details.crypto == 'litecoin') {
			
			if (data.details.currency == 'EUR') {
				price = '\u20AC'+prices.ltceur;
			} else {
				price = '$'+prices.ltcusd;
			}
			console.log(response.screen_name +' the #'+ type +' price is '+ price);
			console.log('--------------------');
			text = response.screen_name +' the #'+ type +' price is '+ price;

		} else if (data.details.crypto == 'ether') {
			
			price = '$'+prices.ethusd;
			console.log(response.screen_name +' the #'+ type +' price is '+ price);
			console.log('--------------------');
			text = response.screen_name +' the #'+ type +' price is '+ price;
		}

		if (data.details.crypto) {
			client.post('statuses/update', {
				in_reply_to_status_id: response.tweetid,
				status: text	
			}, 
			function(error, tweet, res){
			    if (!error) {

			    	// log it
			    	var outgoing = tweet.in_reply_to_screen_name;
			    	var date = tweet.created_at;
					var text = tweet.text;

					console.log('Sent');
					//winston.log('info', outgoing, {time: date, text: text});
			    } else {
			    	client.post('statuses/update', {
						in_reply_to_status_id: response.tweetid,
						status: response.screen_name +' I ran into a problem. Please try again in a few minutes.'	
					});
			    }
			});
		}
		
	},
	alertConfirm: function(response, data) {

		var type, price, text;
		type = data.details.crypto;

		// build response like this
		// @username Bleep. Your request is now cached. I'll hit you back when #'coin' is $x.
		var bleep = ' Bleep. Your request is now cached. I\'ll hit you back when #';

		if(data.details.crypto == 'bitcoin') {

			if(data.details.currency == 'EUR') {
				price = ' is \u20AC'+data.details.alert;
			} else {
				price = ' is $'+data.details.alert;
			}
			console.log(response.screen_name + bleep + 	type + price);
			console.log('--------------------');
			text = response.screen_name  + bleep + 	type + price;

		} else if(data.details.crypto == 'litecoin') {
			
			if(data.details.currency == 'EUR') {
				price = ' is \u20AC'+data.details.alert;
			} else {
				price = ' is $'+data.details.alert;
			}
			console.log(response.screen_name + bleep + type + price);
			console.log('--------------------');
			text = response.screen_name + bleep + type + price;

		} else {
			
			price = ' is $'+data.details.alert;
			console.log(response.screen_name + bleep + type + price);
			console.log('--------------------');
			text = response.screen_name + bleep + type + price;
		}

		client.post('statuses/update', {
			in_reply_to_status_id: response.tweetid,
			status: text	
		}, 
		function(error, tweet, res){
		    if (!error) {
		    	// db insert here
		    } else {
		    	client.post('statuses/update', {
					in_reply_to_status_id: response.tweetid,
					status: response.screen_name +' Oh bleepers, I ran into a problem. Please try again in a few minutes.'	
				});
		    }
		});
	},
	scheduledConfirm: function(response, data) {

		var type, price, text, when;
		type = data.details.crypto;
		when = data.details.schedule;

		// build response like this
		// @username Bleep. Schedule confirmed. See you at 12 UTC... bloop
		var bleep = ' Bleep. Schedule confirmed. See you at ';

		if(data.details.crypto == 'bitcoin') {

			// @username Hi. I scheduled request in my cache. 
			// See you at 1100.
			console.log(response.screen_name + bleep + when + 'UTC... bloop');
			console.log('--------------------');
			text = response.screen_name + bleep + when + 'UTC... bloop';

		} else if(data.details.crypto == 'litecoin') {
			
			console.log(response.screen_name + bleep + when + 'UTC... bloop');
			console.log('--------------------');
			text = response.screen_name + bleep + when + 'UTC... bloop';
		} else {
			
			console.log(response.screen_name + bleep + when + 'UTC... bloop');
			console.log('--------------------');
			text = response.screen_name + bleep + when + 'UTC... bloop';
		}

		
		client.post('statuses/update', {
			in_reply_to_status_id: response.tweetid,
			status: text	
		}, 
		function(error, tweet, res){
		    if (!error) {
		    	// insert into db here
		    } else {
		    	client.post('statuses/update', {
					in_reply_to_status_id: response.tweetid,
					status: response.screen_name +' Oh bleepers, I ran into a problem. Please try again in a few minutes.'	
				});
		    }
		});
	},
	alertTweet: function (alert, price) {

		var username, coin, tweetid, symbol, text;

			username = alert.screen_name;
			coin = alert.crypto;
			tweetid = alert.id_str;
			if (alert.currency == 'USD') { symbol = '$'; } else { symbol = '\u20AC'; } 
			text = username +' Hi there! Bleep, #'+ coin +' is now '+ symbol + price +'. bloop, retweet me.';

		client.post('statuses/update', {
			in_reply_to_status_id: tweetid,
			status: text	
		}, 
		function(error, tweet, res){
		    if (!error) {
		    	console.log('Sent alert to: '+ username);
		    	// need to add a table of sent tweets
		    }
		});
	}
};
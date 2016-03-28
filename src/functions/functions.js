/**
 *  Bitcoin Price Twitter Bot
 *  functions.js
 *  
 *  Copyright Ansel Lindner <ansellindner@blockchainio.com>
 *  MIT License
 */

'use strict';

var c = require('../config');

/** FORMAT all the tweet data
 * ========================================================
 * 
 */
module.exports = {

	parseHashtags: function (rawHashtags) {

		var data = [];
		// if the array is not empty
		if (rawHashtags != []) {
			
			for (var i = 0; i < rawHashtags.length; i++) {
				if (c.TESTTAGS.indexOf(rawHashtags[i].text) > -1){
					data.push(rawHashtags[i].text);
				}
			}
			return data;
			
		// if the array is empty
		} else { return false; }

	},
	parseType: function (hashtags) {

		var type;
		// if there is a hashtag that matches
		if (hashtags.indexOf('sschedule') > -1) {
			return type = 'schedule';

		} else if (hashtags.indexOf('aalert') > -1) {
			return type = 'alert';

		} else { return type = 'price'; }
	},
	parseDetails: function (hashtags, text) {

		// we are setting the crypto, currency, alert price, and scheduled time
		// see /objOutline.js for visual info
		var details = [];
		
		// First set details.crypto
	 	// ========================================================
		if (hashtags.indexOf('bbitcoin') > -1) {
			// includes the hashtag #bitcoin
			details.crypto = 'bitcoin';

		} else if (hashtags.indexOf('llitecoin') > -1) {
			// includes the hashtag #litecoin
			details.crypto = 'litecoin';

		} else if (hashtags.indexOf('eether') > -1) {
			// includes the hashtag #ether
			details.crypto = 'ether';

		} else { details.crypto = false; }

		// Set details.currency
	 	// ========================================================
		if (hashtags.indexOf('eEUR') > -1) {
			// includes the hashtag #EUR, dollars is default
			details.currency = 'EUR';

		} else {details.currency = 'USD';}

		// Set details.alert
	 	// ========================================================
	 	if(text.indexOf('$') > -1) {

	 		var index = text.indexOf('$') + 1;
	 		var sub = text.substr(index); // $430 plus any text to the end of the tweet
	 		
	 		if (sub.indexOf(' ') > -1) {
	 			details.alert = sub.substr(0, sub.indexOf(' ')); // will grab stuff until the fist space
	 		} else {
	 			details.alert = sub.substr(0); // will grab stuff until the end
	 		}

	 	} else { details.alert = false; }

	 	// Set details.schedule
	 	// =======================================================
	 	if (text.indexOf('=') > -1) {

	 		var index = text.indexOf('=') + 1;
	 		var sub = text.substr(index); // =0900 plus any text to the end of the tweet
	 		details.schedule = sub.substr(0, 4); // will grab the 4 characters behind the =

	 	} else { details.schedule = false; }

		return details;
	}
};
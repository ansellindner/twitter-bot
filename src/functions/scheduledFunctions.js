/**
 *  Bitcoin Price Twitter Bot
 *  alertFunctions.js
 *  
 *  Copyright Ansel Lindner <ansellindner@blockchainio.com>
 *  MIT License
 */

'use strict';

var request = require('request');
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var c = require('../config');

// get the current prices
var prices = JSON.parse(fs.readFileSync('./src/prices.json'));
// require the tweet functions so we can tweet from this file
var tweetfunc = require('./src/functions/tweetFunctions.js');
// get the time of day
var time = new Date().getUTCHours();

/** SEARCH Scheduled
 * ========================================================
 * search database for rows that match our needs
 * then we have to delete those rows
 * CONSTANTLY RUNNING
 */
function searchAlerts() {

	// 
	// ========================================================
	var db = new sqlite3.Database('../indxio.db');
	db.serialize(function() {
		console.log('Watching alert tables...');

		// Scheduled
		// ========================================================
		
	});

	// loop indefinitely
	setTimeout(function(){seachAlerts()}, 60000);
}

module.exports = { init: function () { searchAlerts(); } };
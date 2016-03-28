/**
 *  Bitcoin Price Twitter Bot
 *  alertFunctions.js
 *  
 *  Copyright Ansel Lindner <ansellindner@blockchainio.com>
 *  MIT License
 */

'use strict';

var fs = require('fs');
var c = require('../config');
var sqlite3 = require('sqlite3').verbose();

// require the tweet functions so we can tweet from this file
var tweetfunc = require(__dirname +'/tweetFunctions.js');

/** SEARCH Alerts
 * ========================================================
 * search database for rows that match our needs
 * in tableAlertUp that will be rows were the alert price <= current price
 * in tableAlertDown that will be rows were the alert price is >= current price
 * then we have to delete those rows
 * CONSTANTLY RUNNING
 */
function manageAlerts() {
	// get the current prices
	var prices = JSON.parse(fs.readFileSync('./src/prices.json'));

	var db = new sqlite3.Database('../indxio.db');
	db.serialize(function() {
		console.log('Watching alert tables...');

		// Alerts Up
		// ========================================================
		db.each("SELECT * FROM alerts_up WHERE crypto='bitcoin' AND currency='USD' AND price<="+prices.btcusd, 
			function(err, row) {
				if (!err && row) {
					tweetfunc.alertTweet(row, prices.btcusd);
					// delete row
					db.each("DELETE FROM alerts_up WHERE id='"+ row.id +"';");
				}
				if (err) {
					console.log(err);
				}
			}
		);
		db.each("SELECT * FROM alerts_up WHERE crypto='bitcoin' AND currency='EUR' AND price<="+prices.btceur, 
			function(err, row) {
				if (!err && row) {
					tweetfunc.alertTweet(row, prices.btceur);
					// delete row
					db.each("DELETE FROM alerts_up WHERE id='"+ row.id +"';");
				}
			}
		);
		db.each("SELECT * FROM alerts_up WHERE crypto='litecoin' AND currency='USD' AND price<="+prices.ltcusd, 
			function(err, row) {
				if (!err && row) {
					tweetfunc.alertTweet(row, prices.ltcusd);
					// delete row
					db.each("DELETE FROM alerts_up WHERE id='"+ row.id +"';");
				}
			}
		);
		db.each("SELECT * FROM alerts_up WHERE crypto='litecoin' AND currency='EUR' AND price<="+prices.ltceur, 
			function(err, row) {
				if (!err && row) {
					tweetfunc.alertTweet(row, prices.ltceur);
					// delete row
					db.each("DELETE FROM alerts_up WHERE id='"+ row.id +"';");
				}
			}
		);
		db.each("SELECT * FROM alerts_up WHERE crypto='ether' AND price<="+prices.ethusd, 
			function(err, row) {
				if (!err && row) {
					tweetfunc.alertTweet(row, prices.ethusd);
					// delete row
					db.each("DELETE FROM alerts_up WHERE id='"+ row.id +"';");
				}
			}
		);

		// Alerts Down
		// ========================================================
		db.each("SELECT * FROM alerts_down WHERE crypto='bitcoin' AND currency='USD' AND price>="+prices.btcusd, 
			function(err, row) {
				if (!err && row) {
					tweetfunc.alertTweet(row, prices.btcusd);
					// delete row
					db.each("DELETE FROM alerts_down WHERE id='"+ row.id +"';");
				}
			}
		);
		db.each("SELECT * FROM alerts_down WHERE crypto='bitcoin' AND currency='EUR' AND price>="+prices.btceur, 
			function(err, row) {
				if (!err && row) {
					tweetfunc.alertTweet(row, prices.btceur);
					// delete row
					db.each("DELETE FROM alerts_down WHERE id='"+ row.id +"';");
				}
			}
		);
		db.each("SELECT * FROM alerts_down WHERE crypto='litecoin' AND currency='USD' AND price>="+prices.ltcusd, 
			function(err, row) {
				if (!err && row) {
					tweetfunc.alertTweet(row, prices.ltcusd);
					// delete row
					db.each("DELETE FROM alerts_down WHERE id='"+ row.id +"';");
				}
			}
		);
		db.each("SELECT * FROM alerts_down WHERE crypto='litecoin' AND currency='EUR' AND price>="+prices.ltceur, 
			function(err, row) {
				if (!err && row) {
					tweetfunc.alertTweet(row, prices.ltcusd);
					// delete row
					db.each("DELETE FROM alerts_down WHERE id='"+ row.id +"';");
				}
			}
		);
		db.each("SELECT * FROM alerts_down WHERE crypto='ether' AND price>="+prices.ethusd, 
			function(err, row) {
				if (!err && row) {
					tweetfunc.alertTweet(row, prices.ethusd);
					// delete row
					db.each("DELETE FROM alerts_down WHERE id='"+ row.id +"';");
				}
			}
		);
	});

	// loop indefinitely
	setTimeout( function () { manageAlerts(); }, 60000);
}

module.exports = { init: function () { manageAlerts(); } };
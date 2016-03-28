/**
 *  Bitcoin Price Twitter Bot
 *  dbFunctions.js
 *  
 *  Copyright Ansel Lindner <ansellindner@blockchainio.com>
 *  MIT License
 */

'use strict';

var request = require('request');
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var c = require('../config');

// make sure our db are ready to go
var db = new sqlite3.Database('../indxio.db');
db.run(c.tableAlertUp);
db.run(c.tableAlertDown);

/** GET Prices
 * ========================================================
 * call the api every minute and save prices to a json file
 * this needs to be done to reduce api calls to 1/min
 * CONSTANTLY RUNNING
 */
function getprices() {
	request(c.URL, function(error, res, body) {
		if (!error && res.statusCode == 200) {

			var prices = {};
			var result = JSON.parse(body);

			prices.btcusd = result.btc_usd;
			prices.btceur = result.btc_eur;
			prices.ltcusd = result.ltc_usd;
			prices.ltceur = result.ltc_eur;
			prices.ethusd = result.eth_usd;

			var json = JSON.stringify(prices);
			fs.writeFile('./src/prices.json', json, function(err) {
				if (err) throw err;
			});

			// loop indefinitely
			setTimeout(function(){getprices()}, 60000);
		}
	});
}


module.exports = {
	init: function (cb) { 
		getprices();
		// delay the callback 15 secs to give getprices() time to complete.
		setTimeout(cb, 15000);
	},
	addAlert: function (screen_name, tweetid, crypto, currency, price, cb) {
		// get the current prices
		var prices = JSON.parse(fs.readFileSync('./src/prices.json'));
		var date = new Date().getUTCDate();
		var currentprice;

		if (crypto == 'bitcoin') {
			if (currency == 'EUR') { currentprice = prices.btceur; } 
			else { currentprice = prices.btcusd; }
		}
		if (crypto == 'litecoin') {
			if (currency == 'EUR') { currentprice = prices.ltceur; } 
			else { currentprice = prices.ltcusd; }
		}
		if (crypto == 'ether') { currentprice = prices.ethusd; }

		var db = new sqlite3.Database('../indxio.db');
		
		if (price > currentprice) {
			// insert into alerts_up table
			db.serialize(function() {
				var stmt = db.prepare("INSERT INTO alerts_up VALUES (?,?,?,?,?,?,?)");
				stmt.run(null, screen_name, tweetid, crypto, currency, price, date);
				stmt.finalize();

				db.each("SELECT * FROM alerts_up", function(err, row) {
					console.log('alerts UP: '+ row.id + ": " + row.screen_name +'  '+ row.price);
				});
			});
		} else if (price < currentprice) {
			// insert into alerts_down table
			db.serialize(function() {
				var stmt = db.prepare("INSERT INTO alerts_down VALUES (?,?,?,?,?,?,?)");
				stmt.run(null, screen_name, tweetid, crypto, currency, price, date);
				stmt.finalize();

				db.each("SELECT * FROM alerts_down", function(err, row) {
					console.log('alerts DOWN: '+ row.id + ": " + row.screen_name +'  '+ row.price);
				});
			});
		}
		
		db.close();
		cb();
	},
	addSchedule:function (screen_name, crypto, currency, when, cb) {
		var db = new sqlite3.Database('../indxio.db');
		db.serialize(function() {
			db.run(scheduleTable);
			var stmt = db.prepare("INSERT INTO scheduled VALUES (?,?,?,?,?)");
			stmt.run(null, screen_name, crypto, currency, when);
			stmt.finalize();

			db.each("SELECT * FROM scheduled", function(err, row) {
				console.log(row.id + ": " + row.screen_name +'  '+ row.when);
			});
		});
		db.close();
		cb();
	}
};

/**
 *  Bitcoin Price Twitter Bot
 *  config.js
 *  
 *  Copyright Ansel Lindner <ansellindner@blockchainio.com>
 *  MIT License
 */

'use strict';

// These settings are for account <your account name>
module.exports = {
	CONSUMER_KEY: 'CAeV9ddvrBiSYgQlYwpUcolMx',
	CONSUMER_SECRET: 'tafz90B68unIc2IQY4L5MAWZqxOLeFoUxlpUUDZkX2Y7D2AsfF',
	ACCESS_TOKEN_KEY: '712142165271445504-LE9Jt2b9HUEcizvdq2rutFpIve8GnxN',
	ACCESS_TOKEN_SECRET: 'TjfqrLCv24X1f8TkLPnSTJGKoInwqZdkrGBtUhSoZ8pGw',
	RESPOND_TO: 'indxio #bot',
	URL: 'http://theindex.io/api/',
	TAGS: [ 
		'bitcoin', 'litecoin', 'ether',
		'BTC', 'EUR', 
		'price', 'alert', 'schedule'
	],
	TESTTAGS: [
		'bbitcoin', 'llitecoin', 'eether',
		'bBTC', 'eEUR',
		'pprice', 'aalert', 'sschedule'
	],
	tableAlertUp: 'CREATE TABLE if not exists alerts_up (\
				id INTEGER PRIMARY KEY, \
				screen_name TEXT NOT NULL, \
				id_str TEXT NOT NULL, \
				crypto TEXT NOT NULL, \
				currency TEXT NOT NULL, \
				price REAL NOT NULL, \
				created INTEGER NOT NULL)',
	tableAlertDown: 'CREATE TABLE if not exists alerts_down (\
				id INTEGER PRIMARY KEY, \
				screen_name TEXT NOT NULL, \
				id_str TEXT NOT NULL, \
				crypto TEXT NOT NULL, \
				currency TEXT NOT NULL, \
				price REAL NOT NULL, \
				created INTEGER NOT NULL)',
	scheduleTable: 'CREATE TABLE if not exists scheduled (\
					id INTEGER PRIMARY KEY, \
					screen_name TEXT NOT NULL, \
					crypto TEXT NOT NULL, \
					currency TEXT NOT NULL, \
					when TEXT NOT NULL, \
					created INTEGER NOT NULL)'
}

#!/usr/bin/env node

'use strict';

const dns = require('dns');
const got = require('got');
const cheerio = require('cheerio');
const chalk = require('chalk');
const ora = require('ora');
const logUpdate = require('log-update');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');

updateNotifier({pkg}).notify();
const spinner = ora();
const arg = process.argv[2];
let day = process.argv[3] || '';
const pre = chalk.cyan.bold('›');
const pos = chalk.red.bold('›');
const words = `${pre} ${chalk.bold('Word    :')}`;
const meanings = `${pre} ${chalk.bold('Meaning :')}`;
const commands = ['-h', '--help', '-w', '--wordthink', '-d', '--dictionary', '-m', '--merriam'];

const wordThink = 'http://www.wordthink.com/';
const dictionary = 'http://www.dictionary.com/wordoftheday/';
const merriamWebster = 'https://www.merriam-webster.com/word-of-the-day/';

if (!arg || arg === '-h' || arg === '--help' || commands.indexOf(arg) === -1) {
	console.log(`
  ${chalk.cyan('Usage   : ')} worday [sources]

  ${chalk.cyan('Options :')}
   -w, ${chalk.dim('--wordthink')}     Get word of the day from wordthink.com
   -d, ${chalk.dim('--dictionary')}    Get word of the day from dictionary.com
   -m, ${chalk.dim('--merriam')}       Get word of the day from merriam-webster.com

  ${chalk.cyan('Fetch words by date :')}
   $ worday -d 2016-10-10
   $ worday -m 2017-01-01

  ${chalk.cyan('Example :')}
   $ worday -w

  Note : ${chalk.dim('no support of date for the flag -w or --wordthink')}
		`);
	process.exit(1);
}

dns.lookup('google.com', err => {
	if (err) {
		logUpdate(`\n${pos} Please check your internet connection\n`);
		process.exit(1);
	} else {
		logUpdate();
		spinner.text = `Fetching word of the day. Hold on`;
		spinner.start();
	}
});

const showError = () => {
	logUpdate(`\n${pos} No words found \n`);
	process.exit(1);
};

if (arg === '-w' || arg === '--wordthink') {
	got(wordThink).then(res => {
		const $ = cheerio.load(res.body);
		const word = $('.title a, .pagetitle a, h2.attachment a').eq(0).text();
		const meaning = $('.post p').eq(0).text();
		logUpdate(`\n${words} ${word} \n\n${meanings} ${meaning.trim()}\n`);
		spinner.stop();
	});
}

if (arg === '-m' || arg === '--merriam') {
	day = `${merriamWebster}${day}` || merriamWebster;
	got(day).then(res => {
		const $ = cheerio.load(res.body);
		const word = $('.article-header-container.wod-article-header .word-header h1').text();
		const define = $('.wod-article-container p').eq(0).text().split(':')[1].trim();
		logUpdate(`\n${words} ${word} \n\n${meanings} ${define}\n`);
		spinner.stop();
	}).catch(err => {
		if (err) {
			showError();
		}
	});
}

if (arg === '-d' || arg === '--dictionary') {
	day = day.replace(/-/g, '/');
	day = `${dictionary}${day}` || dictionary;
	got(day).then(res => {
		const $ = cheerio.load(res.body);
		const word = $('.definition-header strong').text();
		const defZero = $('.first').text();
		const defOne = $('.second').text();
		logUpdate(`\n${words} ${word} \n\n${meanings} ⚫ ${defZero} \n            ⚫ ${defOne}\n`);
		spinner.stop();
	}).catch(err => {
		if (err) {
			showError();
		}
	});
}

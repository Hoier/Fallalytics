const cacheHandler = require("../util/cachehandler.js");
const roundsDictionary = require('../util/rounds.js');

const Filters = require('../util/filters');

var dictionary = roundsDictionary.dictionary;

module.exports = (req, res) => {
	res.set('Cache-control', cacheHandler.cacheControlHeader);
	let rounds = [];
	for (const round of Object.keys(dictionary)){
		let roundObject = dictionary[round];
		roundObject.round = round;
		rounds.push(roundObject);
	}
	let filters = Filters.default();
	res.render("rounds", { title:"Rounds", rounds: rounds, filters: filters});
}
const cacheHandler = require("../util/cachehandler.js");
const roundsDictionary = require('../util/rounds.js');
const Sorting = require('../util/sorting');
const Misc = require('../util/misc');

var dictionary = roundsDictionary.dictionary;

module.exports = (req, res) => {
	
	res.set('Cache-control', cacheHandler.cacheControlHeader);
		cacheHandler.getRecords(function(array){
			var result = [];
			var totalCounter = 0;
			for(const element of array){
				if(result.findIndex(test => test.round == element.round) == -1){
					if(!dictionary[element.round]){
						dictionary[element.round] = {
							name: element.round,
							type: "Unknown",
							season: 0,
							icon:""
						};
						console.log("Couldnt find round " + element.round);
					}
					var round = {
						name:dictionary[element.round].name,
						icon:dictionary[element.round].icon,
						type: dictionary[element.round].type,
						season: dictionary[element.round].season,
						round:element.round,
						count:0	
					};
					result.push(round);
				}
				result[result.findIndex(test => test.round == element.round)].count++;
				if(element.isfinal){
					totalCounter++;
				}
			}
			
			result = Sorting.quickSort(result, 0, result.length-1);
			result = result.slice(0,10);
			for(var y = 0; y < result.length; y++){
					result[y].percentage = ((result[y].count/totalCounter)*100).toFixed(2);
					result[y].medal = Misc.getMedal(y);
					result[y].position = y+1;
			}
			res.render("index", { title: "Welcome", botStatus: true, amount:totalCounter, rounds: result});
		},"Solo",7,false,false);
};
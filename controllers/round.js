const cacheHandler = require("../util/cachehandler.js");
const roundsDictionary = require('../util/rounds.js');
const Colors = require('../util/colors');
const Misc = require('../util/misc');
var dictionary = roundsDictionary.dictionary;

module.exports = (req, res) => {
    res.set('Cache-control', cacheHandler.cacheControlHeader);
	var round = undefined;
	if(req.params[0]){
		round = Misc.sanitizeString(req.params[0]);
	}
	if(round != undefined && round != ""){
		var roundObject = {};
		roundObject.round = round;
		roundObject.name = dictionary[round].name;
		roundObject.icon = dictionary[round].icon;
		roundObject.type = dictionary[round].type;		
		roundObject.season = dictionary[round].season;
		roundObject.entries = [];
		roundObject.count = 0;
		var data = {};		
		var last30DaysArray = [];
		for (var d = 6; d>=0; d--){
			var date = new Date(Date.now() - d * 24 * 60 * 60 * 1000);
			var dateString = date.getFullYear() + "." + (date.getMonth()+1) + "." + date.getDate();
			last30DaysArray.push(dateString);
			roundObject.entries.push({x:dateString, y: 0})
		}
		cacheHandler.getRecords(function(array){			
				for (var x = 0; x<array.length; x++){
					roundObject.count++;
					var arrayDate = new Date(array[x].date);
					var arrayDateString = arrayDate.getFullYear() + "." + (arrayDate.getMonth()+1) + "." + arrayDate.getDate();
					if(last30DaysArray.indexOf(arrayDateString)>-1){
						roundObject.entries[last30DaysArray.indexOf(arrayDateString)].y++;
					}
				}
				data.datasets= [];
				data.datasets[0]={}
				data.datasets[0].data =roundObject.entries;
				var colors = Colors.getColorArray(7);
				data.datasets[0].backgroundColor = colors[0];
				data.datasets[0].borderColor = colors[1];
				
				res.render("round", { title:"Stats for "+roundObject.name, buttons :[], round: roundObject, data: data});
		},"Prod",7,false,round);	
	}else{
		console.error("Could not resolve path, possible attack?");
		console.error(req._parsedUrl);
		res.redirect("/");
	}
};
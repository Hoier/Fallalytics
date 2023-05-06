const cacheHandler = require("../util/cachehandler.js");
const roundsDictionary = require('../util/rounds.js');
const Colors = require('../util/colors');
const Filters = require('../util/filters');

var dictionary = roundsDictionary.dictionary;

module.exports = (req, res) =>{
    let days = 7;
    let is24hours = false;
    if(req.path === "/roundsall24"){
        is24hours = true;
        days = 1;
    }

	res.set('Cache-control', cacheHandler.cacheControlHeader);

  	cacheHandler.getRecords(function(array){
		let data = {};
		let filters = Filters.default();
		
		dataset = {};
		dataset.label = "";
		dataset.index = 0;
		dataset.data = [];
		dataset.backgroundColor = [];
		dataset.borderColor = [];
		for (const element of array){
			if(!dictionary[element.round]){
				dictionary[element.round] = roundsDictionary.notFound;
				console.log("Couldnt find round " + element.round);
			}
			if(dataset.data.findIndex(round => round.x == dictionary[element.round].name)==-1){
				dataset.data.push({x:dictionary[element.round].name,y:1, season:dictionary[element.round].season, type: dictionary[element.round].type});
				dataset.backgroundColor.push(Colors.getColorByType(dictionary[element.round].type, 0.7));
				dataset.borderColor.push(Colors.getColorByType(dictionary[element.round].type, 1));
			}else{
				dataset.data.find(round => round.x == dictionary[element.round].name).y++;
			}
		}		
		data.datasets = [];
		data.datasets[0] = dataset;
		var buttonArray = [];
		buttonArray.push({name:"7d", classes:"NavButton2 tinyButtonOverride " + (!is24hours ? "enabled":"disabled"), href:"/roundsall"});
		buttonArray.push({name:"24h", classes:"NavButton2 tinyButtonOverride " + (is24hours ? "enabled":"disabled") , href:"/roundsall24"});
		res.render("bar", { width:"100%", height:"500px", customQuickSort:true, buttons : buttonArray, title: "Rounds",filters: filters, graphHeader:"Which rounds has been featured most?", data: data});

	},"Solo",days,false, false);
}
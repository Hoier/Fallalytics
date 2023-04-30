const cacheHandler = require("../util/cachehandler.js");
const roundsDictionary = require('../util/rounds.js');
const Sorting = require('../util/sorting');
const Misc = require('../util/misc');
const showDictionary = require("../util/show.js");
var dictionary = roundsDictionary.dictionary;

module.exports = (req, res) => {
	res.set('Cache-control', cacheHandler.cacheControlHeader);
	var show = undefined;
	if(req.params[0]){
		show = Misc.sanitizeString(req.params[0]);
	}
	if(show != undefined && show != ""){
		cacheHandler.getShows(function(showsArray){
			
			var showObject =  {id:show, displayName: showDictionary.getShowName(show, showsArray)};
			cacheHandler.getRecords(function(arrayAll24){
				cacheHandler.getRecords(function(array){
				//cacheHandler.getAllLast7Days(function(array){
					var currentShows = [];
					var currentShowsObjectArray = [];
					var result = [];
					var totalCounter = [];
					for(var x = 0; x<array.length; x++){
						currentIndex = array[x].index;
						if(!result[currentIndex]){
							result[currentIndex] = {array:[], index:currentIndex};
							totalCounter[currentIndex] = 0;
						}
						if(result[currentIndex].array.findIndex(element => element.round == array[x].round)== -1){
							if(!dictionary[array[x].round]){
								dictionary[array[x].round] = {
									name: array[x].round,
									type: "Unknown",
									season: 0,
									icon:""
								};
								console.log("Couldnt find round " + array[x].round);
							}
							let round = {
								name:dictionary[array[x].round].name,
								icon:dictionary[array[x].round].icon,
								type: dictionary[array[x].round].type,
								season: dictionary[array[x].round].season,
								round:array[x].round,
								count:0	
							};
							result[currentIndex].array.push(round);
						}
						result[currentIndex].array[result[currentIndex].array.findIndex(element => element.round == array[x].round)].count++;
						totalCounter[currentIndex]++;
					}
					
					//Remove first object in array, as no rounds have index == 0.
					result.splice(0,1);
					totalCounter.splice(0,1);

					//Find shows that are live last 24h
					for (const round24 of arrayAll24){
						if(round24.show && currentShows.indexOf(round24.show) == -1){
								currentShows.push(round24.show);
						}
					}
					
					for(var x = 0; x<result.length; x++){
						result[x].array = Sorting.quickSort(result[x].array, 0, result[x].array.length-1);
						result[x].array = result[x].array.slice(0,5);
						for(var y = 0; y < result[x].array.length; y++){
								result[x].array[y].percentage = ((result[x].array[y].count/totalCounter[x])*100).toFixed(2);
								result[x].array[y].medal = Misc.getMedal(y);
						}
					}
					if(currentShows.indexOf(showDictionary.mainShow.id)>-1){
						currentShows.splice(currentShows.indexOf(showDictionary.mainShow.id), 1);
						currentShowsObjectArray.push(showDictionary.mainShow);
					}
					if(currentShows.indexOf(showDictionary.squads.id)>-1){
						currentShows.splice(currentShows.indexOf(showDictionary.squads.id), 1);
						currentShowsObjectArray.push(showDictionary.squads);
					}
					if(currentShows.indexOf(showDictionary.duos.id)>-1){
						currentShows.splice(currentShows.indexOf(showDictionary.duos.id), 1);
						currentShowsObjectArray.push(showDictionary.duos);
					}
					for(var j = 0; j < currentShows.length; j++){
						currentShowsObjectArray.push({
							id:currentShows[j],
							displayName: showDictionary.getShowName(currentShows[j], showsArray)
						});
					}
					res.render("shows", { title: "Stats for "+showObject.displayName, botStatus: true, amount:array.length, rounds: result, show: showObject, currentShows: currentShowsObjectArray});
				},"Prod", 7, show, false);
			},"Prod",1,false,false);
		});
	}
};
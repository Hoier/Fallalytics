const cacheHandler = require("../cachehandler.js");
const roundsDictionary = require('../rounds.js');
const Sorting = require('../util/sorting');
const Misc = require('../util/misc');

var dictionary = roundsDictionary.dictionary;

module.exports = (req, res) => {
	
	res.set('Cache-control', cacheHandler.cacheControlHeader);
	cacheHandler.getRecords(function(array){
		cacheHandler.getShows(function(showsArray){
		
			var players = [];
			var playersIndexer = [];
			for (var i = 0; i < array.length; i++){
				if(array[i].playername){
					console.log(array[i].playername);
					if(playersIndexer.indexOf(array[i].playername) < 0){
						playersIndexer.push(array[i].playername);
						let cleanname = "TempUserName";
						try{
							cleanname = filter.clean(array[i].playername);
						}catch (e){
							console.log("Failed to clean name: "+ array[i].playername);
						}
						players.push(
							{
								playername:array[i].playername,
								cleanname: cleanname,
								rounds:0,
								solo:0,
								solofinal:0,
								showsArray:[],
								showsArrayIndexer:[],
								roundsArray:[],
								roundsArrayIndexer:[],
								count:0
							}
						);
					}
					players[playersIndexer.indexOf(array[i].playername)].rounds++;
					players[playersIndexer.indexOf(array[i].playername)].count++;
					if(array[i].show == "main_show"){
						players[playersIndexer.indexOf(array[i].playername)].count++;
						players[playersIndexer.indexOf(array[i].playername)].solo++;
						if(array[i].isfinal){
							players[playersIndexer.indexOf(array[i].playername)].count += 8;
							players[playersIndexer.indexOf(array[i].playername)].solofinal++;
						}
					}
					if(players[playersIndexer.indexOf(array[i].playername)].showsArrayIndexer.indexOf(array[i].show) < 0){
						players[playersIndexer.indexOf(array[i].playername)].showsArrayIndexer.push(array[i].show);
						players[playersIndexer.indexOf(array[i].playername)].showsArray.push(
							{
								show:array[i].show,
								count: 0
							}
						);
						
					}
					players[playersIndexer.indexOf(array[i].playername)].showsArray[players[playersIndexer.indexOf(array[i].playername)].showsArrayIndexer.indexOf(array[i].show)].count++;
					
					if(players[playersIndexer.indexOf(array[i].playername)].roundsArrayIndexer.indexOf(array[i].round) < 0){
						players[playersIndexer.indexOf(array[i].playername)].roundsArrayIndexer.push(array[i].round);
						players[playersIndexer.indexOf(array[i].playername)].roundsArray.push(
							{
								round:array[i].round,
								count: 0
							}
						);
						
					}
					players[playersIndexer.indexOf(array[i].playername)].roundsArray[players[playersIndexer.indexOf(array[i].playername)].roundsArrayIndexer.indexOf(array[i].round)].count++;
				}
			}
			players = Sorting.quickSort(players, 0, players.length-1);
			players = players.slice(0,10);
			for(var j = 0; j < players.length; j++){
				players[j].showsArray = Sorting.quickSort(players[j].showsArray, 0, players[j].showsArray.length-1);
				players[j].roundsArray = Sorting.quickSort(players[j].roundsArray, 0, players[j].roundsArray.length-1);
				players[j].mostplayedshow = showDictionary.getShowName(players[j].showsArray[0].show, showsArray);
				players[j].medal = Misc.getMedal(j);
				players[j].position = j+1;
				if(!dictionary[players[j].roundsArray[0].round]){
					dictionary[players[j].roundsArray[0].round] = {
						name: players[j].roundsArray[0].round,
						type: "Unknown",
						season: 0,
						icon:""
					};
					console.log("Couldnt find round " + players[j].roundsArray[0].round);
				}
				players[j].mostplayedround = dictionary[players[j].roundsArray[0].round].name;
			}
			console.dir(players);
			res.render("leaderboard", {title: "Leaderboard", players:players});
		});
	},"Prod",7,false, false);
}
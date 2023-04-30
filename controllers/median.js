const cacheHandler = require("../util/cachehandler");
const Sorting = require('../util/sorting');

//Experimental, trying to see how many games have the exact same rounds, in the same order...

module.exports = (req, res) => {
	
	res.set('Cache-control', cacheHandler.cacheControlHeader);
	cacheHandler.getRecords(function(array){
		let gamesArrayIndexer = [];
		let gamesArray = [];
		let result = [];
		let resultIndexer = [];
		let totalGames = 0;
		for (let x = 0; x < array.length; x++){
			if(gamesArrayIndexer.indexOf(array[x].session) > -1){
				gamesArray[gamesArrayIndexer.indexOf(array[x].session)].games.push(array[x]);
			}else{
				let temp = {games:[]};
				temp.games.push(array[x]);
				gamesArray.push(temp);
				gamesArrayIndexer.push(array[x].session);
			}
		}
		for (let y = 0; y < gamesArray.length; y++){
			//making a value count from index, as its easier to sort it then...
			let roundString = "";
			for (let z = 0; z < gamesArray[y].games.length; z++){
				gamesArray[y].games[z].count = gamesArray[y].games[z].index;
			}
			gamesArray[y].games = Sorting.quickSort(gamesArray[y].games, 0 , gamesArray[y].games.length-1);
			for (let a = 0; a < gamesArray[y].games.length; a++){
				roundString += gamesArray[y].games[a].round;
				roundString += "|";
			}
			roundString = roundString.slice(0,-1);
			totalGames++;
			if(resultIndexer.indexOf(roundString) < 0){
				resultIndexer.push(roundString);
				result.push({games:[gamesArray[y].games],count:1,roundString:roundString, rounds:roundString.split("|")});
			}else{
				result[resultIndexer.indexOf(roundString)].count++;
				result[resultIndexer.indexOf(roundString)].games.push(gamesArray[y].games);
			}
		}
		result = Sorting.quickSort(result, 0 , result.length-1);
		for(let b = 0; b < result.length; b++){
			if(result[b].count > 1 || result[b].rounds.length > 6){
				console.dir(result[b]);
				console.dir(result[b].games[0][0].session);
			}
		}
		console.log("Total Games: " + totalGames + " Unique Games: " + resultIndexer.length);
		res.render("about", { title: "About"});
	},"Solo", 7,false,false);
}
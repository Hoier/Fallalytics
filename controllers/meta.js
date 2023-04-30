const cacheHandler = require("../util/cachehandler");
const roundsDictionary = require('../util/rounds');
const Sorting = require('../util/sorting');
const Misc = require('../util/misc');
const Colors = require('../util/colors');
const Filters = require('../util/filters');
let dictionary = roundsDictionary.dictionary;

module.exports = (req, res) => {
    res.set('Cache-control', cacheHandler.cacheControlHeader);
	cacheHandler.getRecords((array) => {
		let cleanDataSet = { round: "", data: [] };
		for (let d = 30; d >= 0; d--) {
			let date = new Date(Date.now() - d * 24 * 60 * 60 * 1000);
			let dateString = `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
			cleanDataSet.data.push({ x: dateString, y: 0, games:[] });
		}
		let datasets = [];
		let countByDate = Misc.goclone(cleanDataSet);
		for (const element of array) {
			if (!dictionary[element.round]) {
				dictionary[element.round] = {
					name: element.round,
					type: "Unknown",
					season: 0,
					icon: ""
				};
				console.log("Couldnt find round " + element.round);
			}

			//Keep count of how many games where played on certain dates
			let tempDate = new Date(element.date);
			let tempDateString = `${tempDate.getFullYear()}.${tempDate.getMonth() + 1}.${tempDate.getDate()}`;

            //Check if date from DB is within graph range
			if (countByDate.data.findIndex(element => element.x == tempDateString) > -1) {
                if(!countByDate.data.find(element => element.x == tempDateString).games.includes(element.session)){
                    countByDate.data.find(element => element.x == tempDateString).y++;
                    countByDate.data.find(element => element.x == tempDateString).games.push(element.session);
                }
			    //add round dataset if not already in
                if(datasets.findIndex(dataset => dataset.round == element.round) == -1){
                    let cleanDataSetInjection = Misc.goclone(cleanDataSet);
			    	cleanDataSetInjection.round = element.round;
			    	cleanDataSetInjection.label = dictionary[element.round].name;
			    	cleanDataSetInjection.season = dictionary[element.round].season;
			    	cleanDataSetInjection.roundType = dictionary[element.round].type;
			    	cleanDataSetInjection.tension = 0.4;
			    	cleanDataSetInjection.hidden = true;
			    	cleanDataSetInjection.count = 0;
			    	datasets.push(cleanDataSetInjection);
                }

			    //Count the round in the correct dataset for the correct date. I know its a lot to take in...
			    datasets.find(dataset => dataset.round == element.round).data.find(data=>data.x == tempDateString).y++;
			    datasets.find(dataset => dataset.round == element.round).count += 1;
			    
            }
		}
		let colors = Colors.getColorArray(datasets.length);

		datasets = Sorting.quickSort(datasets, 0, datasets.length - 1);
		for (let y = 0; y < datasets.length; y++) {
			datasets[y].borderColor = colors[0][y];
			datasets[y].backgroundColor = colors[1][y];
			for (let z = 0; z < datasets[y].data.length; z++) {
				datasets[y].data[z].y = (datasets[y].data[z].y / countByDate.data[z].y) * 100;
			}
		}
		let filters = Filters.default;

		//quickfix since datasets cant have "type"¨
		if(filters.findIndex(element => element.dataField == "type") > -1){
			filters.find(element => element.dataField == "type").dataField = "roundType";
		}
		

		res.render("line", { graphHeader: "Meta", title: "Main Show Meta", data: { datasets: datasets }, buttons: [], filters: filters});
	},"Solo",30,false,false);
};
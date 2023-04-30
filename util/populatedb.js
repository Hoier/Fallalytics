const { MongoClient, ServerApiVersion } = require('mongodb');

//If we dont have an environment uri, we must populate a local db with test data
const uri = "mongodb://127.0.0.1:27017";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const dictionary = require("./rounds.js");

const gamesPerDay = 400;

function populateSolo(){
    let records = [];
    records = getDataSet("main_show", ["Team","Invisibeans","Final"],31,gamesPerDay);
    client.connect(err => {
		if (err) throw err;
		const collection = client.db("FallStats").collection("Solo");
		collection.insertMany(records, function(err2, res) {
			if (err2) throw err2;
			console.log("Inserted "+records.length+" records!");
		});		
	});
}
function populateProd(){
    let records = getDataSet("main_show", ["Team","Invisibeans","Final"],7,gamesPerDay)
    records = records.concat(getDataSet("squads_4player", ["Hunt","Invisibeans","Final"],7,gamesPerDay));
    records = records.concat(getDataSet("squads_2player_template", ["Hunt","Invisibeans","Final"],7,gamesPerDay));

    let invisibeans = [];   
    let today = new Date();
    for (let i = 0; i < 7; i++){
        let tempdate = new Date(new Date().setDate(today.getDate() - i));
        for (let j = 0; j < gamesPerDay; j++){
            let invisibeansgame = {};
            invisibeansgame.index = 1;
            invisibeansgame.isfinal = false;
            invisibeansgame.show = "invisibeans_0508_to_0708_2022";
            invisibeansgame.round = "round_invisibeans";
            invisibeansgame.date = tempdate
            invisibeansgame.session = ""+(10000000+(Math.floor(Math.random() * 20000000) + 1))+"-server-"+(1000000000+(Math.floor(Math.random() * 6000000000) + 1));
            invisibeans.push(invisibeansgame);
        }
    }
    records = records.concat(invisibeans);
    
    client.connect(err => {
		if (err) throw err;
		const collection = client.db("FallStats").collection("Prod");
		collection.insertMany(records, function(err2, res) {
			if (err2) throw err2;
			console.log("Inserted "+records.length+" records!");
		});		
	});
}

exports.clearDB = function () {
    //Clear the DB (on startup?)
    client.connect(err => {
		if (err) throw err;
		const collection = client.db("FallStats").collection("Solo");
		collection.deleteMany({}, function(err2, res) {
			if (err2) throw err2;
			console.log("Deleted "+ res.deletedCount +" in local Solo collection");
            populateSolo();
		});		
	});
    client.connect(err => {
		if (err) throw err;
		const collection = client.db("FallStats").collection("Prod");
		collection.deleteMany({}, function(err2, res) {
			if (err2) throw err2;
			console.log("Deleted "+ res.deletedCount +" in local Prod collection");
            populateProd();
		});		
	});
}

function getDataSet(show, bannedRounds, days, perday){
    let today = new Date();
    let records = [];
    for(let i = 0; i < days; i++){
        for(let j = 0; j < perday; j++){
            //35388305-server-1682068239
            let session = ""+(10000000+(Math.floor(Math.random() * 20000000) + 1))+"-server-"+(1000000000+(Math.floor(Math.random() * 6000000000) + 1));
            let rounds = Math.floor(Math.random() * 3) + 3;
            for (let k = 1; k < rounds; k++){
                //add a normal round same session
                let round = {};
                round.index = k;
                round.isfinal = false;
                round.session = session;
                round.show = show;
                round.date = new Date(new Date().setDate(today.getDate() - i));
                let roundTemp = getRandomRound();
                while (bannedRounds.includes(dictionary.dictionary[roundTemp].type)){
                    roundTemp = getRandomRound();
                }
                round.round = roundTemp;
                records.push(round);
            }

            let final = {};
            final.index = records[records.length-1].index+1;
            final.isfinal = true;
            final.session = session;
            final.show = show;
            final.date = new Date(new Date().setDate(today.getDate() - i));
            let finalTemp = getRandomRound();
            while (dictionary.dictionary[finalTemp].type != "Final"){
                finalTemp = getRandomRound();
            }
            final.round = finalTemp;
            records.push(final);
        }
    }
    return records;
}

function getRandomRound(){
    let roundKeys = Object.keys(dictionary.dictionary);
    return roundKeys[Math.floor(Math.random() * (roundKeys.length))];
}
const NodeCache = require( "node-cache" );
const myCache = new NodeCache( { stdTTL: 1800, checkperiod: 120 } );
const axios = require('axios').default;
const { MongoClient, ServerApiVersion } = require('mongodb');

var uri = "mongodb://127.0.0.1:27017";

var axiosconfig = {
	headers: {
		"x-api-key":"not-a-real-token"
	}
};

var fallGuysDBURL = "http://localhost:8000";

if(process.env.DEPLOYMENT && process.env.DEPLOYMENT == "prod"){
	if(process.env.MONGODB_URL){
		uri = process.env.MONGODB_URL;
	}
	if(process.env.FALLGUYSDB_URL){
		fallGuysDBURL = process.env.FALLGUYSDB_URL;
	}
	if(process.env.FALLGUYSDB_TOKEN){
		axiosconfig = {
			headers: {
				"x-api-key":process.env.FALLGUYSDB_TOKEN
			}
		};
	}
}


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const connection = client.connect();
const connect = connection;

exports.cacheControlHeader = "public, s-maxage=1800";

exports.send = function(record){
	client.connect(err => {
		if (err) throw err;
		const collection = client.db("FallStats").collection("Prod");
		collection.insertOne(record, function(err2, res) {
			if (err2) throw err2;
			console.log("Inserted 1 record!");
		});		
	});
	
}
exports.sendSoloShow = function(records){
	client.connect(err => {
		if (err) throw err;
		const collection = client.db("FallStats").collection("Solo");
		collection.insertMany(records, function(err2, res) {
			if (err2) throw err2;
			console.log("Inserted "+records.length+" records!");
		});		
	});
	
}
exports.check = async function(callback, col, session, index){
	connect.then(() => {
		const collection = client.db("FallStats").collection(col);
		let query = {session:session};
		if(index){
			query.index= index;
		}
		collection.find(query).toArray(async function(err, result) {
			if (err) throw err;
			if(typeof callback !== 'undefined'){
				if(result.length>1){
					console.log("Checked session: " + session + ", index:" + index + ", and found duplicates allready in db: " + col);
					console.dir(result);
				}
				callback(result.length>0);
			}
	});
});
}

exports.getRecords = async function(callback, col, days, show, round){
	let key = buildKey(col, days, show, round);
	let result = myCache.get(key);
	if(result == undefined){
		console.log("Miss on cache: " + key);
		getRecordsFromDb(callback, col, days, show, round);
	}else{
		if(typeof callback !== 'undefined'){
			console.log("Hit on cache: " + key);
			callback(result);
		}
	}
}

exports.getShows = async function(callback){
	var result = myCache.get("AllShows");
	if(result == undefined){
		getShowsExternal(callback);
	}else{
		if(typeof callback !== 'undefined'){
			callback(result);
		}
	}
}

async function getRecordsFromDb(callback, col, days, show, round){
	connect.then(() => {
		const collection = client.db("FallStats").collection(col);
		let query = {};
		if(days){
			let dateDaysAgo = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
			query.date = {$gte : dateDaysAgo}
		}
		if(show){
			query.show = show;
		}
		if(round){
			query.round = round;
		}
		collection.find(query).toArray(async function(err, result) {
			if (err) throw err;
			var success = await myCache.set(buildKey(col, days, show, round), result);
			if(typeof callback !== 'undefined'){
				callback(result);
			}
		});
	});
}

async function getShowsExternal(callback){
	axios.get(fallGuysDBURL, axiosconfig).then(async function (response) {
		if(response && response.data && response.data.data && response.data.data.shows){
			var success = await myCache.set("AllShows", response.data.data.shows);
			callback(response.data.data.shows);
		}else{
			console.log("FG-DB didnt give me what i wanted");
			callback([]);
		}
	}).catch(function (error) {
		// handle error
		//console.log(error);
	}).then(function () {
		// always executed
	});
}

const buildKey = function(col, days, show, round){
	let key = col;
	if(days){
		key += days;
	}
	if(show){
		key += show;
	}
	if(round){
		key += round;
	}
	return key;
}
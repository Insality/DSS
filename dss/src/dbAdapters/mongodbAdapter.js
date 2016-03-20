var database,
	mongodb = require("mongodb"),
	log4js = require("log4js");

log = log4js.getLogger();

function Connect(uri){
	mongodb.MongoClient.connect(uri, function(err, db){
		if (err) {
			log.error("Cant connect to database");
			throw err;
		};
		database = db;
		log.info("Connected to MongoDB database");
	});
}


function Put(app, eventName, json, eventKeys){
	var tableName = GetTableName(app, eventName);
	var record = database.collection(tableName);

	// check unique:
	var uniquePart = {};
	var isHaveUniquePart = false;
	for (index in eventKeys["unique"]) {
		var k = eventKeys["unique"][index];
		uniquePart[k] = json[k];
		isHaveUniquePart = true;
	};

	record.updateOne(uniquePart, {$set: json}, function(err, r){
		if (err) throw err;

		if (r.matchedCount === 0 || !isHaveUniquePart ){
			record.insert(json, function(err, result){
				if (err) throw err;
				log.info("Insered record " + JSON.stringify(json) + " to " + tableName);
			});
		} else{
			log.info("Updated record " + JSON.stringify(json) + " in " + tableName);
		};
	})
}

function Get(app, eventName, eventKeys, callback){
	var tableName = GetTableName(app, eventName);
	var record = database.collection(tableName);

	var result = {"data": []};

	filter = {"_id": 0};
	eventKeys.forEach(function(item){
		filter[item] = 1;
	})

	var cursor = record.find({}, filter );
	cursor.each(function(err, doc){
		if (err) throw err;

		if (doc != null){
			result["data"].push(doc);
		} else {
			callback(result["data"]);
		}
	})
}


function CloseConnection(){
	database.close();
	log.info("Closing MongoDB connection");
}


function GetTableName(app, eventName){
	return app + '.' + eventName;
}

module.exports.Connect = Connect;
module.exports.Put = Put;
module.exports.Get = Get;
module.exports.CloseConnection = CloseConnection;

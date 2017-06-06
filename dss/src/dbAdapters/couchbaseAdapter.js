var database,
	couchbase = require("couchbase"),
	cluster,
	bucket,
	log4js = require("log4js");

log = log4js.getLogger();

// uri = "couchbase://localhost/"

function Connect(uri){
	cluster = new couchbase.Cluster(uri);
	log.info("Connected to cluster database");
	mongodb.MongoClient.connect(uri, function(err, db){
		if (err) {
			log.error("Cant connect to database");
			throw err;
		};
		database = db;
	});
}


function Put(app, eventName, json, eventKeys){
	var tableName = GetTableName(app, eventName);
	var record = cluster.openBucker(tableName;)

	// check unique:
	var uniquePart = {};
	var isHaveUniquePart = false;
	for (index in eventKeys["unique"]) {
		var k = eventKeys["unique"][index];
		uniquePart[k] = json[k];
		isHaveUniquePart = true;
	};

	if (isHaveUniquePart) {
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
	} else {
		record.insert(json, function(err, result){
			if (err) throw err;
			log.info("Insered record " + JSON.stringify(json) + " to " + tableName);
		});
	}
}

function Get(app, eventName, eventKeys, filter, callback){
	var tableName = GetTableName(app, eventName);
	var record = database.collection(tableName);

	var result = {"data": []};

	filterValues = {"_id": 0};
	eventKeys.forEach(function(item){
		filterValues[item] = 1;
	})

	options = filter["options"] ? filter["options"] : {};
	var isCount = ("count" in options) ? true : false;
	delete options["count"]
	delete filter["options"];

	var cursor = record.find(filter, filterValues, options);

	if (isCount){
		cursor.count(function(err, count){
			if (err) throw err;
			callback({"count": count});
		})
		return;
	}
	
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

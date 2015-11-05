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


function Put(app, eventName, json){
	var tableName = app + '.' + eventName;
	var record = database.collection(tableName);
	record.insert(json, function(err, result){
		if (err) throw err;
		log.info("Insered record " + JSON.stringify(json) + " to " + tableName);
	});
}


function CloseConnection(){
	database.close();
	log.info("Closing MongoDB connection");
}


module.exports.Connect = Connect;
module.exports.Put = Put;
module.exports.CloseConnection = CloseConnection;

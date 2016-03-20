var adapterType = "mongodbAdapter"; // write your own and put in adapters dir

var adapter = require("./dbAdapters/" + adapterType),
	settings = require("../settings");

var uri = settings.connectionURL;
adapter.Connect(uri);

process.on("exit", CloseConnection.bind());
process.on("SIGINT", CloseConnection.bind());

function Put(app, eventName, json, eventKeys){
	adapter.Put(app, eventName, json, eventKeys);
}

function Get(app, eventName, eventKeys, callback){
	return adapter.Get(app, eventName, eventKeys, callback);
}

function CloseConnection(){
	adapter.CloseConnection();
}

module.exports.Put = Put;
module.exports.Get = Get;
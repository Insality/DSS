var adapterType = "mongodbAdapter"; // write your own and put in adapters dir

var adapter = require("./dbAdapters/" + adapterType),
	settings = require("../settings");

var uri = settings.connectionURL;
adapter.Connect(uri);

process.on("exit", CloseConnection.bind());
process.on("SIGINT", CloseConnection.bind());

function Put(app, eventName, json){
	adapter.Put(app, eventName, json);
}

function CloseConnection(){
	adapter.CloseConnection();
}

module.exports.Put = Put;
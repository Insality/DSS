var fs = require('fs'),
	path = require('path'),
	log4js = require('log4js'),
	express = require('express');

log = log4js.getLogger();

server = express();

log.info("Devourer Statistic Server started");

port = 7550;
appsDir = "../apps";
var confs = [];


fs.readdirSync(appsDir).forEach(function(name){
	var filePath = path.join(appsDir, name);
	var stat = fs.statSync(filePath);
	if (stat.isFile()){
		confs.push(filePath);
	}
});


log.info("Loading configurations:");

confs.forEach(function(confName){
	log.info("Loading config: " + confName);
	var json = JSON.parse(fs.readFileSync(confName, "utf8"));

	log.info("App name: " + json["app_name"]);

	json["app_events"].forEach(function(o){
		log.info("Event: " + o["event_name"] + " on app " + json["app_name"]);
		server.get("/"+json["app_name"]+"/"+o["event_name"], function(req, res){
			res.send(o["event_fields"]);
		});
	});
});

log.info("Waiting http requests")


// ====================
// Connections settings
// ====================
server.listen(port, function(){
	log.info('DSS listening on port ' + port);
});
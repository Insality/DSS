var fs = require('fs'),
	path = require('path'),
	log4js = require('log4js')
	handlers = require("./requestHandlers");

log = log4js.getLogger();


function LoadConfiguration(confName){
	log.info();
	try {
		var json = JSON.parse(fs.readFileSync(confName, "utf8"));
	} catch (e) {
		log.info("The configuration file " + path.basename(confName) + " is invalid.");
		return;
	}

	log.info("Loading app: " + json["app_name"]);

	json["app_events"].forEach(function(e){
		var eventUrl = "/"+json["app_name"]+"/"+e["event_name"];
		log.info("Registering event: " + eventUrl);

		server.get(eventUrl, function(req, res){
			handlers.StandartEventGet(req, res, e)
		});

		server.post(eventUrl, function(req, res){
			handlers.StandartEventPost(req, res, e);
		});
	});
};


function GetConfigurationsList(dssDir){
	appsDir = path.normalize(dssDir + "/../apps");
	confs = [];

	fs.readdirSync(appsDir).forEach(function(name){
		var filePath = path.join(appsDir, name);
		var stat = fs.statSync(filePath);
		if (stat.isFile() && path.extname(filePath) == ".conf"){
			confs.push(filePath);
		}
	});
	return confs;
}


module.exports.LoadConfiguration = LoadConfiguration;
module.exports.GetConfigurationsList = GetConfigurationsList;
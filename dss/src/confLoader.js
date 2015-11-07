var fs = require('fs'),
	path = require('path'),
	log4js = require('log4js')
	handlers = require("./requestHandlers");

log = log4js.getLogger();


function LoadConfiguration(confName, server){
	log.info();
	try {
		var app = JSON.parse(fs.readFileSync(confName, "utf8"));
	} catch (e) {
		log.info("The configuration file " + path.basename(confName) + " is invalid.");
		return;
	}

	server.apps.push(app);
	log.info("Loading app: " + app["app_name"]);

	server.get("/" + app["app_name"], function(req, res){
		var eventNames = [];
		app["app_events"].forEach(function(ev){
			eventNames.push(ev["event_name"]);
		})
		res.send({"response": eventNames});
	});

	app["app_events"].forEach(function(e){
		var eventUrl = "/"+app["app_name"]+"/"+e["event_name"];
		log.info("Registering event: " + eventUrl);

		server.get(eventUrl, function(req, res){
			handlers.StandartEventGet(req, res, e, app)
		});

		server.post(eventUrl, function(req, res){
			handlers.StandartEventPost(req, res, e, app);
		});

		// loading stats:
		var statNames = [];
		e["event_stats"].forEach(function(stat){
			statNames.push(stat["stat_name"]);
		})

		// stat list send:
		server.get(eventUrl+"/stat", function(req, res){
			res.send({"response": statNames});
		})
	});
	return app;
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

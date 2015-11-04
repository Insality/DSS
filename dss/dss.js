var fs = require('fs'),
	path = require('path'),
	log4js = require('log4js'),
	express = require('express'),
	bodyParser = require('body-parser');

// SERVER UTILS
function GetErrorMessage(errorCode, details){
	var errorMsg = "[Error]: ";
	switch(errorCode){
		case 20:
			errorMsg += "JSON is not valid.";
			break;
		case 21:
			errorMsg += "JSON dont have requred fields.";
			break;
		default:
			errorMsg += "[SERVER_ERROR] Error code is not defined."
			break;
	}
	if (details){
		errorMsg += " Details: " + details;
	}
	return errorMsg;
}

function EventJsonIsValid(requestJson, eventKeys){
	for (index in eventKeys){
		key = eventKeys[index];
		if (!(key in requestJson)){
			return false;
		}
	}
	return true;
}

function GetTimeNow(){
	var date = new Date().toJSON().replace("T", " ").slice(0, -5);
	return date;
}

GetTimeNow();

function AddMetadata(o){
	o["Date"] = GetTimeNow();
}




// SERVER:
// Log can be: debug, info, warn, error, fatal, trace
log = log4js.getLogger();

// Server configuration
server = express();
server.use(bodyParser.json());

// Only JSON aviable in post:
server.use(function (error, req, res, next) {
	if (error instanceof SyntaxError) {
		res.send(GetErrorMessage(20));
	} else {
		next();
	}
});

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
// TODO: validate every conf

confs.forEach(function(confName){
	var json = JSON.parse(fs.readFileSync(confName, "utf8"));

	log.info();
	log.info("Loading app: " + json["app_name"]);

	json["app_events"].forEach(function(e){
		log.info("Event: " + e["event_name"] + " on app " + json["app_name"]);

		var eventUrl = "/"+json["app_name"]+"/"+e["event_name"];
		var eventKeys = e["event_fields"];

		log.info("Event URL: " + eventUrl);

		server.get(eventUrl, function(req, res){
			res.send(eventKeys);
		});

		server.post(eventUrl, function(req, res){
			if (EventJsonIsValid(req.body, eventKeys)){
				var newJson = {};
				for (index in eventKeys){
					var key = eventKeys[index];
					newJson[key] = req.body[key];
				}
				AddMetadata(newJson);
				res.send(JSON.stringify(newJson));
			} else {
				res.send(GetErrorMessage(21));
			}
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
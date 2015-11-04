var utils = require('./utils'),
	log4js = require("log4js"),
	dbController = require("./databaseController");

log = log4js.getLogger();

function StandartEventGet(req, res, e, app){
	if (Object.keys(req.query).length != 0){
		req.body = req.query;
		StandartEventPost(req, res, e, app);
	} else{
		res.send("Event required fields: " + e["event_fields"]);
	}
};


function StandartEventPost(req, res, e, app){
	var eventKeys = e["event_fields"];
	if (utils.EventJsonIsValid(req.body, eventKeys)){
		var newJson = {};
		for (index in eventKeys){
			var key = eventKeys[index];
			newJson[key] = req.body[key];
		}
		utils.AddMetadata(newJson);
		dbController.Put(app["app_name"], e["event_name"], newJson);
		res.send(JSON.stringify(newJson));
	} else {
		res.send(utils.GetErrorMessage(21));
	}
};


module.exports.StandartEventPost = StandartEventPost;
module.exports.StandartEventGet = StandartEventGet;
var utils = require('./utils'),
	log4js = require("log4js"),
	dbController = require("./databaseController");

log = log4js.getLogger();

function StandartEventGet(req, res, e, app){
	if (Object.keys(req.query).length != 0){
		req.body = req.query;
		StandartEventPost(req, res, e, app);
	} else {
		/*
		var eventWiki = "";
		if (e["event_fields_unique"]) eventWiki += "Event unique fields: " + e["event_fields_unique"] + ". ";
		if (e["event_fields_required"]) eventWiki += "Event required fields: " + e["event_fields_required"] + ". ";
		if (e["event_fields_optional"]) eventWiki += "Event optional fields: " + e["event_fields_optional"] + ".";
		*/
		var eventKeys = GetAllEventKeys(e);
		console.log("Get event keys:" + eventKeys);

		dbController.Get(app["app_name"], e["event_name"], eventKeys, function(data){
			res.send(data);
		});

		// res.send(result);
	}
};

function GetAllEventKeys(e){
	var result = [];
	result = result.concat(e["event_fields_unique"]);
	result = result.concat(e["event_fields_required"]);
	result = result.concat(e["event_fields_optional"]);
	return result;
}


function StandartEventPost(req, res, e, app){
	var eventKeys = {
		"unique": e["event_fields_unique"],
		"required": e["event_fields_required"],
		"optional": e["event_fields_optional"]
	};
	var errorMsg = [];
	
	if (utils.EventJsonIsValid(req.body, eventKeys, errorMsg)){
		if (!CheckPassword(req.body, app)) {
			res.send(utils.GetErrorMessage(25));
			return;
		}
		var newJson = {};
		var requiredFields = eventKeys["unique"].concat(eventKeys["required"], eventKeys["optional"]);
		for (index in requiredFields){
			var key = requiredFields[index];
			newJson[key] = "";
			if (req.body[key]) {
				newJson[key] = req.body[key];
			}
		}
		utils.AddMetadata(newJson);
		dbController.Put(app["app_name"], e["event_name"], newJson, eventKeys);
		res.send(utils.GetOkMessage());
	} else {
		res.send(utils.GetErrorMessage(21, errorMsg));
	}
};


function CheckPassword(json, app){
	if (Boolean(app["app_key"])){
		if (json["app_key"] === app["app_key"]){
			return true;
		} else{
			return false;
		}
	}
	return true;
}

module.exports.StandartEventPost = StandartEventPost;
module.exports.StandartEventGet = StandartEventGet;
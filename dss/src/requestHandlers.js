var utils = require('./utils'),
	log4js = require("log4js");

log = log4js.getLogger();

function StandartEventGet(req, res, e){
	if (Object.keys(req.query).length != 0){
		req.body = req.query;
		StandartEventPost(req, res, e);
	} else{
		res.send("Event required fields: " + e["event_fields"]);
	}
};


function StandartEventPost(req, res, e){
	var eventKeys = e["event_fields"];
	if (utils.EventJsonIsValid(req.body, eventKeys)){
		var newJson = {};
		for (index in eventKeys){
			var key = eventKeys[index];
			newJson[key] = req.body[key];
		}
		utils.AddMetadata(newJson);
		res.send(JSON.stringify(newJson));
	} else {
		res.send(utils.GetErrorMessage(21));
	}
};


module.exports.StandartEventPost = StandartEventPost;
module.exports.StandartEventGet = StandartEventGet;
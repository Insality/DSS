var utils = require('./utils'),
	log4js = require("log4js"),
	dbController = require("./databaseController");

log = log4js.getLogger();

function StandartEventGet(req, res, e, app){
	if (Object.keys(req.query).length != 0){
		req.body = req.query;
		StandartEventPost(req, res, e, app);
	} else {
		var eventKeys = GetAllEventKeys(e);

		dbController.Get(app["app_name"], e["event_name"], eventKeys, {}, function(data){
			res.send(data);
		});
	}
};


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


function StandartEventStatGet(req, res, e, app, stat){
	var eventKeys = GetAllEventKeys(e);
	// eventKeys.push("date");

	filter = {};
	filter["options"] = {};
	filter["options"]["sort"] = [];
	var funcs = stat["stat_fun"].split("=>");
	funcs.forEach(function(item){
		var funcName = item.split("(")[0];

		var withoutLastBracket = item.replace(")", "");
		var args = withoutLastBracket.split("(");
		args.shift();

		var startDate = new Date();
		var endDate = new Date();
		switch (funcName){
			case "Last":
				switch(args[0]){
					case "hour":
						startDate.setHours(startDate.getHours()-1);
						break;
					case "day":
						startDate.setDate(startDate.getDate()-1);
						break;
					case "week":
						startDate.setDate(startDate.getDate()-7);
						break;
					case "month":
						startDate.setMonth(startDate.getMonth()-1);
						break;
					case "year":
						startDate.setFullYear(startDate.getFullYear()-1);
						break;
				}
				filter["date"] = {"$gte": startDate};
				break;
			case "Period":
				break;
			case "Count":
				filter["options"]["count"] = true;
				break;
			case "Limit":
				filter["options"]["limit"] = args[0];
				break;
			case "Max":
				filter["options"]["sort"].push([args[0], "desc"])
				filter["options"]["limit"] = 1;
				break;
			case "Min":
				filter["options"]["sort"].push([args[0], "asc"])
				filter["options"]["limit"] = 1;
				break;
			case "Sort":
				filter["options"]["sort"].push([args[0], "asc"])
				break;
			case "SortReversed":
				filter["options"]["sort"].push([args[0], "desc"])
				break;
			default:
				console.log("[Error]: Unknow func name: " + funcName);
		}
	});

	dbController.Get(app["app_name"], e["event_name"], eventKeys, filter, function(data){
		res.send(data);
	});
};

function GetEventKeysInfo(req, res, e, app){
	var eventWiki = "";
	if (e["event_fields_unique"]) eventWiki += "Event unique fields: " + e["event_fields_unique"] + ".  ";
	if (e["event_fields_required"]) eventWiki += "Event required fields: " + e["event_fields_required"] + ".  ";
	if (e["event_fields_optional"]) eventWiki += "Event optional fields: " + e["event_fields_optional"] + ".";
	
	res.send(eventWiki);
}


function GetAllEventKeys(e){
	var result = [];
	result = result.concat(e["event_fields_unique"]);
	result = result.concat(e["event_fields_required"]);
	result = result.concat(e["event_fields_optional"]);
	return result;
}


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
module.exports.GetEventKeysInfo = GetEventKeysInfo;
module.exports.StandartEventStatGet = StandartEventStatGet;
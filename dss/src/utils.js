function GetJsonBlank(){
	return { "response": "", "error": "" };
}

function GetOkMessage(){
	response = GetJsonBlank();
	response["response"] = "ok";
	return JSON.stringify(response);
}

function GetInfoMessage(infoMsg){
	response = GetJsonBlank();
	response["response"] = infoMsg;
	return JSON.stringify(response);
}

function GetErrorMessage(errorCode, details){
	var errorMsg = "";
	switch(errorCode){
		case 20:
			errorMsg += "JSON is not valid";
			break;
		case 21:
			errorMsg += "JSON keys is invalid";
			break;
		case 25:
			errorMsg += "The app key is incorrect";
			break;
		default:
			errorMsg += "Error code is not defined, server error"
			break;
	}
	if (details){
		errorMsg += " Details: " + details;
	}

	response = GetJsonBlank();
	response["response"] = "error";
	response["error"] = errorMsg;
	return JSON.stringify(response);
}

function EventJsonIsValid(requestJson, eventKeys, errorMsg){
	// Check requestJson have every required keys (in eventKeys)
	var requiredFields = eventKeys["unique"].concat(eventKeys["required"]);
	for (index in requiredFields){
		key = requiredFields[index];
		if (!(key in requestJson)){
			errorMsg.push("No key: " + key);
			return false;
		} else{
			// Check requestJson dont have multiply values (arrays)
			if (requestJson[key] instanceof Array) {
				errorMsg.push("Array value is not allowed. Bad key value: " + key);
				return false;
			}
		}
	}

	

	return true;
}

function GetTimeNow(){
	var date = new Date().toJSON().replace("T", " ").slice(0, -5);
	return date;
}

function AddMetadata(o){
	o["date"] = GetTimeNow();
}

module.exports.GetOkMessage = GetOkMessage;
module.exports.GetErrorMessage = GetErrorMessage;
module.exports.GetInfoMessage = GetInfoMessage;
module.exports.EventJsonIsValid = EventJsonIsValid;
module.exports.GetTimeNow = GetTimeNow;
module.exports.AddMetadata = AddMetadata;

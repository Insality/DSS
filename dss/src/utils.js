function GetErrorMessage(errorCode, details){
	var errorMsg = "[Error]: ";
	switch(errorCode){
		case 20:
			errorMsg += "JSON is not valid.";
			break;
		case 21:
			errorMsg += "JSON dont have required fields.";
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

function AddMetadata(o){
	o["date"] = GetTimeNow();
}

module.exports.GetErrorMessage = GetErrorMessage;
module.exports.EventJsonIsValid = EventJsonIsValid;
module.exports.GetTimeNow = GetTimeNow;
module.exports.AddMetadata = AddMetadata;

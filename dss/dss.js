var fs = require('fs'),
	log4js = require('log4js'),
	express = require('express'),
	bodyParser = require('body-parser')
	utils = require('./src/utils'),
	loader = require('./src/confLoader');

// Log can be: debug, info, warn, error, fatal, trace
log = log4js.getLogger();

// Server configuration
server = express();
server.use(bodyParser.json());

// Only JSON aviable in post:
server.use(function (error, req, res, next) {
	if (error instanceof SyntaxError) {
		res.send(utils.GetErrorMessage(20));
	} else {
		next();
	}
});

log.info("Devourer Statistic Server started");
var confs = loader.GetConfigurationsList(__dirname);

log.info("Loading configurations:");
log.info("=======================");
confs.forEach(function(confName){
	loader.LoadConfiguration(confName, server);
});

// ====================
// Connections settings
// ====================
log.info();
port = 7550;
server.listen(port, function(){
	log.info('DSS listening on port ' + port);
});
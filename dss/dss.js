var fs = require('fs'),
	log4js = require('log4js'),
	express = require('express'),
	bodyParser = require('body-parser')
	utils = require('./src/utils'),
	loader = require('./src/confLoader'),
	cors = require('cors');

// Log can be: debug, info, warn, error, fatal, trace
log = log4js.getLogger();

// Server configuration
server = express();
server.use(bodyParser.json());
server.use(cors());

// Only JSON aviable in post:
server.use(function (error, req, res, next) {
	if (error instanceof SyntaxError) {
		res.send(utils.GetErrorMessage(20));
	} else {
		next();
	}
});

var allowCrossDomain = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,POST');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Key');
	next();
}
server.use(allowCrossDomain);

server.apps = [];

log.info("Devourer Statistic Server started");
var confs = loader.GetConfigurationsList(__dirname);

log.info("Loading configurations:");
log.info("=======================");
confs.forEach(function(confName){
	loader.LoadConfiguration(confName, server);
});

server.get("/", function(req, res){
	var names = [];
	server.apps.forEach(function(app){
		names.push(app["app_name"]);
	})
	res.send({"response": names});
})

// ====================
// Connections settings
// ====================
log.info();
port = 7550;
server.listen(port, function(){
	log.info('DSS listening on port ' + port);
});

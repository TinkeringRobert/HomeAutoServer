const path = require('path');
var sqlite3 = require('sqlite3').verbose();
var winston = require('winston');

var Controllers = require('./Controllers');

var db = null;
var db_initalized = false;

module.exports = {
	initialize: function(params, Broker)
	{
		const dbPath = path.resolve(__dirname, params.database.nodes);

		winston.debug('Starting : InfraReceiver');
    winston.debug('-------------------------------------------');
		winston.debug("File :" + dbPath);
		db = new sqlite3.Database(dbPath);
    db_initalized = true;
    winston.debug("Database initialized");

    // Controllers this will be reported at initialisation
    // param: controllerName the name of the controller itself
		Broker.subscribe('ReportController', function(event, payload) {
			if(db === null || db_initalized === false){
				winston.error("Database call not handled db:" + db + " init:" + (db_initalized===true ? "true" : "false"));
				return null;
			}

      if (payload === undefined || payload === null ){
        winston.error('IR : Invalid controller information received Check payload');
        return;
      }

      if (payload.controllerName === undefined){
        winston.error('IR : Invalid controllerName received in payload');
      }

      winston.debug('IR : Valid controller name ' + payload.controllerName);
			Controllers.update(payload.controllerName, db);
		});

		Broker.publish('ReportController',
									{controllerName: 'InfraReceiver'},
									{async: false});
	}
}

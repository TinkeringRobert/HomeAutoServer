var http = require('http');
var _ = require('lodash');
var moment = require('moment');

module.exports = function(app, nodesDb) {


	// create todo and send back all todos after creation
	app.get('/energymeterdata/:amount', function(req, res) {
		console.log("GET :: Current meterdata");
		var amount = 30;

		if(req.params.amount !== undefined){
			amount = req.params.amount;
		}

		nodesDb.getEnergyMeterValue(amount, function(result){
			_.forEach(result, function(field) {
				field.utc = moment.utc(field.timestamp).valueOf();
			});
			return res.send(result);
		});
	});
};

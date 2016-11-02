var http = require('http');
var _ = require('lodash');

module.exports = function(app, nodesDb) {

	// create todo and send back all todos after creation
	app.get('/meterdata', function(req, res) {
		console.log("GET :: Current meterdata");
		return res.send([{"id":1,"power":1000},{"id":2,"power":1500}]);
  });

	// create todo and send back all todos after creation
	app.get('/energymeterdata', function(req, res) {
		console.log("GET :: Current meterdata");
		var amount = 30;

		if(req.params.amount !== undefined){
			amount = req.params.amount;
		}

		nodesDb.getEnergyMeterValue(amount, function(result){
			return res.send(result);
		});
	});
};

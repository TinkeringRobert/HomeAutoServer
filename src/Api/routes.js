var http = require('http');
var _ = require('lodash');

module.exports = function(app, nodesDb) {

	// create todo and send back all todos after creation
	app.get('/nodes/:uuid', function(req, res) {
		console.log("GET :: /nodes/:uuid");
		console.log(req.params.uuid);
		return res.send("Data :)");
  });

	app.get('/nodes', function(req, res) {
		console.log("GET :: /nodes");

		nodesDb.getNodesFromDb(function(result){
			return res.send(result);
		});
	});
};

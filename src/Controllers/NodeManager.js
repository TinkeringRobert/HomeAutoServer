var winston = require('winston')
var db = require('./Database');

module.exports = {
	handleUdpNodeMessage: function(udpMsg)
	{
		winston.debug(JSON.stringify(udpMsg));
		var nodeCount = db.findInDb('nodes', {uuid: udpMsg.node});
		winston.debug('amount of nodes = ' + nodeCount);

		if(nodeCount === 0)
		{
			db.insertIntoDb('nodes', {uuid: udpMsg.node});
		}
	}
}
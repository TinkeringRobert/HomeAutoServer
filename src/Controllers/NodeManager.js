var winston = require('winston')
var db = require('./Database');
var broker;

module.exports = {
	initialize: function(Broker)
	{
		broker = Broker;
		console.log('Starting : NodeManager');

		broker.subscribe('handleUdpNodeMessage', function(event, payload) {
			// Handle the Node message
			//winston.debug('UDP Node Msg  = ' + JSON.stringify(payload.udpMsg));
			//winston.debug('UDP Node Date = ' + JSON.stringify(payload.date));
			// Check if the node already exist if not add to the database
			addOrUpdateNode(payload.udpMsg.node, payload.date);
		});

		setInterval(sendNodeKeepAlive, 10*1000);
	}
}

// Check if the node already exist if not add to the database
function addOrUpdateNode( nodeUuid, reportDate ) {

	var nodeCount = db.findAmountOfElementsInDb('nodes', {uuid: nodeUuid});

	// Add or update the node Uuid and reportDate
	if(nodeCount === 0)
	{
		db.insertIntoDb('nodes', {uuid: nodeUuid, latestDate: reportDate});
	} else {
		db.updateElementInDb('nodes', {uuid: nodeUuid}, {latestDate: reportDate});
	}
}

function sendNodeKeepAlive() {
	winston.debug('Send hartbeat');
	broker.publish('transmitMsg',{udpMsg: '&&{"node":"0000"}##'},{async: true});
	//udp.transmitMsg('&&{"node":"0000"}##');
}

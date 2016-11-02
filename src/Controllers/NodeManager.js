var winston = require('winston');
var nodesDb = require('./NodesDb');
var parser = require('./Utils/SensorDataParser');
var broker;

module.exports = {
	initialize: function(params, Broker)
	{
		broker = Broker;
		console.log('Starting : NodeManager');
    console.log('-------------------------------------------');

		broker.subscribe('handleUdpNodeMessage', function(event, payload) {
			// Handle the Node message
			//winston.debug('UDP Node Msg  = ' + JSON.stringify(payload.udpMsg));
			//winston.debug('UDP Node Date = ' + JSON.stringify(payload.date));
			// Check if the node already exist if not add to the database
			parser.addNodeIdFromNode(payload.udpMsg);
			addOrUpdateNode(payload.udpMsg);
			if (payload.udpMsg.status !== undefined && payload.udpMsg.status === "measure"){
				storeSensorData(payload.udpMsg);
			}
		});

		broker.subscribe('handleSerialNodeMessage', function(event, payload) {
			// Handle the Node message
		  //winston.debug('Serial Node Msg  = ' + JSON.stringify(payload.serialMsg));
			//winston.debug('Serial Node Date = ' + JSON.stringify(payload.date));
			// Check if the node already exist if not add to the database
			addOrUpdateNode(payload.serialMsg);
			if (payload.serialMsg.status !== undefined && payload.serialMsg.status === "measure"){
				storeSensorData(payload.serialMsg);
			}
		});

		setInterval(sendNodeKeepAlive, 10*1000);
	}
}

// Check if the node already exist if not add to the database
function addOrUpdateNode( message ) {
	//console.log("Handle addOrUpdateNode for " + nodeId);

	nodesDb.findNode(message.nodeId, function(result){
		//winston.silly("Nodes found = " + (result?"True":"False"));
		// Add or update the node Uuid and reportDate
		if(result === false)
		{
			nodesDb.addNode(message.nodeId, message.date);
		} else {
			nodesDb.updateNode(message.nodeId, message.date);
		}
	});
}

// Check if the node already exist if not add to the database
function storeSensorData( message ) {
	parser.validateMinimalData(message, function(valid){
		if (valid === true){
			var stored = "";
			stored += parser.parseTemperatureData(message);
			stored += parser.parseHumidityData(message);
			stored += parser.parseBatteryData(message);
			stored += parser.parseEnergyMeterData(message);
			winston.debug("Stored :: " + stored + " :: For " + message.nodeId);
		}
	});
}

function sendNodeKeepAlive() {
	winston.debug('Send hartbeat');
	broker.publish('transmitMsg',{udpMsg: '&&{"node":"0000"}##'},{async: true});
}

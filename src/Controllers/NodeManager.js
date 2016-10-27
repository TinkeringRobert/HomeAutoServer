var winston = require('winston')
var nodesDb = require('./NodesDb');
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
			addOrUpdateNode(payload.udpMsg.node, payload.date);
			winston.debug(payload.udbMsg);
			storeUdpSensorData(payload.udpMsg, payload.date);
		});

		broker.subscribe('handleSerialNodeMessage', function(event, payload) {
			// Handle the Node message
		  winston.debug('Serial Node Msg  = ' + JSON.stringify(payload.serialMsg));
			winston.debug('Serial Node Date = ' + JSON.stringify(payload.date));
			// Check if the node already exist if not add to the database
			addOrUpdateNode(payload.serialMsg.nodeId, payload.date);
			storeSerialSensorData(payload.serialMsg, payload.date);
		});

		setInterval(sendNodeKeepAlive, 10*1000);
	}
}

// Check if the node already exist if not add to the database
function addOrUpdateNode( nodeId, reportDate ) {
	//console.log("Handle addOrUpdateNode for " + nodeId);

	nodesDb.findNode(nodeId, function(result){
		//console.log("Nodes found = " + (result?"True":"False"));
		// Add or update the node Uuid and reportDate
		if(result === false)
		{
			nodesDb.addNode(nodeId, reportDate);
		} else {
			nodesDb.updateNode(nodeId, reportDate);
		}
	});
}

// Check if the node already exist if not add to the database
function storeSerialSensorData( nodeData, reportDate ) {
	console.log("Handle storeSerialSensorData for " + nodeData.nodeId);
	console.log("SensorData :");
	console.log(nodeData);

	if ( nodeData.nodeId !== undefined && nodeData.temperature !== undefined )
	{
		nodesDb.storeSensorValue('temperature_node',
		                         nodeData.nodeId,
													   nodeData.temperature,
													   reportDate);
	}
	if ( nodeData.nodeId !== undefined && nodeData.humidity !== undefined )
	{
		nodesDb.storeSensorValue('humidity_node',
														 nodeData.nodeId,
														 nodeData.humidity,
														 reportDate);
	}
	if ( nodeData.nodeId !== undefined && nodeData.battery !== undefined )
	{
		nodesDb.storeSensorValue('battery_node',
														 nodeData.nodeId,
														 nodeData.battery,
														 reportDate);
	}
}

// Check if the node already exist if not add to the database
function storeUdpSensorData( nodeData, reportDate ) {
	console.log("Handle storeUdpSensorData for " + nodeData.node);
	console.log("SensorData :");
	console.log(nodeData);

	if ( nodeData.node === undefined || nodeData.values === undefined){
		return;
	}
	if ( nodeData.values.temp !== undefined )
	{
		nodesDb.storeSensorValue('temperature_node',
		                         nodeData.node,
													   nodeData.values.temp,
													   reportDate);
	}
	if ( nodeData.values.hum !== undefined )
	{
		nodesDb.storeSensorValue('humidity_node',
														 nodeData.node,
														 nodeData.values.hum,
														 reportDate);
	}
	if ( nodeData.values.battery !== undefined )
	{
		nodesDb.storeSensorValue('battery_node',
														 nodeData.node,
														 nodeData.values.battery,
														 reportDate);
	}
}

//
function sendNodeKeepAlive() {
	winston.debug('Send hartbeat');
	broker.publish('transmitMsg',{udpMsg: '&&{"node":"0000"}##'},{async: true});
	//udp.transmitMsg('&&{"node":"0000"}##');
}

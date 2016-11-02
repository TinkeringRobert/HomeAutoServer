// Local requires
var debug = require('./Debug');
var node = require('./NodeManager');
var udp = require('./UdpController');
var serial = require('./SerialController');
var nodesDb = require('./NodesDb');
var db = require('./Database');
var db_fd = "";

module.exports = {
	initialize: function(params, broker)
	{
    console.log('Starting : ModuleInit');
    //db.initialise(params.database);

    //debug.initialize(broker);
		nodesDb.initialize(params, broker);
		udp.initialize(params, broker);
		serial.initialize(params, broker);
    node.initialize(params, broker);
	}
}

// Local requires
var debug = require('./Debug');
var node = require('./NodeManager');
var udp = require('./UdpController');
var db = require('./Database');
var db_fd = "";

module.exports = {
	initialize: function(params, broker)
	{
    console.log('Starting : ModuleInit');
    db_fd = db.initialise(params.database);

    debug.initialize(broker);
    udp.initialize(broker);
    node.initialize(broker);
	}
}

var winston = require('winston')
var broker;

module.exports = {
	initialize: function(Broker)
	{
		broker = Broker;
    console.log('Starting : Debug');
		broker.subscribe('debugMsg', function(event, payload) {
      winston.debug(payload.msg);
    });
	}
}

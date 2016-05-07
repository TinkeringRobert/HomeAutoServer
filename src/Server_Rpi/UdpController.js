var PORT = 33333;
var isWin = /^win/.test(process.platform);
var HOST = '';
if (isWin){var HOST = '0.0.0.0';}
else{var HOST = '255.255.255.255';}

var dgram = require('dgram');
var server = dgram.createSocket('udp4');
var winston = require('winston');
//{ error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
winston.level = 'debug';

module.exports = {
  exports.test: function(){
    winston.info('Is this called');
    server.bind(PORT, HOST);

    server.on('listening', function () {
        var address = server.address();
        winston.info('UDP Server listening on ' + address.address + ":" + address.port);


    server.on('message', function (message, remote) {
        var date = new Date();
        winston.debug(date.toLocaleString() + ' at recv:' + remote.address + ':' + remote.port +' - ' + message);
        winston.debug(message.length);

        // Parse the received udp message to JSON format
        var udp_res = parse_udp_message(message);

        winston.info('received: ' + JSON.stringify(udp_res));
    });
  });
  }
}

function parse_udp_message(message)
{
    // Find the start and stop header for the UDP message
    // && = start
    // ## = end
    // format will be like:
    // &&{<JSON message>}##
    var start_index = message.toString().indexOf('&&');
    var end_index = message.toString().indexOf('##');

    winston.silly('start at ' + start_index + ' end at ' + end_index);
    //var str_msg = message.toString();
    if(start_index == -1) {
        winston.error('UDP start not found');
        return null;
    }
    if(end_index == -1) {
        winston.error('UDP end not found');
        return null;
    }

    if(start_index > -1 && end_index > -1)
    {
        winston.silly('Message substring');

        var str_msg = message.toString().substring(start_index+2, end_index);

        winston.silly(str_msg);

        var received = JSON.parse(str_msg);

        winston.silly('Parsed to JSON');
        winston.silly(received);
        return received;
    }
    return null;
};

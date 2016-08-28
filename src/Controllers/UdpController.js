var PORT = 33333;
var SEND_PORT = 22222;
var isWin = /^win/.test(process.platform);
var HOST = '';
if (isWin){var RECV_HOST = '0.0.0.0'; var SEND_HOST = '255.255.255.255';}
else{var HOST = '255.255.255.255';}

var dgram = require('dgram');
var server = dgram.createSocket('udp4');
var winston = require('winston');
var broker;
//{ error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
//var node = require('./NodeManager');
var count = 0;

module.exports = {
  initialize: function(Broker)
  {
    broker = Broker;
    console.log('Starting : UdpController');

    broker.subscribe('transmitMsg', function(event, payload) {
      transmitMsg(payload.udpMsg);
    });

    server.bind(PORT, HOST);
  }
}

server.on('listening', function () {
    var address = server.address();
    winston.info('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {
    var date = new Date();
    date.setMilliseconds(0);
    //winston.debug(date.toLocaleString() + ' at recv:' + remote.address + ':' + remote.port +' - ' + message);
    winston.debug(remote);

    // Parse the received udp message to JSON format
    var udp_res = parse_udp_message(message);

    //winston.info('test transmit function');

    if (udp_res !== null)
    {
      winston.info('received: ' + JSON.stringify(udp_res));
      winston.debug(udp_res.values.temp + ' ' + udp_res.values.hum);
      // var message = new Buffer('&&{"node":"0000","rgb":[' + udp_res.values.temp + ',' +udp_res.values.hum+ ',0]}##');
      // count++;
      // setTimeout(function() {
      //   var client = dgram.createSocket('udp4');
      //   client.bind();
      //   client.on("listening", function () {
      //     client.setBroadcast(true);
      //     client.send(message, 0, message.length, SEND_PORT, SEND_HOST, function(err, bytes) {
      //         if (err) {
      //           client.close();
      //           throw err;
      //         }
      //         //console.log('UDP message sent to ' + SEND_HOST +':'+ SEND_PORT);
      //         client.close();
      //     });
      //   });
      // }, 500);
      broker.publish('handleUdpNodeMessage',
                     {udpMsg: udp_res, date: date},
                     {async: true});
      // node.handleUdpNodeMessage(udp_res, date);
    }
});

function transmitMsg(msg){
  winston.debug('transmitMsg');
  var message = new Buffer(msg);
  var client = dgram.createSocket('udp4');
  client.bind();
  client.on("listening", function () {
    client.setBroadcast(true);

    client.send(message, 0, message.length, SEND_PORT, '10.0.0.6', function(err, bytes) {
        if (err) {
          client.close();
          throw err;
        }
        console.log('UDP message sent to ' + SEND_HOST +':'+ SEND_PORT);
        client.close();
    });
  });
};

function parse_udp_message(message)
{
    // Find the start and stop header for the UDP message
    // && = start
    // ## = end
    // format will be like:
    // &&{<JSON message>}##
    var start_index = message.toString().indexOf('&&');
    var end_index = message.toString().indexOf('##');

    //winston.silly('start at ' + start_index + ' end at ' + end_index);
    //var str_msg = message.toString();
    if(start_index == -1) {
        //winston.error('UDP start not found');
        return null;
    }
    if(end_index == -1) {
        //winston.error('UDP end not found');
        return null;
    }

    if(start_index > -1 && end_index > -1)
    {
        //winston.silly('Message substring');

        var str_msg = message.toString().substring(start_index+2, end_index);

        //winston.silly(str_msg);

        var received = JSON.parse(str_msg);
        if(received.node === "0000"){
          return null;
        }
        //winston.silly('Parsed to JSON');
        //winston.silly(received);
        return received;
    }
    return null;
};

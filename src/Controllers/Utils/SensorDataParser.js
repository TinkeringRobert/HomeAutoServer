var winston = require('winston')
var nodesDb = require('../NodesDb');

module.exports = {
  addNodeIdFromNode: function(message){
    if (message.nodeId === undefined && message.node !== undefined){
      message.nodeId = message.node;

      if(message.values !== undefined && message.values.temp !== undefined){
        message.temperature = message.values.temp;
      }
      if(message.values !== undefined && message.values.hum !== undefined){
        message.humidity = message.values.hum;
      }
      if(message.status === undefined){
        message.status = "measure";
      }
    }
  },

  validateMinimalData: function(message, callback){
    if (message.nodeId !== undefined && message.date !== undefined){
      return callback(true);
    }
    return callback(false);
  },

  parseTemperatureData: function(message){
    if ( message.temperature !== undefined )
  	{
  		nodesDb.storeSensorValue('temperature_node', message.nodeId, message.temperature, message.date);
      return "temp ";
  	}
    return "";
  },

  parseHumidityData: function(message){
    if ( message.humidity !== undefined )
  	{
  		nodesDb.storeSensorValue('humidity_node', message.nodeId, message.humidity, message.date);
      return "hum ";
  	}
    return "";
  },

  parseBatteryData: function(message){
    if ( message.battery !== undefined )
  	{
  		nodesDb.storeSensorValue('battery_node', message.nodeId, message.battery,message.date);
      return "batt ";
    }
    return "";
  },

  parseEnergyMeterData: function(message){
    if ( message.power1 !== undefined &&
         message.power2 !== undefined &&
         message.power3 !== undefined &&
         message.power4 !== undefined )
    {
      winston.debug("_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+");
      winston.debug("Store Energy Meter readings for: " + message.nodeId);
      winston.debug("P1 = " + message.power1 + " P4" + message.power4);
      var energy_meter = message.power1;
      var house_hold = message.power1 - message.power4;
      var photo_voltaic = message.power4;
      winston.debug("");
      winston.debug("energy_meter  = " + energy_meter);
      winston.debug("house_hold    = " + house_hold);
      winston.debug("photo_voltaic = " + photo_voltaic);
      nodesDb.storeEnergyMeterValues('energy_meter',
                                     message.nodeId,
                                     energy_meter,
                                     house_hold,
                                     photo_voltaic,
                                     message.date);
      winston.debug("_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+");
      return "em ";
    }
    return "";
  }
}

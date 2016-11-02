const path = require('path');
var winston = require('winston');
var sqlite3 = require('sqlite3').verbose();

module.exports = {
  initialize: function(dbFile){
    winston.info("Step 1 : Initialise database   :: " + dbFile);
    winston.info("Step 1 : At location           :: " + __dirname);

    const dbPath = path.resolve(__dirname, dbFile);
    winston.info("Step 2 : Resolve database path :: " + dbPath);
    var db = new sqlite3.Database(dbPath);
    winston.info("Step 3 : Open database at path :: " + db);

    db.serialize(function(err) {
      winston.info("Step 4 : Serialize database    :: " + (err!==undefined ? err : "Success"));
      if(err !== undefined){
        console.log("err :" + err);
      }
      winston.info("Step 5 : Seed the database     :: " + (err!==undefined ? err : "Success"));
      addNetworkNode(db);
      winston.info("Step 5 : Seed the database     :: " + (err!==undefined ? err : "Success"));
      addBatteryNode(db);
      winston.info("Step 5 : Seed the database     :: " + (err!==undefined ? err : "Success"));
      addTemperatureNode(db);
      winston.info("Step 5 : Seed the database     :: " + (err!==undefined ? err : "Success"));
      addHumidityNode(db);
      winston.info("Step 5 : Seed the database     :: " + (err!==undefined ? err : "Success"));
      addEnergyMeterDb(db);
      winston.info("Step 5 : Seed the database     :: " + (err!==undefined ? err : "Success"));
    });
    winston.info("Step 6 : Close database file   :: Success");
    db.close();
    winston.info("Step 7 : Database created      :: Success");
  }
}

function addNetworkNode(db){
  winston.info("Add network_node database table");

  db.run("CREATE TABLE IF NOT EXISTS network_node " +
        "(id       INTEGER            PRIMARY KEY   AUTOINCREMENT, " +
        "node_id   CHAR(4)   NOT NULL, " +
        "last_seen DATETIME)");
}

function addBatteryNode(db){
  winston.info("Add battery_node database table");

  db.run("CREATE TABLE IF NOT EXISTS battery_node " +
        "(id       INTEGER            PRIMARY KEY   AUTOINCREMENT, " +
        "node_id   CHAR(4)   NOT NULL, " +
        "timestamp DATETIME, " +
        "value     REAL)");
}

function addTemperatureNode(db){
  winston.info("Add temperature_node database table");
  db.run("CREATE TABLE IF NOT EXISTS temperature_node " +
        "(id       INTEGER            PRIMARY KEY   AUTOINCREMENT, " +
        "node_id   CHAR(4)   NOT NULL, " +
        "timestamp DATETIME, " +
        "value     REAL)");
}

function addHumidityNode(db){
  winston.info("Add humidity_node database table");
  db.run("CREATE TABLE IF NOT EXISTS humidity_node " +
        "(id       INTEGER            PRIMARY KEY   AUTOINCREMENT, " +
        "node_id   CHAR(4)   NOT NULL, " +
        "timestamp DATETIME, " +
        "value     REAL)");
}

function addEnergyMeterDb(db){
  winston.info("Add energy_meter database table");
  db.run("CREATE TABLE IF NOT EXISTS energy_meter " +
        "(id       INTEGER            PRIMARY KEY   AUTOINCREMENT, " +
        "node_id   CHAR(4)   NOT NULL, " +
        "timestamp DATETIME, " +
        "kwh_meter REAL," +
        "hh_meter  REAL," +
        "pv_meter  REAL)");
}

const path = require('path');
var sqlite3 = require('sqlite3').verbose();
var winston = require('winston');
var db = null;
var db_initalized = false;

module.exports = {
  initialize: function(params, Broker)
  {
    console.log("Nodes Database initialise");
    const dbPath = path.resolve(__dirname, params.database.nodes)

    console.log("File :" + dbPath);
    db = new sqlite3.Database(dbPath);
    db_initalized = true;
    console.log("Nodes Database initialized");
    console.log('-------------------------------------------');
  },

  getNodesFromDb: function(callback)
  {
    console.log( "Get nodes from database");
    if(db === null || db_initalized === false){
      winston.error("Database call not handled db:" + db + " init:" + (db_initalized===true ? "true" : "false"));
      return callback(undefined);
    }
    db.serialize(function() {
      db.all("SELECT id, node_id, last_seen FROM network_node", function(err, rows) {
        if( err !== null)
        {
          console.log("ERR: " + err);
          callback(undefined);
          //db.close();
          return;
        }
        //console.log(rows);
        if (rows !== undefined && rows.length > 0)
        {
          //console.log(row.id + ": " + row.node_id + ": ", row.last_seen);
          callback(rows);
        }
        else {
          callback(undefined);
        }
      });
    });
    //db.close();
  },

  findNode: function(nodeId, callback) {
    console.log( "Find node with id :" + nodeId);
    if(db === null || db_initalized === false){
      winston.error("Database call not handled db:" + db + " init:" + (db_initalized===true ? "true" : "false"));
      return callback(undefined);
    }
    db.serialize(function() {
      db.all("SELECT id, node_id, last_seen FROM network_node WHERE node_id = ?", nodeId, function(err, rows) {
        if( err !== null )
        {
          console.log("ERR: " + err);
          callback(undefined);
          //db.close();
          return;
        }
        //console.log(rows);
        if (rows !== undefined && rows.length > 0)
        {
          //console.log(row.id + ": " + row.node_id + ": ", row.last_seen);
          callback(true);
        }
        else {
          callback(false);
        }
      });
    });
    //db.close();
  },

  addNode: function(nodeId, reportDate){
    console.log( "Add node with id :" + nodeId + " and date :" + reportDate);
    if(db === null || db_initalized === false){
      winston.error("Database call not handled db:" + db + " init:" + (db_initalized===true ? "true" : "false"));
      return callback(undefined);
    }

    var stmt = db.prepare("INSERT INTO network_node (node_id, last_seen) VALUES (?,?)");
    stmt.run(nodeId, reportDate, function(err) {
      if (err)
      {
        console.log(err + " : ");
      }
    });
    stmt.finalize();
  },

  updateNode: function(nodeId, reportDate){
    console.log( "Update node with id :" + nodeId + " to date :" + reportDate);
    if(db === null || db_initalized === false){
      winston.error("Database call not handled db:" + db + " init:" + (db_initalized===true ? "true" : "false"));
      return callback(undefined);
    }

    db.run("UPDATE network_node SET last_seen = ? WHERE node_id = ?", reportDate, nodeId, function(err) {
      if (err)
      {
        console.log(err + " : ");
      }
    });
  },

  getSensorValue: function(tableName, nodeId, limit, callback){
    console.log( "Get stored for node with id :" + nodeId + " from " + tableName);
    if(db === null || db_initalized === false){
      winston.error("Database call not handled db:" + db + " init:" + (db_initalized===true ? "true" : "false"));
      return callback(undefined);
    }
    var query = "SELECT node_id, value, timestamp FROM " + tableName + " WHERE node_id = ? ORDER BY timestamp DESC LIMIT ?";
    db.serialize(function() {
      db.all(query, nodeId, limit, function(err, rows) {
        if( err !== null)
        {
          console.log("ERR: " + err);
          callback(undefined);
          //db.close();
          return;
        }
        //console.log(rows);
        if (rows !== undefined && rows.length > 0)
        {
          //console.log(row.id + ": " + row.node_id + ": ", row.last_seen);
          callback(rows);
        }
        else {
          callback(undefined);
        }
      });
    });;
  },

  storeSensorValue: function(tableName, nodeId, value, reportDate){
    console.log( "Store " + value + " for node with id :" + nodeId + " and date :" + reportDate + " into " + tableName);
    if(db === null || db_initalized === false){
      winston.error("Database call not handled db:" + db + " init:" + (db_initalized===true ? "true" : "false"));
      return callback(undefined);
    }

    var query = "INSERT INTO " + tableName + " (node_id, value, timestamp) VALUES (?,?,?)";
    var stmt = db.prepare(query);
    stmt.run(nodeId, value, reportDate, function(err) {
      if (err)
      {
        console.log(err + " : ");
      }
    });
    stmt.finalize();
  }
}

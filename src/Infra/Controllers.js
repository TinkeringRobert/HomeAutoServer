var winston = require('winston');
var broker;

module.exports = {
	update: function(controller, db)
	{
    winston.silly("IC : Update controller " + controller);
    findController(controller, db, function(rows){
      var index = rows[0].id;
      if (index === null){
        return;
      }
      if (index === -1){
        addController(controller, db);
      }
      winston.silly("IC : Update index " + index);
      updateController(controller, db);

    });
    winston.silly("Step 10");
  }
}

function findController(controller, db, callback){
  db.serialize(function() {
    db.all("SELECT id FROM controllers WHERE controller_name = ?", controller, function(err, rows) {
      if( err !== null )
      {
        console.log("findController : " + err);
        return callback(null);
      }
      if (rows !== undefined && rows.length > 0)
      {
        var index = rows;
        callback(index);
      }
      else {
        callback([{id:-1}]);
      }
    });
  });
}

function addController(controller, db){
  var date = new Date();
  date.setMilliseconds(0);

  var stmt = db.prepare("INSERT INTO controllers (controller_name, first_seen, last_seen) VALUES (?,?,?)");
  stmt.run(controller, date, date, function(err) {
    if (err)
    {
      console.log("addController : " + err);
    }
  });
  stmt.finalize();
}

function updateController(controller, db){
  var date = new Date();
  date.setMilliseconds(0);

  db.run("UPDATE controllers SET last_seen = ? WHERE controller_name = ?", date, controller, function(err) {
    if (err)
    {
      console.log("updateController : " + err);
    }
  });
}

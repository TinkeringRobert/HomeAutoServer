var pjson = require('./package.json');

// External requires
var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jwt-simple');
var _ = require('lodash');
var app = express();
var winston = require('winston');
var broker = require('mercury-broker');

var nodesDb = require('./Controllers/NodesDb');
var moment = require('moment');
//{ error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
winston.level = 'silly';

// Application settings
var isWin = /^win/.test(process.platform);
if (isWin){
  var params = require('./Config/SettingsWindows');
}
else{
  var params = require('./Config/SettingsLinux');
}
// Local requires
var dbInit = require('./Config/DbInit');
var modules = require('./Controllers/ModuleInit');

var run_initialize = false;
//*******************
// 1. Parse forms & JSON in body
//*******************
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//****************
// 2. Stel middleware in voor serveren van statische bestanden (HTML, CSS, images)
//****************
app.use(express.static(__dirname + '/public'));

app.get('/api', function (req, res) {
    res.send('Gebruik: stuur een POST-request met user-gegevens(bv "username" en "email") naar http://localhost:3000/user')
});

app.get('/nodes', function (req, res) {
    var page = '';
    pjson.version;
    page += '<title>Node ' + pjson.version + '</title>';
    page += '<head><meta http-equiv="refresh" content="5" ><style>table{font-family: arial, sans-serif;border-collapse: collapse;width: 100%;} td,th{border: 1px solid #dddddd;text-align: left;padding: 8px;}tr:nth-child(even) {background-color: #dddddd;}</style></head>';
    page += '<h1>Status Page</h1>';

    nodesDb.getNodesFromDb(function(result){
      page += '<pre><code><br>';
      page += JSON.stringify(result, null, 4);
      page += '</code></pre>';
      nodesDb.getSensorValue('temperature_node', '0003', 1, function(sen_result){
        page += '<h2>Sensor Data</h2>';
        page += '<pre><code><br>';
        page += JSON.stringify(sen_result, null, 4);
        page += '</code></pre>';
        nodesDb.getSensorValue('temperature_node', '0002', 1, function(sen_results){
          page += '<h2>Sensor Data</h2>';
          page += '<pre><code><br>';
          page += JSON.stringify(sen_results, null, 4);
          page += '</code></pre>';
          res.send(page);
        });
      });
      return;

      page += '<table style="width:100%"><tr><th>Node ID</th><th>db id</th><th>LatestDate</th></tr>';
      if(result !== undefined && result.length > 0){
        result.forEach(function(node){
          winston.error((moment() - moment(node.last_seen))/1000);
          // Set color if time is longer then 10 minutes
          if((moment() - moment(node.last_seen))/1000 >= 10*60)
          {
            page += '<tr><td><font color="green">' + node.node_id + '</td><td><font color="red">' + node.id + '</td><td><font color="red">' + moment(node.last_seen).format("YYYY-MM-DD") + ' - ' + moment(node.last_seen).format("HH:mm") + '</td>';

          }
          else {
            page += '<tr><td><font color="green">' + node.node_id + '</td><td><font color="black">' + node.id + '</td><td>' + moment(node.last_seen).format("YYYY-MM-DD") + ' - ' + moment(node.last_seen).format("HH:mm") + '</td>';
          }
        });
      }
      page += '</table>';
      winston.debug(result);
      res.send(page);
    });
});
//****************
// 3. De route voor vewerken van AngularJS - POST-request
//****************
var rgb = {};
app.post('/user', function (req, res) {
    // verwerk binnenkomende request. We gaan er van uit
    // dat de parameter 'username' en 'email' aanwezig zijn.
    // TODO: error checking!
    winston.debug(JSON.stringify(req.body));
    var msg = '&&{"node":"0000","rgb":[' + req.body.red + ',' + req.body.green + ',' + req.body.blue + ']}##';
    winston.debug('message = ' + msg);

    broker.publish('transmitMsg',{udpMsg: msg},{async:true});

    rgb.red = req.body.red;
    rgb.green = req.body.green;
    rgb.blue = req.body.blue;
    winston.debug(rgb);
    res.json(rgb);
});

function initialize(){
  console.log('Boot Home automation server');
  console.log(JSON.stringify(params,null,4));

  if(run_initialize) {
    dbInit.initialize(params.database.nodes);
    return;
  }
  else {
    winston.log("Go here????");
    modules.initialize(params, broker);

    // Activate website
    app.listen(3000, function () {
        console.log('Server gestart op poort 3000...');
    });
  }
  winston.info("System started");
};

initialize();

//**************
// 4. TODO: Echte authenticatie via JWT, zie bijvoorbeeld https://github.com/auth0/angularjs-jwt-authentication-tutorial
//*************

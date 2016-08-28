
// External requires
var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jwt-simple');
var _ = require('lodash');
var app = express();
var winston = require('winston');
var broker = require('mercury-broker');
var db = require('./Controllers/Database');
var moment = require('moment');
//{ error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
winston.level = 'silly';

// Application settings
var params = require('./Config/Settings');
// Local requires
var modules = require('./Controllers/ModuleInit');
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
    page += '<head><meta http-equiv="refresh" content="5" ><style>table{font-family: arial, sans-serif;border-collapse: collapse;width: 100%;} td,th{border: 1px solid #dddddd;text-align: left;padding: 8px;}tr:nth-child(even) {background-color: #dddddd;}</style></head>';
    page += '<h1>Status Page</h1>';

    var result = db.getElementsFromDb('nodes', '');
    page += '<table style="width:100%"><tr><th>Node ID</th><th>db id</th><th>LatestDate</th></tr>';

    result.forEach(function(node){
      page += '<tr><td>' + node.uuid + '</td><td>' + node.id + '</td><td>' + moment(node.latestDate).format("YYYY-MM-DD") + ' - ' + moment(node.latestDate).format("HH:mm") + '</td>';
    });
    page += '</table>';
    winston.debug(result);
    res.send(page)
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
  console.log(params);

  modules.initialize(params, broker);

  // Activate website
  app.listen(3000, function () {
      console.log('Server gestart op poort 3000...');
  });
};

initialize();

//**************
// 4. TODO: Echte authenticatie via JWT, zie bijvoorbeeld https://github.com/auth0/angularjs-jwt-authentication-tutorial
//*************

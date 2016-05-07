
// External requires
var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jwt-simple');
var _ = require('lodash');
var app = express();
var winston = require('winston');
//{ error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
winston.level = 'silly';

// Application settings
var params = require('./Config/Settings');
// Local requires
var udp = require('./Controllers/UdpController');
var db = require('./Controllers/Database');
var db_fd = "";
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
//app.use(express.static(__dirname + '/public'));

app.get('/api', function (req, res) {
    res.send('Gebruik: stuur een POST-request met user-gegevens(bv "username" en "email") naar http://localhost:3000/user')
});

//****************
// 3. De route voor vewerken van AngularJS - POST-request
//****************
var user = {};
app.post('/user', function (req, res) {
    // verwerk binnenkomende request. We gaan er van uit
    // dat de parameter 'username' en 'email' aanwezig zijn.
    // TODO: error checking!
    winston.debug('Request for User received');
    user.username = req.body.username;
    user.email = req.body.email;
    // In een echte app: HIER valideren en naar de
    // database voor live data. Voor nu:
    // Echo het user-object naar de client
    // Eventueel;
    //user.token = "1233434536456.778789900";
    res.json(user);

});

function initialize(){
  console.log('Boot Home automation server');
  console.log(params);
  db_fd = db.initialise(params.database);

  app.listen(3000, function () {
      console.log('Server gestart op poort 3000...');
  });

  udp.initialize();
  db.findInDb('nodes', {uuid:'0001'});
};

initialize();

//**************
// 4. TODO: Echte authenticatie via JWT, zie bijvoorbeeld https://github.com/auth0/angularjs-jwt-authentication-tutorial
//*************

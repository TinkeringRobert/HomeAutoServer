var pjson = require('./package.json');

// External requires
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');
var app = express();
var winston = require('winston');
var moment = require('moment');

//{ error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
winston.level = 'silly';

// Application settings
var isWin = /^win/.test(process.platform);
if (isWin){
  var params = require('../config/Windows');
}
else{
  var params = require('../config/Linux');
}

//*******************
// 1. Parse forms & JSON in body
//*******************
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/status', function (req, res) {
  res.json({status: 'online', application: 'homecontroller'});
});

//****************
// 2. Stel middleware in voor serveren van statische bestanden (HTML, CSS, images)
//****************
app.use(express.static(__dirname + '/public'));

// routes ======================================================================
// require('./Api/routes.js')(app);
// require('./Api/meter_data.js')(app, nodesDb);
require('./Api/status/infra.js')(app);

function initialize(){
  console.log('Boot Home portal server');
  console.log(JSON.stringify(params,null,4));

  app.listen(params.application_port.portal, function () {
      console.log('Server gestart op poort '+ params.application_port.portal);
  });

  winston.info("System started");
};

initialize();

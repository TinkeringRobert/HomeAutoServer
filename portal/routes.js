var http = require('http');
var _ = require('lodash');
var async = require('async');

module.exports = function(app) {
	// create todo and send back all todos after creation
	app.post('/api/todos', function(req, res) {
    getSystemComponents(function(results){
      console.log('+++++++++++++++++++++++++');
      console.log(results);
      console.log('+++++++++++++++++++++++++');
      return res.send(results);

      //console.log(results);
      var systemComponents = {};
      //var systemComponents = [];
      systemComponents.nodes = [];
      systemComponents.links = [];
      if (results !== undefined){
        //console.log('get first node');
        if (results.name !== undefined)
        {
          //console.log(results.name);
          systemComponents.nodes.push({"nr": results._id, "id": results.name, "group": "1"});
        }
        //console.log(results.relationships);
        _.forEach(results.relationships, function (relation) {
          //console.log(relation);
          if (relation !== undefined && relation.name !== undefined){
            systemComponents.nodes.push({"id": relation.name, "group": "1"});
          }
          if (relation !== undefined && relation.direction === 'to'){
            systemComponents.links.push({"source": results._id, "target": relation._id, "value": 1});
          }
          else if (relation !== undefined && relation.direction === 'from'){
            systemComponents.links.push({"source": relation._id, "target": results._id, "value": 1});
          }
        });
      }
      //console.log(systemComponents);
      //return res.send(systemComponents);
    });
  });

  // application -------------------------------------------------------------
  app.get('*', function(req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
  });
};

function getSystemComponents(callback) {
  async.auto({
    getModules: function(callback) {
        console.log('Get Modules');

        var body = '';

        http.get({
            host: '10.0.0.101',
            port: '5000',
            path: '/allModules'
        }, function(response) {
            // Continuously update stream with data
            response.on('data', function(d) {
              body += d;
            });
            response.on('end', function() {
              // Data reception is done, do whatever with it!
              var parsed = JSON.parse(body);
              // async code to get some data
              callback(null, parsed);
            });
        });
    },
    getRelations: function(callback) {
      console.log('Get Relations');

      var body = '';

      http.get({
          host: '10.0.0.101',
          port: '5000',
          path: '/allRelations'
      }, function(response) {
          // Continuously update stream with data
          response.on('data', function(d) {
            body += d;
          });
          response.on('end', function() {
            // Data reception is done, do whatever with it!
            var parsed = JSON.parse(body);
            // async code to get some data
            callback(null, parsed);
          });
      });
    },
    createD3Array: ['getModules', 'getRelations', function(results, callback) {
        console.log('Create d3 array');
        var list = {};
        list.modules = [];
        list.relations = [];
        _.forEach(results.getModules, function (module) {
          module.group = 1;
          list.modules.push(module);
        });

        _.forEach(results.getRelations, function (relation) {
          var link = {};
          console.log('from_id');
          var from_id = _.findIndex(list.modules, {'id': relation.from_id});
          console.log(from_id);
          console.log('to_id');
          var to_id = _.findIndex(list.modules, {'id': relation.to_id});
          console.log(to_id);

          list.relations.push({"source":from_id,"target":to_id,"value":1});
        });
        console.log('------------------');
        console.log(list);
        console.log('------------------');
// once there is some data and the directory exists,
        // write the data to a file in the directory
        callback(null, list);
    }]
  }, function(err, results) {
      console.log('err = ', err);
      //console.log('results = ', results);
      callback(results.createD3Array);
  });
};

var winston = require('winston');
var pjson = require('../package.json');
//console.log(pjson.version);
module.exports = {
	initialize: function(params, app, infraRecv)
	{
    app.delete('/:id', function (req, res) {
      winston.debug('Delete module :: ' + req.params.id);
      infraRecv.deleteModule(req.params.id, function(err, result){
        if (err){
          return res.status(500).send('deleteModule :: ' + err);
        }
        return res.status(200).send({id:req.params.id});
      });
    })

    app.get('/allModules', function (req, res) {
      winston.debug('Get basic module information');
      infraRecv.getAllModules(function(err, result){
        if (err){
          return res.status(500).send('getAllModules :: ' + err);

        }
        return res.status(200).send(result);
      });
    })

    app.get('/allRelations', function (req, res) {
      winston.debug('Get basic relation information');
      infraRecv.getAllRelations(function(err, result){
        if (err){
          return res.status(500).send('getAllRelations :: ' + err);

        }
        return res.status(200).send(result);
      });
    })

    app.get('/status', function (req, res) {
      res.json({status: 'online', application: pjson.name, version: pjson.version, description: pjson.description});
    })
  }
}
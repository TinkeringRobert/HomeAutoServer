// Database test
var Mistral = require('mistraldb');

var winston = require('winston')

var haDb;

module.exports = {
	initialise: function(db_params)
	{
		console.log('Initialize database : ');
		haDB = new Mistral.Database('homeAutomation');
		var nodes = new Mistral.Collection(haDB, 'nodes');
		var node_logging = new Mistral.Collection(haDB, 'operations');


		for(var i = 0; i < 10; i++){
		//var nodesId = nodes.insert({uuid: '0001', name: 'Workroom node', assets: [{dth11: 'temp'},{dth11: 'hum'},{light: 'neopixel'}]});
		}
		nodes.find({uuid:'0001'}).forEach(function(node){
		console.log('DB dump item = ' + JSON.stringify(node.uuid));
		});
		/*for(var i = 0; i < 25; i++){
			winston.debug('add ' + i);
			var postId = posts.insert({
			    content: 'hello all' + i,
			    type: i
			});
			winston.debug('added: ' + postId);
		}*/

		//winston.debug(JSON.stringify(posts.sortBy('id')));
		return haDB;
	},

	findInDb: function(collection, query)
	{
		var db_col = new Mistral.Collection(haDB, collection);

		winston.silly('find ' + JSON.stringify( query ) + ' in \'' + collection + '\'');
		
		var resultCount = 0;

		db_col.find(query).forEach(function(item){
			resultCount++;

			console.log('items item = ' + JSON.stringify(item));
		});
		return resultCount;
	},

	insertIntoDb: function(collection, object)
	{
		var db_col = new Mistral.Collection(haDB, collection);
		var objectId = db_col.insert(object);
		winston.debug('added: ' + objectId);
	}
}

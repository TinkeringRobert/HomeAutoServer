// Database test
var Mistral = require('mistraldb');
var winston = require('winston');
var haDb;

module.exports = {
	initialise: function(db_params)	{
		console.log('Starting : Database');
		haDB = new Mistral.Database('homeAutomation');
		var nodes = new Mistral.Collection(haDB, 'nodes');
		var node_logging = new Mistral.Collection(haDB, 'operations');

		//this.getElementsFromDb('nodes', {uuid: "0003"}).forEach(function(item){
		  //console.log('DB dump item = ' + JSON.stringify(item.uuid));
		 	//nodes.remove({id: item.id});
		//});

		return haDB;
	},

	findAmountOfElementsInDb: function(collection, query)	{
		var db_col = new Mistral.Collection(haDB, collection);

		winston.silly('DB: find amount ' + JSON.stringify( query ) + ' in \'' + collection + '\'');

		var resultCount = 0;

		db_col.find(query).forEach(function(item){
			resultCount++;

			console.log('items item = ' + JSON.stringify(item));
		});
		return resultCount;
	},

	getElementsFromDb: function(collection, query) {
		var db_col = new Mistral.Collection(haDB, collection);

		winston.silly('DB: get Elements ' + JSON.stringify( query ) + ' in \'' + collection + '\'');

		var resultElements = [];

		db_col.find(query).forEach(function(item){
			resultElements.push(item);

			console.log('items item = ' + JSON.stringify(item));
		});
		return resultElements;
	},

	insertIntoDb: function(collection, object) {
		var db_col = new Mistral.Collection(haDB, collection);
		var objectId = db_col.insert(object);
		winston.debug('added: ' + objectId);
	},

	updateElementInDb: function(collection, query, content) {
		var db_col = new Mistral.Collection(haDB, collection);

		var element = this.getElementsFromDb(collection, query);

		winston.debug(JSON.stringify(element[0].id));
		winston.debug(content);

		if ( element !== null ){
			winston.debug('Update');
			winston.debug(JSON.stringify(element));
			element.content;
			winston.debug(db_col.update({id: element[0].id}, content));
		}
	}
}

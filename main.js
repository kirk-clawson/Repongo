/**
 * Created by Kirk.Clawson on 2/21/2016.
 */
var mongo = require('mongojs');
var Schema = require('./lib/schema.js');
var Repository = require('./lib/repository.js');

var db = function(connectionString){
    var mongodb = mongo(connectionString);

    function getRepo(schema) {
        return new Repository(schema, mongodb);
    }

    return {
        Schema: Schema,
        repoFor: getRepo
    }
};

module.exports = db;

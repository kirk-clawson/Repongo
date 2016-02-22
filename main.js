/**
 * Created by Kirk.Clawson on 2/21/2016.
 */
var mongo = require('mongojs');
var Schema = require('./lib/schema.js');
var Repository = require('./lib/repository.js');
var Builder = require('./lib/queryBuilder.js');

var repongo = function(connectionString){
    var mongodb = mongo(connectionString);

    function getRepo(schema) {
        return new Repository(schema, mongodb);
    }

    return {
        Schema: Schema,
        QueryBuilder: Builder,
        repoFor: getRepo
    }
};

module.exports = repongo;

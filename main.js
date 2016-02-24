/**
 * Created by Kirk.Clawson on 2/21/2016.
 */
(function () {
    "use strict";

    var mongo = require('mongojs');
    var Schema = require('./lib/schema.js');
    var Repository = require('./lib/repository.js');
    var QueryBuilder = require('./lib/queryBuilder.js');

    module.exports = function (connectionString) {
        var mongodb = mongo(connectionString);

        function createRepo(schema) {
            return new Repository(schema, mongodb);
        }

        function createSchema(options) {
            return new Schema(options);
        }

        return {
            QueryBuilder: QueryBuilder,
            createRepo: createRepo,
            createSchema: createSchema
        }
    };
}());

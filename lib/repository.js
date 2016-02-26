/**
 * Created by Kirk.Clawson on 2/21/2016.
 */
(function(){
    "use strict";

    var Schema = require('./schema.js');
    var QueryBuilder = require('./queryBuilder.js');
    var _ = require('lodash');
    var Promise = require('bluebird');

    var Repository = function(schema, db) {
        this._schema = schema;
        if (_.isString(schema)) {
            this._schema = new Schema(schema); // default schema has no field restrictions or validations
        }

        this._dbCollection = db.collection(this._schema.catalogName);

        var contextOpts = {
            context: this._dbCollection
        };
        this._promiseApi = {
            find: Promise.promisify(this._dbCollection.find, contextOpts),
            findOne: Promise.promisify(this._dbCollection.findOne, contextOpts),
            save: Promise.promisify(this._dbCollection.save, contextOpts),
            remove: Promise.promisify(this._dbCollection.remove, contextOpts)
        }
    };

    Repository.prototype.getAll = function() {
        var repo = this;
        return repo._promiseApi.find({})
            .then(function(doc){
                return repo._schema.m2j(doc);
            });
    };

    Repository.prototype.get = function(id) {
        var repo = this;
        return repo._promiseApi.findOne({ _id: this._schema.getIdFromString(id) })
            .then(function(doc){
                return repo._schema.m2j(doc);
            });
    };

    Repository.prototype.query = function(query) {
        var repo = this;
        return repo._promiseApi.find(query.encode())
            .then(function(doc){
                return repo._schema.m2j(doc);
            });
    };

    Repository.prototype.save = function(item) {
        // assume that item is singular
        var result = this._schema.j2m(item);
        var repo = this;
        if (result._validationResult && result._validationResult._isValid) {
            delete result._validationResult; // don't want to persist this field in the DB
            return repo._promiseApi.save(result)
                .then(function(doc){
                    return repo._schema.m2j(doc);
                });
        } else {
            return Promise.reject({ message: 'Item failed schema validation check.', data: result});
        }
    };

    Repository.prototype.delete = function(id) {

    };

    Repository.prototype.createQueryBuilder =function(){
        return new QueryBuilder(this._schema);
    };

    // for testing purposes only
    Repository.prototype._clear = function() {
        this._dbCollection.remove({});
    };

    module.exports = Repository;
}());

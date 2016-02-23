/**
 * Created by Kirk.Clawson on 2/21/2016.
 */
(function(){
    "use strict";

    var Schema = require('./schema.js');
    var _ = require('lodash');

    var Repository = function(schema, db) {
        this._schema = schema;
        if (_.isString(schema)) {
            this._schema = new Schema(schema); // default schema has no field restrictions or validations
        }

        this._dbCollection = db.collection(this._schema.catalogName);
    };

    Repository.prototype.getAll = function(callback) {
        this._dbCollection.find(function(err, doc) {
            callback(err, doc);
        });
    };

    Repository.prototype.get = function(id, callback) {
        var repo = this;
        this._dbCollection.findOne({ _id: this._schema.getIdFromString(id) }, function(err, doc) {
            if (err) {
                callback(err);
            } else {
                callback(null, repo._schema.parseBson(doc));
            }
        });
    };

    Repository.prototype.query = function(query, callback) {
        var repo = this;
        this._dbCollection.find(query.encode(), function(err, doc) {
            if (err) {
                callback(err);
            } else {
                callback(null, repo._schema.parseBson(doc));
            }
        });
    };

    Repository.prototype.save = function(item, callback) {
        // assume that item is singular
        var result = this._schema.parseJson(item);
        var repo = this;
        if (result._isValid) {
            delete result._isValid; // don't want to persist this field in the DB
            this._dbCollection.save(result, function(err, doc){
                if (err) {
                    callback(err);
                } else {
                    callback(null, repo._schema.parseBson(doc));
                }
            });
        } else {
            callback('Item failed schema validation check.', result);
        }
    };

    Repository.prototype.delete = function(id, callback) {

    };

    // for testing purposes only
    Repository.prototype.clear = function() {
        this._dbCollection.remove({});
    };

    module.exports = Repository;
}());

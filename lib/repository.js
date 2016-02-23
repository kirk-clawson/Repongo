/**
 * Created by Kirk.Clawson on 2/21/2016.
 */

var Schema = require('./schema.js');
var _ = require('lodash');

var Repository = function(schema, db) {
    var dbCollection;
    var _schema = schema;

    if (_.isString(schema)) {
        _schema = new Schema(schema); // default schema has no field restrictions or validations
    }
    dbCollection = db.collection(_schema.catalogName);

    this.getAll = function(callback) {
        dbCollection.find(function(err, doc) {
            callback(err, doc);
        });
    };

    this.get = function(id, callback) {
        dbCollection.findOne({ _id: _schema.getIdFromString(id) }, function(err, doc) {
            if (err) {
                callback(err);
            } else {
                callback(null, _schema.parseBson(doc));
            }
        });
    };

    this.query = function(query, callback) {
        dbCollection.find(query.encode(), function(err, doc) {
            if (err) {
                callback(err);
            } else {
                callback(null, _schema.parseBson(doc));
            }
        });
    };

    this.save = function(item, callback) {
        // assume that item is singular
        var result = _schema.parseJson(item);
        if (result._isValid) {
            delete result._isValid; // don't want to persist this field in the DB
            dbCollection.save(result, function(err, doc){
                if (err) {
                    callback(err);
                } else {
                    callback(null, _schema.parseBson(doc));
                }
            });
        } else {
            callback('Item failed schema validation check.', result);
        }
    };

    this.delete = function(id, callback) {

    };

    // for testing purposes only
    this.clear = function() {
        dbCollection.remove({});
    }
};

module.exports = Repository;
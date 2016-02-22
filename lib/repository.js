/**
 * Created by Kirk.Clawson on 2/21/2016.
 */

var Schema = require('./schema.js');

var Repository = function(schema, db) {
    var dbCollection;
    var _schema = schema;

    if (typeof schema === 'string' || schema instanceof String) {
        _schema = new Schema(schema);
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
        if (_schema.isValid(item)) {
            dbCollection.save(_schema.parseJson(item), function(err, doc){
                if (err) {
                    callback(err);
                } else {
                    callback(null, _schema.parseBson(doc));
                }
            });
        } else {
            callback('Item failed schema validation check.');
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
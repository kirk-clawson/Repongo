/**
 * Created by Kirk.Clawson on 2/21/2016.
 */

var mongo = require('mongojs');
var merge = require('merge');

var Schema = function(name, fields){
    this.catalogName = name;
    this.fieldDefs = fields || {};
    this.restricted = !!fields;
};

Schema.prototype.getIdFromString = function(id) {
    return mongo.ObjectId(id);
};

Schema.prototype.isValid = function(json) {
    var keys = Object.keys(this.fieldDefs);
    if (!this.restricted && keys.length == 0) return true;

    for(var i = 0; i < keys.length; ++i){
        var currentKey = keys[i];
        var currentValue = this.fieldDefs[currentKey];

    }

    return true;
};


Schema.prototype.parseJson = function(json) {
    if (this.isValid(json)) {
        if (json._id && (typeof json._id === 'string' || json._id instanceof String) && json._id != '') {
            json._id = this.getIdFromString(json._id);
        }
        return json;
    }
};

Schema.prototype.parseBson = function(bson) {
    var json = bson;
    // assumes bson will always have an _id property, which will always be true with a doc returned from mongo
    json._id = bson._id.toString();
    if (!this.isValid(json)) throw "Invalid data retrieved from catalog.";
    return json;
};

module.exports = Schema;
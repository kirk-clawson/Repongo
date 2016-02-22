/**
 * Created by Kirk.Clawson on 2/21/2016.
 */

var mongo = require('mongojs');

var Schema = function(name){
    this.catalogName = name;
    this.fieldDefs = {};
};

Schema.prototype.getIdFromParam = function(id) {
    return mongo.ObjectId(id);
};

Schema.prototype.isValid = function(json) {
    return true;
};

Schema.prototype.parseJson = function(json) {
    if (this.isValid(json)) {
        return json;
    }
};

Schema.prototype.parseBson = function(bson) {
    return bson;
};

module.exports = Schema;
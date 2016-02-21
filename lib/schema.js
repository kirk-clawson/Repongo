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

module.exports = Schema;
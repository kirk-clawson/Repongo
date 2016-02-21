/**
 * Created by Kirk.Clawson on 2/21/2016.
 */

var Repository = function(schema, db) {

    var dbCollection = db.collection(schema.catalogName);

    this.getAll = function(callback) {
        dbCollection.find(function(err, doc){
            callback(err, doc);
        });
    };

    this.get = function(id, callback) {
        dbCollection.findOne({ _id: schema.getIdFromParam(id) }, function(err, doc){
            callback(err, doc);
        });
    };

    this.save = function(item, callback) {
        // assume that item is singular
        dbCollection.save(item, function(err, doc){
            callback(err, doc);
        });
    };

    // for testing purposes only
    this.clear = function() {
        dbCollection.remove({});
    }
};

module.exports = Repository;
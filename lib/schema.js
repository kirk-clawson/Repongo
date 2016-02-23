/**
 * Created by Kirk.Clawson on 2/21/2016.
 */

(function(){
    "use strict";

    var mongo = require('mongojs');
    var _ = require('lodash');
    var converters = require('./dataconverters.js');
    var QueryBuilder = require('./queryBuilder.js');

    var rulesetDefaults = {
        isRequired: false,
        requiredMessage: ':? is required.',
        type: converters.any,
        typeMessage: ':? is the wrong data type',
        customValidator: function() { return null; }
    };

    var Schema = function(name, fields){
        this.catalogName = name;
        this.fieldDefs = fields || {};
        this.restricted = !!fields;
    };

    Schema.prototype._validateObject = function(json) {
        json._isValid = true;

        var keys = Object.keys(this.fieldDefs);
        if (!this.restricted && keys.length == 0) return;

        for(var i = 0; i < keys.length; ++i){
            var currentKey = keys[i];
            var currentRuleset = _.assignIn(this.fieldDefs[currentKey], rulesetDefaults);
            var validationResults = this._validateField(currentKey, json[currentKey], currentRuleset);
            if (validationResults.length > 0) {
                json._isValid = false;
                if (!json.hasOwnProperty('_validationErr')) json._validationErr = {};
                json._validationErr[currentKey] = validationResults;
            }
        }
    };

    Schema.prototype._validateField = function (fieldName, fieldValue, schemaRules) {
        var result = [];
        // field exists
        if (fieldValue == undefined) { // we've already decided the field has to exist, so no need to consult ruleset
            result.push(fieldName + ' is missing.');
            return result;
        }
        // Required validation
        if (schemaRules.isRequired && fieldValue == null) {
            result.push(_.replace(schemaRules.requiredMessage, ':?', fieldName));
        }
        // data type validation
        if (schemaRules.type && !schemaRules.type.validate(fieldValue)) {
            result.push(_.replace(schemaRules.typeMessage, ':?', fieldName));
        }
        // custom validator
        if (schemaRules.customValidator && typeof schemaRules.customValidator === 'function') {
            var customResult = schemaRules.customValidator(fieldValue);
            if (_.isArray(customResult)) {
                Array.prototype.push.apply(result, customResult);
            } else if (customResult && _.isString(customResult) && customResult != '') {
                result.push(customResult);
            }
        }
        return result;
    };

    Schema.prototype.getIdFromString = function(id) {
        return mongo.ObjectId(id);
    };

    Schema.prototype.parseJson = function(json) {
        this._validateObject(json);
        if (json._isValid) {
            if (json._id && _.isString(json._id) && json._id != '') {
                json._id = this.getIdFromString(json._id); //convert _id from string to mongo id object
            }
            // TODO: data type conversion
        }
        return json;
    };

    Schema.prototype.parseBson = function(bson) {
        var json = bson;
        // assumes bson will always have an _id property, which will always be true with a doc returned from mongo
        json._id = bson._id.toString(); // convert mongo id object to string
        this._validateObject(json);
        return json;
    };

    Schema.prototype.createQueryBuilder = function() {
        return new QueryBuilder(this);
    };

    module.exports = Schema;
}());

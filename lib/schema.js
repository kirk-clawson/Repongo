/**
 * Created by Kirk.Clawson on 2/21/2016.
 */

(function(){
    "use strict";

    var mongo = require('mongojs');
    var _ = require('lodash');
    var converters = require('./validators.js');
    var QueryBuilder = require('./queryBuilder.js');

    var rulesetDefaults = {
        isRequired: false,
        requiredMessage: ':? is required',
        type: converters.any,
        typeMessage: ':? is the wrong data type',
        customValidator: function() { return null; }
    };

    var optionDefs = {
        catalog: null,
        fields: {},
        allowExtraFields: true
    };

    var Schema = function(options) {
        var _opts;
        if (_.isString(options))
        {
            _opts = _.extend(optionDefs, {catalog: options});
        } else {
            _opts = _.extend(optionDefs, options);

        }
        this.catalogName = _opts.catalog;
        this.fieldDefs = _opts.fields || {};
        this.restricted = _opts.allowExtraFields;
    };

    Schema.prototype._validateObject = function(json) {
        if (!json.hasOwnProperty('_validationResult')) json._validationResult = {};
        json._validationResult._isValid = true;

        var keys = Object.keys(this.fieldDefs);
        if (!this.restricted && keys.length == 0) return;

        for(var i = 0; i < keys.length; ++i){
            var currentKey = keys[i];
            var currentRuleset = _.extend(rulesetDefaults, this.fieldDefs[currentKey]);
            var validationResults = this._validateField(currentKey, json[currentKey], currentRuleset);
            if (validationResults.length > 0) {
                json._validationResult._isValid = false;
                json._validationResult[currentKey] = validationResults;
            }
        }
    };

    Schema.prototype._validateField = function (fieldName, fieldValue, schemaRules) {
        var result = [];
        // Required validation
        if (schemaRules.isRequired && (fieldValue == null || fieldValue == undefined)) {
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

    Schema.prototype._parseBson = function(bson) {
        // assumes bson object will always have an _id property, which will always be true with a doc returned from mongo
        var json = bson;
        json._id = bson._id.toString(); // convert mongo id object to string
        this._validateObject(json);
        return json;
    };

    Schema.prototype.getIdFromString = function(id) {
        return mongo.ObjectId(id);
    };

    Schema.prototype.j2m = function(json) {
        this._validateObject(json);
        if (json._validationResult._isValid) {
            if (json._id && _.isString(json._id) && json._id != '') {
                json._id = this.getIdFromString(json._id); //convert _id from string to mongo id object
            }
            // TODO: data type conversion
        }
        return json;
    };

    Schema.prototype.m2j = function(bson) {
        var json;
        if (_.isArray(bson)) {
            json = [];
            for (var i = 0; i < bson.length; i++) {
                json.push(this._parseBson(bson[i]));
            }
        } else {
            json = this._parseBson(bson);
        }
        return json;
    };

    Schema.prototype.createQueryBuilder = function() {
        return new QueryBuilder(this);
    };

    module.exports = Schema;
}());

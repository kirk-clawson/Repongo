/**
 * Created by Kirk.Clawson on 2/21/2016.
 */

(function(){
    "use strict";

    var mongo = require('mongojs');
    var _ = require('lodash');
    var validators = require('./validators.js');
    var QueryBuilder = require('./queryBuilder.js');

    var rulesetDefaults = {
        isRequired: false,
        requiredMessage: ':? is required',
        validator: validators.any(true),
        typeMessage: ':? is the wrong data type',
        customValidator: function() { return null; }
    };

    var optionDefaults = {
        catalog: null,
        fields: {},
        allowExtraFields: true
    };

    var Schema = function(options) {
        var _opts;
        if (_.isString(options))
        {
            _opts = _.extend(optionDefaults, {catalog: options});
        } else {
            _opts = _.extend(optionDefaults, options);

        }
        this.catalogName = _opts.catalog;
        this.fieldRulesets = _opts.fields || {};
        this.restricted = _opts.allowExtraFields;
    };

    function validateField (fieldName, fieldValue, schemaRules) {
        var result = [];
        // Required validation
        if (schemaRules.isRequired && (fieldValue == null || fieldValue == undefined)) {
            result.push(_.replace(schemaRules.requiredMessage, ':?', fieldName));
        }
        // data type validation
        if (schemaRules.validator && !schemaRules.validator.validate(fieldValue)) {
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
    }

    function convertJsonToBson (validatedJson) {
        var result = validatedJson;
        // validation check is done before we get here
        if (validatedJson._id && _.isString(validatedJson._id) && validatedJson._id != '') {
            validatedJson._id = this.getIdFromString(validatedJson._id); //convert _id from string to mongo id object
        }
        // TODO: data type conversion
        return result;
    }

    function convertBsonToJson (bson) {
        // assumes bson object will always have an _id property, which will always be true with a doc returned from mongo
        var json = bson;
        json._id = bson._id.toString(); // convert mongo id object to string
        return json;
    }

    Schema.prototype.validateObject = function(json) {
        json._validationResult = {
            _isValid: true
        };

        var preDefinedFields = Object.keys(this.fieldRulesets);
        if (!this.restricted && preDefinedFields.length == 0) return;

        for(var i = 0; i < preDefinedFields.length; ++i){
            var currentField = preDefinedFields[i];
            var currentRuleset = _.extend(rulesetDefaults, this.fieldRulesets[currentField]);
            var validationResults = validateField(currentField, json[currentField], currentRuleset);
            if (validationResults.length > 0) {
                json._validationResult._isValid = false;
                json._validationResult[currentField] = validationResults;
            }
        }
    };

    Schema.prototype.j2m = function(json) {
        var bson = null;
        if (_.isArray(json)) {
            bson = [];
            for (var i = 0; i < json.length; ++i) {
                var current = json[i];
                this.validateObject(current);
                if (current._validationResult._isValid) {
                    bson.push(convertJsonToBson(current));
                } else {
                    bson.push(current);
                }
            }
        } else {
            this.validateObject(json);
            if (json._validationResult._isValid) {
                bson = convertJsonToBson(json);
            } else {
                bson = json;
            }
        }
        return bson;
    };

    Schema.prototype.m2j = function(bson) {
        var json = null;
        var current;
        if (_.isArray(bson)) {
            json = [];
            for (var i = 0; i < bson.length; i++) {
                current = convertBsonToJson(bson[i]);
                this.validateObject(current);
                if (current._validationResult._isValid) {
                    json.push(current);
                }
            }
        } else {
            current = convertBsonToJson(bson);
            this.validateObject(current);
            if (current._validationResult._isValid) {
                json = current;
            }
        }
        return json;
    };

    Schema.prototype.getIdFromString = function(id) {
        return mongo.ObjectId(id);
    };

    Schema.prototype.createQueryBuilder = function() {
        return new QueryBuilder(this);
    };

    module.exports = Schema;
}());

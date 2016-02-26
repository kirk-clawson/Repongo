/**
 * Created by clawsonk on 2/23/2016.
 */

(function () {
    "use strict";

    var _ = require('lodash');

    module.exports = function () {

        var any = function (allowNull) {
            return {
                validate: function (value) {
                    return (value != undefined && (!!allowNull || value != null));
                },
                convert: function (value) {
                    if (_.isNil(value)) {
                        if (!!allowNull)
                            return null;
                        throw 'Can\'t convert null or undefined any() type to a non-null value.'
                    }
                    return value;
                }
            };
        };

        var intDefaults = {
            max: undefined,
            min: undefined,
            allowNull: true,
            floorMax: false,
            ceilMin: false
        };

        var int = function (options) {
            var _options = _.extend(intDefaults, options);
            return {
                validate: function (value) {
                    if (_.isSafeInteger(value)) {
                        var maxValid = (_.isNil(_options.max) || (_options.max >= value));
                        var minValid = (_.isNil(_options.min) || (_options.min <= value));
                        return maxValid && minValid;
                    }
                    return (_options.allowNull && value == null);
                },
                convert: function (value) {
                    if (_.isNil(value) && _options.allowNull) return null;
                    var result = _.toSafeInteger(value); // will return 0 for null/undef
                    if (_options.floorMax && !_.isNil(_options.max))
                        result = Math.min(_options.max, value);
                    if (_options.ceilMin && !_.isNil(_options.min))
                        result = Math.max(_options.min, value);
                    return result;
                }
            };
        };

        var stringDefaults = {
            maxLength: undefined,
            minLength: undefined,
            allowEmpty: true,
            allowNull: true,
            trimToMax: false,
            omissionChar: '',
            padToMin: false,
            padChar: ' ',
            padAtEnd: true
        };

        var string = function (options) {
            var _options = _.extend(stringDefaults, options);
            return {
                validate: function (value) {
                    var maxValid = true;
                    var minValid = true;
                    if (_.isString(value)) {
                        if (!_.isNil(_options.maxLength)) {
                            maxValid = (_options.maxLength >= value.length);
                        }
                        if (!_.isNil(_options.minLength)) {
                            minValid = (_options.minLength <= value.length) || (value.length == 0 && _options.allowEmpty);
                        }
                        return maxValid && minValid;
                    }
                    return (!!_options.allowNull && (value == null));
                },
                convert: function(value) {
                    if (_.isNil(value) && _options.allowNull) return null;
                    var result = _.toString(value); // will return '' for null/undef
                    if (!_.isNil(_options.maxLength) && _options.trimToMax) {
                        var loOpts = {
                            length: _options.maxLength,
                            omission: _options.omissionChar || ''
                        };
                        result = _.truncate(result, loOpts);
                    }
                    if (!_.isNil(_options.minLength) && _options.padToMin) {
                        if (!((_options.minLength <= value.length) || (value.length == 0 && _options.allowEmpty))) {
                            if (_options.padAtEnd) {
                                result = _.padEnd(result, _options.minLength, _options.padChar);
                            } else {
                                result = _.padStart(result, _options.minLength, _options.padChar);
                            }
                        }
                    }
                    return result;
                }
            }
        };

        return {
            any: any,
            int: int,
            string: string
        };
    }();
}());

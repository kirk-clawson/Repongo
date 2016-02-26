/**
 * Created by clawsonk on 2/23/2016.
 */

(function(){
    "use strict";

    var _ = require('lodash');

    module.exports = function () {
        var any = function () {
            return {
                validate: function () {
                    return true;
                },
                convert: function (value) {
                    return value;
                }
            }
        };
        var int = function (max, min, allowNull) {
            return {
                validate: function (value) {
                    if (_.isSafeInteger(value)) {
                        var maxValid = (_.isNil(max) || (max >= value));
                        var minValid = (_.isNil(min) || (min <= value));
                        return maxValid && minValid;
                    }
                    return (allowNull && value == null);
                },
                convert: function (value) {
                    return _.toSafeInteger(value);
                }
            }
        };
        var string = function (maxLength, minLength, allowNullAndEmpty) {
            return {
                validate: function (value) {
                    var maxValid = true;
                    var minValid = true;
                    if (_.isString(value)) {
                        if (!_.isNil(maxLength)) {
                            maxValid = (maxLength >= value.length);
                        }
                        if (!_.isNil(minLength)) {
                            if (allowNullAndEmpty && value.length == 0) {
                                minValid = true;
                            } else {
                                minValid = (minLength <= value.length);
                            }
                        }
                        return maxValid && minValid;
                    }
                    return (allowNullAndEmpty && (value == null));
                },
                convert: function (value) {
                    return _.toSafeInteger(value);
                }
            }
        };

        return {
            any: any,
            int: int
        };
    }();
}());

/**
 * Created by clawsonk on 2/23/2016.
 */

var _ = require('lodash');

var dataConverters = (function() {
    var any = {
        validate: function() { return true; },
        convert: function(value) { return value; }
    };
    var int = {
        validate: function(value) { return _.isSafeInteger(value); },
        convert: function(value) { return _.toSafeInteger(value); }
    };

    return {
        any: any,
        int: int
    };
}());

module.exports = dataConverters;
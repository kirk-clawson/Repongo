
'use strict';
var GulpConfig = (function () {
    function gulpConfig() {
        //Got tired of scrolling through all the comments so removed them
        //Don't hurt me AC :-)
        this.source = '.';
        //this.sourceApp = this.source + '/app/';

        this.tsOutputPath = this.source + '/js';
        this.allTypeScript = this.source + '/lib/**/*.ts';
        this.testTypeScript = this.source + '/test/**/*.ts';

        this.libraryTypeScriptDefinitions = './typings/**/*.ts';
    }
    return gulpConfig;
})();
module.exports = GulpConfig;
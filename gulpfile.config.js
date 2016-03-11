
'use strict';
var GulpConfig = (function () {
    function gulpConfig() {
        this.sourceDir = 'src';
        this.debugDir = 'debug';
        this.prodDir = 'build';

        this.defsOutDir = 'definitions';
        this.defsInDir = 'typings';

        this.testDir = '/test';

        this.tsFiles = '/**/*.ts';
        this.jsFiles = '/**/*.js';
        this.mapFiles = '/**/*.js.map';
    }
    return gulpConfig;
})();
module.exports = GulpConfig;
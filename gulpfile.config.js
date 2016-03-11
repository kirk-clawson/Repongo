
'use strict';
var GulpConfig = (function () {
    function gulpConfig() {
        //Got tired of scrolling through all the comments so removed them
        //Don't hurt me AC :-)

        this.baseDir = './';

        this.sourceFiles = this.baseDir + 'src/**/*.ts';
        this.testFiles = this.baseDir + 'test/**/*.ts';
        this.typings = this.baseDir + 'typings/**/*.d.ts';

        this.allTsFiles = this.baseDir + '**/*.ts';

        this.outDir = this.baseDir + 'build';
    }
    return gulpConfig;
})();
module.exports = GulpConfig;
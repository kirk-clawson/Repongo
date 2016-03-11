'use strict';

var gulp = require('gulp'),
    debug = require('gulp-debug'),
    inject = require('gulp-inject'),
    tsc = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del'),
    Config = require('./gulpfile.config'),
    merge = require('merge2');

var tsProject = tsc.createProject('tsconfig.json');
var config = new Config();

/**
 * Generates the app.d.ts references file dynamically from all application *.ts files.
 */
// gulp.task('gen-ts-refs', function () {
//     var target = gulp.src(config.appTypeScriptReferences);
//     var sources = gulp.src([config.allTypeScript], {read: false});
//     return target.pipe(inject(sources, {
//         starttag: '//{',
//         endtag: '//}',
//         transform: function (filepath) {
//             return '/// <reference path="../..' + filepath + '" />';
//         }
//     })).pipe(gulp.dest(config.typings));
// });

/**
 * Compile TypeScript and include references to library and app .d.ts files.
 */
gulp.task('tsc-debug', function () {
    var sourceTsFiles = [
        config.sourceDir + config.tsFiles,
        config.defsInDir + config.tsFiles
    ];

    var tsResult = gulp
        .src(sourceTsFiles, { base: config.sourceDir })
        .pipe(sourcemaps.init())
        .pipe(tsc(tsProject));

    return merge([
        tsResult.dts
            .pipe(gulp.dest(config.defsOutDir)),
        tsResult.js
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(config.debugDir))
    ]);
});

gulp.task('tsc-production', function () {
    var sourceTsFiles = [
        config.sourceDir + config.tsFiles,
        config.defsInDir + config.tsFiles,
        '!' + config.sourceDir + config.testDir + config.tsFiles
    ];

    var tsResult = gulp
        .src(sourceTsFiles, { base: config.sourceDir })
        .pipe(tsc(tsProject, undefined, tsc.reporter.longReporter()));

    return merge([
        tsResult.dts.pipe(gulp.dest(config.defsOutDir)),
        tsResult.js.pipe(gulp.dest(config.prodDir))
    ]);
});

/**
 * Remove all generated JavaScript files from TypeScript compilation.
 */
gulp.task('clean-ts', function (cb) {
    var typeScriptGenFiles = [
        config.debugDir + config.jsFiles,    // path to all JS files auto gen'd by editor
        config.debugDir + config.mapFiles // path to all sourcemap files auto gen'd by editor
    ];
    // delete the files
    del(typeScriptGenFiles, cb);
});

gulp.task('watch', function() {
    gulp.watch([config.sourceDir + config.tsFiles], ['tsc-debug']);
});

gulp.task('default', ['tsc-debug']);
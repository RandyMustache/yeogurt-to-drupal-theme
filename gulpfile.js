'use strict';

/******************************************************************************
 * CONFIGURATIONS
 *****************************************************************************/

// Import configurations to get the path and FTP credentials
var configurations = require('./configurations.json');
var credentials = require('./credentials.json'); // This file should not be added to git.


// Default yeogurt stuff
var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var browserSyncLib = require('browser-sync');
var pjson = require('./package.json');
var minimist = require('minimist');
var wrench = require('wrench');
var sftp = require('gulp-sftp');
var plugins = gulpLoadPlugins();
var config = pjson.config;
var args = minimist(process.argv.slice(2));
var dirs = config.directories;
var taskTarget = args.production ? dirs.destination : dirs.temporary;
var browserSync = browserSyncLib.create();
wrench.readdirSyncRecursive('./gulp').filter(function (file) {
    return (/\.(js)$/i).test(file);
}).map(function (file) {
    require('./gulp/' + file)(gulp, plugins, args, config, taskTarget, browserSync);
});


/******************************************************************************
 * THE GULP TASKS
 *****************************************************************************/

// Copy css to server. Check configurations.json and credentials.json for path and password
gulp.task('copycsstoserver', function () {
    // Only copy if the enabled in configurations.js
    if (configurations.copytoserver) {
        return 	gulp.src('tmp/styles/*')
                .pipe(sftp({
                    host: credentials.host,
                    user: credentials.user,
                    pass: credentials.pass,
                    remotePath: configurations.path.remote.css
                }));
    } else {
        return true;
    }
});

// Copy js to server. Check configurations.json and credentials.json for path and password
gulp.task('copyjstoserver', function () {
    // Only copy if the enabled in configurations.js
    if (configurations.copytoserver) {
        return 	gulp.src('tmp/scripts/*')
                .pipe(sftp({
                    host: credentials.host,
                    user: credentials.user,
                    pass: credentials.pass,
                    remotePath: configurations.path.remote.js
                }));
    } else {
        return true;
    }
});

// Copy js to server. Check configurations.json and credentials.json for path and password
gulp.task('copyfontstoserver', function () {
    // Only copy if the enabled in configurations.js
    if (configurations.copytoserver) {
        return 	gulp.src('tmp/typography/**/*.{ttf,woff,eot,svg}')
                .pipe(sftp({
                    host: credentials.host,
                    user: credentials.user,
                    pass: credentials.pass,
                    remotePath: configurations.path.remote.typography
                }));
    } else {
        return true;
    }
});

// Copy js to server. Check configurations.json and credentials.json for path and password
gulp.task('copyimagestoserver', function () {
    // Only copy if the enabled in configurations.js
    if (configurations.copytoserver) {
        return 	gulp.src('tmp/images/**/*')
                .pipe(sftp({
                    host: credentials.host,
                    user: credentials.user,
                    pass: credentials.pass,
                    remotePath: configurations.path.remote.images
                }));
    } else {
        return true;
    }
});

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

gulp.task('build', [
    'copy',
    'copyfonts',
    'imagemin',
    'jade',
    'sass',
    'browserify'
]);

gulp.task('serve', [
    'imagemin',
    'copy',
    'copyfonts',
    'jade',
    'sass',
    'browserify',
    'browserSync',
    'copycsstoserver',
    'copyjstoserver',
    'copyfontstoserver',
    'copyimagestoserver',
    'watch'
]);
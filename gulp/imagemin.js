'use strict';

var path = require('path');
var gulpif = require('gulp-if');
var pngquant = require('imagemin-pngquant');

// Import configurations
var configurations = require('../configurations.json');

module.exports = function (gulp, plugins, args, config, taskTarget, browserSync) {
    var dirs = config.directories;
    var dest = path.join(taskTarget, dirs.images.replace(/^_/, ''));
    var dest_build = configurations.path.local.images;

    // Imagemin
    gulp.task('imagemin', function () {
        return gulp.src(path.join(dirs.source, dirs.images, '**/*.{jpg,jpeg,gif,svg,png}'))
                .pipe(plugins.changed(dest))
                .pipe(gulpif(args.production, plugins.imagemin({
                    progressive: true,
                    svgoPlugins: [{removeViewBox: false}],
                    use: [pngquant({speed: 10})]
                })))
                .pipe(gulp.dest(dest))
                .pipe(gulp.dest(dest_build));

    });
};

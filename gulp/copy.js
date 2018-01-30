'use strict';

var path = require('path');

// Import configurations
var configurations = require('../configurations.json');

module.exports = function (gulp, plugins, args, config, taskTarget, browserSync) {
	var dirs = config.directories;
	var dest = path.join(taskTarget);
	var dest_build = configurations.path.local.typography;

	// Copy
	gulp.task('copy', function () {
		return gulp.src([
			path.join(dirs.source, '**/*'),
			'!' + path.join(dirs.source, '{**/\_*,**/\_*/**}'),
			'!' + path.join(dirs.source, '**/*.jade')
		])
				.pipe(plugins.changed(dest))
				.pipe(gulp.dest(dest));
	});

	// Copy all fonts to theme folder
	gulp.task('copyfonts', function () {
		gulp.src('src/typography/**/*.{ttf,woff,eot,svg}')
				.pipe(gulp.dest(dest_build));
	});
};

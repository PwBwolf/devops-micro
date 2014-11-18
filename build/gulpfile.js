'use strict';
// generated on 2014-11-12 using generator-gulp-webapp 0.1.0
// Note: The serve tasks have not beemn validated to work. Only gulp build works.

var gulp = require('gulp');

// load plugins
var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files']
});

// inject bower components
gulp.task('wiredep2', function () {
  var wiredep = require('wiredep').stream;

  gulp.src('../client/app/*.html')
    .pipe(wiredep({
      directory: '../client/app/bower_components',
      bowerJson: require('../client/bower.json'),
      exclude: ['bootstrap'],
      ignorePath: /^\/|\.\.\//,
      src: '../client/app/*.html'
    }))
    .pipe(gulp.dest('dist'));
});

// Run all css through Autoprefixer (https://github.com/postcss/autoprefixer-core)
// Note: This is a pretty opinionated task. See link for more.
gulp.task('styles', function () {
    return gulp.src('../client/app/styles/main.css')
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest('.tmp/styles'))
        .pipe($.size());
});

// Run all scripts through jshint
gulp.task('scripts', function () {
    return gulp.src('../client/app/scripts/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter(require('jshint-stylish')))
        .pipe($.size());
});

// Process and minify all our AngularJs views
// Also combine them into a single module for pre-loading. (https://www.npmjs.org/package/gulp-ng-html2js)
// And then dump them inside .tmp
gulp.task('partials', function () {
  return gulp.src('../client/app/**/*.html') // Read all our partials
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.ngHtml2js({		// Convert HTML to injectable JavaScript
      moduleName: 'YipTV'	// Note: This should correspond to our main module name in our app.
    }))
    .pipe(gulp.dest('.tmp'))// Dump everything in .tmp when done
    .pipe($.size());
});

// Hint: Documentation for many of the tasks below can be found at the following URL:
// https://www.npmjs.org/package/gulp-<taskname>
// eg. Documentation for $.useref is at https://www.npmjs.org/package/gulp-useref

gulp.task('html', ['scripts', 'partials'], function () {
  var htmlFilter = $.filter('*.html'); 	// Filter out each HTML file
  var jsFilter = $.filter('**/*.js');		// Filter out each JS file
  var cssFilter = $.filter('**/*.css');	// Filter out each CSS file
  var assets;

  return gulp.src('../client/app/*.html')	// Read index.html
    .pipe($.inject(gulp.src('.tmp/views/**/*.js'), {	// Inject each processed partial output by the partials task
      read: false,
      starttag: '<!-- inject:partials -->',
      addRootSlash: false,
      addPrefix: '../../build' // Make the following tasks look for the file in the correct path (build/.tmp)
    }))
    .pipe(assets = $.useref.assets()) // Concatenate all our CSS and JS files, take only the concatenated files
    .pipe($.rev())	// Rev the files by prefixing them with the file hash
    .pipe(jsFilter)	// Take only the Javascript files
    .pipe($.ngAnnotate()) // Run them through ng-annotate to expand AngularJs dependency injection annotations to their full forms
    .pipe($.uglify())	// Minify the Javascript, strip out comments
    .pipe(jsFilter.restore())	// Restore non-JS files back to the stream
    .pipe(cssFilter)	// Take only the CSS files
    .pipe($.csso())		// Minify the CSS using CSSO
    .pipe(cssFilter.restore())	// Restore non-CSS files back to the stream
    .pipe(assets.restore())	// Restore all other files (we were only working on concatenated CSS/JS till now)
    .pipe($.useref())	// Finish replacing all CSS and JS links with our processed, concatenated, minified files
    .pipe($.revReplace())	
    .pipe(htmlFilter)
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(htmlFilter.restore()) // Restore non-html files back to the stream
    .pipe(gulp.dest('dist'))
    .pipe($.size());
});

// Copy _and_ optimise images.
gulp.task('images', function () {
    return gulp.src('../client/app/images/**/*') // Get images from specified dir and all subdirs.
        .pipe($.imagemin({		// $.cache() sometimes causes errors so it has been removed.
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('dist/images/'))
        .pipe($.size());
});

// Copy over fonts used by Bower modules do not specify fonts outside Bower modules)
gulp.task('fonts', function () {
    return gulp.src($.mainBowerFiles({paths: '../client'}))
    .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe($.flatten())
    .pipe(gulp.dest('dist/fonts'))
    .pipe($.size());
});

// Copy non-html files in project root including .htaccess, robots.txt, etc.
gulp.task('extras', function () {
    return gulp.src(['../client/app/*.*', '!../client/app/*.html'], { dot: true }) 
        .pipe(gulp.dest('dist'));
});

// Sometimes clearing the cache is the only way to fix path errors in the image task when building
gulp.task('clear', function (done) { 
    return $.cache.clearAll(done);
});

gulp.task('clean', function () {
    return gulp.src(['.tmp', 'dist'], { read: false }).pipe($.clean());
});

// The entry point to the gulpfile
gulp.task('build', ['html', 'images', 'fonts', 'extras']);

// Note that gulp build will _not_ clean first. Use simply `gulp` to clean and build.
gulp.task('default', ['clean'], function () { 
    gulp.start('build');
});






// Serve and connect related (Not used and not validated to be working.) - Varun Naik, November 13 2014

gulp.task('connect', function () {
    var connect = require('connect');
    var app = connect()
        .use(require('connect-livereload')({ port: 35729 }))
        .use(connect.static('app'))
        .use(connect.static('.tmp'))
        .use(connect.directory('app'));

    require('http').createServer(app)
        .listen(9000)
        .on('listening', function () {
            console.log('Started connect web server on http://localhost:9000');
        });
});

gulp.task('serve', ['connect'], function () {
    require('opn')('http://localhost:9000');
});

// inject bower components
gulp.task('wiredep', function () {
    var wiredep = require('wiredep').stream;

    gulp.src('../client/app/*.html')
        .pipe(wiredep({
            directory: '../client/app/bower_components'
        }))
        .pipe(gulp.dest('../client/app'));
});

gulp.task('watch', ['connect', 'serve'], function () {
    var server = $.livereload();

    // watch for changes

    gulp.watch([
        '../client/app/*.html',
        '.tmp/styles/**/*.css',
        '../client/app/scripts/**/*.js',
        '../client/app/images/**/*'
    ]).on('change', function (file) {
        server.changed(file.path);
    });

    gulp.watch('../client/app/styles/**/*.css', ['styles']);
    gulp.watch('../client/app/scripts/**/*.js', ['scripts']);
    gulp.watch('../client/app/images/**/*', ['images']);
    gulp.watch('bower.json', ['wiredep']);
});

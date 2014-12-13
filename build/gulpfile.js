/***********************************************************************/
/*                          DEPLOYMENT TASKS                           */
/***********************************************************************/
var gulp = require('gulp');
/* load all the gulp plugins */
var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files']
});
var fs = require('fs-extended');
var argv = require('yargs').argv;
var Q = require('q');
var replace = require('gulp-replace-task');
var tag_version = require('gulp-tag-version');

/**
 * Process and minify all our AngularJs views
 * Also combine them into a single module for pre-loading. (https://www.npmjs.org/package/gulp-ng-html2js)
 * And then dump them inside .tmp
 */
gulp.task('partials', function () {
    return gulp.src('../client/**/*.html') // Read all our partials
        .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe($.ngHtml2js({		// Convert HTML to injectable JavaScript
            moduleName: 'app'	// Note: This should correspond to our main module name in our app.
        }))
        .pipe(gulp.dest('.tmp'))// Dump everything in .tmp when done
        .pipe($.size());
});

/**
 * Copy only routing.js to the dist folder
 */
gulp.task('roles', function() {
    return gulp.src('../client/scripts/config/routing.js')
        .pipe($.uglify())
        .pipe(gulp.dest('dist/client/scripts/config'))
});

/**
 * Prepare the web application.
 * Process the html, css, js files along with the partials and copy them all to the
 * destination dist directory
 */
gulp.task('webapp', ['partials', 'roles'], function () {
    var htmlFilter = $.filter('*.html'); 	// Filter out each HTML file
    var jsFilter = $.filter('**/*.js');	// Filter out each JS file
    var cssFilter = $.filter('**/*.css');	// Filter out each CSS file
    var assets;

    return gulp.src('../client/*.html')	// Read index.html
        .pipe($.inject(gulp.src('.tmp/views/**/*.js'), {	// Inject each processed partial output by the partials task
            read: false,
            starttag: '<!-- inject:partials -->',
            addRootSlash: false,
            addPrefix: '../build' // Make the following tasks look for the file in the correct path (build/.tmp)
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
        .pipe(gulp.dest('dist/client'))
        .pipe($.size());
});

/**
 * Process all the images.
 * Read each image, optimize it and save it in the destination folder.
 */
gulp.task('images', function () {
    return gulp.src('../client/img/**/*') // Get images from specified dir and all subdirs.
        .pipe($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('dist/client/img/'))
        .pipe($.size());
});

/**
 * Copy over fonts used by Bower modules.
 */
gulp.task('fonts', function () {
    gulp.src('../client/styles/fonts/*')
        .pipe($.flatten())
        .pipe(gulp.dest('dist/client/styles/fonts'));

    return gulp.src($.mainBowerFiles({paths: '../client'}))
        .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
        .pipe($.flatten())
        .pipe(gulp.dest('dist/client/fonts'))
        .pipe($.size());
});

/**
 * Copy non-html files in project root including .htaccess, robots.txt, etc.
 */
gulp.task('extras', function () {
    return gulp.src(['../client/*.*', '!../client/*.html'], { dot: true })
        .pipe(gulp.dest('dist/client'));
});

/**
 * Copy the files and directories specific to the NodeJS server.
 * We will copy the common and webserver directories along with the package.json located in the parent server
 * directory.
 */
gulp.task('server', function(cb) {
    gulp.src('../server/package.json', {dot: true}).pipe(gulp.dest('dist/server'));
    gulp.src('../server/common/**/*', {dot: true}).pipe(gulp.dest('dist/server/common'));
    gulp.src('../server/webserver/**/*', {dot: true}).pipe(gulp.dest('dist/server/webserver'));
    cb();
});

function postDeploy() {
    gulp.src('../server/webserver/app.js')
        .pipe(replace({
            patterns: [
                {
                    match: 'development',
                    replacement: argv.env
                }
            ],
            usePrefix: false
        }))
        .pipe(gulp.dest('dist/server/webserver'));
    if(argv.tag) {
        commitAndTag();
    }
}

function commitAndTag() {
    gulp.src('./version.json')
        .pipe(tag_version());
}

function bumpVersion() {
    var bumpType = 'patch';
    if(argv.deployType === 'feature') {
        bumpType = 'minor';
    } else if(argv.deployType === 'release') {
        bumpType = 'major';
    }
    gulp.src('./version.json')
        .pipe($.bump({type: bumpType}))
        .pipe(gulp.dest('./'))
        .pipe(gulp.dest('dist/client'));
}

gulp.task('doDeploy', ['webapp', 'images', 'fonts', 'extras', 'server'], postDeploy);

gulp.task('deploy', ['clean'], function(){
    bumpVersion();
    environment = argv.env || 'integration';
    deployType = argv.deployType || 'patch';
    tagBuild = argv.tag || true;

    gulp.start('doDeploy');
});

gulp.task('clean', function (cb) {
    fs.emptyDirSync(".tmp");
    fs.emptyDirSync("dist/client");
    fs.emptyDirSync("dist/server");
    cb();
});

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
var git = require('gulp-git');
var connect = require('gulp-connect');

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
 * Prepare the web application.
 * Process the js files along with the partials and copy them all to the
 * destination dist directory
 */
gulp.task('webapp-nominify', ['partials', 'roles'], function () {
    var jsFilter = $.filter('**/*.js');	// Filter out each JS file
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
        .pipe(jsFilter.restore())	// Restore non-JS files back to the stream
        .pipe(assets.restore())	// Restore all other files (we were only working on concatenated CSS/JS till now)
        .pipe($.useref())	// Finish replacing all CSS and JS links with our processed, concatenated, minified files
        .pipe($.revReplace())
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
gulp.task('extras', function (cb) {
    gulp.src(['../client/*.*', '!../client/*.html'], { dot: true })
        .pipe(gulp.dest('dist/client'));
    gulp.src('../client/dependencies/*.*', { dot: true })
        .pipe(gulp.dest('dist/client/dependencies'));
    cb();
});

/**
 * Copy all the tools in the project a tools directory
 */
gulp.task('tools', function () {
    return gulp.src(['../tools/*.*'], { dot: true })
        .pipe(gulp.dest('dist/tools'));
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

function postDeploy(cb) {
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

    gulp.src(['../server/common/database/fixtures.js', '../server/common/database/cleanup.js'])
        .pipe(replace({
            patterns: [
                {
                    match: 'development',
                    replacement: argv.env
                }
            ],
            usePrefix: false
        }))
        .pipe(gulp.dest('dist/server/common/database'));

    if(argv.tag && argv.tag === 'true') {
        var version = fs.readJSONSync('./version.json').version;
        commitAndTag(version).then(function() {
            git.push('origin', 'v'+version, function(err) {
                if(err) {
                    console.log('Could not push the release to github. Please run git push origin v'+version + ' to make the release');
                } else {
                    git.push('origin', 'master', function(err) {
                        if(err) {
                            console.log('Could not push the updated version file to master');
                        }
                    });
                }
            });
        });
    } else {
        cb();
    }
}

function commitAndTag(version) {
    var def = Q.defer();
    gulp.src('./version.json')
        .pipe(git.add())
        .pipe(git.commit('committing version ' + version))
        .pipe(tag_version());
    setTimeout(function(){
        def.resolve();
    }, 2000)
    return def.promise;
}

function bumpVersion(versionFile, destination) {
    var bumpType = 'patch';
    if(argv.deployType === 'feature') {
        bumpType = 'minor';
    } else if(argv.deployType === 'release') {
        bumpType = 'major';
    }
    gulp.src('./' + versionFile + '.json')
        .pipe($.bump({type: bumpType}))
        .pipe(gulp.dest('./'))
        .pipe(gulp.dest(destination));
}

gulp.task('doDeploy', [argv.env === 'integration' ? 'webapp-nominify' : 'webapp', 'images', 'fonts', 'extras', 'server', 'tools'], function(cb){
    postDeploy(cb);
    checkAndPrepareDist('dist', 'yip-server');
});

gulp.task('dummy', function(cb) {
    cb();
});

gulp.task('deploy', [argv.env === 'integration' ? 'test' : 'dummy', 'clean'], function(){
    if(argv.tag) {
        if(argv.tag !== 'false' && argv.tag !== 'true') {
            checkoutFromTag().then(function() {
                gulp.start('doDeploy');
                gulp.src('./version.json')
                    .pipe(gulp.dest('dist/client'));
            }, function(err){
                console.log('There was a problem while checking out from this tag!..maybe you forgot to do a "git fetch"?');
                console.log(err);
            });
        } else {
            if(argv.deployType) {
                bumpVersion('version', 'dist/client');
            } else {
                gulp.src('./version.json')
                    .pipe(gulp.dest('dist/client'));
            }
            gulp.start('doDeploy');
        }
    } else if(argv.env === 'integration') {
        if(argv.deployType) {
            bumpVersion('version', 'dist/client');
        } else {
            gulp.src('./version.json')
                .pipe(gulp.dest('dist/client'));
        }
        gulp.start('doDeploy');
    } else {
        console.log('Deploying to an environment other than integration requires a tag!');
        console.log('Usage: gulp deploy --env test|staging|production --tag x.x.xx');
    }
});

function checkoutFromTag() {
    var def = Q.defer();
    git.checkout('v'+argv.tag, function(err) {
        if(!err) {
            def.resolve();
        } else {
            def.reject(err);
        }
    });
    return def.promise;
}

function addRemote(remote, serverRemotes, distDir) {
    var def = Q.defer();
    git.addRemote(remote, serverRemotes[remote], {cwd: './'+distDir}, function(err) {
        if(err) {
            console.log('something went wrong:', err);
        }
        def.resolve();
    });
    return def.promise;
}

function checkAndPrepareDist(distDir, module) {
    if(!fs.existsSync('./'+distDir+'/.git')) {
        git.init({cwd: './'+distDir}, function(err) {
            if(!err) {
                var serverRemotes = fs.readJSONSync('./config/'+module+'-remote.json');
                addRemote('integration', serverRemotes, distDir).then(function(){
                    addRemote('test', serverRemotes, distDir);
                });
            }
        });
    }
}

gulp.task('clean', function (cb) {
    fs.emptyDirSync(".tmp");
    fs.emptyDirSync("dist/client");
    fs.emptyDirSync("dist/server");
    fs.emptyDirSync("dist/tools");
    cb();
});

/*****************************************************************/
/*                       Daemon tasks                            */
/*****************************************************************/
function copyDaemon(source, destination) {
    var def = Q.defer();
    gulp.src(source, {dot: true})
        .pipe(gulp.dest(destination));
    def.resolve();
    return def.promise;
}

function cleanDaemon(name) {
    fs.emptyDirSync("daemons-dist/" + name);
}

gulp.task('daemon:deploy', function() {
    var daemon = argv.name;
    cleanDaemon(daemon);
    if(argv.deployType) {
        bumpVersion('rule-engine-version', 'daemons-dist');
    }
    copyDaemon(['../server/daemons/'+daemon+'/**/*', '!../server/daemons/'+daemon+'/'+daemon+'-main.js', '!../server/daemons/start.sh'], 'daemons-dist/'+daemon).then(function() {
        gulp.src('../server/daemons/'+daemon+'/'+daemon+'-main.js')
            .pipe(replace({
                patterns: [
                    {
                        match: 'development',
                        replacement: argv.env
                    }
                ],
                usePrefix: false
            }))
            .pipe(gulp.dest('daemons-dist/'+daemon));

        gulp.src('../server/daemons/start.sh')
            .pipe(replace({
                patterns: [
                    {
                        match: '#--'+daemon+'#',
                        replacement: ''
                    }
                ],
                usePrefix: false
            }))
            .pipe(gulp.dest('daemons-dist'));

        checkAndPrepareDist('daemons-dist', 'daemons');
    });
});

/*****************************************************************/
/*                        Development                            */
/*****************************************************************/
gulp.task('connect', function () {
    fs.createDirSync('../logs');
    // Start the Node server to provide the API
    var nodemon = require('gulp-nodemon');
    nodemon({ cwd: '../server/webserver', script: 'app.js', ext: 'js' });

    connect.server({
        root: '../../client',
        livereload: true,
        port: 9000,
        middleware: function (connect, opt) {
            return [
                require('connect-history-api-fallback'),
                require('connect-modrewrite')(['^/api/(.*)$ http://localhost:3000/api/$1 [P]'])
            ]
        }
    });
});

gulp.task('serve', ['connect', 'watch'], function () {
    setTimeout(function(){
        require('opn')('http://localhost:9000');
    }, 2000);
});

gulp.task('reload-html', function(){
    gulp.src('../../client/**/*.html')
        .pipe(connect.reload());
});
gulp.task('reload-js', function(){
    gulp.src('../../client/scripts/**/*.js')
        .pipe(connect.reload());
});
gulp.task('reload-css', function(){
    gulp.src('../../client/styles/**/*.css')
        .pipe(connect.reload());
});
gulp.task('reload-images', function(){
    gulp.src('../../client/images/**/*')
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch(['../../client/**/*.html'], ['reload-html']);
    gulp.watch(['../../client/scripts/**/*.js'], ['reload-js']);
    gulp.watch(['../../client/styles/**/*.css'], ['reload-css']);
    gulp.watch(['../../client/img/**/*'], ['reload-images']);
});


/*****************************************************************/
/*                            Testing                            */
/*****************************************************************/

var karma = require('gulp-karma');

var testFiles = [
    '../test/client/**/*.js'
];

gulp.task('test', function() {
    // Be sure to return the stream
    return gulp.src('./dummy.js')
        .pipe(karma({
            configFile: 'karma.conf.js',
            action: 'run'
        }))
        .on('error', function(err) {
            // Make sure failed tests cause gulp to exit non-zero
            throw err;
        });
});

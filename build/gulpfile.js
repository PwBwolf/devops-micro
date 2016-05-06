'use strict';

/***********************************************************************/
/*                          DEPLOYMENT TASKS                           */
/***********************************************************************/
var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files']
});
var fs = require('fs-extended');
var argv = require('yargs').argv;
var Q = require('q');
var replace = require('gulp-replace-task');
var tagVersion = require('gulp-tag-version');
var git = require('gulp-git');
var connect = require('gulp-connect');

/**
 * Process and minify all our AngularJs views
 * Also combine them into a single module for pre-loading. (https://www.npmjs.org/package/gulp-ng-html2js)
 * And then dump them inside .tmp
 */
gulp.task('partials', function () {
    return gulp.src('../client/web-app/**/*.html') //Read all our partials
        .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe($.ngHtml2js({ //Convert HTML to injectable JavaScript
            moduleName: 'app' //Note: This should correspond to our main module name in our app.
        }))
        .pipe(gulp.dest('.tmp')) //Dump everything in .tmp when done
        .pipe($.size());
});

/**
 * Copy only routing.js to the dist folder
 */
gulp.task('roles', function () {
    return gulp.src('../client/web-app/scripts/config/routing.js')
        .pipe($.uglify())
        .pipe(gulp.dest('dist/client/web-app/scripts/config'));
});

gulp.task('jwplayer', function () {
    return gulp.src(['../client/web-app/scripts/external/jwplayer.js', '../client/web-app/scripts/external/jwplayer.html5.js', '../client/web-app/scripts/external/jwplayer.flash.swf'])
        .pipe(gulp.dest('dist/client/web-app/scripts/external'));
});

gulp.task('sass', function () {
    return gulp.src('../client/web-app/styles/sass/app.scss')
        .pipe($.sass())
        .pipe(gulp.dest('../client/web-app/styles/'));
});

/**
 * Prepare the web application.
 * Process the html, css, js files along with the partials and copy them all to the
 * destination dist directory
 */
gulp.task('webapp', ['sass', 'partials', 'roles', 'jwplayer'], function () {
    var htmlFilter = $.filter('*.html'); //Filter out each HTML file
    var jsFilter = $.filter('**/*.js'); //Filter out each JS file
    var cssFilter = $.filter('**/*.css'); //Filter out each CSS file
    var assets;

    return gulp.src('../client/web-app/*.html') // Read index.html
        .pipe($.inject(gulp.src('.tmp/views/**/*.js'), { //Inject each processed partial output by the partials task
            read: false,
            starttag: '<!-- inject:partials -->',
            addRootSlash: false,
            addPrefix: '../../build' //Make the following tasks look for the file in the correct path (build/.tmp)
        }))
        .pipe(assets = $.useref.assets()) //Concatenate all our CSS and JS files, take only the concatenated files
        .pipe($.rev()) // Rev the files by prefixing them with the file hash
        .pipe(jsFilter) // Take only the Javascript files
        .pipe($.ngAnnotate()) // Run them through ng-annotate to expand AngularJs dependency injection annotations to their full forms
        .pipe($.uglify()) // Minify the Javascript, strip out comments
        .pipe(jsFilter.restore()) // Restore non-JS files back to the stream
        .pipe(cssFilter) // Take only the CSS files
        .pipe($.csso()) // Minify the CSS using CSSO
        .pipe(cssFilter.restore()) // Restore non-CSS files back to the stream
        .pipe(assets.restore()) // Restore all other files (we were only working on concatenated CSS/JS till now)
        .pipe($.useref()) // Finish replacing all CSS and JS links with our processed, concatenated, minified files
        .pipe($.revReplace())
        .pipe(htmlFilter)
        .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(htmlFilter.restore()) // Restore non-html files back to the stream
        .pipe(gulp.dest('dist/client/web-app'))
        .pipe($.size());
});

/**
 * Prepare the web application.
 * Process the js files along with the partials and copy them all to the
 * destination dist directory
 */
gulp.task('webapp-nominify', ['partials', 'roles', 'jwplayer'], function () {
    var jsFilter = $.filter('**/*.js'); //Filter out each JS file
    var assets;

    return gulp.src('../client/web-app/*.html') //Read index.html
        .pipe($.inject(gulp.src('.tmp/views/**/*.js'), { //Inject each processed partial output by the partials task
            read: false,
            starttag: '<!-- inject:partials -->',
            addRootSlash: false,
            addPrefix: '../build' //Make the following tasks look for the file in the correct path (build/.tmp)
        }))
        .pipe(assets = $.useref.assets()) //Concatenate all our CSS and JS files, take only the concatenated files
        .pipe($.rev()) //Rev the files by prefixing them with the file hash
        .pipe(jsFilter) //Take only the Javascript files
        .pipe($.ngAnnotate()) //Run them through ng-annotate to expand AngularJs dependency injection annotations to their full forms
        .pipe(jsFilter.restore()) //Restore non-JS files back to the stream
        .pipe(assets.restore()) //Restore all other files (we were only working on concatenated CSS/JS till now)
        .pipe($.useref()) //Finish replacing all CSS and JS links with our processed, concatenated, minified files
        .pipe($.revReplace())
        .pipe(gulp.dest('dist/client/web-app'))
        .pipe($.size());
});

/**
 * Process all the images.
 * Read each image, optimize it and save it in the destination folder.
 */
gulp.task('images', function () {
    return gulp.src('../client/web-app/images/**/*') //Get images from specified dir and all subdirs.
        .pipe($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('dist/client/web-app/images/'))
        .pipe($.size());
});

/**
 * Copy over fonts used by Bower modules.
 */
gulp.task('fonts', function () {
    gulp.src('../client/web-app/styles/fonts/*')
        .pipe($.flatten())
        .pipe(gulp.dest('dist/client/web-app/styles/fonts'));

    return gulp.src($.mainBowerFiles({paths: '../client/web-app'}))
        .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
        .pipe($.flatten())
        .pipe(gulp.dest('dist/client/web-app/fonts'))
        .pipe($.size());
});

/**
 * Copy non-html files in project root including .htaccess, robots.txt, etc.
 */
gulp.task('extras', function (cb) {
    gulp.src(['../client/web-app/*.*', '!../client/web-app/*.html'], {dot: true})
        .pipe(gulp.dest('dist/client/web-app'));
    gulp.src(['../client/crm-app/**/*'], {dot: true})
        .pipe(gulp.dest('dist/client/crm-app'));
    cb();
});

/**
 * Copy all the tools in the project a tools directory
 */
gulp.task('tools', function () {
    return gulp.src(['../tools/**/*'], {dot: true})
        .pipe(gulp.dest('dist/tools'));
});

/**
 * Copy the files and directories specific to the NodeJS server.
 * We will copy the common and web-app directories along with the package.json located in the parent server
 * directory.
 */
gulp.task('server', function (cb) {
    gulp.src('../server/package.json', {dot: true}).pipe(gulp.dest('dist/server'));
    gulp.src('../server/restart-daemons.sh', {dot: true}).pipe(gulp.dest('dist/server'));
    gulp.src('../server/restart-servers.sh', {dot: true}).pipe(gulp.dest('dist/server'));
    gulp.src(['../server/common/**/*', '!../server/common/config/*'], {dot: true}).pipe(gulp.dest('dist/server/common'));
    gulp.src(['../server/common/config/all.js', '../server/common/config/' + argv.env + '.js'], {dot: true}).pipe(gulp.dest('dist/server/common/config'));
    gulp.src('../server/web-app/**/*', {dot: true}).pipe(gulp.dest('dist/server/web-app'));
    gulp.src('../server/crm-app/**/*', {dot: true}).pipe(gulp.dest('dist/server/crm-app'));
    gulp.src('../server/api-server/**/*', {dot: true}).pipe(gulp.dest('dist/server/api-server'));
    cb();
});

function replaceAndCopy(source, destination, text, replacementText) {
    gulp.src(source)
        .pipe(replace({
            patterns: [
                {
                    match: text,
                    replacement: replacementText
                }
            ],
            usePrefix: false
        }))
        .pipe(gulp.dest(destination));
}

function postDeploy(cb) {
    replaceAndCopy('../server/web-app/app.js', 'dist/server/web-app', 'development', argv.env);
    replaceAndCopy('../server/crm-app/app.js', 'dist/server/crm-app', 'development', argv.env);
    replaceAndCopy('../server/api-server/app.js', 'dist/server/api-server', 'development', argv.env);
    replaceAndCopy('../server/common/database/fixtures.js', 'dist/server/common/database', 'development', argv.env);
    replaceAndCopy('../tools/deployment-scripts/notify-build.js', 'dist/tools/deployment-scripts', 'development', argv.env);
    replaceAndCopy('../tools/deployment-scripts/update-database.js', 'dist/tools/deployment-scripts', 'development', argv.env);
    replaceAndCopy('../tools/deployment-scripts/cleanup.js', 'dist/tools/deployment-scripts', 'development', argv.env);
    replaceAndCopy('../tools/admin-cli/cancel-subscription.js', 'dist/tools/admin-cli', 'development', argv.env);
    replaceAndCopy('../tools/admin-cli/change-email.js', 'dist/tools/admin-cli', 'development', argv.env);
    replaceAndCopy('../tools/admin-cli/compare-complimentary-fs-db-packages-1.js', 'dist/tools/admin-cli', 'development', argv.env);
    replaceAndCopy('../tools/admin-cli/compare-complimentary-fs-db-packages-2.js', 'dist/tools/admin-cli', 'development', argv.env);
    replaceAndCopy('../tools/admin-cli/compare-free-fs-db-packages-1.js', 'dist/tools/admin-cli', 'development', argv.env);
    replaceAndCopy('../tools/admin-cli/compare-premium-fs-db-packages-1.js', 'dist/tools/admin-cli', 'development', argv.env);
    replaceAndCopy('../tools/admin-cli/compare-premium-fs-db-packages-2.js', 'dist/tools/admin-cli', 'development', argv.env);
    replaceAndCopy('../tools/admin-cli/compare-premium-fs-db-packages-3.js', 'dist/tools/admin-cli', 'development', argv.env);
    replaceAndCopy('../tools/admin-cli/complimentary-code.js', 'dist/tools/admin-cli', 'development', argv.env);
    replaceAndCopy('../tools/admin-cli/complimentary-users-report.js', 'dist/tools/admin-cli', 'development', argv.env);
    replaceAndCopy('../tools/admin-cli/convert-to-complimentary-subscription.js', 'dist/tools/admin-cli', 'development', argv.env);
    replaceAndCopy('../tools/admin-cli/convert-to-free-db-only.js', 'dist/tools/admin-cli', 'development', argv.env);
    replaceAndCopy('../tools/admin-cli/create-api-client.js', 'dist/tools/admin-cli', 'development', argv.env);
    replaceAndCopy('../tools/admin-cli/create-crm-user.js', 'dist/tools/admin-cli', 'development', argv.env);
    replaceAndCopy('../tools/admin-cli/create-merchant.js', 'dist/tools/admin-cli', 'development', argv.env);
    replaceAndCopy('../tools/admin-cli/crm-user-reset-password.js', 'dist/tools/admin-cli', 'development', argv.env);
    replaceAndCopy('../tools/admin-cli/crm-user-set-status.js', 'dist/tools/admin-cli', 'development', argv.env);
    replaceAndCopy('../tools/admin-cli/db-fs-sync.js', 'dist/tools/admin-cli', 'development', argv.env);
    replaceAndCopy('../tools/admin-cli/delete-user.js', 'dist/tools/admin-cli', 'development', argv.env);
    replaceAndCopy('../tools/admin-cli/end-complimentary-subscription.js', 'dist/tools/admin-cli', 'development', argv.env);
    replaceAndCopy('../tools/admin-cli/end-premium-subscription.js', 'dist/tools/admin-cli', 'development', argv.env);
    replaceAndCopy('../tools/admin-cli/export-cj-batch-file.js', 'dist/tools/admin-cli', 'development', argv.env);
    replaceAndCopy('../tools/admin-cli/export-cj-users.js', 'dist/tools/admin-cli', 'development', argv.env);
    replaceAndCopy('../tools/admin-cli/export-comp-users-with-expiry-date.js', 'dist/tools/admin-cli', 'development', argv.env);
    replaceAndCopy('../tools/admin-cli/export-email-sms-opt-in-users.js', 'dist/tools/admin-cli', 'development', argv.env);
    replaceAndCopy('../tools/admin-cli/export-freeside-users.js', 'dist/tools/admin-cli', 'development', argv.env);
    replaceAndCopy('../tools/admin-cli/export-idt-payments.js', 'dist/tools/admin-cli', 'development', argv.env);
    replaceAndCopy('../tools/admin-cli/export-partner-accounts.js', 'dist/tools/admin-cli', 'development', argv.env);
    replaceAndCopy('../tools/admin-cli/export-users.js', 'dist/tools/admin-cli', 'development', argv.env);
    replaceAndCopy('../tools/admin-cli/freeside-login-report.js', 'dist/tools/admin-cli', 'development', argv.env);
    replaceAndCopy('../tools/admin-cli/raf-report.js', 'dist/tools/admin-cli', 'development', argv.env);
    replaceAndCopy('../tools/admin-cli/remove-7-day-package.js', 'dist/tools/admin-cli', 'development', argv.env);
    replaceAndCopy('../tools/admin-cli/remove-7-day-package-fs-only.js', 'dist/tools/admin-cli', 'development', argv.env);
    replaceAndCopy('../tools/admin-cli/reset-password.js', 'dist/tools/admin-cli', 'development', argv.env);
    replaceAndCopy('../tools/admin-cli/suspend-user.js', 'dist/tools/admin-cli', 'development', argv.env);
    replaceAndCopy('../tools/admin-cli/unsuspend-user.js', 'dist/tools/admin-cli', 'development', argv.env);
    replaceAndCopy('../tools/admin-cli/upgrade-subscription.js', 'dist/tools/admin-cli', 'development', argv.env);
    replaceAndCopy('../tools/admin-cli/verify-account.js', 'dist/tools/admin-cli', 'development', argv.env);
    replaceAndCopy('../tools/migration-scripts/set1/remove-unused-collections.js', 'dist/tools/migration-scripts/set1', 'development', argv.env);
    replaceAndCopy('../tools/migration-scripts/set1/remove-payment-pending-field.js', 'dist/tools/migration-scripts/set1', 'development', argv.env);
    replaceAndCopy('../tools/migration-scripts/set1/update-user-fields.js', 'dist/tools/migration-scripts/set1', 'development', argv.env);
    replaceAndCopy('../tools/migration-scripts/set1/update-account-fields.js', 'dist/tools/migration-scripts/set1', 'development', argv.env);
    replaceAndCopy('../tools/migration-scripts/set1/migrate-trial-ended-users.js', 'dist/tools/migration-scripts/set1', 'development', argv.env);
    replaceAndCopy('../tools/migration-scripts/set1/migrate-comp-ended-users.js', 'dist/tools/migration-scripts/set1', 'development', argv.env);
    replaceAndCopy('../tools/migration-scripts/set1/migrate-canceled-users.js', 'dist/tools/migration-scripts/set1', 'development', argv.env);
    replaceAndCopy('../tools/migration-scripts/set1/migrate-payment-pending-users.js', 'dist/tools/migration-scripts/set1', 'development', argv.env);
    replaceAndCopy('../tools/migration-scripts/set1/migrate-free-active-users.js', 'dist/tools/migration-scripts/set1', 'development', argv.env);
    replaceAndCopy('../tools/migration-scripts/set1/migrate-comp-active-users.js', 'dist/tools/migration-scripts/set1', 'development', argv.env);
    replaceAndCopy('../tools/migration-scripts/set1/migrate-paid-active-users.js', 'dist/tools/migration-scripts/set1', 'development', argv.env);
    replaceAndCopy('../tools/migration-scripts/set2/update-free-user-packages.js', 'dist/tools/migration-scripts/set2', 'development', argv.env);
    replaceAndCopy('../tools/migration-scripts/set2/update-comp-user-packages.js', 'dist/tools/migration-scripts/set2', 'development', argv.env);
    replaceAndCopy('../tools/migration-scripts/set2/update-paid-user-packages.js', 'dist/tools/migration-scripts/set2', 'development', argv.env);
    replaceAndCopy('../tools/migration-scripts/set3/add-email-sms-subscription-fields.js', 'dist/tools/migration-scripts/set3', 'development', argv.env);
    replaceAndCopy('../tools/migration-scripts/set4/create-email-sms-subscription-field.js', 'dist/tools/migration-scripts/set4', 'development', argv.env);
    replaceAndCopy('../tools/migration-scripts/set4/remove-unused-fields.js', 'dist/tools/migration-scripts/set4', 'development', argv.env);
    replaceAndCopy('../tools/migration-scripts/set4/remove-visitor-collection.js', 'dist/tools/migration-scripts/set4', 'development', argv.env);
    replaceAndCopy('../tools/migration-scripts/set4/delete-failed-users.js', 'dist/tools/migration-scripts/set4', 'development', argv.env);
    replaceAndCopy('../tools/migration-scripts/set5/remove-unused-collections.js', 'dist/tools/migration-scripts/set5', 'development', argv.env);
    var version = fs.readJSONSync('./version.json').version;
    if (argv.tag && argv.tag === 'true') {
        commitAndTag(version).then(function () {
            git.push('origin', 'v' + version, function (err) {
                if (err) {
                    console.log('Could not push the release to github. Please run git push origin v' + version + ' to make the release');
                } else {
                    git.push('origin', 'master', function (err) {
                        if (err) {
                            console.log('Could not push the updated version file to master');
                        }
                    });
                }
            });
        });
    } else if (argv.deployType) {
        gulp.src('./version.json')
            .pipe(git.add())
            .pipe(git.commit('committing version ' + version));
        git.push('origin', 'master', function (err) {
            if (err) {
                console.log('Could not push the updated version file to master');
            }
        });
    }
    else {
        cb();
    }
}

function commitAndTag(version) {
    var def = Q.defer();
    gulp.src('./version.json')
        .pipe(git.add())
        .pipe(git.commit('committing version ' + version))
        .pipe(tagVersion());
    setTimeout(function () {
        def.resolve();
    }, 2000);
    return def.promise;
}

function bumpVersion(versionFile, destination) {
    var bumpType = 'patch';
    if (argv.deployType === 'feature') {
        bumpType = 'minor';
    } else if (argv.deployType === 'release') {
        bumpType = 'major';
    }
    gulp.src('./' + versionFile + '.json')
        .pipe($.bump({type: bumpType}))
        .pipe(gulp.dest('./'))
        .pipe(gulp.dest(destination));
}

gulp.task('doDeploy', [argv.noMinify ? 'webapp-nominify' : 'webapp', 'images', 'fonts', 'extras', 'server', 'tools'], function (cb) {
    buildDaemon('dist/server/daemons', 'email-sms-processor');
    buildDaemon('dist/server/daemons', 'subscription-processor');
    buildDaemon('dist/server/daemons', 'cj-report-processor');
    postDeploy(cb);
    checkAndPrepareDist('dist', 'yip-server');
});

gulp.task('dummy', function (cb) {
    cb();
});

gulp.task('deploy', [argv.env === 'integration' ? 'dummy' : 'dummy', 'clean'], function () {
    if (argv.tag) {
        if (argv.tag !== 'false' && argv.tag !== 'true') {
            checkoutFromTag().then(function () {
                gulp.start('doDeploy');
                gulp.src('./version.json')
                    .pipe(gulp.dest('dist/client/web-app'));
            }, function (err) {
                console.log('There was a problem while checking out from this tag! Maybe you forgot to do a "git fetch"?');
                console.log(err);
            });
        } else {
            if (argv.deployType) {
                bumpVersion('version', 'dist/client/web-app');
            } else {
                gulp.src('./version.json')
                    .pipe(gulp.dest('dist/client/web-app'));
            }
            gulp.start('doDeploy');
        }
    } else if (argv.env === 'integration') {
        if (argv.deployType) {
            bumpVersion('version', 'dist/client/web-app');
        } else {
            gulp.src('./version.json')
                .pipe(gulp.dest('dist/client/web-app'));
        }
        gulp.start('doDeploy');
    } else {
        console.log('Deploying to an environment other than integration requires a tag!');
        console.log('Usage: gulp deploy --env test|staging|production --tag x.x.xx');
    }
});

function checkoutFromTag() {
    var def = Q.defer();
    git.checkout('v' + argv.tag, function (err) {
        if (!err) {
            def.resolve();
        } else {
            def.reject(err);
        }
    });
    return def.promise;
}

function addRemote(remote, serverRemotes, distDir) {
    var def = Q.defer();
    git.addRemote(remote, serverRemotes[remote], {cwd: './' + distDir}, function (err) {
        if (err) {
            console.log('something went wrong:', err);
        }
        def.resolve();
    });
    return def.promise;
}

function checkAndPrepareDist(distDir, module) {
    if (!fs.existsSync('./' + distDir + '/.git')) {
        git.init({cwd: './' + distDir}, function (err) {
            if (!err) {
                var serverRemotes = fs.readJSONSync('./config/' + module + '-remote.json');
                addRemote('integration', serverRemotes, distDir).then(function () {
                    addRemote('test', serverRemotes, distDir).then(function () {
                        if (serverRemotes.ci) {
                            addRemote('ci', serverRemotes, distDir);
                        }
                    });
                });
            }
        });
    }
}

gulp.task('clean', function (cb) {
    fs.emptyDirSync('.tmp');
    fs.emptyDirSync('dist/client');
    fs.emptyDirSync('dist/server');
    fs.emptyDirSync('dist/tools');
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

function cleanDaemon(destDir, name) {
    fs.emptyDirSync(destDir + '/' + name);
}

function buildDaemon(destDir, daemon, cb) {
    cleanDaemon(destDir, daemon);
    copyDaemon(['../server/daemons/' + daemon + '/**/*', '!../server/daemons/' + daemon + '/' + daemon + '-main.js', '!../server/daemons/start.sh'], destDir + '/' + daemon).then(function () {
        gulp.src('../server/daemons/' + daemon + '/' + daemon + '-main.js')
            .pipe(replace({
                patterns: [
                    {
                        match: 'development',
                        replacement: argv.env
                    }
                ],
                usePrefix: false
            }))
            .pipe(gulp.dest(destDir + '/' + daemon));

        gulp.src('../server/daemons/start.sh')
            .pipe(replace({
                patterns: [
                    {
                        match: '#--' + daemon + '#',
                        replacement: ''
                    }
                ],
                usePrefix: false
            }))
            .pipe(gulp.dest(destDir));

        cb();
    });
}

gulp.task('daemon:deploy', function (cb) {
    buildDaemon('daemons-dist', cb);
    if (argv.deployType) {
        bumpVersion('rule-engine-version', 'daemons-dist');
    }
    checkAndPrepareDist('daemons-dist', 'daemons');
});

/*****************************************************************/
/*                        Development                            */
/*****************************************************************/

gulp.task('web-app', ['connect-web-app', 'watch-web-app'], function () {
    setTimeout(function () {
        require('opn')('http://localhost:9000');
    }, 2000);
});

gulp.task('crm-app', ['connect-crm-app', 'watch-crm-app'], function () {
    setTimeout(function () {
        require('opn')('http://localhost:9100');
    }, 2000);
});

gulp.task('api-server', function () {
    fs.createDirSync('../logs');
    //Start the Node server to provide the API
    var nodemon = require('gulp-nodemon');
    nodemon({cwd: '../server/api-server', script: 'app.js', ext: 'js'});
});

gulp.task('web-app-reload-html', function () {
    gulp.src('../../client/web-app/**/*.html')
        .pipe(connect.reload());
});

gulp.task('web-app-reload-js', function () {
    gulp.src('../../client/web-app/scripts/**/*.js')
        .pipe(connect.reload());
});

gulp.task('web-app-reload-css', function () {
    gulp.src('../../client/web-app/styles/**/*.css')
        .pipe(connect.reload());
});

gulp.task('web-app-reload-images', function () {
    gulp.src('../../client/web-app/images/**/*')
        .pipe(connect.reload());
});

gulp.task('watch-web-app', function () {
    gulp.watch(['../../client/web-app/**/*.html'], ['web-app-reload-html']);
    gulp.watch(['../../client/web-app/scripts/**/*.js'], ['web-app-reload-js']);
    gulp.watch(['../../client/web-app/styles/**/*.css'], ['web-app-reload-css']);
    gulp.watch(['../../client/web-app/images/**/*'], ['web-app-reload-images']);
});

gulp.task('connect-web-app', function () {
    fs.createDirSync('../logs');
    //Start the Node server to provide the API
    var nodemon = require('gulp-nodemon');
    nodemon({cwd: '../server/web-app', script: 'app.js', ext: 'js'});

    connect.server({
        root: '../../client/web-app',
        livereload: true,
        port: 9000,
        middleware: function () {
            return [
                require('connect-history-api-fallback'),
                require('connect-modrewrite')(['^/api/(.*)$ http://localhost:3000/api/$1 [P]'])
            ];
        }
    });
});

gulp.task('crm-app-reload-html', function () {
    gulp.src('../../client/crm-app/**/*.html')
        .pipe(connect.reload());
});

gulp.task('crm-app-reload-js', function () {
    gulp.src('../../client/crm-app/scripts/**/*.js')
        .pipe(connect.reload());
});

gulp.task('crm-app-reload-css', function () {
    gulp.src('../../client/crm-app/styles/**/*.css')
        .pipe(connect.reload());
});

gulp.task('crm-app-reload-images', function () {
    gulp.src('../../client/crm-app/images/**/*')
        .pipe(connect.reload());
});

gulp.task('watch-crm-app', function () {
    gulp.watch(['../../client/crm-app/**/*.html'], ['crm-app-reload-html']);
    gulp.watch(['../../client/crm-app/scripts/**/*.js'], ['crm-app-reload-js']);
    gulp.watch(['../../client/crm-app/styles/**/*.css'], ['crm-app-reload-css']);
    gulp.watch(['../../client/crm-app/images/**/*'], ['crm-app-reload-images']);
});

gulp.task('connect-crm-app', function () {
    fs.createDirSync('../logs');
    //Start the Node server to provide the API
    var nodemon = require('gulp-nodemon');
    nodemon({cwd: '../server/crm-app', script: 'app.js', ext: 'js'});

    connect.server({
        root: '../../client/crm-app',
        livereload: true,
        port: 9100,
        middleware: function () {
            return [
                require('connect-history-api-fallback'),
                require('connect-modrewrite')(['^/crm/api/(.*)$ http://localhost:5000/crm/api/$1 [P]'])
            ];
        }
    });
});

/*****************************************************************/
/*                            Testing                            */
/*****************************************************************/

var karma = require('gulp-karma');

gulp.task('test', function () {
    //Be sure to return the stream
    return gulp.src('./dummy.js')
        .pipe(karma({
            configFile: 'karma.conf.js',
            action: 'run'
        }))
        .on('error', function (err) {
            //Make sure failed tests cause gulp to exit non-zero
            throw err;
        });
});

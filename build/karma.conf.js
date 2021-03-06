'use strict';
// Karma configuration
// Generated on Sat Dec 13 2014 19:13:45 GMT+0530 (IST)

module.exports = function (config) {
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',
        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],
        // list of files / patterns to load in the browser
        files: [
            '../client/web-app/bower_components/jquery/jquery.js',
            '../client/web-app/bower_components/lodash/dist/lodash.js',
            '../client/web-app/bower_components/angular/angular.js',
            '../client/web-app/bower_components/angular-webstorage/angular-webstorage.js',
            '../client/web-app/bower_components/angular-sanitize/angular-sanitize.js',
            '../client/web-app/bower_components/angular-route/angular-route.js',
            '../client/web-app/bower_components/angular-animate/angular-animate.js',
            '../client/web-app/bower_components/angular-translate/angular-translate.js',
            '../client/web-app/bower_components/toastr/toastr.js',
            '../client/web-app/bower_components/fastclick/lib/fastclick.js',
            '../client/web-app/bower_components/bootstrap/dist/js/bootstrap.min.js',
            '../client/web-app/bower_components/angular-bootstrap/ui-bootstrap.js',
            '../client/web-app/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
            './node_modules/angular-mocks/angular-mocks.js',
            '../client/web-app/scripts/**/*.js',
            '../test/client/unit/controllers/*.js',
            '../test/client/unit/directives/*.js',
            '../test/client/unit/services/*.js'
        ],
        // list of files to exclude
        exclude: [],
        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {},
        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],
        // web server port
        port: 9876,
        // enable / disable colors in the output (reporters and logs)
        colors: true,
        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,
        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],
        plugins: [
            'karma-jasmine',
            'karma-phantomjs-launcher'
        ],
        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true
    });
};

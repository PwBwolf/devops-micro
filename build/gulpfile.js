'use strict';
// generated on 2014-11-12 using generator-gulp-webapp 0.1.0
// Note: The serve tasks have not beemn validated to work. Only gulp build works.

var gulp = require('gulp');

// load plugins
var $ = require('gulp-load-plugins')();

gulp.task('styles', function () {
    return gulp.src('../client/app/styles/main.css')
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest('.tmp/styles'))
        .pipe($.size());
});

gulp.task('scripts', function () {
    return gulp.src('../client/app/scripts/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter(require('jshint-stylish')))
        .pipe($.size());
});

gulp.task('html', ['styles', 'scripts'], function () {
    var jsFilter = $.filter('../client/**/*.js');
    var cssFilter = $.filter('../client/**/*.css');

    return gulp.src(['../client/app/*.html', '../client/app/views/**/*.html'])
        .pipe($.useref.assets({searchPath: '{.tmp,../client/app}'}))
        .pipe(jsFilter)
        .pipe($.uglify())
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe($.csso())
        .pipe(cssFilter.restore())
        .pipe($.useref.restore())
        .pipe($.useref())
        .pipe($.minifyHtml())
        .pipe(gulp.dest('dist/'))
        .pipe($.size());
});

gulp.task('images', function () {
    return gulp.src('../client/app/images/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
        .pipe($.size());
});

gulp.task('fonts', function () {
    return $.bowerFiles({
        bowerDirectory: '../client/app/bower_components',
        bowerrc: '../client/.bowerrc',
        bowerJson: '../client/bower.json'
    })
        .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
        .pipe($.flatten())
        .pipe(gulp.dest('dist/fonts'))
        .pipe($.size());
});

gulp.task('extras', function () {
    return gulp.src(['../client/app/*.*', '!../client/app/*.html'], { dot: true })
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function () {
    return gulp.src(['.tmp', 'dist'], { read: false }).pipe($.clean());
});

gulp.task('build', ['html', 'images', 'extras']);

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

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

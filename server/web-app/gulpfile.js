var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function () {
    gulp.src('../../client/web-app/styles/sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('../../client/web-app/styles/'));
});

gulp.task('watch', function() {
    gulp.watch('../../client/web-app/styles/sass/**/*', ['sass']);
});

gulp.task('default', ['sass', 'watch']);

const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const watch = require('gulp-watch');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const fileInclude = require('gulp-file-include');
const gulpCopy = require('gulp-copy');

gulp.task('copy', function(callback) {
    return gulp.src(['source/fonts/**/*.*', 'source/img/**/*.*', 'source/svg/**/*.*'])
        .pipe(gulpCopy('./build', { prefix: 1 }))
    callback();
})

gulp.task('html', function(callback){
    return gulp.src('source/html/index.html')
        .pipe(plumber({
            errorHandler: notify.onError(function(err){
                return {
                    title: "HTML Include",
                    sound: false,
                    message: err.message
                }
            })
        }))
        .pipe(fileInclude({prefix:'@@'}))
        .pipe(gulp.dest('./build'));
    callback();
})

gulp.task("scss", function (callback) {
    return gulp.src("./source/scss/*.scss")
        .pipe(plumber({
            errorHandler: notify.onError(function(err){
                return {
                    title: "SCSS Styles",
                    sound: false,
                    message: err.message
                }
            })
        }))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 4 versions']
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./build/css"));
    callback();
});

gulp.task('watch', function(){
    watch(['./source/html/**/*.html', './source/**/*.scss'], gulp.parallel(browserSync.reload));
    watch('./source/**/*.scss', gulp.parallel('scss'));
    watch('./source/html/**/*.html', gulp.parallel('html'));
});

gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: './build'
        }
    });
});

gulp.task('default', gulp.parallel('server', 'watch', 'scss', 'html'));
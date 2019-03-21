'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    svgSprite = require('gulp-svg-sprite'),
    svgmin = require('gulp-svgmin'),
    cheerio = require('gulp-cheerio'),
    replace = require('gulp-replace'),
    reload = browserSync.reload


var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/image/',
        fonts: 'build/fonts/'
    },
    src: {
        html: 'src/*.html',
        js: ['src/js/*.js'],
        style: 'src/scss/main.scss',
        img: 'src/image/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/scss/**/*.scss',
        css: 'build/css/main.css',
        img: 'src/image/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};


gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});
gulp.task('image:build', function () {
    gulp.src(path.src.img)
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});

gulp.task('css:build', function(){
    return gulp.src('build/css/main.css')
		.pipe(rename({suffix: '.min'}))
		.pipe(cssnano())
        .pipe(gulp.dest('build/css'))
        
});

gulp.task('style:build', function () {
    gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass({
            sourceMap: true,
            errLogToConsole: true
        }))
          .pipe(sourcemaps.write())
          .pipe(
            autoprefixer({
              browsers: ["last 2 versions"],
              cascade: false
            })
          )
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});
gulp.task('js:build', function () {
  return gulp.src(path.src.js)
    .pipe(gulp.dest(path.build.js));
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('build', [
    'html:build',
    'style:build',
    'fonts:build',
    'css:build',
    'js:build',
    'image:build'
]);




gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
    watch([path.watch.css], function(event, cb) {
        gulp.start('css:build');
    });
});





gulp.task('default', ['build', 'watch']);
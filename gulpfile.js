'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'), // Ребилд только измененных файлов
    plumber = require('gulp-plumber'), // Защита gulp от вылета
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rimraf = require('rimraf'), // Очистка директорий
    twig = require('gulp-twig'), // JS шаблонизатор с синтаксисом TWIG
    browserSync = require("browser-sync"),
    kss = require('gulp-kss'),
    reload = browserSync.reload;

var path = {
    build: {
        html: '/',
        js: 'js/',
        css: 'css/',
        cssimg: 'css/img/',
        images: 'images/',
        fonts: 'fonts/',
    },
    src: {
        html: 'src/*.html',
        js: 'src/js/*.js',
        jsmain: 'src/js/main.js',
        scss: 'src/scss/*.*',
        cssimg: 'src/scss/img/**/*.*',
        images: 'src/images/**/*.*',
        fonts: 'src/fonts/**/*.*',
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        scss: 'src/scss/**/*.scss',
        cssimg: 'src/scss/img/**/*.*',
        images: 'src/images/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};


var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend_Devil"
};



gulp.task('webserver', function () {
   // browserSync(config); // Запуск веб-сервера
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('html:build', function () {
    gulp.src(path.src.html) 
        .pipe(plumber())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
    gulp.src(path.src.js) 
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('/')) 
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
    gulp.src(path.src.scss) 
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass()).on('error', sass.logError)
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});


gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(plumber())
        .pipe(gulp.dest(path.build.fonts))
});


gulp.task('kss', function () {
    gulp.src(path.src.scss)
        .pipe(kss({
            overview: 'kss/styleguide.md',
            templateDirectory: 'kss/template'
        }))
        .pipe(gulp.dest('kss/'));
});

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
]);

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.scss], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});


gulp.task('default', ['build', 'webserver', 'watch']);

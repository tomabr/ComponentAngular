var gulp = require('gulp');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var nodemon = require('gulp-nodemon');
var order = require("gulp-order");
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var csscomb = require('gulp-csscomb');
var cssbeautify = require('gulp-cssbeautify');
var templateCache = require('gulp-angular-templatecache');



var config = {
    srcTemplates:[
        'javascript/**/*.html',
        'javascript/**/**/*.html',
    ],
    destPartials: 'javascript'
};


gulp.task('html-templates', function() {
    return gulp.src(config.srcTemplates)
    .pipe(templateCache('templateCache.js', { module:'mySearch', standalone:true }))
    .pipe(gulp.dest(config.destPartials));
});


gulp.task('js', function() {
  return gulp.src('javascript/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(order([
      "app.js",
      "templateCache.js"
    ]))
    .pipe(concat('main.js'))
    .pipe(rename({ suffix: '.min' }))
    //.pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/assets'));
});

gulp.task('styles', function() {
  return gulp.src('stylesheet/sass/main.sass')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(csscomb())
    .pipe(cssbeautify())
    .pipe(gulp.dest('public/assets'));
});

gulp.task('watch', ['js', 'styles', 'html-templates'], function() {
  gulp.watch('javascript/**/*.html', ['html-templates']);
  gulp.watch('javascript/**/*.js', ['js']);
  gulp.watch('stylesheet/**.*.sass', ['styles']);
});

gulp.task('dev:server', function() {
  nodemon({
    script: 'server.js',
    ext: 'js',
    ignore: ['javascript*', 'public/assets*']
  });
});

gulp.task('dev', ['watch', 'dev:server']);

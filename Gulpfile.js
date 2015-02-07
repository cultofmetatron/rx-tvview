var gulp = require('gulp');
var browserify = require('gulp-browserify');
var sourcemaps = require('gulp-sourcemaps');
var less = require('gulp-less');
var path = require('path');

gulp.task('frontend', function() {
  return gulp.src('./frontend/src/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(browserify({
      insertGlobals : true,
      debug : true,
      transform: [
        ['es6ify']
      ]
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./frontend/build/js'));
});

function logger() {
  return console.log.apply(console, arguments);
}

gulp.task('less', function() {
  return gulp.src('./frontend/src/stylesheets/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname,'frontend', 'src', 'stylesheets') ]
    }))
    .on('error', logger)
    .pipe(gulp.dest('./frontend/build/stylesheets'))
});









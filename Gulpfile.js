var gulp = require('gulp');
var browserify = require('gulp-browserify');
var sourcemaps = require('gulp-sourcemaps');
var less = require('gulp-less');

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

gulp.task('less', function() {
  gulp.src('./src/styles/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'src', 'styles') ]
    }))
    .pipe(gulp.dest('./build/styles'));
});









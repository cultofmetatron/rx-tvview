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
        ['es6ify', {global: true, modules:'commonjs'}],
        ['brfs']
      ]
    }))
    .pipe(sourcemaps.write())
    .on('error', logger)
    .pipe(gulp.dest('./frontend/build/js'));
});

gulp.task('less', function() {
  return gulp.src('./frontend/src/stylesheets/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname,'frontend', 'src', 'stylesheets') ]
    }))
    .on('error', logger)
    .pipe(gulp.dest('./frontend/build/stylesheets'))
});


gulp.task('default', function() {
  //livereload.listen();
  gulp.run('less')
  gulp.run('frontend');
  gulp.watch('./frontend/src/**/*.js',['frontend']);
  gulp.watch('./frontend/src/**/*.less', ['less']);

})



function logger() {
  return console.log.apply(console, arguments);
}







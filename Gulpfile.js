var gulp = require('gulp');
var browserify = require('browserify');
var sourcemaps = require('gulp-sourcemaps');
var less = require('gulp-less');
var es6ify = require('es6ify');
var brfs = require('brfs');
var path = require('path');
var fs = require('fs');

gulp.task('frontend', function() {
  return browserify({
    debug: true,
    transform: ['es6ify'],
    //standalone: true
  })
    //.add('./frontend/src/js/**/*.js')
    .require(require.resolve('./frontend/src/js/main/app.js'), { entry: true })
    .bundle()
    //.pipe(gulp.dest('./frontend/build/js'));
    .pipe(fs.createWriteStream('./frontend/build/js/main/app.js'))
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







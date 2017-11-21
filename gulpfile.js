var gulp = require('gulp'),
  connect = require('gulp-connect'),
  watch = require('gulp-watch'),
  minify = require('gulp-minifier'),
  sass = require('gulp-sass');

const ENV = {
  current: '',
  dev_path: './dev/',
  prod_path: './dist/',
  minify_config: {
    minify: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    minifyJS: true,
    minifyCSS: true,
    getKeptComment: function(content, filePath) {
      var m = content.match(/\/\*![\s\S]*?\*\//img);
      return m && m.join('\n') + '\n' || '';
    }
  },
  sass_config: {
    outputStyle: 'nested'
  },
  configure: function(first_config, min) {
    return Object.assign({}, first_config, {
      minify: min,
      minifyJS: min
    })
  }
}

var ENV_PATH = '';

gulp.task('webserver', function() {
  connect.server({
    livereload: true,
    root: ['.', ENV_PATH]
  });
});

gulp.task('livereload', function() {
  gulp.src([ENV_PATH + '*.css', ENV_PATH + '*.js'])
    .pipe(watch([ENV_PATH + '*.css', ENV_PATH + '*.js']))
    .pipe(connect.reload());
});


gulp.task('sass', function() {
  return gulp.src('./scss/**/*.scss')
    .pipe(sass(ENV.sass_config).on('error', sass.logError))
    .pipe(gulp.dest(ENV_PATH));
});

gulp.task('watch', function() {
  gulp.watch('./scss/**/*.scss', ['sass']);
  gulp.watch('./js/**/*.js', ['minify-js'])
});

gulp.task('minify-js', function() {
  return gulp.src('./js/**/*js')
    .pipe(minify(ENV.minify_config))
    .pipe(gulp.dest(ENV_PATH + ''));
});

gulp.task('dev::env', function() {
  ENV_PATH = ENV.dev_path;
  ENV.minify_config = ENV.configure(ENV.minify_config, false);
  ENV.sass_config = {
    outputStyle: 'nested'
  }
})
gulp.task('prod::env', function() {
  ENV_PATH = ENV.prod_path;
  ENV.minify_config = ENV.configure(ENV.minify_config, true);
  ENV.sass_config = {
    outputStyle: 'compressed'
  }
})



gulp.task('dev::tasks', ['dev::env', 'minify-js', 'sass', 'webserver', 'livereload', 'watch']);
gulp.task('prod::build', ['prod::env', 'minify-js', 'sass']);

gulp.task('default', ['dev::tasks']);

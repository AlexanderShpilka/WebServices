'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const debug = require('gulp-debug');
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const del = require('del');
const browserSync = require('browser-sync').create();
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const eslint = require('gulp-eslint');
const through2 = require('through2').obj;
const fs = require('fs');
const combine = require('stream-combiner2').obj;
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const minify = require("gulp-csso");
const rename = require("gulp-rename");

let isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

gulp.task('styles', function() {
  return gulp.src('app/scss/styles.scss')
    .pipe(plumber({
      errorHandler: notify.onError(function(err) {
        return {
          title: 'Styles',
          message: err.message,
        };
      })
    }))
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(sass())
    .pipe(debug({title: 'sass'}))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("dist/css/"))
    .pipe(minify())
    .pipe(rename("styles.min.css"))
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('clean', function() {
  return del('dist/');
});

gulp.task('assets', function() {
  return gulp.src(['app/assets/**', '!app/assets/favicon/**'], {since: gulp.lastRun('assets')})
    .pipe(debug({title: 'assets'}))
    .pipe(gulp.dest('dist/'));
});

gulp.task('js', function() {
  return gulp.src('app/js/**/*.js', {since: gulp.lastRun('js')})
    .pipe(debug({title: 'js'}))
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('html', function() {
  return gulp.src('app/**/*.html', {since: gulp.lastRun('html')})
    .pipe(debug({title: 'html'}))
    .pipe(gulp.dest('dist/'));
});

gulp.task('favicon', function() {
  return gulp.src('app/assets/favicon/**/*', {since: gulp.lastRun('favicon')})
    .pipe(debug({title: 'html'}))
    .pipe(gulp.dest('dist/'))
});

gulp.task('build', gulp.series(
  'clean', 
  gulp.parallel('styles', 'assets', 'js', 'html', 'favicon'))
);

gulp.task('watch', function() {
  gulp.watch('app/scss/**/*.scss', gulp.series('styles'));
  gulp.watch('app/js/**/*.js', gulp.series('js'));
  gulp.watch('app/assets/**/*.*', gulp.series('assets'));
  gulp.watch('app/**/*.html', gulp.series('html'));
});

gulp.task('serve', function() {
  browserSync.init({
    server: './dist/'
  });

  browserSync.watch('./dist/**/*.*').on('change', browserSync.reload);
});

gulp.task('dev', gulp.series(
  'build', 
  gulp.parallel('watch', 'serve'))
);

gulp.task('lint', function() {

  let eslintResults = {};
  let cacheFilePath = process.cwd() + '/tmp/lintCache.json';

  try {
    eslintResults = JSON.parse(fs.readFileSync(cacheFilePath));
  } catch (e) {}

  return gulp.src('app/js/**/*.js', {read: false})
    .pipe(debug({title: 'src'}))
    .pipe(gulpIf(
      function(file) {
        return eslintResults[file.path] && eslintResults[file.path].mtime == 
                                                    file.stat.mtime.toJSON();
      },
      through2(function(file, enc, callback) {
        file.eslint = eslintResults[file.path].eslint;
        callback(null, file);
      }),
      combine(
        through2(function(file, enc, callback) {
          file.contents = fs.readFileSync(file.path);
          callback(null, file);
        }),
        eslint(),
        debug({title: 'eslint'}),
        through2(function(file, enc, callback) {
          eslintResults[file.path] = {
            eslint: file.eslint,
            mtime: file.stat.mtime
          };
          callback(null, file);
        })
      )
    ))
    .pipe(eslint.format())
    .on('end', function() {
      fs.writeFileSync(cacheFilePath, JSON.stringify(eslintResults));
    });
});

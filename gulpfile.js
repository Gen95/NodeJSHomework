const gulp = require('gulp');
const watch = require('gulp-watch');
const browserSync = require('browser-sync');
const twig = require('gulp-twig');

const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');

const webpackStream = require('webpack-stream');
const notify = require('gulp-notify');
const uglify = require('gulp-uglify-es').default;

const handleError = (err) => {
  notify.onError({ title: 'Gulp error', message: err.message })(err);
};

gulp.task('server', () => {
  watch('src/client/**/*.scss', gulp.task('build:styles'));
  watch('src/client/**/*.js', gulp.task('build:scripts'));
  watch('src/server/*.js', gulp.task('build:server:scripts'));
  watch('src/client/**/*.twig', gulp.task('build:html'));
  browserSync.init({
    server: {
      baseDir: './build/client',
    },
    host: 'localhost',
    port: 9000,
  });
});

gulp.task('watch', () => {
  watch('build/**/*.*', gulp.series('server:refresh'));
});

gulp.task('server:refresh', () => {
  browserSync.reload();
});

gulp.task('build:styles', () => gulp.src('src/client/styles/main.scss')
  .pipe(plumber(handleError))
  .pipe(sassGlob())
  .pipe(sass())
  .pipe(autoprefixer())
  .pipe(cleanCss())
  .pipe(concat('style.css'))
  .pipe(plumber.stop())
  .pipe(gulp.dest('build/client')));

gulp.task('build:html', () => gulp.src('src/client/pages/*.twig')
  .pipe(plumber(handleError))
  .pipe(twig())
  .pipe(plumber.stop())
  .pipe(gulp.dest('build/client')));

gulp.task('build:scripts', () => gulp.src('src/client/**/*.js')
  .pipe(plumber(handleError))
  .pipe(webpackStream({
    entry: './src/client/scripts/index.js',
    output: {
      filename: 'script.js',
    },
    optimization: {
      minimize: true,
    },
  }))
  .pipe(uglify())
  .pipe(gulp.dest('./build/client')));

gulp.task('build:server:scripts', () => gulp.src('src/**/*.js')
  .pipe(plumber(handleError))
  .pipe(uglify())
  .pipe(gulp.dest('./build/server')));

gulp.task('build:assets', () => gulp.src('src/client/assets/**/*.*')
  .pipe(gulp.dest('build/client/assets')));

gulp.task('build', gulp.series(
  'build:server:scripts',
  'build:styles',
  'build:scripts',
  'build:html',
  'build:assets',
  'server',
  'watch',
));

gulp.task('default', gulp.series('build'));

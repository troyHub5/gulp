const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const fileInclude = require('gulp-file-include');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const cleanDist = require('gulp-clean');


const paths = {
  styles: {
    src: 'src/styles/**/*.scss',
    dest: 'dist/css/'
  },

  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'dist/js/'
  }
};

function clean() {
  return gulp.src('./dist/', { read:false, allowempty: true})
    .pipe(cleanDist());
}


function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(cleanCSS())
        .pipe(rename({
          basename: 'main',
          suffix: '.min'
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.styles.dest));
}

function scripts() {
  return gulp.src(paths.scripts.src, {
    soursmaps: true
  })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
}

function includeHTML() {
  return gulp.src('src/**/*.html')
    .pipe(fileInclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('dist/'));
}

function watch(){
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
}

const build = gulp.series(clean, gulp.series(styles, scripts), watch); 

exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;
exports.build = build;
exports.default = build;
exports.includeHTML = includeHTML;

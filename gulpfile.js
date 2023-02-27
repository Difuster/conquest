const {src, dest, series, watch} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const csso = require('gulp-csso');
const include = require('gulp-file-include');
const htmlmin = require('gulp-htmlmin');
const del = require('del');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const sync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const	pngquant = require('imagemin-pngquant');
const	cache = require('gulp-cache');

function html() {
  return src('src/**.html')
    .pipe(include({
      prefix: '@@'
    }))
    .pipe(htmlmin({
      collapseWhitespace: true,
    }))
    .pipe(dest('dist'))
}

function scss() {
  return src('src/scss/**.scss')
    .pipe(sass())
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 2 versions']
    }))
    .pipe(csso())
    .pipe(concat('style.css'))
    .pipe(dest('dist'))
}

function clear() {
  return del('dist')
}

function img() {
  return src('src/images/**/*')
  .pipe(cache(imagemin({ 
    interlaced: true,
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()]
  })))
  .pipe(dest('dist/images'));
}

function serve() {
  sync.init({
    server: './dist'
  })

  watch('src/**.html', series(html)).on('change', sync.reload)
  watch('src/scss/**.scss', series(scss)).on('change', sync.reload)
  watch('src/images**/*', series(img)).on('change', sync.reload)
}

exports.build = series(clear, scss, img, html)
exports.serve = series(clear, scss, img, html, serve)
exports.clear = clear;

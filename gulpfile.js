const gulp = require('gulp');
const clean = require('gulp-clean');
const imagemin = require('gulp-imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminZopfli = require('imagemin-zopfli');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminOptipng = require('imagemin-optipng');
const imageminSvgo = require('imagemin-svgo');

const compress = function() {
    return gulp.src('input/**/*.{gif,png,jpg,jpeg,svg}')
        .pipe(imagemin([
        //png
            imageminPngquant({
                speed: 1,
                quality: [0.95, 1] //lossy settings
            }),
            imageminOptipng(),
            imageminZopfli({
                more: true
                // iterations: 50 // very slow but more effective
            }),
        //gif
            // imagemin.gifsicle({
            //     interlaced: true,
            //     optimizationLevel: 3
            // }),
            //gif very light lossy, use only one of gifsicle or Giflossy
        //svg
            imageminSvgo(),
            imagemin.svgo({
                plugins: [{
                    removeViewBox: false
                }]
            }),
        //jpg lossless
            // imagemin.jpegtran({
            //     progressive: true
            // }),
        //jpg very light lossy, use vs jpegtran
            imageminMozjpeg({
                quality: 70
            })
        ]))
        .pipe(gulp.dest('output'));
};

const cls = function () {
    return gulp.src('output', {read: false})
        .pipe(clean());
};

gulp.task('default', gulp.series(cls, compress));

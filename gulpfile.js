/**
 * Скачать и установить GraphicsMagic
 * @link http://www.graphicsmagick.org/
 *
 * --- или ---
 *
 * Скачать и установить ImageMagic
 * @link https://imagemagick.org/script/download.php
 */
const gulp = require('gulp');
const clean = require('gulp-clean');
const imagemin = require('gulp-imagemin');
const imageresize = require('gulp-image-resize');
const imageminPngquant = require('imagemin-pngquant');
const imageminZopfli = require('imagemin-zopfli');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminOptipng = require('imagemin-optipng');
const imageminSvgo = require('imagemin-svgo');

const computeScaleInstructions = (file, _, cb) => {
    readMetadata(file.path, (err, meta) => {
        if (err) return cb(err);
        file.scale = {
            maxWidth: 1920,
            maxHeight: 1080
        }
        cb(null, file);
    });
}

const compress = function() {
    return gulp.src('input/**/*')
        .pipe(imageresize({
            width: 1920,
            height: 1080,
            crop: false,
            upscale: false,
            // imageMagic: true // использовать imageMagic (сначала установить)
        }))
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
    return gulp.src('output', {read: false, allowEmpty: true})
        .pipe(clean());
};

gulp.task('default', gulp.series(cls, compress));

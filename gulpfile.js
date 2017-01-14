var gulp = require ('gulp');
var sass = require ('gulp-sass');
var browserSync = require ('browser-sync');
var reload = browserSync.reload;
var autoprefixer = require ('gulp-autoprefixer');
var clean = require ('gulp-clean');
var concat = require ('gulp-concat');
var browserify = require ('gulp-browserify');
var merge = require ('merge-stream');
var newer = require ('gulp-newer');
var imagemin = require ('gulp-imagemin');
var injectPartials = require ('gulp-inject-partials');
var minify = require ('gulp-minify');
var rename = require ('gulp-rename');
var cssmin = require ('gulp-cssmin');
var htmlmin = require ('gulp-htmlmin');

var sourcePaths = {
    sassSource: 'src/scss/*.scss',
    sassApp: 'src/scss/app.scss',
    htmlSource: 'src/*.html',
    htmlPartial: 'src/partial/*.html',
    jsSource: 'src/js/**',
    imgSource: 'src/images/**'
};

var appPaths = {
    root: 'app/',
    css: 'app/css/',
    js: 'app/js/',
    fonts: 'app/fonts',
    images: 'app/images/'
};

gulp.task('clean-html', function(){
    return gulp.src(appPaths.root + '*.html', {read: false, force: true})
    .pipe(clean());
});

gulp.task('clean-scripts', function(){
    return gulp.src(appPaths.js + '*.js', {read: false, force: true})
    .pipe(clean());
});

gulp.task('images', function(){
    return gulp.src(sourcePaths.imgSource)
    .pipe(newer(appPaths.images))
    .pipe(imagemin())
    .pipe(gulp.dest(appPaths.images));

});

gulp.task('sass', function(){
    sassFiles = gulp.src(sourcePaths.sassApp)
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(concat('app.css'))
    .pipe(gulp.dest(appPaths.css));
});

gulp.task('scripts', ['clean-scripts'], function(){
    gulp.src(sourcePaths.jsSource)
    .pipe(concat('main.js'))
    .pipe(browserify())
    .pipe(gulp.dest(appPaths.js))
});

/** Production Tasks **/

gulp.task('compress', function(){
    gulp.src(sourcePaths.jsSource)
    .pipe(concat('main.js'))
    .pipe(browserify())
    .pipe(minify())
    .pipe(gulp.dest(appPaths.js))
});

gulp.task('compresscss', function(){
    sassFiles = gulp.src(sourcePaths.sassSource)
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(concat('app.css'))
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(appPaths.css));
});

gulp.task('minifyhtml', function(){
    return gulp.src(sourcePaths.htmlSource)
    .pipe(injectPartials())
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(appPaths.root))
});

/** End of Production Tasks **/

gulp.task('html', function(){
    return gulp.src(sourcePaths.htmlSource)
    .pipe(injectPartials())
    .pipe(gulp.dest(appPaths.root))
});

gulp.task('serve', ['sass'], function(){
    browserSync.init([appPaths.css + '/*.css', appPaths.root + '/*.html', appPaths.js + '/*.js'],{
        server: {
            baseDir: appPaths.root
        }
    })
});

gulp.task('watch', ['serve', 'sass', 'clean-html', 'clean-scripts', 'scripts', 'html', 'images'], function(){
    gulp.watch([sourcePaths.sassSource], ['sass']);
    gulp.watch([sourcePaths.jsSource], ['scripts']);
    gulp.watch([sourcePaths.imgSource], ['images']);
    gulp.watch([sourcePaths.htmlSource, sourcePaths.htmlPartial], ['html']);
});

gulp.task('default', ['watch']);
gulp.task('production', ['minifyhtml', 'compresscss', 'compress', 'serve']);
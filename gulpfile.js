var gulp = require ('gulp');
var sass = require ('gulp-sass');
var browserSync = require ('browser-sync');
var reload = browserSync.reload;
var autoprefixer = require ('gulp-autoprefixer');
var clean = require ('gulp-clean');
var concat = require ('gulp-concat');
var browserify = require ('gulp-browserify');
var merge = require ('merge-stream');

var sourcePaths = {
    sassSource: 'src/scss/*.scss',
    htmlSource: 'src/*.html',
    jsSource: 'src/js/**'
};

var appPaths = {
    root: 'app/',
    css: 'app/css/',
    js: 'app/js/',
    fonts: 'app/fonts'
};

gulp.task('clean-html', function(){
    return gulp.src(appPaths.root + '*.html', {read: false, force: true})
    .pipe(clean());
});

gulp.task('clean-scripts', function(){
    return gulp.src(appPaths.js + '*.js', {read: false, force: true})
    .pipe(clean());
});

gulp.task('sass', function(){
    var bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
    var sassFiles;
    sassFiles = gulp.src(sourcePaths.sassSource)
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer())
    return merge( bootstrapCSS, sassFiles)
    .pipe(concat('app.css'))
    .pipe(gulp.dest(appPaths.css));
});

gulp.task('moveFonts', function(){
    gulp.src('./node_modules/bootstrap/dist/fonts/*.{eot,svg,ttf,woff,woff2}')
    .pipe(gulp.dest(appPaths.fonts))
});

gulp.task('scripts', ['clean-scripts'], function(){
    gulp.src(sourcePaths.jsSource)
    .pipe(concat('main.js'))
    .pipe(browserify())
    .pipe(gulp.dest(appPaths.js))
});

gulp.task('copy', ['clean-html'], function(){
    gulp.src(sourcePaths.htmlSource)
    .pipe(gulp.dest(appPaths.root))
});

gulp.task('serve', ['sass'], function(){
    browserSync.init([appPaths.css + '/*.css', appPaths.root + '/*.html', appPaths.js + '/*.js'],{
        server: {
            baseDir: appPaths.root
        }
    })
});

gulp.task('watch', ['serve', 'sass', 'copy', 'clean-html', 'clean-scripts', 'scripts', 'moveFonts'], function(){
    gulp.watch([sourcePaths.sassSource], ['sass']);
    gulp.watch([sourcePaths.htmlSource], ['copy']);
    gulp.watch([sourcePaths.jsSource], ['scripts']);
});

gulp.task('default', ['watch']);
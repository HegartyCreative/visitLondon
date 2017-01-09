var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var autoprefixer = require('gulp-autoprefixer');

var sourcePaths = {
    sassSource: 'src/scss/*.scss'
};

var appPaths = {
    root: 'app/',
    css: 'app/css/',
    js: 'app/js'
};


gulp.task('sass', function(){
    return gulp.src(sourcePaths.sassSource)
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest(appPaths.css));
});

gulp.task('watch', ['serve', 'sass'], function(){
    gulp.watch([sourcePaths.sassSource], ['sass'])
});

gulp.task('serve', ['sass'], function(){
    browserSync.init([appPaths.css + '/*.css', appPaths.root + '/*.html', appPaths.js + '/*.js'],{
        server: {
            baseDir: appPaths.root
        }
    })
});


gulp.task('default', ['watch']);
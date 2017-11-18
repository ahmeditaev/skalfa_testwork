var gulp = require('gulp'),
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    csscomb = require('gulp-csscomb'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload,
    plumber = require('gulp-plumber'),
    plumberNotifier = require('gulp-plumber-notifier');

// De-caching for Data files
function requireUncached( $module ) {
    delete require.cache[require.resolve( $module )];
    return require( $module );
}

gulp.task('style:build', function(){
    gulp.src('app/sass/style.sass')
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(prefix())
    .pipe(csscomb())
    .pipe(gulp.dest('app/css/'))
    .pipe(reload({stream: true}))
});

gulp.task('js:build', function(){
    gulp.src(['app/js/*.js', '!app/js/*min.js'])
        .pipe(plumber())
        .pipe(plumberNotifier())
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest('app/js'))
        .pipe(reload({stream: true}))
});

gulp.task('build', ['js:build', 'style:build']);

gulp.task('webserver', function (){
    browserSync({
        server: {
            baseDir: "app/"
        },
        port: 8080,
        open: true,
        notify: false
    });
});

gulp.task('watch', function(){
    gulp.watch('app/sass/**/*.sass', ['style:build']);
    gulp.watch('app/js/*.js', ['js:build']);
    gulp.watch("app/*.html").on('change', browserSync.reload);
});

gulp.task('default', ['build', 'webserver', 'watch']);
var gulp = require('gulp'),
  webserver = require('gulp-webserver'),
  stylus = require('gulp-stylus'),
  nib = require('nib'),
  minifyCSS = require('gulp-minify-css'),
  nodemon = require('nodemon'),
  livereload = require('gulp-livereload'),
  notify = require('gulp-notify');

var config = {
  styles: {
    main: './src/styles/main.styl',
    watch: './src/**/*.styl',
    output: './public/stylesheets'
  },
  jade: {
    watch: './views/**/*.jade'
  }
};

//Tarea de servicio web
gulp.task('server', function () {
  livereload.listen();
    nodemon({
      script: './app.js',
    ext: 'jade html js css www'
  }).on('restart', function () {  
    gulp.src('./app.js')
      .pipe(livereload())
      .pipe(notify('Recargando, espera...'))
      console.log('restarted!');
    })  
});

gulp.task('css', function(){
  gulp.src(config.styles.main)
    .pipe(stylus({
    use: nib(),
    'include css': true
  }))
  .pipe(minifyCSS())
  .pipe(gulp.dest(config.styles.output)); 
  console.log('Cambio en CSS.');
});

gulp.task('watch',function(){
  gulp.watch(config.styles.watch, ['css']);
});

gulp.task('build',['css']);

gulp.task('default',['server','watch','build']);
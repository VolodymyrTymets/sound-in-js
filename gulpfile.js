const gulp = require('gulp');
const run = require('gulp-run');
const nodemon = require('gulp-nodemon');

gulp.task('server', () => nodemon({
  script: './server/index.js',
  watch: ['./server']
}));

gulp.task('client', () =>
  gulp.src('./client', { cwd: __dirname })
     // !src not worked
    .pipe(run('cd client && npm run start'))
);

gulp.task('run:dev', gulp.parallel('client', 'server'));
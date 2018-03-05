const _ = require('lodash');
const path = require('path');
const gulp = require('gulp');
const { rollup } = require('rollup');
const { Server } = require('karma');

const rollupGenerator = require('./utils/rollup-generator');

const testConfig = rollupGenerator({
  format: 'iife',
  istanbul: true,
  output: path.join(__dirname, 'tests', 'coverage', 'index.js'),
});

const pkg = require('./package.json');

const productionConfig = rollupGenerator();

/* eslint import/no-extraneous-dependencies: 0 */

function rollupBundle(config) {
  return rollup(_.omit(config, 'output'));
}

gulp.task('pack:test', () => rollupBundle(testConfig)
  .then(bundle => bundle.write({
    format: 'umd',
    exports: 'default',
    name: '<%= functionName %>',
    extend: true,
    file: path.join(__dirname, 'tests', 'coverage', 'index.js'),
  })));

gulp.task('pack:cjs', () => rollupBundle(productionConfig)
  .then(bundle => bundle.write({
    format: 'cjs',
    exports: 'default',
    name: '<%= functionName %>',
    extend: true,
    file: path.join(__dirname, pkg.main),
  })));

gulp.task('pack:umd', () => rollupBundle(productionConfig)
  .then(bundle => bundle.write({
    format: 'umd',
    exports: 'default',
    name: '<%= functionName %>',
    extend: true,
    file: path.join(__dirname, pkg.browser),
  })));

gulp.task('pack:dist', ['pack:umd', 'pack:cjs']);

gulp.task('server', ['pack:test'], cb => new Server({
  configFile: `${__dirname}/karma.conf.js`,
  singleRun: false,
  autoWatch: true,
}, cb).start());

gulp.task('listener', () => gulp.watch('lib/**/*.js', ['pack:test']));
gulp.task('watch', ['server', 'listener']);
gulp.task('default', ['pack:test', 'pack:dist']);

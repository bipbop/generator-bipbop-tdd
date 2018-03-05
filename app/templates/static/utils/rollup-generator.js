const path = require('path');
const buble = require('rollup-plugin-buble');
const license = require('rollup-plugin-license');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const istanbul = require('rollup-plugin-istanbul');

const pkg = require('../package.json');

const external = Object.keys(pkg.dependencies).concat(Object.keys(pkg.devDependencies));

/* eslint import/no-extraneous-dependencies: 0 */
module.exports = function configuration(confs = {}) {
  const plugins = [
    commonjs(),
    resolve(),
    buble(),
    license({ banner: { file: path.join(__dirname, 'banner.txt') } }),
  ];

  if (confs.istanbul) {
    plugins.push(istanbul({ exclude: ['tests/**/*', 'node_modules/**/*'] }));
  }

  return {
    input: 'lib/index.js',
    plugins,
    external,
  };
};

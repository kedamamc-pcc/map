const cssimport = require('postcss-import');
const cssnext = require('postcss-cssnext');

module.exports = {
  plugins: [
    cssimport(),
    cssnext()
  ]
};

const autoprefixer = require('autoprefixer')({ browsers: ['IE 9'] });
const cssnano = require('cssnano');

module.exports = {
  map: false,
  plugins: [autoprefixer, cssnano]
};

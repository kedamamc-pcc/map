const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    style: './src/style/style.pcss'
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].css'
  },
  module: {
    rules: [
      {
        test: /\.p?css$/,
        use: ExtractTextPlugin.extract({
          use: 'postcss-loader'
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin(path.resolve(__dirname, 'build/style.css'))
  ]
};

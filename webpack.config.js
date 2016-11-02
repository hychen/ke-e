let webpack = require('webpack');
let fs = require('fs');

module.exports = {
  entry: './src/index.js',
  output: {
    path: './dist',
    filename: 'ke-e.js',
    library: 'ke',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
};

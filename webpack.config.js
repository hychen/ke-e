let webpack = require('webpack');
let fs = require('fs');

module.exports = {
  entry: './src/index.js',
  output: {
    path: './dist',
    filename: 'hycheck.js',
    library: 'hycheck',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  }
};

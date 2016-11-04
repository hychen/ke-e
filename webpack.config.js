let webpack = require('webpack');
let fs = require('fs');

const pkgInfo = JSON.parse(fs.readFileSync('./package.json'));

const metaInfo = [
  `Author: ${pkgInfo.author}`,
  `Homepage: ${pkgInfo.homepage}`,
  `License: ${pkgInfo.license}`
].join('\n');

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
  },
  plugins: [
    new webpack.BannerPlugin(metaInfo)
  ]
};

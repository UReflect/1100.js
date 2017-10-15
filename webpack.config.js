var webpack = require('webpack');
var path = require('path');

module.exports = {
  context: path.join(__dirname, ''),
  entry: './src/MC.js',
  output: {
    path: path.join(__dirname, 'lib'),
    filename: 'MC.js',
    library: 'MC',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    loaders: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    modules: [
      path.resolve('./src'),
      "node_modules"
    ]
  }
}

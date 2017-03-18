var webpack = require('webpack');
var path = require('path');

module.exports = {
  context: path.join(__dirname, ''),
  entry: './src/milcen.js',
  output: {
    path: path.join(__dirname, 'lib'),
    filename: 'milcen.js',
    library: 'Milcen',
    //libraryTarget: 'umd',
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
    modules: [path.resolve('./src')]
  }
}

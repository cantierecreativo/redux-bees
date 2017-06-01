const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: {
    bundle: './example/index.js'
  },
  resolve: {
    modules: [path.resolve(__dirname, 'app'), 'node_modules'],
    extensions: ['.js', '.jsx', '.json']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist/dist'),
    publicPath: '/dist'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          'babel-loader',
        ]
      },
    ],
  },
  devServer: {
    historyApiFallback: true
  },
  devtool: (
    process.env.NODE_ENV === 'production' ?
      'source-map' : 'inline-source-map'
  ),
};

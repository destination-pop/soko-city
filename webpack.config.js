'use strict';

const webpack = require('webpack');
const path = require('path');
require('dotenv').config({path: __dirname + '/.env'})

const {
  NODE_ENV: mode
} = process.env

const devServer = {
  contentBase: './public',
  open: true
}

module.exports = {

  mode,

  devServer,

  entry: './src/index.js',

  output: {
    path: path.resolve(__dirname, 'public'),
    publicPath: '/public/',
    filename: 'bundle.js'
  },

  resolve: {
    extensions: ['.js', '.jsx']
  },

  devtool: 'source-map',

  watchOptions: {
    ignored: /node_modules/
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }

};
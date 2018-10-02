const path = require('path');

module.exports = {
  target: 'node',
  resolve: {
    extensions: ['.js']
  },
  externals: {
    redis: 'commonjs redis',
    'redis-commands': 'commonjs redis-commands',
    'redis-parser': 'commonjs redis-parser'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};

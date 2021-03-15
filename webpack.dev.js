// eslint-disable-next-line import/no-extraneous-dependencies
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

// @ts-ignore
const config = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    historyApiFallback: true,
    port: 3000,
    disableHostCheck: true,
  },
})

module.exports = config

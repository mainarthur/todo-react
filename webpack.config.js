const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')

const config = {
  entry: ['./src/index.tsx'],
  output: {
    path: path.resolve(__dirname, 'static/build'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  devServer: {
    historyApiFallback: true,
    port: 3000,
    disableHostCheck: true,
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: path.resolve(__dirname, 'static/index.html'),
      filename: 'index.html',
    }),
  ],
}

module.exports = config

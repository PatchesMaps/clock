const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  target: 'web',

  entry: [path.resolve(__dirname, 'index.js')],
  output: {
    path: path.resolve(__dirname, '../', 'build'),
    filename: 'bundle.js',
    // Include comments in bundles with information about the contained modules.
    // DO NOT USE in production!!
    pathinfo: true
  },

  // A SourceMap without column-mappings that simplifies loaded Source Maps to a
  // single mapping per line. Original source (lines only)
  devtool: 'cheap-module-source-map',

  plugins: [
    // Injects path.appSrc into public/index.html
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, 'index.html'),
      // favicon: path.resolve(__dirname, 'favicon.ico'),
    }),

    // Do not emit compiled assets that include errors
    new webpack.NoEmitOnErrorsPlugin()
  ],

  devServer: {
    port: 2020,
    clientLogLevel: 'none',
    publicPath: path.resolve('/'),
    contentBase: path.resolve(__dirname, '../', 'build'),
    historyApiFallback: true
  }
}

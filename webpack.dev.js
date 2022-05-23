const webpack = require("webpack");
const path = require("path");
const webpackConfig = require("./webpack.config.js");
// 22.合并配置
const { merge } = require("webpack-merge");

module.exports = merge(webpackConfig, {
  mode: "development",
  devtool: "eval-cheap-module-source-map",
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    compress: true,
    port: 9000,
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
});

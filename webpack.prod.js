const webpack = require("webpack");
const webpackConfig = require("./webpack.config.js");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

// 22.合并配置
const { merge } = require("webpack-merge");

module.exports = merge(webpackConfig, {
  mode: "production",
  devtool: "cheap-module-source-map",
  plugins: [new BundleAnalyzerPlugin()],
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
});

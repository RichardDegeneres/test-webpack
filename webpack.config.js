// 3. 使用 webpack 插件，需要引入 webpack 包
const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// 10. 仅 webpack5 支持该插件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// // 21. 打包分析工具
// const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = {
  // 1. 设置模式 production | development | none
  // mode: "production",

  // 2. 配置 source-map 生成规则
  // devtool: false,

  // 3. 多入口文件配置
  entry: {
    home: path.resolve(__dirname, "src/home.js"),
    contact: path.resolve(__dirname, "src/contact.js"),
  },

  // 4. 生成文件(缓存)
  // path.resolve(__dirname, filename) __dirname 获取当前模块所在目录的绝对路径
  output: {
    filename: "[name].[contenthash].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },

  plugins: [
    // 2. 配置 source-map 生成规则
    // 11. 🤔？：引入 MiniCssExtractPlugin 插件后，一个 js 会有两份 map， 一个聚合内联样式，一个则是导入css外部文件链接
    new webpack.SourceMapDevToolPlugin({
      filename: "[name].[contenthash].js.map",
      exclude: ["vendor.js"],
    }),

    // 5. 设置应用入口 html 引入动态名 bundle 文件
    new HtmlWebpackPlugin({
      title: "html 应用 home",
      filename: "home.html",
      template: path.resolve(__dirname, "index.html"),
      chunks: ["home"],
    }),

    // 6. 生成多 html 文件，引入相应的动态名 bundle 文件
    new HtmlWebpackPlugin({
      title: "html 应用 contact",
      filename: "contact.html",
      template: path.resolve(__dirname, "index.html"),
      chunks: ["contact"],
      // 16. 设置网站图标
      favicon: path.resolve(__dirname, "favicon.jpg"),
    }),

    // 7. 每次生成新 dist 打包文件时，清除上次的文件
    new CleanWebpackPlugin(),

    // 10. 将每个js文件引入的 css 单独抽离一个外部 css 文件
    // webpack5官方文档 有三种输出文件名类型 [name] chunk name,[id] chunk id, [contenthash]内容哈希值
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
      chunkFilename: "[id].css",
    }),

    // 17. 热更新
    // new webpack.HotModuleReplacementPlugin(),

    // // 21. 打包分析工具
    // new BundleAnalyzerPlugin(),
  ],

  module: {
    rules: [
      // 8. 引入 css 文件 & postcss.config.js 浏览器前缀插件 autoprefixer
      {
        test: /\.css$/i,
        // 从右向左解析
        use: [
          // (3) style loader 是将 css 文件打包注入到 html 的 style 标签
          "style-loader",
          // (2) 加载 css 文件
          { loader: "css-loader", options: { modules: true } },
          // (1) 添加浏览器供应商前缀
          "postcss-loader",
        ],
      },
      // 8. 引入 less 文件
      {
        test: /\.less$/i,
        // 从右向左解析
        use: [
          // (4) MiniCssExtractPlugin loader: 将每个js文件引入的 css 单独抽离一个外部 css 文件
          // 和 style-loader 不能同时使用，功能不同
          MiniCssExtractPlugin.loader,
          // (3) 加载 css 文件
          { loader: "css-loader", options: { modules: true } },
          // (2) 添加浏览器供应商前缀
          "postcss-loader",
          // (1) 将 less 解析为 css
          "less-loader",
        ],
      },
      // 12. 打包图片
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            // 将图片打包成 base64
            loader: "url-loader",
            options: {
              limit: 8192,
              // 超出限制使用 file-loader
              fallback: {
                loader: "file-loader",
                options: {
                  name: "[contenthash].[ext]",
                },
              },
            },
          },
        ],
      },

      // 13. 转译 js 文件, 13 和 14 不能同时配置
      // {
      //   test: /\.m?js/i,
      //   exclude: /node_modules/,
      //   use: {
      //     loader: "babel-loader",
      //     options: {
      //       presets: [["@babel/preset-env", { targets: "default" }]],
      //     },
      //   },
      // },

      // 14. 配置解析 React jsx 文件
      {
        test: /\.jsx?/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            babelrc: true,
          },
        },
      },
    ],
  },

  // 15. 配置本地开发环境服务器环境，实时重新加载
  // devServer: {
  //   static: {
  //     directory: path.resolve(__dirname, "dist"),
  //   },
  //   hot: true,
  //   compress: true,
  //   port: 9000,
  // },

  // // 20. code-splitting 之 splitChunksPlugin
  // optimization: {
  //   splitChunks: {
  //     chunks: "all",
  //   },
  // },

  // 22. 关闭入口文件打包体积超过 244kb 的提示
  performance: {
    hints: false,
  },
};

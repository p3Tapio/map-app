const webpack = require("webpack");
const path = require("path");
require('dotenv').config();
const HtmlWebpackPlugin = require("html-webpack-plugin");
const environment = process.env.NODE_ENV;
const isDev = environment !== "production";

module.exports = {
  ...(isDev ? { devtool: "eval-source-map" } : {}),
  entry: {
    index: "./src/index.tsx",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    modules: ["node_modules", path.join(__dirname, "src")],
  },
  output: {
    filename: "[name].js",
    chunkFilename: "[name].chunk.js",
    assetModuleFilename: "assets/[name].[contenthash][ext][query]",
    path: path.join(__dirname, "build"),
  },
  module: {
    rules: [
      {
        test: /\.(tsx?|jsx?)$/,
        loader: "ts-loader",
        options: {
          transpileOnly: true,
        },
        exclude: /build/,
      },
      {
        test: /.*\.(gif|png|jpe?g|svg|ico)$/i,
        use: [
          {
            loader: "url-loader",
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  devServer: {
    port: 3000,
    open: true,
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new webpack.EnvironmentPlugin({
      APP_URL: process.env.APP_URL,
      MAPBOX_TOKEN: process.env.MAPBOX_TOKEN,
    }),
  ],
};

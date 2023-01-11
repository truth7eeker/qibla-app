const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: "./src/index.js",

  output: {
    path: path.join(__dirname, "/build"),
    filename: "bundle.js",
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new Dotenv()
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.png|svg|jpg|gif$/,
        use: ["file-loader"],
      },
    ],
  },
};
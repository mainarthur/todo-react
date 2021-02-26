var path = require("path");

var config = {
  entry: ["./src/index.tsx"],
  output: {
    path: path.resolve(__dirname, "static/build"),
    filename: "bundle.js"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  }
};

module.exports = config;
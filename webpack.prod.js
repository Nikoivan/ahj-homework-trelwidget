const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  optimization: {
    minimizer: [new CssMinimizerPlugin()],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: "licenses", to: "licenses" }],
    }),
  ],
});

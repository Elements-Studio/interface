/* eslint-disable @typescript-eslint/no-var-requires */
const { VanillaExtractPlugin } = require('@vanilla-extract/webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { DefinePlugin } = require('webpack')

const commitHash = require('child_process').execSync('git rev-parse HEAD')

module.exports = {
  babel: {
    plugins: ['@vanilla-extract/babel-plugin'],
  },
  webpack: {
    plugins: [
      new VanillaExtractPlugin(),
      new DefinePlugin({
        'process.env.REACT_APP_GIT_COMMIT_HASH': JSON.stringify(commitHash.toString()),
      }),
    ],
    configure: (webpackConfig) => {
      const instanceOfMiniCssExtractPlugin = webpackConfig.plugins.find(
        (plugin) => plugin instanceof MiniCssExtractPlugin
      )
      if (instanceOfMiniCssExtractPlugin !== undefined) { instanceOfMiniCssExtractPlugin.options.ignoreOrder = true }
      // fix: Can't import the named export 'bytesToHex' from non EcmaScript module (only default export is available) 
      // https://github.com/aptos-labs/aptos-core/issues/4601
      webpackConfig.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto"
      });
      return webpackConfig
    },
  },
}

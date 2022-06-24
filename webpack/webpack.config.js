/*
 * @Author: SongQian
 * @LastEditors: SongQian
 * @Date: 2022/06/24 13:25
 * @eMail: onlylove117225594632vip.qq.com
 * @Description: webpack.config 入口配置
 */

const { merge } = require('webpack-merge')
const miniCssExtractPlugin = require('mini-css-extract-plugin')
const entry = require("./entry")
const output = require("./output")
const rules = require("./rules")
const resolve = require("./resolve")
const optimization = require("./optimization")
const plugins = require("./plugins")

module.exports = merge({}, {
  entry,
  output,
  module: {
    rules: [
      ...rules(miniCssExtractPlugin)
    ]
  },
  resolve,
  optimization,
  mode: 'production',
  plugins: [
    new miniCssExtractPlugin({
      filename: 'examples/assets/css/[name].css',
      chunkFilename: 'examples/assets/css/[name].[contenthash:8].css',
    }),
    ...plugins()
  ],
  performance: {
    hints: process.env.NODE_ENV === 'production' ? false : false
  },
  //生产时，请将此处的devtool改成false
  devtool: process.env.NODE_ENV === 'production' ? false : "source-map"
})
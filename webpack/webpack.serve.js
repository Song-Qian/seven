/*
 * @Author: @skysong
 * @Date: 2022-12-02 10:46:36
 * @LastEditors: @skysong
 * @LastEditTime: 2023-02-14 10:31:46
 * @FilePath: /seven/webpack/webpack.serve.js
 * @Description: webpack serve 代理服务器
 * @eMail: songqian6110@dingtalk.com
 */

const { merge } = require('webpack-merge')
const devServer = require('./devServer')
const webpackConfig = require('./webpack.examples')

module.exports = merge(webpackConfig, {
    mode: 'development',
    devServer
})
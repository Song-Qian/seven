/*
 * @Author: SongQian
 * @LastEditors: @skysong
 * @Date: 2022/06/24 10:36
 * @eMail: onlylove117225594632vip.qq.com
 * @Description: Demo 生产入口
 */
const { merge } = require('webpack-merge')
const path = require('path')
const webpackConfig = require("./webpack.config")
const htmlPlugin = require('html-webpack-plugin');

module.exports = merge(webpackConfig, {
    entry : {
        'index' : path.join(__dirname, '../', 'src/index.tsx')
    },
    output: {
        'path' : path.resolve(__dirname, '../', 'docs'),
        'publicPath': './',
        'filename': 'examples/[name].[hash:8].js'
    },
    mode: 'production',
    plugins: [
        new htmlPlugin({
            title : 'Seven',
            filename : path.join(__dirname, '../', 'docs/index.html'),
            template : path.resolve(__dirname, '../', 'index.html'),
            favicon : false,
            chunks : ['index']
        })
    ]
})
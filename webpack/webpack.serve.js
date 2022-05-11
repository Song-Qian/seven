/**
 * Developer    :   SongQian
 * Time         :   2021/12/08
 * eMail        :   onlylove1172559463@vip.qq.com
 * Description  :   webpack serve 代理服务器
 */

const { merge } = require('webpack-merge')
const devServer = require('./devServer')
const webpackConfig = require('./webpack.examples')

module.exports = merge(webpackConfig, {
    devServer
})
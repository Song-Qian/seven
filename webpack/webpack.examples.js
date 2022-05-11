/**
 * Developer    :   SongQian
 * Time         :   2019/03/09
 * eMail        :   onlylove1172559463@vip.qq.com
 * Description  :  Demo 生产入口
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
        'path' : path.resolve(__dirname, '../', 'dist'),
        filename:  'examples/[name].[hash:8].js',
    },
    plugins: [
        new htmlPlugin({
            title : 'Seven',
            filename : path.join(__dirname, '../', 'dist/index.html'),
            template : path.resolve(__dirname, '../', 'index.html'),
            favicon : false,
            chunks : ['index']
        })
    ]
})
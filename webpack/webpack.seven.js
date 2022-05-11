/**
 * Developer    :   SongQian
 * Time         :   2019/03/09
 * eMail        :   onlylove1172559463@vip.qq.com
 * Description  :  core 生产入口
 */
 const { merge } = require('webpack-merge')
 const path = require('path')
 const webpackConfig = require("./webpack.config")
 
 module.exports = merge(webpackConfig, {
     entry : {
        'seven' : path.join(__dirname, '../', 'src/seven/index')
     },
     output: {
         'path' : path.resolve(__dirname, '../', 'dist/cjs'),
         filename:  process.env.NODE_ENV === 'production' ? './[name].prod.js' : './[name].js',
     },
     performance: {
       hints: false
     },
     devtool: false
 })
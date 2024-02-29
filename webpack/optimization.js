/*
 * @Author: SongQian
 * @LastEditors: SongQian
 * @Date: 2022/06/23 16:53
 * @eMail: onlylove117225594632vip.qq.com
 * @Description: 提取公共脚本
 */

const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
   minimize : process.env.NODE_ENV === 'production',
   minimizer : process.env.NODE_ENV === 'production' ? [
       new TerserPlugin({
           test: /\.(js|jsx|ts|tsx)$/i,
           exclude :  [/[\\/]node_modules[\\/]/, /(\.d)\.(tsx?)/], //要排除的文件。
           parallel : true,  //使用多进程并行运行可提高构建速度。
           extractComments : false, //启用/禁用提取注释。提取all或some（使用/^\**!|@preserve|@license|@cc_on/iRegExp）注释。
           terserOptions : {
               ecma : true, 
               warnings: true, //传递true以在中返回压缩机警告result.warnings。使用该值可"verbose"获取更详细的警告。
               sourceMap : false, 
               ie8 : false, //-设置true为支持IE8。
               keep_classnames: true, //通过true以防止丢弃或破坏类名。传递正则表达式以仅保留与该正则表达式匹配的类名
               keep_fnames: true, //传递true以防止丢弃或破坏函数名。传递正则表达式以仅保留与该正则表达式匹配的类名
               safari10 : true, //通过true此选项可解决循环作用域和中的Safari 10/11错误await
               output: {
                   comments: /@license/i,
               }
           }
       })
   ] : [],
   splitChunks: {
       chunks : 'all',
       minSize : 20480,
       minChunks : 1,
       maxAsyncRequests : 50,
       maxInitialRequests : 50
   }
}
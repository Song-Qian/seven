/*
 * @Author: SongQian
 * @LastEditors: SongQian
 * @Date: 2022/06/24 13:45
 * @eMail: onlylove117225594632vip.qq.com
 * @Description: 生产依赖插件配置
 */

const webpack = require('webpack')
const path = require('path')

module.exports = function() {

    let bannerPlugin = new webpack.BannerPlugin({
        banner : `Developer :   SongQian
Time    :   2022-04-01
eMail   :   onlylove1172559463@vip.qq.com
Description :  Seven`,
        raw : false,
        entryOnly : false,
        test : /\.(ts|tsx|js)/,
        exclude : /node_modules/
    });
    
    // if(process.env.NODE_ENV === 'production') {
    //     definePlugin = new webpack.DefinePlugin({
    //         'process.env': {
    //           NODE_ENV: '"production"'
    //         }
    //     });
    // }

    return [
        bannerPlugin
    ]
}
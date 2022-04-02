/**
 * Developer    :   SongQian
 * Time         :   2019/03/09
 * eMail        :   onlylove1172559463@vip.qq.com
 * Description  :   生产依赖插件配置
 */
const htmlPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = function() {
    let htmlPlugins = new htmlPlugin({
        title : 'cobweb',
        filename : 'index.html',
        template : path.resolve(__dirname, '../', 'index.html'),
        favicon : false,
        chunks : ['index']
    });

    let bannerPlugin = new webpack.BannerPlugin({
        banner : `Developer :   SongQian
Time    :   2021-12-08
eMail   :   onlylove1172559463@vip.qq.com
Description :  Cobweb`,
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
        htmlPlugins,
        bannerPlugin
    ]
}
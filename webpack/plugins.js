/**
 * Developer    :   SongQian
 * Time         :   2019/03/09
 * eMail        :   onlylove1172559463@vip.qq.com
 * Description  :   生产依赖插件配置
 */
const htmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack');
const path = require('path');

module.exports = function() {
    let htmlPlugins = new htmlPlugin({
        title : 'Vue 3.0 TSX',
        filename : 'index.html',
        template : path.resolve(__dirname, '../', 'index.html'),
        favicon : false,
        chunks : ['vue', 'app']
    });

    let bannerPlugin = new webpack.BannerPlugin({
        banner : `Developer :   SongQian
Time    :   2021-12-08
eMail   :   onlylove1172559463@vip.qq.com
Description : Vue 3.0 TSX for Developer@SongQian`,
        raw : false,
        entryOnly : false,
        test : /\.(ts|tsx|js)/,
        exclude : /node_modules/
    });
    
    let miniCssExtractPlugin = new MiniCssExtractPlugin({
        filename: './assets/css/[name].css',
        chunkFilename: './assets/css/[name].[hash:8].css'
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
        bannerPlugin,
        miniCssExtractPlugin
    ]
}
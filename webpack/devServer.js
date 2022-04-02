/**
 * Developer    :   SongQian
 * Time         :   2019/03/09
 * eMail        :   onlylove1172559463@vip.qq.com
 * Description  :   生产依赖插件配置
 */

const { join } = require('path')

module.exports = {
    static: {
        directory: join(__dirname, '../dist'),
    },
    compress: true,
    historyApiFallback : true
}
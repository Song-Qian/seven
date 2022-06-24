/*
 * @Author: SongQian
 * @LastEditors: SongQian
 * @Date: 2022/06/24 13:50
 * @eMail: onlylove117225594632vip.qq.com
 * @Description: 路径语法糖配置
 */

var path = require("path")

module.exports =  {
    extensions : ['.js', '.ts', '.tsx', '.json', '.sass', '.scss'],
    alias: {
        '~' : path.join(__dirname, '../', 'src')
    }
}
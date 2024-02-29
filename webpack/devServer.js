/*
 * @Author: @skysong
 * @Date: 2022-12-02 10:46:36
 * @LastEditors: @skysong
 * @LastEditTime: 2023-02-14 10:31:14
 * @FilePath: /seven/webpack/devServer.js
 * @Description: 生产依赖插件配置~!
 * @eMail: songqian6110@dingtalk.com
 */
const { join } = require('path')

module.exports = {
    static: {
        directory: join(__dirname, '../docs'),
    },
    compress: true,
    historyApiFallback : true
}
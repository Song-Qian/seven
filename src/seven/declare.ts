/*
 * @Author: SongQian
 * @Date: 2022-04-26 16:54:58
 * @Description:  基础数据结构类型申明文件
 * @eMail: onlylove1172559463@vip.qq.com
 */

/**
 * @Author: SongQian
 * @description: 点
 */
export type Point = { x: number, y: number}

/**
 * @Author: SongQian
 * @description: 弧
 */
 export type Arc = {
    points : Readonly<Array<Point>>
}

/**
 * @Author: SongQian
 * @description: 圆
 */
export type Circle = {
    points : Readonly<Array<Point>>
}
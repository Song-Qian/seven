/*
 * @Author: SongQian
 * @Date: 2022-04-26 17:05:37
 * @Description: file written by SongQian developers 
 * @eMail: onlylove1172559463@vip.qq.com
 */
import { Circle, Point } from "./declare"
import { AnyAnglePoint } from "./point"

/**
 * @Author: SongQian
 * @description:  获取一个圆上所有点
 * @param {Point} 圆心
 * @param {number} 半径
 * @param {number} 圆上点数量
 * @return {*} 返回一个圆的点坐标对象
 */
export const GenerateCircle = function(o : Point, radius: number, size : number = 100) : Circle {
    const points = new Array(size).fill(360 / size).map((v, i) => AnyAnglePoint(o, v * i, radius));
    return { points }
}
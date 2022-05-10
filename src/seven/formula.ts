/*
 * @Author: SongQian
 * @LastEditors: SongQian
 * @Date: 2022/05/07 14:14
 * @eMail: onlylove1172559463@vip.qq.com
 * @Description: 海伦公式、三角函数、勾股定理
 */
import { Point } from "./declare"
/**
 * @LastEditors: SongQian
 * @Author: SongQian
 * @Date: 2022/05/07 14:35
 * @description: 已知斜边和底边长度，计算直角三角的高
 * @param {number} 斜边
 * @param {number} 底边
 * @return {*} 返回三角的高
 */
export const calcTriangleHeight = (hypotenuse : number, floor : number) : number => {
    return Math.sqrt(hypotenuse * hypotenuse - floor * floor);
}

/**
 * @LastEditors: SongQian
 * @Author: SongQian
 * @Date: 2022/05/07 14:38
 * @description: 计算三角的底边
 * @param {number} 斜边
 * @param {number} 高
 * @return {*} 返回三角的底边长
 */
export const calcTriangleFloor = (hypotenuse : number, height : number) : number => {
    return Math.sqrt(hypotenuse * hypotenuse - height * height) * 2;
}

/**
 * @LastEditors: SongQian
 * @Author: SongQian
 * @Date: 2022/05/07 14:42
 * @description: 已知直角三角形底边和高，求斜边长度
 * @param {number} 底边
 * @param {number} 高
 * @return {*}
 */
export const calcTriangleHypotenuse = (floor: number, height : number) : number => {
    const a = floor / 2;
    return Math.sqrt(a * a + height * height);
}

/**
 * @LastEditors: SongQian
 * @Author: SongQian
 * @Date: 2022/05/07 14:50
 * @description: 已知三条边长，求面积
 * @param {number} 边a
 * @param {number} 边b
 * @param {number} 边c
 * @return {*} 返回三角形面积
 */
export const calcTriangleArea = (a : number, b : number, c : number) : number => {
    const p = (a + b + c) / 2;
    return Math.sqrt(p * (p - a) * (p - b) * (p - c));
}

/**
 * @LastEditors: SongQian
 * @Author: SongQian
 * @Date: 2022/05/07 16:00
 * @description: 计算平面坐标不规则多边形面积
 * @param {array} 多边的点坐标,坐标需要有闭合.
 * @return {*} 返回任意多边形面积
 */
export const calcMultilateralArea = (...args : Array<Point>) : number => {
    if (args.length < 3) {
        return 0;
    }
    let sum = 0;
    for (let i = 1; i < args.length; i++) {
        sum += args[i - 1].x * args[i].y - args[i].x * args[i - 1].y;
    }
    return 0.5 * sum;
}
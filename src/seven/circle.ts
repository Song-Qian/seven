/*
 * @Author: SongQian
 * @Date: 2022-04-26 17:05:37
 * @Description: 圆特性算法
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
 * @return {*} 返回一个圆的Geometry对象
 */
export const GenerateCircle = function(o : Point, radius: number, size : number = 100) : Circle {
    const points = new Array(size).fill(360 / size).map((v, i) => AnyAnglePoint(o, v * i, radius));
    return { points }
}

/**
 * @LastEditors: SongQian
 * @Author: SongQian
 * @Date: 2022/04/28 11:57
 * @description: 获取一个对称椭圆
 * @param {Point} 圆心
 * @param {number} 长半轴
 * @param {number} 短半轴
 * @param {number} 椭圆上点数量
 * @return {*} 返回一个椭圆的Geometry对象
 */
export const GenerateEllipse = function(o : Point, laxis : number, saxis : number, size : number = 100) : Circle {
    const points = new Array(size).fill(360 / size).map((v, i) =>  EllipseAnyAngleXY(o, laxis, saxis, v * i));
    return { points }
}

/**
 * @LastEditors: SongQian
 * @Author: SongQian
 * @Date: 2022/04/28 14:04
 * @description: 获取椭圆上任意角度点位置
 * @param {Point} 圆心
 * @param {number} 长半轴
 * @param {number} 短半轴
 * @param {number} 椭圆上点数量
 * @return {*} 返回一个椭圆的Geometry对象
 */
export const EllipseAnyAngleXY = function(o : Point, laxis : number, saxis : number, angle : number) : Point {
    //P((ab*cost)/√[(b*cost)^2+(a*sint)^2]，(ab*sint)/√[(b*cost)^2+(a*sint)^2])
    angle = angle * (Math.PI / 180);
    return {
        x : o.x + (laxis * saxis * Math.cos(angle)) / Math.sqrt(Math.pow((saxis * Math.cos(angle)), 2) + Math.pow((laxis * Math.sin(angle)), 2)),
        y : o.y + (laxis * saxis * Math.sin(angle)) / Math.sqrt(Math.pow((saxis * Math.cos(angle)), 2) + Math.pow((laxis * Math.sin(angle)), 2))
    }
}
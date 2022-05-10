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
export const GenerateCircle = (o : Point, radius: number, size : number = 100) : Circle => {
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
export const GenerateEllipse = (o : Point, laxis : number, saxis : number, size : number = 100, ratate : number = 0) : Circle => {
    const points = new Array(size).fill(360 / size).map((v, i) =>  EllipseAnyAngleXY(o, laxis, saxis, v * i, ratate));
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
export const EllipseAnyAngleXY = (o : Point, laxis : number, saxis : number, angle : number, rotate : number = 0) : Point => {
    angle = angle * (Math.PI / 180);
    rotate = rotate * (Math.PI / 180);
    //P((ab*cosφ)/√[(b*cosφ)^2+(a*sinφ)^2]，(ab*sinφ)/√[(b*cosφ)^2+(a*sinφ)^2])
    let p = {
        x : (laxis * saxis * Math.cos(angle)) / Math.sqrt(Math.pow((saxis * Math.cos(angle)), 2) + Math.pow((laxis * Math.sin(angle)), 2)),
        y : (laxis * saxis * Math.sin(angle)) / Math.sqrt(Math.pow((saxis * Math.cos(angle)), 2) + Math.pow((laxis * Math.sin(angle)), 2))
    }
    //x′=x cos φ-y(b/a)sin φ，y′=x·(a/b)sin φ+ycos φ ??? 三维变换公式 ?
    //x′=x cos φ-ysin φ，y′=xsin φ+ycos φ 平面旋转
    return {
        x : o.x + p.x * Math.cos(rotate)  - p.y * Math.sin(rotate),
        y : o.y + p.x * Math.sin(rotate) + p.y * Math.cos(rotate)
    }
}
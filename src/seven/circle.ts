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

/**
 * @LastEditors: SongQian
 * @Author: SongQian
 * @Date: 2022/05/11 15:27
 * @description: 获取椭圆的离心率
 * @param {number} 短半轴
 * @param {number} 长半轴
 * @return {*} 返回椭圆离心率
 */
export const EllipseEccentricity = (saxis : number, laxis : number) : number => {
    [saxis, laxis] = laxis < saxis ? [laxis, saxis] : [saxis, laxis];
    return Math.sqrt(1 - (saxis * saxis) / (laxis * laxis));
}

/**
 * @LastEditors: SongQian
 * @Author: SongQian
 * @Date: 2022/05/11 16:10
 * @description: 获取椭圆的焦点 
 * @param {Point} 圆心
 * @param {number} 短半轴
 * @param {number} 长半轴
 * @param {number} 转旋角度(顺时针)
 * @return {*} 返回椭圆焦点
 */
export const EllipseFocus = (o : Point, saxis : number, laxis: number, rotate: number = 0) : [Point, Point] => {
    // a > b > 0, a > c > 0;
    //椭圆焦点距离公式: c ^ 2 = a ^ 2 - b ^ 2; 
    [saxis, laxis] = laxis < saxis ? [laxis, saxis] : [saxis, laxis];
    let c = Math.sqrt(Math.pow(laxis, 2) - Math.pow(saxis, 2));
    return [
        { x : o.x + c *  Math.cos(rotate * Math.PI / 180), y : o.y + c * Math.sin(rotate * Math.PI / 180) },
        { x : o.x - c *  Math.cos(rotate * Math.PI / 180), y : o.y + c * Math.sin((rotate + 180) * Math.PI / 180) }
    ]
}

/**
 * @LastEditors: SongQian
 * @Author: SongQian
 * @Date: 2022/05/11 17:55
 * @description: 椭圆焦点的通径长度
 * @param {number} 短半轴
 * @param {number} 长半轴
 * @return {*} 返回通径长度
 */
export const EllipseFocusShortStrings = (o : Point, saxis : number, laxis : number, isRight : boolean = true) : [Point, Point, number] => {
    // a > b > 0, a > c > 0;
    // c ^ 2 = a ^ 2 - b ^ 2; 
    // 令x = c, x = -c, 则y1 = (x, b ^ 2 / a) y2 = (x, -b ^ 2 / a)或者y1 = (-x, b ^ 2 / a) y2 = (-x, -b ^ 2 / a)
    // 通径距离为: 2b^2 / a
    [saxis, laxis] = laxis < saxis ? [laxis, saxis] : [saxis, laxis];
    let c = Math.sqrt(Math.pow(laxis, 2) - Math.pow(saxis, 2));
    return [
        { x : isRight ? o.x + c : o.x - c, y : o.y + Math.pow(saxis, 2) / laxis },
        { x : isRight ? o.x + c : o.x - c, y : o.y + -(Math.pow(saxis, 2) / laxis) },
        Math.pow(2 * saxis, 2) / laxis
    ]
}
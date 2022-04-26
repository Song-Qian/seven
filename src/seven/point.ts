/*
 * @Author: SongQian
 * @Date: 2022-04-06 17:07:15
 * @Description: 点算法
 * @eMail: onlylove1172559463@vip.qq.com
 */
import { Point, Circle } from './declare'

/**
 * @Author: SongQian
 * @description: 获取点的对称点位置
 * @param {Point} 当前点位置
 * @param {Point} 原点位置
 * @param {string} 对称方向，h 水平对称,  v 垂直对称
 * @return {*} 对称点
 */
export const SymmetryPoint = function(p : Point, o : Point = { x : 0, y : 0 }, direction : string = 'h' ) :  Point {
    if (direction === 'h') {
        return { x : p.x, y : o.y - (p.y - o.y) }
    } 
    return { x : o.x - (p.x - o.x), y : p.y}
}

/**
 * @Author: SongQian
 * @description: 获取点对称角位置
 * @param {Point} 当前点
 * @param {Point} 圆心点
 * @return {*} 返回夹角对称点位置
 */
export const SymmetryAnglePoint = function(p : Point, o : Point = { x : 0, y : 0 }) : Point {
    let dist = Distance(p, o);
    let clockwise = ClockwiseAngle(p, o);
    let angle = (clockwise + 180) % 360;
    return AnyAnglePoint(o, angle, dist);
}

/**
 * @Author: SongQian
 * @description: 获取点任意角度位置
 * @param {Point} 原点
 * @param {number} 角度
 * @param {number} 半径
 * @return {*} 圆角度上的任意点位置
 */
export const  AnyAnglePoint = function(p : Point, angle : number, r : number, counterclockwise: boolean = false) {
    angle = counterclockwise ? -angle : angle;
    const x = p.x + r * Math.cos(angle * Math.PI / 180);
    const y = p.y + r * Math.sin(angle * Math.PI / 180);
    return { x, y };
} 

/**
 * @Author: SongQian
 * @description: 获取两点的距离
 * @param {Point} A 点
 * @param {Point} B 点
 * @return {*} 两点之间的距离
 */
export const Distance = function(a : Point, b : Point)  : number {
    return Math.sqrt((b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y));
}

/**
 * @Author: SongQian
 * @description: 获取两点的之间的角度
 * @param {Point} 测量角的点
 * @param {Point} 圆点
 * @return {*} 两点形成的角度，0 & 180度位于水平线右侧顺时针至左侧水平线, 0 & -180 度位于水平线右侧逆时针至左侧水平线
 */
export const  Angle = function(a : Point, b : Point) : number {
    return Math.atan2((a.y - b.y), (a.x - b.x)) / (Math.PI / 180);
}

/**
 * @Author: SongQian
 * @description: 获取两点顺时针之间的角度
 * @param {Point} 测量角的点
 * @param {Point} 圆点
 * @return {*} 两点形成的角度 value = 0 ~ 359.999...
 */
export const ClockwiseAngle = function(a: Point, b: Point) : number {
    return (360 + Angle(a, b)) % 360;
}

/**
 * @Author: SongQian
 * @description: 获取两点逆时针之间的角度
 * @param {Point} 测量角的点
 * @param {Point} 圆点
 * @return {*} 两点形成的角度过value = 0 ~ 359.999...
 */
export const  CounterclockwiseAngle = function(a : Point, b: Point) : number {
    const angle = Math.atan2((b.y - a.y), (a.x - b.x)) / (Math.PI / 180);
    return (360 + angle) % 360;
}

/**
 * @Author: SongQian
 * @description: 两点是否重叠
 * @param {Point} 重叠点A
 * @param {Point} 重叠点B
 * @param {number} 计算精度表达式 如：0.1计算一个小数位、0.0001 计算四个小数位
 * @return {*} 返回重叠判定结果
 */
export const  IsOverlapping = function(a : Point, b : Point, precision :  number = 1) : boolean {
    let multiple = 1;
    while((precision * multiple) % 1 < 0) {
        multiple *= 10;
    }
    return ((a.x * multiple) >> 0) === ((b.x * multiple) >> 0) && ((a.y * multiple) >> 0) === ((b.y * multiple) >> 0);
}
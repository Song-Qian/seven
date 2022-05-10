/*
 * @Author: SongQian
 * @LastEditors: SongQian
 * @Date: 2022/04/28 15:46
 * @eMail: onlylove1172559463@vip.qq.com
 * @Description:  线特性算法
 */
import { ClockwiseAngle, Distance, AnyAnglePoint, IncludedAngle } from "./point"
import { Point, Line } from "./declare"

/**
 * @LastEditors: SongQian
 * @Author: SongQian
 * @Date: 2022/04/28 16:19
 * @description: 线段的斜率
 * @param {Point} 起点
 * @param {Point} 终点
 * @return {*} 斜率
 */
export const Slope = (start : Point, end: Point) : number => {
    return (end.y - start.y) / (end.x - start.x);
}

/**
 * @LastEditors: SongQian
 * @Author: SongQian
 * @Date: 2022/04/29 16:43
 * @description: 获取一个高阶贝赛尔曲线
 * @param {Array} 控制点
 * @param {number} 输出点数量
 * @return {*} 一个贝赛尔曲线上的点
 */
export const BezierCurve = (operate : Array<Point>, size : number) : Line => {
    const yhTriangle = (m : number, n : number)  : number => {
        //杨辉三角
        let isEndpoint = m === 1 || m === n;
        return isEndpoint ? 1 :   yhTriangle(m - 1, n - 1) + yhTriangle(m,  n - 1);
    }

    const curve = (i : number, n : number, t : number, v : number[]) : number => {
        if (i === n) {
            return Math.pow(t, i - 1) * v[i - 1];
        }
        let k = yhTriangle(i, n);
        var deep = k * Math.pow(1 - t, n - i) * Math.pow(t, i - 1) * v[i -1];
        return deep + curve(++i, n, t, v);
    }

    if (operate.length < 3) {
        return { points : [] }
    }

    return {
        points: new Array(size).fill(1 / size).map((v, i) => {
            return {
                x : curve(1, operate.length, v * i, operate.map(it => it.x)),
                y : curve(1, operate.length, v *i, operate.map(it => it.y))
            }
        })
    }
}

/**
 * @LastEditors: SongQian
 * @Author: SongQian
 * @Date: 2022/05/06 14:05
 * @description: 判断点是否在线段上。
 * @param {Point} aPoint 线段起点
 * @param {Point} bPoint 线段终点
 * @param {Point} cPoint 判定点
 * @return {*} 返回点在线上或者线段外
 */
export const InStroke = (aPoint: Point, bPoint : Point, cPoint : Point) : boolean => {
    if (
        (cPoint.x - aPoint.x) * (bPoint.y - aPoint.y) === (bPoint.x - aPoint.x) * (cPoint.y - aPoint.y) && 
        cPoint.x >= Math.min(aPoint.x, bPoint.x) && 
        cPoint.x <= Math.max(aPoint.x, bPoint.x) &&
        cPoint.y >= Math.min(aPoint.y, bPoint.y) &&
        cPoint.y <= Math.max(aPoint.y, bPoint.y)) {
            return true;
    }
    return false;
}

/**
 * @LastEditors: SongQian
 * @Author: SongQian
 * @Date: 2022/05/07 16:31
 * @description: 获取与线段相交部份的弧线坐标
 * @param {Point} 相交的线段起点
 * @param {Point} 相交的线段终点
 * @param {number} 弧线的半径, 圆心到线段起点或终点的长度
 * @param {number} 弧线点数量
 * @return {*} 返回弧线线段
 */
export const ArcFromRadius = (start : Point, end : Point, radius : number, size : number = 10) : Line  => {
    const a = ClockwiseAngle(start, end);
    const c = { x : (start.x + end.x) / 2, y : (start.y + end.y) / 2 };
    const ac_length = Distance(start, c);
    let h = radius < ac_length ? ac_length - radius : Math.sqrt(radius * radius - ac_length * ac_length);
    let r = radius < ac_length ? Math.sqrt((ac_length - radius) * (ac_length - radius) + ac_length * ac_length) : radius;
    let sa = radius < ac_length ? -90 : 90;
    const o = {
        x : c.x + h * Math.cos((a - sa) * Math.PI / 180),
        y : c.y + h * Math.sin((a - sa) * Math.PI / 180)
    }
    const ra = ClockwiseAngle(start, o);
    const oa = radius < ac_length ? 360 - IncludedAngle(start, o , end) : IncludedAngle(start, o, end);
    return {
        points : new Array(size).fill(oa / (size- 1)).map((v, i) => AnyAnglePoint(o, (ra + v * i) % 360, r))
    }
}

/**
 * @LastEditors: SongQian
 * @Author: SongQian
 * @Date: 2022/05/07 16:46
 * @description:  根据弧相交线段长和弧高, 获取弧线坐标.
 * @param {Point} 相交的线段起点
 * @param {Point} 相交的线段终点
 * @param {number} 弧高
 * @param {number} 弧线点数量
 * @return {*} 返回弧线线段
 */
export const ArcFromHeight = (start : Point, end : Point, height: number, size: number = 10) : Line => {
    const a = ClockwiseAngle(start, end);
    const c = { x : (start.x + end.x) / 2, y : (start.y + end.y) / 2 };
    const len = Distance(start, end);
    const r = Math.pow(len, 2) / (8 * height) + (height / 2);
    const isMajorArc = r < height;
    const h = isMajorArc ? height - r : r - height;
    let sa = isMajorArc ? -90 : 90;
    const o = {
        x : c.x + h * Math.cos((a - sa) * Math.PI / 180),
        y : c.y + h * Math.sin((a - sa) * Math.PI / 180)
    }
    const ra = ClockwiseAngle(start, o);
    const oa = isMajorArc ? 360 - IncludedAngle(start, o , end) : IncludedAngle(start, o, end);
    return {
        points : new Array(size).fill(oa / (size - 1)).map((v, i) => AnyAnglePoint(o, (ra + v * i) % 360, r))
    }
}
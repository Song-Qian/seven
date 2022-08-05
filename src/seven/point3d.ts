/*
 * @Author: SongQian
 * @LastEditors: SongQian
 * @Date: 2022/07/07 09:56
 * @eMail: onlylove117225594632vip.qq.com
 * @Description: 这是一个魔术，来自Author创作，需要修改请留下大名~!
 */
import { Vertex3D } from './declare'

/**
 * @Author: SongQian
 * @description: 获取点任意角度位置
 * @param {Vertex3D} 原点
 * @param {number} 角度
 * @param {number} 极角
 * @param {number} 半径
 * @param {Array[number, number, number]} 原点 x, y, z 旋转角度 0 ~ 360
 * @param {boolean} 是否逆时针
 * @return {*} 圆角度上的任意点位置
 */
export const AnyAnglePoint = (p: Vertex3D, angle: number, polar: number, r: number, m: [number, number, number] = [ 0, 0, 0], counterclockwise: boolean = false) : Vertex3D => {
    angle = counterclockwise ? angle : -angle;
    polar = counterclockwise ? polar : -polar;
    const d = Math.PI / 180;
    let x = r * Math.sin(polar * d) * Math.cos(angle * d);
    let y = r * Math.sin(polar * d) * Math.sin(angle * d);
    let z = r * Math.cos(polar * d);
    //添加极心旋转计算
    const z1 = x * (-Math.cos(m[0] * d) * Math.sin(m[1] * d)) + y * Math.sin(m[0] * d) + z * Math.cos(m[0] * d) * Math.cos(m[1] * d);
    const x1 = x * (Math.cos(m[1] * d) * Math.cos(m[2] * d) - Math.sin(m[0] * d) * Math.sin(m[1] * d) * Math.sin(m[2] * d))
        - y * Math.cos(m[0] * d) * Math.sin(m[2] * d)
        + z * (Math.sin(m[1] * d) * Math.cos(m[2] * d) + Math.sin(m[0] * d) * Math.cos(m[1] * d) * Math.sin(m[2] * d));
    const y1 = x * (Math.cos(m[1] * d) * Math.sin(m[2] * d) + Math.sin(m[0] * d) * Math.sin(m[1] * d) * Math.cos(m[2] * d))
        + y * Math.cos(m[0] * d) * Math.cos(m[2] * d)
        + z * (Math.sin(m[1] * d) * Math.sin(m[2] * d) - Math.sin(m[0] * d) * Math.cos(m[1] * d) * Math.cos(m[2] * d));
    return { x: p.x + x1, y: p.y + y1, z: p.z + z1 }
}

/**
 * @Author: SongQian
 * @Date: 2022/08/02 16:26
 * @description: 丙点的距离
 * @param {Vertex3D} 三维空间中的点A
 * @param {Vertex3D} 三维空间中的点B
 * @return {*}
 */
export const Distance = (a: Vertex3D, b: Vertex3D) => {
    return Math.sqrt((b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y) + (b.z - a.z) * (b.z - a.z));
}
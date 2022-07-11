/*
 * @Author: SongQian
 * @LastEditors: SongQian
 * @Date: 2022/07/07 09:56
 * @eMail: onlylove117225594632vip.qq.com
 * @Description: 这是一个魔术，来自Author创作，需要修改请留下大名~!
 */
import { Vertex3D } from './declare'

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
    return { x: p.x + x1, y: p.y + y1, z: p.z + z1 };
}

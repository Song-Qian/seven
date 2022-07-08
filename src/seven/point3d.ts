/*
 * @Author: SongQian
 * @LastEditors: SongQian
 * @Date: 2022/07/07 09:56
 * @eMail: onlylove117225594632vip.qq.com
 * @Description: 这是一个魔术，来自Author创作，需要修改请留下大名~!
 */
import { Vertex3D } from './declare'

export const AnyAnglePoint = (p : Vertex3D, angle : number, polar: number, r : number, counterclockwise: boolean = false) : Vertex3D => {
    angle = counterclockwise ? angle : -angle;
    polar = counterclockwise ? polar : -polar;
    const x = p.x + r * Math.sin(polar * Math.PI / 180) * Math.cos(angle * Math.PI / 180);
    const y = p.y + r * Math.sin(polar * Math.PI / 180) * Math.sin(angle * Math.PI / 180);
    const z = p.z + r * Math.cos(polar * Math.PI / 180);
    return { x, y, z };
}

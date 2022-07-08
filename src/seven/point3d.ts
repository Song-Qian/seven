/*
 * @Author: SongQian
 * @LastEditors: SongQian
 * @Date: 2022/07/07 09:56
 * @eMail: onlylove117225594632vip.qq.com
 * @Description: 这是一个魔术，来自Author创作，需要修改请留下大名~!
 */
import { Vertex3D } from './declare'

export const AnyAnglePoint = (p: Vertex3D, angle: number, polar: number, r: number, matrix: [number, number, number] = [ 0, 0, 0], counterclockwise: boolean = false) : Vertex3D => {
    angle = counterclockwise ? angle : -angle;
    polar = counterclockwise ? polar : -polar;
    const x = p.x + r * Math.sin(polar * Math.PI / 180) * Math.cos(angle * Math.PI / 180);
    const y = p.y + r * Math.sin(polar * Math.PI / 180) * Math.sin(angle * Math.PI / 180);
    const z = p.z + r * Math.cos(polar * Math.PI / 180);
    //添加极心旋转计算
    const x1 = x * (Math.cos(matrix[1] * Math.PI / 180) * Math.cos(matrix[2] * Math.PI / 180) - Math.sin(matrix[0] * Math.PI / 180) * Math.sin(matrix[1] * Math.PI / 180) * Math.sin(matrix[2] * Math.PI / 180))
        - y * Math.cos(matrix[0] * Math.PI / 180) * Math.sin(matrix[2] * Math.PI / 180)
        + z * (Math.sin(matrix[1] * Math.PI / 180) * Math.cos(matrix[2] * Math.PI / 180) + Math.sin(matrix[0] * Math.PI / 180) * Math.cos(matrix[1] * Math.PI / 180) * Math.sin(matrix[2] * Math.PI / 180));
    const y1 = x * (Math.cos(matrix[1] * Math.PI / 180) * Math.sin(matrix[2] * Math.PI / 180) + Math.sin(matrix[0] * Math.PI / 180) * Math.sin(matrix[1] * Math.PI / 180) * Math.cos(matrix[2] * Math.PI / 180))
        + y * Math.cos(matrix[0] * Math.PI / 180) * Math.cos(matrix[2] * Math.PI / 180)
        + z * (Math.sin(matrix[1] * Math.PI / 180) * Math.sin(matrix[2] * Math.PI / 180) - Math.sin(matrix[0] * Math.PI / 180) * Math.cos(matrix[1] * Math.PI / 180) * Math.cos(matrix[2] * Math.PI / 180));
    const z1 = x * (- Math.cos(matrix[0] * Math.PI / 180) * Math.sin(matrix[1] * Math.PI / 180)) + y * Math.sin(matrix[0] * Math.PI / 180) + z * Math.cos(matrix[0] * Math.PI / 180) * Math.cos(matrix[1] * Math.PI / 180);
    return { x: x1, y: y1, z: z1 };
}

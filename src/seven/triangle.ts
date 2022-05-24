/*
 * @Author: SongQian
 * @LastEditors: SongQian
 * @Date: 2022/05/20 10:33
 * @eMail: onlylove117225594632vip.qq.com
 * @Description: 三角函数算法
 */

/**
 * @LastEditors: SongQian
 * @Date: 2022/05/20 10:35
 * @description: 获取三角斜边长度
 * @param {number} A边
 * @param {number} B边
 * @param {number} 夹角 0 ~ 180
 * @return {*} 返回斜边长度
 */
export const SideLength = (a: number, b: number, o : number): number => { 
    return Math.sqrt((Math.pow(a, 2) + Math.pow(b, 2) - 2 * a * b * Math.cos(o * Math.PI / 180)));
}

/**
 * @LastEditors: SongQian
 * @Date: 2022/05/24 14:57
 * @description: 获取直角三角的斜边长
 * @param {number} A边
 * @param {number} B边
 * @return {*} 返回斜边长度
 */
export const RightAngleHypotenuse = (a: number, b: number): number => {
    return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}

/**
 * @LastEditors: SongQian
 * @Date: 2022/05/24 14:57
 * @description: 获取直角三角的高或底边长
 * @param {number} 斜边长
 * @param {number} 高或者底边长
 * @return {*} 返回高或者底边长，a 如果是高，则输出底边长度，反之则输出高
 */
export const RightAngleSide = (hypotenuse: number, a: number): number => { 
    return Math.sqrt(Math.pow(hypotenuse, 2) - Math.pow(a, 2))
}
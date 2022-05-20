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
 * @return {*} 返回斜边长度
 */
export const HypotenuseLength = (a: number, b: number): number => { 
    return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}
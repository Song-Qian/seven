/*
 * @Author: SongQian
 * @Date: 2022-04-26 16:54:58
 * @Description:  基础数据结构类型申明文件
 * @eMail: onlylove1172559463@vip.qq.com
 */

/**
 * @Author: SongQian
 * @description: 点
 */
export type Point = { x: number, y: number}

/**
 * @Author: SongQian
 * @description: 线
 */
 export type Line = {
    points : Readonly<Array<Point>>
}

/**
 * @Author: SongQian
 * @description: 圆
 */
export type Circle = {
    points : Readonly<Array<Point>>
    //半径
    radius : number
    //短轴
    saxis: number
    //长轴
    laxis: number
    //右侧焦点
    PF1 : Point
    //左侧焦点 
    PF2 : Point
    //焦半径 右侧
    MR1 : number
    //焦半径 左侧
    MR2 : number
    //通径位置或者椭圆内线段A
    P1 : Point
    //通径位置或者椭圆内线段B
    P2 : Point
    //焦距
    C : number
    //离心率
    E : number
    //线段之间的距离
    D: number
}

/**
 * @Author: SongQian
 * @description: 三角函数
 */
export type Triangle = {
    a: Vertex3D
    b: Vertex3D
    c: Vertex3D
}

/**
 * @Author: SongQian
 * @description: 三维顶点
 */
export type Vertex3D = {
    x : number;
    y : number;
    z: number;
    
    _grid?: number;
}

export type Surface = {
    a: Vertex3D;
    b: Vertex3D;
    c: Vertex3D;
}

export type Tetrahedron = {
    p1: Vertex3D;
    p2: Vertex3D;
    p3: Vertex3D;
    p4: Vertex3D;
    center: Vertex3D;
    r: number;
    
    e1?: Surface;
    e2?: Surface;
    e3?: Surface;
    e4?: Surface;
}
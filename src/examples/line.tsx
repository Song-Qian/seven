/*
 * @Author: SongQian
 * @LastEditors: SongQian
 * @Date: 2022/04/28 16:21
 * @eMail: onlylove1172559463@vip.qq.com
 * @Description:  线物理二维图形功能展示
 */
import { defineComponent, ComponentOptionsWithoutProps, SetupContext, render, ref, reactive, onMounted } from "vue"
import { Geometry, Line } from "~/seven/index"

type Props = {}
export default defineComponent<ComponentOptionsWithoutProps<Props>, any, any>({
    name : "LineExamples",
    setup(props : Readonly<Props>, { emit, slots, attrs} : SetupContext) : typeof render {
        let type = ref<Array<string>>(["Slope"]);
        let canvas = ref<HTMLCanvasElement>();
        let descartes = reactive<{ x : number, y : number, gutter : number }>({ x : 0, y : 0, gutter: 20 });
        let eventHandler = ref<String>("none");

        let slopeArgs = reactive({ a : { x : 0, y : 0 }, b : { x : 0, y : 0 }, output: 0 });
        let bezierCurveArgs = reactive<{ operate : Array<Geometry.Point>,  size : number, output: Array<Geometry.Point> }>({ operate : [], size : 10, output: [] })
        let inStrokeArgs = reactive<{ a : Geometry.Point, b : Geometry.Point, c : Geometry.Point, output: boolean }>({ a :  { x : 0, y : 0 }, b : { x : 0, y : 0 }, c : { x : 0, y : 0 }, output: false })
        let arcFromRadiusArgs = reactive<{  a : Geometry.Point, b : Geometry.Point, radius: number, type: "0" | "1", size: number, output : Array<Geometry.Point> }>({ a : { x : 0, y : 0 }, b : { x : 0 , y : 0 }, type: "0", radius: 0, size: 10, output: [] })

        let drawerPoint = () => {
            let ctx = canvas.value?.getContext && canvas.value.getContext("2d");
            if (!ctx || !canvas.value) 
                throw new Error("Invalid Canvas Context")
            ResetSymmetryBase();
            if (type.value[0] === "Slope") {
                let { x, y, gutter } = descartes;
                let aPoint = {
                    x : x + slopeArgs.a.x * gutter,
                    y : y - slopeArgs.a.y * gutter
                }

                let bPoint = {
                    x : x + slopeArgs.b.x * gutter,
                    y : y - slopeArgs.b.y * gutter
                }

                ctx.beginPath();
                ctx.fillStyle = "red";
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.lineWidth = 2;
                ctx.strokeStyle = "red";
                ctx.arc(aPoint.x, aPoint.y, 5, 0, 2  * Math.PI);
                ctx.moveTo(bPoint.x, bPoint.y);
                ctx.arc(bPoint.x, bPoint.y, 5, 0, 2  * Math.PI);
                ctx.moveTo(aPoint.x, aPoint.y);
                ctx.lineTo(bPoint.x, bPoint.y);
                ctx.fillText("A点", aPoint.x - 10, aPoint.y + 10);
                ctx.fillText("B点", bPoint.x - 10, bPoint.y + 10);
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
                let output = Line.Slope(aPoint, bPoint);
                ctx.fillStyle = "blue";
                let text = output === Infinity ? "顺时针-90度垂直" : 
                    output === -Infinity ? "顺时针90度垂直" : 
                    output === 0 && 1 / output > 0 ? "水平180度" : 
                    output === 0 && 1 / output < 0 ? "水平0度" : 
                    output > 0 && aPoint.x < bPoint.x ? "点A在第一象限" :
                    output < 0 && aPoint.x > bPoint.x ? "点A在第二象限" :
                    output > 0 && aPoint.x > bPoint.x ? "点A在第三象限" :
                    output < 0 && aPoint.x < bPoint.x ? "点A在第四象限" : "飞出宇宙？";
                ctx.fillText(text, bPoint.x + 10, bPoint.y - 10);
                slopeArgs.output = output;
            }

            if (type.value[0] === "BezierCurve") {
                let { x, y, gutter } = descartes;
                ctx.beginPath();
                ctx.fillStyle = "red";
                bezierCurveArgs.operate.forEach((it) => {
                    ctx?.moveTo(it.x, it.y);
                    ctx?.arc(it.x, it.y, 5, 0, 2 * Math.PI);
                })
                ctx.fill();
                ctx.closePath();
                let output = Line.BezierCurve(bezierCurveArgs.operate, bezierCurveArgs.size);
                ctx.beginPath();
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.lineWidth = 2;
                ctx.strokeStyle = "blue";
                ctx.fillStyle = "blue";
                output.points.forEach((it) => {
                    ctx?.moveTo(it.x, it.y);
                    ctx?.arc(it.x, it.y, 5, 0, 2 * Math.PI);
                })
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
                bezierCurveArgs.output = output.points.map(it => ({ x :  (it.x - x) / gutter, y :  (y - it.y) / gutter }));
            }

            if (type.value[0] === "InStroke") {
                let { x, y, gutter } = descartes;
                let aPoint = {
                    x : x + inStrokeArgs.a.x * gutter,
                    y : y - inStrokeArgs.a.y * gutter
                }

                let bPoint = {
                    x : x + inStrokeArgs.b.x * gutter,
                    y : y - inStrokeArgs.b.y * gutter
                }

                let cPoint = {
                    x : x + inStrokeArgs.c.x * gutter,
                    y : y - inStrokeArgs.c.y * gutter
                }

                ctx.beginPath();
                ctx.fillStyle = "red";
                ctx.strokeStyle = "red";
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.lineWidth = 2;
                ctx.moveTo(aPoint.x, aPoint.y);
                ctx.arc(aPoint.x, aPoint.y, 5, 0, 2  * Math.PI);
                ctx.moveTo(bPoint.x, bPoint.y);
                ctx.arc(bPoint.x, bPoint.y, 5, 0, 2 * Math.PI);
                ctx.moveTo(aPoint.x, aPoint.y);
                ctx.lineTo(bPoint.x, bPoint.y);
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
                let output = Line.InStroke(aPoint, bPoint, cPoint);
                ctx.beginPath();
                ctx.fillStyle = "blue";
                ctx.strokeStyle = "blue";
                ctx.moveTo(cPoint.x, cPoint.y);
                ctx.arc(cPoint.x, cPoint.y, 5, 0, 2  * Math.PI);
                ctx.fillText(String(output), cPoint.x + 10, cPoint.y + 10);
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
                inStrokeArgs.output = output;
            }

            if (type.value[0] === "ArcFromRadius") {
                let { x, y, gutter } = descartes;
                let aPoint = {
                    x : x + arcFromRadiusArgs.a.x * gutter,
                    y : y - arcFromRadiusArgs.a.y * gutter
                }

                let bPoint = {
                    x : x + arcFromRadiusArgs.b.x * gutter,
                    y : y - arcFromRadiusArgs.b.y * gutter
                }

                ctx.beginPath();
                ctx.fillStyle = "red";
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.strokeStyle = "red";
                ctx.lineWidth = 2;
                ctx.moveTo(aPoint.x, aPoint.y);
                ctx.arc(aPoint.x, aPoint.y, 5, 0, 2  * Math.PI);
                ctx.fillText("A点", aPoint.x + 10, aPoint.y - 10);
                ctx.lineTo(bPoint.x, bPoint.y);
                ctx.arc(bPoint.x, bPoint.y, 5, 0, 2  * Math.PI);
                ctx.fillText("B点", bPoint.x + 10, bPoint.y - 10);
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
                let output = arcFromRadiusArgs.type == "0" ? Line.ArcFromRadius(aPoint, bPoint, arcFromRadiusArgs.radius * gutter, arcFromRadiusArgs.size) : Line.ArcFromHeight(aPoint, bPoint, arcFromRadiusArgs.radius * gutter, arcFromRadiusArgs.size);
                ctx.beginPath();
                ctx.fillStyle = "blue";
                ctx.strokeStyle = "blue";
                output.points.forEach((it) => {
                    ctx?.moveTo(it.x, it.y);
                    ctx?.arc(it.x, it.y, 5, 0, 2 * Math.PI);
                })
                ctx.fill();
                ctx.closePath();
                arcFromRadiusArgs.output = output.points.map(it => ({ x :  (it.x - x) / gutter, y :  (y - it.y) / gutter }))
            }
        }

        let onAddPoints = (e : MouseEvent) => {
            let ctx = canvas.value?.getContext && canvas.value.getContext("2d");
            if (!ctx || !canvas.value) 
                throw new Error("Invalid Canvas Context")
            if (eventHandler.value === "bezierCurve") {
                ResetSymmetryBase();
                bezierCurveArgs.operate.push({ x : e.offsetX, y : e.offsetY });
                ctx.beginPath();
                ctx.fillStyle = "red";
                bezierCurveArgs.operate.forEach((it) => {
                    ctx?.moveTo(it.x, it.y);
                    ctx?.arc(it.x, it.y, 5, 0, 2 * Math.PI);
                })
                ctx.fill();
                ctx.closePath();
                let output = Line.BezierCurve(bezierCurveArgs.operate, bezierCurveArgs.size);
                ctx.beginPath();
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.lineWidth = 2;
                ctx.strokeStyle = "blue";
                ctx.fillStyle = "blue";
                output.points.forEach((it) => {
                    ctx?.moveTo(it.x, it.y);
                    ctx?.arc(it.x, it.y, 5, 0, 2 * Math.PI);
                })
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
                bezierCurveArgs.output = [...output.points];
            }
        }

        let ResetSymmetryBase = () => {
            let ctx = canvas.value?.getContext("2d");
            if (canvas.value && ctx) {
                let w = canvas.value.clientWidth;
                let h = canvas.value.clientHeight;
                canvas.value.width = w;
                canvas.value.height = h;
                descartes.x = w / 2;
                descartes.y = h / 2;
                ctx.clearRect(0, 0, w, h);
                ctx.fillStyle = "#f9f9f9";
                let bg = new Path2D();
                bg.rect(0, 0 , w, h);
                ctx.fill(bg);
                let grid = new Path2D();
                grid.moveTo(descartes.x, 0);
                grid.lineTo(descartes.x, h);
                grid.moveTo(0, descartes.y);
                grid.lineTo(w, descartes.y);
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.lineWidth = 2;
                ctx.strokeStyle = "#333";
                ctx.stroke(grid);
                let x = descartes.x;
                let gutter = descartes.gutter;
                while(x + gutter <= w) {
                    x += gutter;
                    grid.moveTo(x, 0);
                    grid.lineTo(x, h);
                    ctx.fillStyle = "#333";
                    ctx.font = "14px SimSun, Songti SC";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "bottom";
                    ctx.fillText(String((x - descartes.x) / gutter), x, descartes.y);
                }
                x = descartes.x;
                while(x - gutter >= 0) {
                    x -= gutter;
                    grid.moveTo(x, 0);
                    grid.lineTo(x, h);
                    ctx.fillStyle = "#333";
                    ctx.font = "14px SimSun, Songti SC";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "top";
                    ctx.fillText("-" + ((descartes.x - x) / gutter), x, descartes.y);
                }
                let y = descartes.y
                while (y + gutter <= h) {
                    y += gutter;
                    grid.moveTo(0, y);
                    grid.lineTo(w, y);
                    ctx.fillStyle = "#333";
                    ctx.font = "14px SimSun, Songti SC";
                    ctx.textAlign = "end";
                    ctx.textBaseline = "middle";
                    ctx.fillText("-" + ((y - descartes.y) / gutter), descartes.x, y);
                }
                y = descartes.y
                while(y - gutter >= 0) {
                    y -= gutter;
                    grid.moveTo(0, y);
                    grid.lineTo(w, y);
                    ctx.fillStyle = "#333";
                    ctx.font = "14px SimSun, Songti SC";
                    ctx.textAlign = "start";
                    ctx.textBaseline = "middle";
                    ctx.fillText(String((descartes.y - y) / gutter), descartes.x, y);
                }
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.lineWidth = 1;
                ctx.strokeStyle = "#e3e3e3";
                ctx.stroke(grid);
                ctx.save();
            }
        }

        onMounted(() => {
            ResetSymmetryBase();
            window.onresize = () => {
                if (canvas.value) {
                    canvas.value.width = canvas.value.clientWidth;
                    canvas.value.height = canvas.value.clientHeight;
                }
            }
        })
        
        return () => (
            <div class="container">
                <div class="drawer-wapper">
                    <canvas width="100%" height="100%" style="width: 100%; height: 100%" ref={canvas} onClick={onAddPoints}></canvas>
                </div>
                <div class="drawer-args">
                    <acro-collapse v-model={[type.value, "active-key"]} accordion>
                        <acro-collapse-item header="斜率" key="Slope">
                            <acro-form model={slopeArgs} layout="vertical">
                                <acro-form-item label="A点 x坐标">
                                    <acro-slider v-model={slopeArgs.a.x } min={-20} max={20} onChange={drawerPoint}/>
                                </acro-form-item>
                                <acro-form-item label="A点 y坐标">
                                    <acro-slider v-model={slopeArgs.a.y } min={-20} max={20} step={1} onChange={drawerPoint} />
                                </acro-form-item>
                                <acro-form-item label="B点 x坐标">
                                    <acro-slider v-model={slopeArgs.b.x } min={-20} max={20} step={1} onChange={drawerPoint} />
                                </acro-form-item>
                                <acro-form-item label="B点 y坐标">
                                    <acro-slider v-model={slopeArgs.b.y } min={-20} max={20} step={1}  onChange={drawerPoint} />
                                </acro-form-item>
                                <acro-form-item label="输出结果">
                                    <acro-textarea model-value={ JSON.stringify(slopeArgs.output) } readonly />
                                </acro-form-item>
                            </acro-form>
                        </acro-collapse-item>
                        <acro-collapse-item header="贝赛尔曲线" key="BezierCurve">
                            <acro-form model={bezierCurveArgs} layout="vertical">
                                <acro-form-item label="曲线点数量">
                                    <acro-slider v-model={bezierCurveArgs.size } min={10} max={1000} step={1} onChange={drawerPoint} />
                                </acro-form-item>
                                <acro-form-item label="操作">
                                    <acro-space size="mini">
                                        <acro-button type="primary" size="small" onClick={ () => eventHandler.value = "bezierCurve" }>拾取点</acro-button>
                                        <acro-button type="primary" size="small" onClick={() => (bezierCurveArgs.operate = [], ResetSymmetryBase()) }>清除</acro-button>
                                    </acro-space>
                                </acro-form-item>
                                <acro-form-item label="输出结果">
                                    <acro-textarea model-value={ JSON.stringify(bezierCurveArgs.output) } readonly />
                                </acro-form-item>
                            </acro-form>
                        </acro-collapse-item>
                        <acro-collapse-item header="点是否在线上" key="InStroke">
                            <acro-form model={inStrokeArgs} layout="vertical">
                                <acro-form-item label="A点 x坐标">
                                    <acro-slider v-model={inStrokeArgs.a.x} step={1} min={-20} max={20} onChange={drawerPoint} />
                                </acro-form-item>
                                <acro-form-item label="A点 y坐标">
                                    <acro-slider v-model={inStrokeArgs.a.y} step={1} min={-20} max={20} onChange={drawerPoint} />
                                </acro-form-item>
                                <acro-form-item label="B点 x坐标">
                                    <acro-slider v-model={inStrokeArgs.b.x} step={1} min={-20} max={20} onChange={drawerPoint} />
                                </acro-form-item>
                                <acro-form-item label="B点 y坐标">
                                    <acro-slider v-model={inStrokeArgs.b.y} step={1} min={-20} max={20} onChange={drawerPoint} />
                                </acro-form-item>
                                <acro-form-item label="判定点 x坐标">
                                    <acro-slider v-model={inStrokeArgs.c.x} step={1} min={-20} max={20} onChange={drawerPoint} />
                                </acro-form-item>
                                <acro-form-item label="判定点 y坐标">
                                    <acro-slider v-model={inStrokeArgs.c.y} step={1} min={-20} max={20} onChange={drawerPoint} />
                                </acro-form-item>
                                <acro-form-item label="输出结果">
                                    <acro-textarea model-value={ JSON.stringify(inStrokeArgs.output) } readonly />
                                </acro-form-item>
                            </acro-form>
                        </acro-collapse-item>
                        <acro-collapse-item header="弧" key="ArcFromRadius">
                            <acro-form model={arcFromRadiusArgs} layout="vertical">
                                <acro-form-item label="绘制方式">
                                    <acro-radio-group  v-model={arcFromRadiusArgs.type} type="button" size="small" onChange={drawerPoint}>
                                        <acro-radio value="0">半径</acro-radio>
                                        <acro-radio value="1">弧高</acro-radio>
                                    </acro-radio-group>
                                </acro-form-item>
                                <acro-form-item label="A点 x坐标">
                                    <acro-slider v-model={arcFromRadiusArgs.a.x} step={1} min={-20} max={20} onChange={drawerPoint} />
                                </acro-form-item>
                                <acro-form-item label="A点 y坐标">
                                    <acro-slider v-model={arcFromRadiusArgs.a.y} step={1} min={-20} max={20} onChange={drawerPoint} />
                                </acro-form-item>
                                <acro-form-item label="B点 x坐标">
                                    <acro-slider v-model={arcFromRadiusArgs.b.x} step={1} min={-20} max={20} onChange={drawerPoint} />
                                </acro-form-item>
                                <acro-form-item label="B点 y坐标">
                                    <acro-slider v-model={arcFromRadiusArgs.b.y} step={1} min={-20} max={20} onChange={drawerPoint} />
                                </acro-form-item>
                                <acro-form-item label={arcFromRadiusArgs.type == "0" ? "半径" : "弓高"}>
                                    <acro-slider v-model={arcFromRadiusArgs.radius} step={1} min={0} max={50} onChange={drawerPoint} />
                                </acro-form-item>
                                <acro-form-item label="弧线点数量">
                                    <acro-slider v-model={arcFromRadiusArgs.size} step={1} min={10} max={100} onChange={drawerPoint} />
                                </acro-form-item>
                                <acro-form-item label="输出结果">
                                    <acro-textarea model-value={ JSON.stringify(arcFromRadiusArgs.output) } readonly />
                                </acro-form-item>
                            </acro-form>
                        </acro-collapse-item>
                    </acro-collapse>
                </div>
            </div>
        )
    }
})
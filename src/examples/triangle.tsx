/*
 * @Author: SongQian
 * @LastEditors: SongQian
 * @Date: 2022/05/20 10:41
 * @eMail: onlylove117225594632vip.qq.com
 * @Description: 三角函数扩展图形功能展示
 */
import { defineComponent, ComponentPropsOptions, render, SetupContext, ref, reactive, onMounted, withModifiers } from "vue"
import * as Geometry from "~/seven/declare"
import * as Triangle from "~/seven/triangle"
import * as Point from "~/seven/point"
import * as Delaunay from "~/seven/delaunay"


type Props = {}
export default defineComponent<ComponentPropsOptions<Props>, any, any>({
    name: "TriangleExamples",
    setup(props: Readonly<Props>, { emit, slots, attrs }: SetupContext): typeof render {
        let type = ref<Array<string>>(["GenerateCircle"]);
        let canvas = ref<HTMLCanvasElement>();
        let descartes = reactive<{ x: number, y: number, gutter: number }>({ x: 0, y: 0, gutter: 20 });

        let sideLengthArgs = reactive<{ a: Geometry.Point, b: Geometry.Point, output: number }>({ a: { x: 0, y: 0 }, b: { x: 0, y: 0 }, output: 0 })
        let rightAngleHypotenuseArgs = reactive<{ a: number, b: number, output: number }>({ a: 0, b: 0, output: 0 });
        let rightAngleSideArgs = reactive<{ type: 0 | 1, a: Geometry.Point, b: Geometry.Point, output: number }>({ type: 0, a: { x: 0, y: 0 }, b: { x: 0, y: 0 }, output: 0 });
        let delaunayArgs = reactive<{ points: Array<Geometry.Vertex3D>, total: number, output: Array<any> }>({ points: [], total: 3, output: [] });
        
        let drawTriangle = () => {
            let ctx = canvas.value?.getContext && canvas.value.getContext("2d");
            if (!ctx || !canvas.value) 
                throw new Error("Invalid Canvas Context")
            ResetSymmetryBase();

            if (type.value[0] === "HypotenuseLength") { 
                let { x, y, gutter } = descartes;
                let aPoint = {
                    x: x + sideLengthArgs.a.x * gutter,
                    y: y - sideLengthArgs.a.y * gutter
                }
                let bPoint = {
                    x: x + sideLengthArgs.b.x * gutter,
                    y: y - sideLengthArgs.b.y * gutter
                }
                ctx.beginPath();
                ctx.fillStyle = "red";
                ctx.strokeStyle = "red";
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.lineWidth = 2;
                ctx.moveTo(x, y);
                ctx.arc(x, y, 5, 0, 2 * Math.PI);
                ctx.moveTo(aPoint.x, aPoint.y);
                ctx.arc(aPoint.x, aPoint.y, 5, 0, 2 * Math.PI);
                ctx.moveTo(bPoint.x, bPoint.y);
                ctx.arc(bPoint.x, bPoint.y, 5, 0, 2 * Math.PI);
                ctx.fill();
                ctx.moveTo(x, y);
                ctx.lineTo(aPoint.x, aPoint.y);
                ctx.moveTo(x, y);
                ctx.lineTo(bPoint.x, bPoint.y);
                ctx.stroke();
                ctx.closePath();
                let aleng = Point.Distance({ x, y }, aPoint);
                let bleng = Point.Distance({ x, y }, bPoint);
                let angle = Point.IncludedAngle(bPoint, { x, y }, aPoint);
                let cleng = Triangle.SideLength(aleng, bleng, angle);
                ctx.beginPath();
                ctx.fillStyle = "blue";
                ctx.strokeStyle = "blue";
                ctx.moveTo(aPoint.x, aPoint.y);
                ctx.lineTo(bPoint.x, bPoint.y);
                ctx.stroke();
                ctx.fillText(String(cleng / gutter), (aPoint.x + bPoint.x) / 2, (aPoint.y + bPoint.y) / 2);
                ctx.closePath();
                sideLengthArgs.output = cleng / gutter;
            }

            if (type.value[0] === "RightAngleHypotenuse") {
                let { x, y, gutter } = descartes;
                let aPoint = {
                    x: x + rightAngleHypotenuseArgs.a * gutter,
                    y: y
                }
                let bPoint = {
                    x: x,
                    y: y - rightAngleHypotenuseArgs.b * gutter
                }
                ctx.beginPath();
                ctx.fillStyle = "red";
                ctx.strokeStyle = "red";
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.lineWidth = 2;
                ctx.moveTo(x, y);
                ctx.arc(x, y, 5, 0, 2 * Math.PI);
                ctx.moveTo(aPoint.x, aPoint.y);
                ctx.arc(aPoint.x, aPoint.y, 5, 0, 2 * Math.PI);
                ctx.moveTo(bPoint.x, bPoint.y);
                ctx.arc(bPoint.x, bPoint.y, 5, 0, 2 * Math.PI);
                ctx.fill();
                ctx.moveTo(x, y);
                ctx.lineTo(aPoint.x, aPoint.y);
                ctx.moveTo(x, y);
                ctx.lineTo(bPoint.x, bPoint.y);
                ctx.fillText("a边", (x + aPoint.x) / 2, (y + aPoint.y) / 2 + 10);
                ctx.fillText("b边", (x + bPoint.x) / 2, (y + bPoint.y) / 2 + 10);
                ctx.stroke();
                ctx.closePath();
                let output = Triangle.RightAngleHypotenuse(rightAngleHypotenuseArgs.a * gutter, rightAngleHypotenuseArgs.b * gutter);
                ctx.beginPath();
                ctx.fillStyle = "blue";
                ctx.strokeStyle = "blue";
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.moveTo(aPoint.x, aPoint.y);
                ctx.lineTo(bPoint.x, bPoint.y);
                ctx.fillText(String(output / gutter), (aPoint.x + bPoint.x) / 2, (aPoint.y + bPoint.y) / 2);
                ctx.stroke();
                ctx.closePath();
                rightAngleHypotenuseArgs.output = output / gutter;
            }

            if (type.value[0] === "RightAngleSide") { 
                let { x, y, gutter } = descartes;
                let aPoint = {
                    x: x + rightAngleSideArgs.a.x * gutter,
                    y: y
                }
                let bPoint = {
                    x: x,
                    y: y - rightAngleSideArgs.b.y * gutter
                }
                ctx.beginPath();
                ctx.fillStyle = "red";
                ctx.strokeStyle = "red";
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.lineWidth = 2;
                ctx.moveTo(x, y);
                ctx.arc(x, y, 5, 0, 2 * Math.PI);
                ctx.moveTo(aPoint.x, aPoint.y);
                ctx.arc(aPoint.x, aPoint.y, 5, 0, 2 * Math.PI);
                ctx.moveTo(bPoint.x, bPoint.y);
                ctx.arc(bPoint.x, bPoint.y, 5, 0, 2 * Math.PI);
                ctx.fill();
                if (rightAngleSideArgs.type === 0) {
                    ctx.moveTo(x, y);
                    ctx.lineTo(aPoint.x, aPoint.y);
                }
                if (rightAngleSideArgs.type === 1) {  
                    ctx.moveTo(x, y);
                    ctx.lineTo(bPoint.x, bPoint.y);
                }
                ctx.lineTo(aPoint.x, aPoint.y);
                ctx.stroke();
                ctx.closePath();
                let hypotenuse = Point.Distance(aPoint, bPoint);
                let a = rightAngleSideArgs.type === 0 ? Point.Distance({ x, y }, { x: aPoint.x, y }) : Point.Distance({ x, y }, { x, y: bPoint.y });
                let output = Triangle.RightAngleSide(hypotenuse, a);
                ctx.beginPath();
                ctx.strokeStyle = "blue";
                ctx.fillStyle = "blue";
                ctx.moveTo(x, y);
                if (rightAngleSideArgs.type === 0) {
                    ctx.lineTo(bPoint.x, bPoint.y);
                    ctx.fillText(String(output / gutter), (x + bPoint.x) / 2 - 10, (y + bPoint.y) / 2);
                }
                if (rightAngleSideArgs.type === 1) {  
                    ctx.lineTo(aPoint.x, aPoint.y);
                    ctx.fillText(String(output / gutter), (x + aPoint.x) / 2, (y + aPoint.y) / 2 + 10);
                }
                ctx.stroke();
                ctx.closePath();
                rightAngleSideArgs.output = output / gutter;
            }

            if (type.value[0] === "Delaunay") { 
                let { x, y, gutter } = descartes;
                ctx.beginPath();
                ctx.fillStyle = "red";
                ctx.strokeStyle = "red";
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                for (let i = 0, len = delaunayArgs.points.length; i < len; i++) {
                    ctx.moveTo(delaunayArgs.points[i].x, delaunayArgs.points[i].y);
                    ctx.arc(delaunayArgs.points[i].x, delaunayArgs.points[i].y, 5, 0, 2 * Math.PI);
                }
                ctx.fill();
                ctx.closePath();
                let delaunayTriangle = Delaunay.Delaunay2d(delaunayArgs.points);
                ctx.beginPath();
                ctx.strokeStyle = "blue";
                ctx.fillStyle = "blue";
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                for (let i = 0, len = delaunayTriangle.length; i < len; i += 3) { 
                    let a = delaunayTriangle[i];
                    let b = delaunayTriangle[i + 1];
                    let c = delaunayTriangle[i + 2];
                    
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.lineTo(c.x, c.y);
                    ctx.lineTo(a.x, a.y);
                    delaunayArgs.output.push(
                        x + a.x * gutter, y - a.y * gutter,
                        x + b.x * gutter, y - b.y * gutter,
                        x + c.x * gutter, y - c.y * gutter
                    );
                }
                ctx.stroke();
                ctx.closePath();
            }
        }

        let AddDelaunayPoint = (e: MouseEvent) => { 
            if (type.value[0] === "Delaunay") {
                delaunayArgs.points.push({ x: e.offsetX, y: e.offsetY, z: 0 });
                drawTriangle();
            }
        }

        let RoundDelaunayPoint = (e: MouseEvent) => {
            if (type.value[0] === "Delaunay") {
                delaunayArgs.points = [];
                let { gutter } = descartes;
                for (let i = 0; i < delaunayArgs.total; i++)
                    delaunayArgs.points.push({ x: gutter * 50 * Math.random(), y: gutter * 40 * Math.random(), z: 0 });
                drawTriangle();
            }
        }

        let ClearDelaunayPoint = (e: MouseEvent) => {
            if (type.value[0] === "Delaunay") {
                delaunayArgs.points = [];
                delaunayArgs.output = [];
                drawTriangle();
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
                    <canvas width="100%" height="100%" style="width: 100%; height: 100%" ref={canvas} onClick={ withModifiers(AddDelaunayPoint, ["capture", "stop"]) }></canvas>
                </div>
                <div class="drawer-args">
                    <acro-collapse v-model={[type.value, "active-key"]} accordion>
                        <acro-collapse-item header="三角斜边长度" key="HypotenuseLength">
                            <acro-form model={sideLengthArgs} layout="vertical">
                                <acro-form-item label="A边点x坐标">
                                    <acro-slider v-model={sideLengthArgs.a.x} min={-20} max={20} step={1} onChange={drawTriangle} />
                                </acro-form-item>
                                <acro-form-item label="A边点y坐标">
                                    <acro-slider v-model={sideLengthArgs.a.y} min={-20} max={20} step={1} onChange={drawTriangle} />
                                </acro-form-item>
                                <acro-form-item label="B边点x坐标">
                                    <acro-slider v-model={sideLengthArgs.b.x} min={-20} max={20} step={1} onChange={drawTriangle} />
                                </acro-form-item>
                                <acro-form-item label="B边点y坐标">
                                    <acro-slider v-model={sideLengthArgs.b.y} min={-20} max={20} step={1} onChange={drawTriangle} />
                                </acro-form-item>
                                <acro-form-item label="输出结果">
                                    <acro-textarea model-value={ JSON.stringify(sideLengthArgs.output) } readonly/>
                                </acro-form-item>
                            </acro-form>
                        </acro-collapse-item>
                        <acro-collapse-item header="直角三角形斜边长" key="RightAngleHypotenuse">
                            <acro-form model={rightAngleHypotenuseArgs} layout="vertical">
                                <acro-form-item label="A边">
                                    <acro-slider v-model={rightAngleHypotenuseArgs.a} min={-20} max={20} step={1} onChange={drawTriangle} />
                                </acro-form-item>
                                <acro-form-item label="B边">
                                    <acro-slider v-model={rightAngleHypotenuseArgs.b} min={-20} max={20} step={1} onChange={drawTriangle} />
                                </acro-form-item>
                                <acro-form-item label="输出结果">
                                    <acro-textarea model-value={ JSON.stringify(rightAngleHypotenuseArgs.output) } readonly/>
                                </acro-form-item>
                            </acro-form>
                        </acro-collapse-item>
                        <acro-collapse-item header="直角三角形高或底边" key="RightAngleSide">
                            <acro-form model={rightAngleSideArgs} layout="vertical">
                                <acro-form-item label="通径方向">
                                    <acro-radio-group  v-model={rightAngleSideArgs.type} type="button" size="small" onChange={drawTriangle}>
                                        <acro-radio value={0}>高</acro-radio>
                                        <acro-radio value={1}>底边</acro-radio>
                                    </acro-radio-group>
                                </acro-form-item>
                                <acro-form-item label="斜边A点位置">
                                    <acro-slider v-model={rightAngleSideArgs.a.x} min={-20} max={20} step={1} onChange={drawTriangle} />
                                </acro-form-item>
                                <acro-form-item label="斜边B点位置">
                                    <acro-slider v-model={rightAngleSideArgs.b.y} min={-20} max={20} step={1} onChange={drawTriangle} />
                                </acro-form-item>
                                <acro-form-item label="输出结果">
                                    <acro-textarea model-value={ JSON.stringify(rightAngleSideArgs.output) } readonly/>
                                </acro-form-item>
                            </acro-form>
                        </acro-collapse-item>
                        <acro-collapse-item header="Delaunay三角" key="Delaunay">
                            <acro-form model={delaunayArgs} layout="vertical">
                                <acro-form-item label="数量">
                                    <acro-slider v-model={delaunayArgs.total} min={3} max={300} step={1} />
                                </acro-form-item>
                                <acro-form-item label="操作">
                                    <acro-space size="mini">
                                        <acro-button type="primary" size="small" onClick={ClearDelaunayPoint}>清除</acro-button>
                                        <acro-button type="primary" size="small" onClick={RoundDelaunayPoint}>随机</acro-button>
                                    </acro-space>
                                </acro-form-item>
                                <acro-form-item label="输出结果">
                                    <acro-textarea model-value={ JSON.stringify(delaunayArgs.output) } readonly/>
                                </acro-form-item>
                            </acro-form>
                        </acro-collapse-item>
                    </acro-collapse>
                </div>
            </div>
        )
    }
})
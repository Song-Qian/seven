/*
 * @Author: SongQian
 * @LastEditors: SongQian
 * @Date: 2022/05/20 10:41
 * @eMail: onlylove117225594632vip.qq.com
 * @Description: 三角函数扩展图形功能展示
 */
import { defineComponent, ComponentPropsOptions, render, SetupContext, ref, reactive, onMounted } from "vue"
import * as Geometry from "~/seven/declare"
import * as Triangle from "~/seven/triangle"
import * as Point from "~/seven/point"


type Props = {}
export default defineComponent<ComponentPropsOptions<Props>, any, any>({
    name: "TriangleExamples",
    setup(props: Readonly<Props>, { emit, slots, attrs }: SetupContext): typeof render {
        let type = ref<Array<string>>(["GenerateCircle"]);
        let canvas = ref<HTMLCanvasElement>();
        let descartes = reactive<{ x: number, y: number, gutter: number }>({ x: 0, y: 0, gutter: 20 });

        let hypotenuseLengthArgs = reactive<{ a: Geometry.Point, b: Geometry.Point, output: number }>({ a: { x: 0, y: 0 }, b: { x: 0, y: 0 }, output: 0 })
        
        let drawTriangle = () => {
            let ctx = canvas.value?.getContext && canvas.value.getContext("2d");
            if (!ctx || !canvas.value) 
                throw new Error("Invalid Canvas Context")
            ResetSymmetryBase();

            if (type.value[0] === "HypotenuseLength") { 
                let { x, y, gutter } = descartes;
                let aPoint = {
                    x: x + hypotenuseLengthArgs.a.x * gutter,
                    y: y - hypotenuseLengthArgs.a.y * gutter
                }
                let bPoint = {
                    x: x + hypotenuseLengthArgs.b.x * gutter,
                    y: y - hypotenuseLengthArgs.b.y * gutter
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
                let cleng = Triangle.HypotenuseLength(aleng, bleng);
                ctx.beginPath();
                ctx.fillStyle = "blue";
                ctx.strokeStyle = "blue";
                ctx.moveTo(aPoint.x, aPoint.y);
                ctx.lineTo(bPoint.x, bPoint.y);
                ctx.stroke();
                ctx.fillText(String(cleng), (aPoint.x + bPoint.x) / 2, (aPoint.y + bPoint.y) / 2);
                ctx.closePath();
                hypotenuseLengthArgs.output = cleng;
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
                    <canvas width="100%" height="100%" style="width: 100%; height: 100%" ref={canvas}></canvas>
                </div>
                <div class="drawer-args">
                    <acro-collapse v-model={[type.value, "active-key"]} accordion>
                        <acro-collapse-item header="三角斜边长度" key="HypotenuseLength">
                            <acro-form model={hypotenuseLengthArgs} layout="vertical">
                                <acro-form-item label="A边点x坐标">
                                    <acro-slider v-model={hypotenuseLengthArgs.a.x} min={-20} max={20} step={1} onChange={drawTriangle} />
                                </acro-form-item>
                                <acro-form-item label="A边点y坐标">
                                    <acro-slider v-model={hypotenuseLengthArgs.a.y} min={-20} max={20} step={1} onChange={drawTriangle} />
                                </acro-form-item>
                                <acro-form-item label="B边点x坐标">
                                    <acro-slider v-model={hypotenuseLengthArgs.b.x} min={-20} max={20} step={1} onChange={drawTriangle} />
                                </acro-form-item>
                                <acro-form-item label="B边点y坐标">
                                    <acro-slider v-model={hypotenuseLengthArgs.b.y} min={-20} max={20} step={1} onChange={drawTriangle} />
                                </acro-form-item>
                                <acro-form-item label="输出结果">
                                    <acro-textarea model-value={ JSON.stringify(hypotenuseLengthArgs.output) } readonly/>
                                </acro-form-item>
                            </acro-form>
                        </acro-collapse-item>
                    </acro-collapse>
                </div>
            </div>
        )
    }
})
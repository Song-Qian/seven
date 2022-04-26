/*
 * @Author: SongQian
 * @Date: 2022-04-07 11:20:30
 * @Description: 点物理二维图形功能展示
 * @eMail: onlylove1172559463@vip.qq.com
 */
import { Point } from '~/seven'
import { defineComponent, ComponentOptionsWithoutProps, SetupContext, render, reactive, ref, onMounted, provide } from 'vue'

import './point.sass'

type Props = {}

export default defineComponent<ComponentOptionsWithoutProps<Props>, any, any>({
    name : "PointExamples",
    setup(props: Readonly<Props>, { emit, slots, attrs } : SetupContext) : typeof render {
        let type = ref<string[]>(["SymmetryPoint"])
        let canvas  = ref<HTMLCanvasElement>();
        let descartes = reactive<{ x : number, y : number, gutter : number }>({ x : 0, y : 0, gutter: 20 });
        provide("descartes", descartes);

        let symmetryPointArgs = reactive({ a : { x : 0, y : 0 }, b : { x : 0, y : 0 }, direction : "h", output: { x : 0, y : 0 } })
        let symmetryAngleArgs = reactive({ a : { x : 0, y : 0 }, b : { x : 0, y : 0 }, output: { x : 0, y : 0 } })
        let anyAngleArgs = reactive({  a : { x : 0, y : 0 },  radius: 0, angle : 0, iscounterclockwise : false, output: { x : 0, y : 0 } })
        let includedAngleArgs = reactive({ a : { x : 0, y : 0 }, b : { x : 0, y : 0 }, output: 0 })
        let clockwiseAngleArgs = reactive({ a : { x : 0, y : 0 }, b : { x : 0, y : 0 }, output: 0 })
        let counterclockwiseAngleArgs = reactive({ a : { x : 0, y : 0 }, b : { x : 0, y : 0 }, output: 0 })
        let distanceArgs = reactive({ a : { x : 0, y : 0 }, b : { x : 0, y : 0 }, output: 0 })

        let drawerPoint = () => {
            let ctx = canvas.value?.getContext && canvas.value.getContext("2d");
            if (!ctx || !canvas.value) 
                throw new Error("Invalid Canvas Context")
            ResetSymmetryBase();
            if (type.value[0] === "SymmetryPoint") {
                let { x, y, gutter } = descartes;
                let point = {
                    x : x + symmetryPointArgs.a.x * gutter,
                    y : y - symmetryPointArgs.a.y * gutter
                }
                ctx.beginPath();
                ctx.fillStyle = "red";
                ctx.arc(point.x, point.y, 5, 0, 2  * Math.PI);
                ctx.fill();
                ctx.closePath();
                let output =  Point.SymmetryPoint(point, descartes,  symmetryPointArgs.direction);
                ctx.beginPath();
                ctx.fillStyle = "blue";
                ctx.arc(output.x, output.y, 5, 0, 2  * Math.PI);
                ctx.fill();
                ctx.closePath();
                symmetryPointArgs.output.x = (output.x - x) / gutter;
                symmetryPointArgs.output.y = (y - output.y) / gutter;
            }

            if (type.value[0] === "SymmetryAnglePoint") {
                let { x, y, gutter } = descartes;
                let point = {
                    x: x + symmetryAngleArgs.a.x * gutter,
                    y : y - symmetryAngleArgs.a.y * gutter
                }
                ctx.beginPath();
                ctx.fillStyle = "red";
                ctx.arc(point.x, point.y, 5, 0, 2  * Math.PI);
                ctx.fill();
                let output =  Point.SymmetryAnglePoint(point, descartes);
                ctx.beginPath();
                ctx.fillStyle = "blue";
                ctx.arc(output.x, output.y, 5, 0, 2  * Math.PI);
                ctx.fill();
                ctx.closePath();
                symmetryAngleArgs.output.x = (output.x - x) / gutter;
                symmetryAngleArgs.output.y = (y - output.y) / gutter;
            }

            if (type.value[0] === "AnyAnglePoint") {
                let { x, y, gutter } = descartes;
                let point = Point.AnyAnglePoint(descartes, anyAngleArgs.angle, anyAngleArgs.radius * gutter, anyAngleArgs.iscounterclockwise);
                ctx.beginPath();
                ctx.fillStyle = "red";
                ctx.strokeStyle = "red";
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.arc(point.x, point.y, 5, 0,  2 * Math.PI);
                ctx.fill();
                ctx.moveTo(x, y);
                ctx.lineTo(point.x, point.y);
                ctx.stroke();
                ctx.closePath();
                anyAngleArgs.output.x = (point.x - x) / gutter ;
                anyAngleArgs.output.y = (y - point.y) / gutter ;
            }

            if (type.value[0] === "Angle") {
                let { x, y, gutter } = descartes;
                let point = {
                    x: x + includedAngleArgs.a.x * gutter,
                    y : y - includedAngleArgs.a.y * gutter
                }
                ctx.beginPath();
                ctx.fillStyle = "red";
                ctx.arc(point.x, point.y, 5, 0, 2  * Math.PI);
                ctx.fill();
                let output =  Point.Angle(point, descartes);
                ctx.beginPath();
                ctx.strokeStyle = "blue";
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.lineWidth = 2;
                ctx.arc(x, y, 20, 0, output * (Math.PI / 180),  output <  0);
                ctx.moveTo(x, y);
                ctx.lineTo(point.x, point.y);
                ctx.stroke();
                ctx.closePath();
                includedAngleArgs.output = output;
            }

            if (type.value[0] === "Distance") {
                let { x, y, gutter } = descartes;
                let point = {
                    x: x + distanceArgs.a.x * gutter,
                    y : y - distanceArgs.a.y * gutter
                }
                ctx.beginPath();
                ctx.fillStyle = "red";
                ctx.arc(x, y, 5, 0, 2  * Math.PI);
                ctx.arc(point.x, point.y, 5, 0, 2  * Math.PI);
                ctx.fill();
                ctx.closePath();
                let output =  Point.Distance(descartes, point);
                ctx.beginPath();
                ctx.strokeStyle = "red";
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.lineWidth = 2;
                ctx.moveTo(x, y);
                ctx.lineTo(point.x, point.y);
                ctx.stroke();
                ctx.fillText(output + "px", point.x + 10, point.y + 10);
                ctx.closePath();
                distanceArgs.output = output;
            }

            if (type.value[0] === "ClockwiseAngle") {
                let { x, y, gutter } = descartes;
                let point = {
                    x: x + clockwiseAngleArgs.a.x * gutter,
                    y : y - clockwiseAngleArgs.a.y * gutter
                }
                ctx.beginPath();
                ctx.fillStyle = "red";
                ctx.arc(point.x, point.y, 5, 0, 2  * Math.PI);
                ctx.fill();
                ctx.closePath();
                let output =  Point.ClockwiseAngle(point, descartes);
                ctx.beginPath();
                ctx.strokeStyle = "blue";
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.lineWidth = 2;
                ctx.arc(x, y, 20, 0, output * (Math.PI / 180));
                ctx.moveTo(x, y);
                ctx.lineTo(point.x, point.y);
                ctx.stroke();
                ctx.closePath();
                clockwiseAngleArgs.output = output;
            }

            if (type.value[0] === "CounterclockwiseAngle") {
                let { x, y, gutter } = descartes;
                let point = {
                    x: x + counterclockwiseAngleArgs.a.x * gutter,
                    y : y - counterclockwiseAngleArgs.a.y * gutter
                }
                ctx.beginPath();
                ctx.fillStyle = "red";
                ctx.arc(point.x, point.y, 5, 0, 2  * Math.PI);
                ctx.fill();
                ctx.closePath();
                let output =  Point.CounterclockwiseAngle(point, descartes);
                ctx.beginPath();
                ctx.strokeStyle = "blue";
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.lineWidth = 2;
                ctx.arc(x, y, 20, 0, (-output) * (Math.PI / 180), true);
                ctx.moveTo(x, y);
                ctx.lineTo(point.x, point.y);
                ctx.stroke();
                ctx.closePath();
                counterclockwiseAngleArgs.output = output;
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
            window.onreset = () => {
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
                        <acro-collapse-item header="对称点" key="SymmetryPoint">
                            <acro-form model={symmetryPointArgs} layout="vertical">
                                <acro-form-item label="A点 x坐标">
                                    <acro-input-number placeholder="Please Enter" default-value={0} mode="button" v-model={symmetryPointArgs.a.x} onChange={drawerPoint} />
                                </acro-form-item>
                                <acro-form-item label="A点 y坐标">
                                    <acro-input-number placeholder="Please Enter" default-value={0} mode="button" v-model={symmetryPointArgs.a.y} onChange={drawerPoint} />
                                </acro-form-item>
                                <acro-form-item label="参考点">
                                    <acro-input  model-value={JSON.stringify(symmetryPointArgs.b)} readonly></acro-input>
                                </acro-form-item>
                                <acro-form-item label="对称方向">
                                    <acro-radio-group v-model={ symmetryPointArgs.direction } type="button" onChange={drawerPoint}>
                                        <acro-radio value="h">水平</acro-radio>
                                        <acro-radio value="v">垂直</acro-radio>
                                    </acro-radio-group>
                                </acro-form-item>
                                <acro-form-item label="输出结果">
                                    <acro-textarea model-value={ JSON.stringify(symmetryPointArgs.output) } readonly />
                                </acro-form-item>
                            </acro-form>
                        </acro-collapse-item>
                        <acro-collapse-item header="对称角" key="SymmetryAnglePoint">
                            <acro-form model={symmetryAngleArgs} layout="vertical">
                                <acro-form-item label="A点 x坐标">
                                    <acro-input-number placeholder="Please Enter" default-value={0} mode="button" v-model={symmetryAngleArgs.a.x} onChange={drawerPoint} />
                                </acro-form-item>
                                <acro-form-item label="A点 y坐标">
                                    <acro-input-number placeholder="Please Enter" default-value={0} mode="button" v-model={symmetryAngleArgs.a.y} onChange={drawerPoint} />
                                </acro-form-item>
                                <acro-form-item label="参考点">
                                    <acro-input  model-value={JSON.stringify(symmetryAngleArgs.b)} readonly></acro-input>
                                </acro-form-item>
                                <acro-form-item label="输出结果">
                                    <acro-textarea model-value={ JSON.stringify(symmetryAngleArgs.output) } readonly />
                                </acro-form-item>
                            </acro-form>
                        </acro-collapse-item>
                        <acro-collapse-item header="任意角" key="AnyAnglePoint">
                            <acro-form model={anyAngleArgs} layout="vertical">
                                <acro-form-item label="参考点">
                                    <acro-input  model-value={JSON.stringify(anyAngleArgs.a)} readonly></acro-input>
                                </acro-form-item>
                                <acro-form-item label="半径">
                                    <acro-slider v-model={anyAngleArgs.radius} min={0} max={20} onChange={drawerPoint} />
                                </acro-form-item>
                                <acro-form-item label="角度">
                                    <acro-slider v-model={anyAngleArgs.angle} min={0} max={359} onChange={drawerPoint} />
                                </acro-form-item>
                                <acro-form-item label="方向">
                                    <acro-radio-group type="button" size="small" v-model={anyAngleArgs.iscounterclockwise}>
                                        <acro-radio value={false}>顺时针</acro-radio>
                                        <acro-radio value={true}>逆时针</acro-radio>
                                    </acro-radio-group>
                                </acro-form-item>
                                <acro-form-item label="输出结果">
                                    <acro-textarea model-value={ JSON.stringify(anyAngleArgs.output) } readonly />
                                </acro-form-item>
                            </acro-form>
                        </acro-collapse-item>
                        <acro-collapse-item header="两点距离" key="Distance">
                            <acro-form model={distanceArgs} layout="vertical">
                                <acro-form-item label="A点 x坐标">
                                    <acro-input-number placeholder="Please Enter" default-value={0} mode="button" v-model={distanceArgs.a.x} onChange={drawerPoint} />
                                </acro-form-item>
                                <acro-form-item label="A点 y坐标">
                                    <acro-input-number placeholder="Please Enter" default-value={0} mode="button" v-model={distanceArgs.a.y} onChange={drawerPoint} />
                                </acro-form-item>
                                <acro-form-item label="参考点">
                                    <acro-input  model-value={JSON.stringify(distanceArgs.b)} readonly></acro-input>
                                </acro-form-item>
                                <acro-form-item label="输出结果">
                                    <acro-textarea model-value={ JSON.stringify(distanceArgs.output) } readonly />
                                </acro-form-item>
                            </acro-form>
                        </acro-collapse-item>
                        <acro-collapse-item header="两点角度" key="Angle">
                            <acro-form model={includedAngleArgs} layout="vertical">
                                <acro-form-item label="A点 x坐标">
                                    <acro-input-number placeholder="Please Enter" default-value={0} mode="button" v-model={includedAngleArgs.a.x} onChange={drawerPoint} />
                                </acro-form-item>
                                <acro-form-item label="A点 y坐标">
                                    <acro-input-number placeholder="Please Enter" default-value={0} mode="button" v-model={includedAngleArgs.a.y} onChange={drawerPoint} />
                                </acro-form-item>
                                <acro-form-item label="参考点">
                                    <acro-input  model-value={JSON.stringify(includedAngleArgs.b)} readonly></acro-input>
                                </acro-form-item>
                                <acro-form-item label="输出结果">
                                    <acro-textarea model-value={ JSON.stringify(includedAngleArgs.output) } readonly />
                                </acro-form-item>
                            </acro-form>
                        </acro-collapse-item>
                        <acro-collapse-item header="点顺时针角度" key="ClockwiseAngle">
                            <acro-form model={clockwiseAngleArgs} layout="vertical">
                                <acro-form-item label="A点 x坐标">
                                    <acro-input-number placeholder="Please Enter" default-value={0} mode="button" v-model={clockwiseAngleArgs.a.x} onChange={drawerPoint} />
                                </acro-form-item>
                                <acro-form-item label="A点 y坐标">
                                    <acro-input-number placeholder="Please Enter" default-value={0} mode="button" v-model={clockwiseAngleArgs.a.y} onChange={drawerPoint} />
                                </acro-form-item>
                                <acro-form-item label="参考点">
                                    <acro-input  model-value={JSON.stringify(clockwiseAngleArgs.b)} readonly></acro-input>
                                </acro-form-item>
                                <acro-form-item label="输出结果">
                                    <acro-textarea model-value={ JSON.stringify(clockwiseAngleArgs.output) } readonly />
                                </acro-form-item>
                            </acro-form>
                        </acro-collapse-item>
                        <acro-collapse-item header="点逆时针角度" key="CounterclockwiseAngle">
                            <acro-form model={counterclockwiseAngleArgs} layout="vertical">
                                <acro-form-item label="A点 x坐标">
                                    <acro-input-number placeholder="Please Enter" default-value={0} mode="button" v-model={counterclockwiseAngleArgs.a.x} onChange={drawerPoint} />
                                </acro-form-item>
                                <acro-form-item label="A点 y坐标">
                                    <acro-input-number placeholder="Please Enter" default-value={0} mode="button" v-model={counterclockwiseAngleArgs.a.y} onChange={drawerPoint} />
                                </acro-form-item>
                                <acro-form-item label="参考点">
                                    <acro-input  model-value={JSON.stringify(counterclockwiseAngleArgs.b)} readonly></acro-input>
                                </acro-form-item>
                                <acro-form-item label="输出结果">
                                    <acro-textarea model-value={ JSON.stringify(counterclockwiseAngleArgs.output) } readonly />
                                </acro-form-item>
                            </acro-form>
                        </acro-collapse-item>
                    </acro-collapse>
                </div>
            </div>
        )
    }
})

/*
 * @Author: SongQian
 * @Date: 2022-04-27 14:19:02
 * @Description:  圆物理二维图形功能展示
 * @eMail: onlylove1172559463@vip.qq.com
 */
import { defineComponent, ComponentOptionsWithoutProps, SetupContext, onMounted, render, ref, reactive } from 'vue'
import { Geometry, Circle } from '~/seven'

type Props = {}
export default defineComponent<ComponentOptionsWithoutProps<Props>, any, any>({
    name : "CircleExamples",
    setup(props : Readonly<Props>, { slots, emit, attrs  } : SetupContext) : typeof render {
        let type = ref<Array<string>>(["GenerateCircle"]);
        let canvas = ref<HTMLCanvasElement>();
        let descartes = reactive<{ x : number, y : number, gutter : number }>({ x : 0, y : 0, gutter: 20 });

        let generateCircleArgs = reactive<{ a : Geometry.Point, radius : number, size : number, output: Array<any>}>({ a : { x : 0, y : 0 }, radius: 1, size : 10 , output: [] })
        let generateEllipseArgs = reactive<{ a : Geometry.Point, laxis : number, saxis : number, angle : number, size : number, output: Array<any>}>({  a : { x : 0, y : 0}, laxis : 1, saxis : 1, angle: 0, size : 10, output: [] })
        let ellipseAnyAngleXYArgs = reactive({ a : { x : 0, y : 0 }, laxis : 1, saxis : 1, angle : 0, output : { x : 0, y : 0 }})

        let drawCircle = () => {
            let ctx = canvas.value?.getContext && canvas.value.getContext("2d");
            if (!ctx || !canvas.value) 
                throw new Error("Invalid Canvas Context")
            ResetSymmetryBase();
            if (type.value[0] === "GenerateCircle") {
                let { x, y, gutter } = descartes;
                let point = {
                    x : x + generateCircleArgs.a.x * gutter,
                    y : y - generateCircleArgs.a.y * gutter
                }
                ctx.beginPath();
                ctx.fillStyle = "red";
                ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
                ctx.fill();
                ctx.closePath();
                let r = generateCircleArgs.radius * gutter;
                let output = Circle.GenerateCircle(point, r, generateCircleArgs.size);
                ctx.beginPath();
                ctx.fillStyle = "blue";
                output.points.forEach((it) => {
                    ctx?.moveTo(it.x, it.y);
                    ctx?.arc(it.x, it.y, 5, 0, 2  * Math.PI);
                })
                ctx.fill();
                ctx.closePath();
                generateCircleArgs.output = output.points.map(it => ({ x : (it.x - x) / gutter, y : (y - it.y) / gutter}));
            }

            if (type.value[0] === "GenerateEllipse") {
                let { x, y, gutter } = descartes;
                let point = {
                    x : x + generateEllipseArgs.a.x * gutter,
                    y : y - generateEllipseArgs.a.y * gutter
                }
                ctx.beginPath();
                ctx.fillStyle = "red";
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.lineWidth = 2;
                ctx.strokeStyle  = "red";
                ctx.arc(point.x, point.y, 5, 0, 2  * Math.PI);
                ctx.moveTo(point.x, point.y);
                ctx.lineTo(point.x + generateEllipseArgs.laxis * gutter, point.y);
                ctx.moveTo(point.x, point.y);
                ctx.lineTo(point.x, point.y - generateEllipseArgs.saxis * gutter);
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
                let output = Circle.GenerateEllipse(point, generateEllipseArgs.laxis * gutter, generateEllipseArgs.saxis * gutter, generateEllipseArgs.size);
                ctx.beginPath();
                ctx.fillStyle = "blue";
                output.points.forEach((it) => {
                    ctx?.moveTo(it.x, it.y);
                    ctx?.arc(it.x, it.y, 5, 0, 2 * Math.PI);
                });
                ctx.fill();
                ctx.closePath();
                generateEllipseArgs.output = output.points.map(it => ({ x : (it.x - x) / gutter, y : (y - it.y) / gutter}));
            }

            if (type.value[0] === "EllipseAnyAngleXY") {
                let { x, y, gutter } = descartes;
                let point = {
                    x : x + ellipseAnyAngleXYArgs.a.x * gutter,
                    y : y - ellipseAnyAngleXYArgs.a.y * gutter
                }
                ctx.beginPath();
                ctx.fillStyle = "red";
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.strokeStyle = "red";
                ctx.lineWidth = 2;
                ctx.arc(point.x, point.y, 5, 0, 2  * Math.PI);
                ctx.moveTo(point.x, point.y);
                ctx.lineTo(point.x + ellipseAnyAngleXYArgs.laxis * gutter, point.y);
                ctx.moveTo(point.x, point.y);
                ctx.lineTo(point.x, point.y - ellipseAnyAngleXYArgs.saxis * gutter);
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
                let output = Circle.EllipseAnyAngleXY(point, ellipseAnyAngleXYArgs.laxis * gutter, ellipseAnyAngleXYArgs.saxis * gutter, ellipseAnyAngleXYArgs.angle);
                ctx.beginPath();
                ctx.fillStyle = "blue";
                ctx.arc(output.x, output.y, 5, 0, 2 * Math.PI);
                ctx.fill();
                ctx.closePath();
                ellipseAnyAngleXYArgs.output = output;
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
                        <acro-collapse-item header="正圆" key="GenerateCircle">
                            <acro-form model={generateCircleArgs} layout="vertical">
                                <acro-form-item label="圆心 x坐标">
                                    <acro-slider v-model={generateCircleArgs.a.x} min={-20} max={ 20} step={ 1 } onChange={drawCircle} />
                                </acro-form-item>
                                <acro-form-item label="圆心 y坐标">
                                    <acro-slider v-model={generateCircleArgs.a.y} min={-20} max={ 20} step={ 1 } onChange={drawCircle} />
                                </acro-form-item>
                                <acro-form-item label="圆半径">
                                    <acro-slider v-model={generateCircleArgs.radius} min={1} max={ 20} step={ 1 } onChange={drawCircle} />
                                </acro-form-item>
                                <acro-form-item label="圆边界点数量">
                                    <acro-slider v-model={generateCircleArgs.size} min={10} max={1000} step={ 1 } onChange={drawCircle} />
                                </acro-form-item>
                                <acro-form-item label="输出结果">
                                    <acro-textarea model-value={ JSON.stringify(generateCircleArgs.output) } readonly />
                                </acro-form-item>
                            </acro-form>
                        </acro-collapse-item>
                        <acro-collapse-item header="椭圆" key="GenerateEllipse">
                                <acro-form model={generateEllipseArgs} layout="vertical">
                                    <acro-form-item label="圆心 x坐标">
                                        <acro-slider v-model={generateEllipseArgs.a.x} min={-20} max={ 20} step={ 1 } onChange={drawCircle} />
                                    </acro-form-item>
                                    <acro-form-item label="圆心 y坐标">
                                        <acro-slider v-model={generateEllipseArgs.a.y} min={-20} max={ 20} step={ 1 } onChange={drawCircle} />
                                    </acro-form-item>
                                    <acro-form-item label="长半轴">
                                        <acro-slider v-model={generateEllipseArgs.laxis} min={1} max={20} step={ 1 } onChange={drawCircle} />
                                    </acro-form-item>
                                    <acro-form-item label="短半轴">
                                        <acro-slider v-model={generateEllipseArgs.saxis} min={1} max={20} step={ 1 } onChange={drawCircle} />
                                    </acro-form-item>
                                    <acro-form-item label="椭圆倾斜角">
                                        <acro-slider v-model={generateEllipseArgs.angle} min={0} max={360} step={ 1 } onChange={drawCircle} />
                                    </acro-form-item>
                                    <acro-form-item label="椭圆边界点数量">
                                        <acro-slider v-model={generateEllipseArgs.size} min={10} max={1000} step={ 1 } onChange={drawCircle} />
                                    </acro-form-item>
                                    <acro-form-item label="输出结果">
                                        <acro-textarea model-value={ JSON.stringify(generateEllipseArgs.output) } readonly />
                                    </acro-form-item>
                                </acro-form>
                        </acro-collapse-item>
                        <acro-collapse-item header="获取椭圆上点位置" key="EllipseAnyAngleXY">
                            <acro-form model={ ellipseAnyAngleXYArgs} layout="vertical">
                                <acro-form-item label="圆心 x坐标">
                                    <acro-slider v-model={ ellipseAnyAngleXYArgs.a.x} min={-20} max={ 20} step={ 1 } onChange={drawCircle} />
                                </acro-form-item>
                                <acro-form-item label="圆心 y坐标">
                                    <acro-slider v-model={ ellipseAnyAngleXYArgs.a.y} min={-20} max={ 20} step={ 1 } onChange={drawCircle} />
                                </acro-form-item>
                                <acro-form-item label="长半轴">
                                    <acro-slider v-model={ ellipseAnyAngleXYArgs.laxis} min={1} max={20} step={ 1 } onChange={drawCircle} />
                                </acro-form-item>
                                <acro-form-item label="短半轴">
                                    <acro-slider v-model={ ellipseAnyAngleXYArgs.saxis} min={1} max={20} step={ 1 } onChange={drawCircle} />
                                </acro-form-item>
                                <acro-form-item label="角度">
                                    <acro-slider v-model={ ellipseAnyAngleXYArgs.angle} min={0} max={360} step={ 1 } onChange={drawCircle} />
                                </acro-form-item>
                                <acro-form-item label="输出结果">
                                    <acro-textarea model-value={ JSON.stringify(ellipseAnyAngleXYArgs.output) } readonly />
                                </acro-form-item>
                            </acro-form>
                        </acro-collapse-item>
                    </acro-collapse>
                </div>
            </div>
        )
    }
})
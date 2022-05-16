/*
 * @Author: SongQian
 * @Date: 2022-04-27 14:19:02
 * @Description:  圆物理二维图形功能展示
 * @eMail: onlylove1172559463@vip.qq.com
 */
import { defineComponent, ComponentOptionsWithoutProps, SetupContext, onMounted, render, ref, reactive } from 'vue'
import { Geometry, Circle, Point } from '~/seven'

type Props = {}
export default defineComponent<ComponentOptionsWithoutProps<Props>, any, any>({
    name : "CircleExamples",
    setup(props : Readonly<Props>, { slots, emit, attrs  } : SetupContext) : typeof render {
        let type = ref<Array<string>>(["GenerateCircle"]);
        let canvas = ref<HTMLCanvasElement>();
        let descartes = reactive<{ x : number, y : number, gutter : number }>({ x : 0, y : 0, gutter: 20 });

        let generateCircleArgs = reactive<{ a : Geometry.Point, radius : number, size : number, output: Array<any>}>({ a : { x : 0, y : 0 }, radius: 1, size : 10 , output: [] })
        let generateEllipseArgs = reactive<{ a : Geometry.Point, laxis : number, saxis : number, angle : number, size : number, output: Array<any>}>({  a : { x : 0, y : 0}, laxis : 1, saxis : 1, angle: 0, size : 10, output: [] })
        let ellipseAnyAngleXYArgs = reactive<{ a : Geometry.Point, laxis : number, saxis : number, angle : number, rotate: number, output: Geometry.Point}>({ a : { x : 0, y : 0 }, laxis : 1, saxis : 1, angle : 0, rotate: 0, output : { x : 0, y : 0 }})
        let ellipseEccentricityArgs = reactive<{ laxis : number, saxis : number, output: number }>({ laxis: 0, saxis: 0, output: 0 })
        let ellipseFocusArgs = reactive<{ laxis : number, saxis : number, rotate: number, output: [Geometry.Point, Geometry.Point] }>({ laxis: 0, saxis: 0, rotate: 0, output: [{x : 0, y: 0}, {x : 0, y: 0}]})
        let ellipseFocusShortStringsArgs = reactive<{ laxis: number, saxis: number, isRight: boolean, output: [Geometry.Point, Geometry.Point, number] }>({ laxis: 0, saxis: 0, isRight: true, output: [{ x: 0, y : 0}, { x: 0, y : 0}, 0] })
        let inEllipseArgs = reactive<{ a : Geometry.Point, o : Geometry.Point, laxis : number, saxis : number, output: number }>({ a : { x : 0, y : 0 },  o : { x : 0, y : 0 }, laxis : 0, saxis: 0, output: 0  })
        let ellipseFocusRadiusArgs = reactive<{ angle: number, laxis: number, saxis: number, output: [number, number] }>({ angle: 0, laxis: 0, saxis: 0, output: [0, 0] });
        let inCircleArgs = reactive<{ a :Geometry.Point, radius: number, output: number }>({ a: {x : 0, y : 0}, radius: 0, output: 0 });
  
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

            if (type.value[0] === "InCircle") { 
                let { x, y, gutter } = descartes;
                let point = {
                    x : x + inCircleArgs.a.x * gutter,
                    y : y - inCircleArgs.a.y * gutter
                }
                ctx.beginPath();
                ctx.fillStyle = "red";
                ctx.moveTo(x, y);
                ctx.arc(x, y, 5, 0, 2 * Math.PI);
                let c = Circle.GenerateCircle({ x, y }, inCircleArgs.radius * gutter, 30);
                c.points.forEach((it) => { 
                    ctx?.moveTo(it.x, it.y);
                    ctx?.arc(it.x, it.y, 5, 0, 2 * Math.PI);
                })
                ctx.fill();
                ctx.closePath();
                let output = Circle.InCircle({ x, y }, point, inCircleArgs.radius * gutter);
                ctx.beginPath();
                ctx.fillStyle = "blue";
                ctx.moveTo(point.x, point.y);
                ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
                ctx.fill();
                ctx.fillText(output < 0 ? "圆内" : output === 0 ? "圆上" : output === 1 ? "圆外" : "飞出宇宙", point.x + 10, point.y + 10);
                ctx.closePath();
                inCircleArgs.output = output;
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
                let output = Circle.GenerateEllipse(point, generateEllipseArgs.laxis * gutter, generateEllipseArgs.saxis * gutter, generateEllipseArgs.size, generateEllipseArgs.angle);
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
                let dist = Point.Distance(point, { x:  point.x + ellipseAnyAngleXYArgs.laxis * gutter, y : point.y});
                let p = Point.AnyAnglePoint(point, ellipseAnyAngleXYArgs.rotate, dist, false);
                ctx.lineTo(p.x, p.y);
                ctx.moveTo(point.x, point.y);
                dist = Point.Distance(point, { x:  point.x, y : point.y - ellipseAnyAngleXYArgs.saxis * gutter });
                p = Point.AnyAnglePoint(point, ellipseAnyAngleXYArgs.rotate  - 90, dist, false);
                ctx.lineTo(p.x, p.y);
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
                let output = Circle.EllipseAnyAngleXY(point, ellipseAnyAngleXYArgs.laxis * gutter, ellipseAnyAngleXYArgs.saxis * gutter, ellipseAnyAngleXYArgs.angle, ellipseAnyAngleXYArgs.rotate);
                ctx.beginPath();
                ctx.fillStyle = "blue";
                ctx.arc(output.x, output.y, 5, 0, 2 * Math.PI);
                ctx.fill();
                ctx.closePath();
                ellipseAnyAngleXYArgs.output = { x : (output.x - x) / gutter, y :  (y - output.y) / gutter };
            }

            if (type.value[0] === "EllipseEccentricity") {
                let { x, y, gutter } = descartes;
                ctx.beginPath();
                ctx.fillStyle = "red";
                ctx.strokeStyle = "red";
                ctx.lineCap  = "round";
                ctx.lineJoin = "round";
                ctx.lineWidth = 2;
                ctx.moveTo(x, y);
                ctx.arc(x, y, 5, 0 , 2  * Math.PI)
                ctx.moveTo(x + ellipseEccentricityArgs.laxis * gutter, y);
                ctx.arc(x + ellipseEccentricityArgs.laxis * gutter, y, 5, 0, 2 * Math.PI);
                ctx.moveTo(x, y + ellipseEccentricityArgs.saxis * gutter);
                ctx.arc(x, y + ellipseEccentricityArgs.saxis * gutter, 5, 0, 2 * Math.PI);
                ctx.fill();
                ctx.moveTo(x, y);
                ctx.lineTo(x + ellipseEccentricityArgs.laxis * gutter, y);
                ctx.moveTo(x, y);
                ctx.lineTo(x, y + ellipseEccentricityArgs.saxis * gutter);
                ctx.stroke();
                ctx.closePath();
                let output = Circle.EllipseEccentricity(ellipseEccentricityArgs.saxis * gutter, ellipseEccentricityArgs.laxis * gutter);
                let circle = Circle.GenerateEllipse(descartes, ellipseEccentricityArgs.laxis * gutter, ellipseEccentricityArgs.saxis * gutter, 20);
                ctx.beginPath();
                ctx.fillStyle = "blue";
                circle.points.forEach(it => {
                    ctx?.moveTo(it.x, it.y);
                    ctx?.arc(it.x, it.y, 5, 0, 2  * Math.PI);
                })
                ctx.fill();
                ctx.fillText(String(output.E), x + 10, y - 10);
                ellipseEccentricityArgs.output = output.E || 0;
            }

            if (type.value[0] === "EllipseFocus") {
                let { x, y, gutter } = descartes;
                let output = Circle.EllipseFocus(descartes, ellipseFocusArgs.saxis * gutter, ellipseFocusArgs.laxis * gutter, ellipseFocusArgs.rotate);
                let circle = Circle.GenerateEllipse(descartes, ellipseFocusArgs.laxis * gutter, ellipseFocusArgs.saxis * gutter, 30, ellipseFocusArgs.rotate);
                ctx.beginPath();
                ctx.fillStyle = "red";
                ctx.strokeStyle = "red";
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.lineWidth = 2;
                ctx.moveTo(x, y);
                ctx.arc(x, y, 5, 0 , 2  * Math.PI)
                circle.points.forEach(it => {
                    ctx?.moveTo(it.x, it.y);
                    ctx?.arc(it.x, it.y, 5, 0, 2  * Math.PI);
                })
                ctx.fill();
                let dist = Point.Distance(descartes, { x:  x + ellipseFocusArgs.laxis * gutter, y});
                let p = Point.AnyAnglePoint(descartes, ellipseFocusArgs.rotate, dist, false);
                ctx.moveTo(x, y);
                ctx.lineTo(p.x, p.y);
                dist = Point.Distance(descartes, { x:  x, y : y - ellipseFocusArgs.saxis * gutter });
                p = Point.AnyAnglePoint(descartes, ellipseFocusArgs.rotate  - 90, dist, false);
                ctx.moveTo(x, y);
                ctx.lineTo(p.x, p.y);
                ctx.stroke();
                ctx.closePath();
                ctx.beginPath();
                ctx.fillStyle = "blue";
                ctx.moveTo(output.PF1.x, output.PF1.y);
                ctx.arc(output.PF1.x, output.PF1.y, 5, 0, 2  * Math.PI);
                ctx.moveTo(output.PF2.x, output.PF2.y);
                ctx.arc(output.PF2.x, output.PF2.y, 5, 0, 2  * Math.PI);
                ctx.moveTo(output.PF1.x, output.PF1.y);
                ctx.lineTo(output.PF2.x, output.PF2.y);
                ctx.fill();
                ctx.closePath();
                ellipseFocusArgs.output = [output.PF1, output.PF2];
            }

            if (type.value[0] === "EllipseFocusShortStrings") {
                let { x, y, gutter } = descartes;
                let { P1, P2, D } = Circle.EllipseFocusShortStrings({x, y}, ellipseFocusShortStringsArgs.saxis * gutter, ellipseFocusShortStringsArgs.laxis * gutter, ellipseFocusShortStringsArgs.isRight);
                let circle = Circle.GenerateEllipse(descartes, ellipseFocusShortStringsArgs.laxis * gutter, ellipseFocusShortStringsArgs.saxis * gutter, 30);
                ctx.beginPath();
                ctx.fillStyle = "red";
                ctx.moveTo(x, y);
                ctx.arc(x, y, 5, 0 , 2  * Math.PI);
                circle.points.forEach(it => {
                    ctx?.moveTo(it.x, it.y);
                    ctx?.arc(it.x, it.y, 5, 0, 2  * Math.PI);
                })
                ctx.fill();
                ctx.closePath();
                ctx.beginPath();
                ctx.fillStyle = "blue";
                ctx.strokeStyle = "blue";
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.lineWidth = 2;
                ctx.moveTo(P1.x, P1.y);
                ctx.arc(P1.x, P1.y, 5, 0 , 2 * Math.PI);
                ctx.moveTo(P2.x, P2.y);
                ctx.arc(P2.x, P2.y, 5, 0 , 2 * Math.PI);
                ctx.moveTo(P1.x, P1.y);
                ctx.lineTo(P2.x, P2.y);
                ctx.stroke();
                ctx.fill();
                ctx.closePath();
                ellipseFocusShortStringsArgs.output = [
                    { x : (P2.x - x) / gutter, y : (y - P2.y) / gutter },
                    { x : (P1.x - x) / gutter, y : (y - P1.y) / gutter },
                    D / gutter
                ]
            }

            if (type.value[0] === "InEllipse") {
                let { x, y, gutter } = descartes;
                let aPoint = {
                    x : x + inEllipseArgs.a.x * gutter,
                    y : y - inEllipseArgs.a.y * gutter
                }
                let output = Circle.InEllipse(aPoint, descartes, inEllipseArgs.saxis * gutter, inEllipseArgs.laxis * gutter);
                let { points } = Circle.GenerateEllipse(descartes, inEllipseArgs.laxis * gutter, inEllipseArgs.saxis * gutter, 30, 0);
                ctx.beginPath();
                ctx.fillStyle = "red";
                ctx.strokeStyle = "red";
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.moveTo(x, y);
                ctx.arc(x, y, 5, 0 , 2  * Math.PI);
                points.forEach((it) => {
                    ctx?.moveTo(it.x, it.y);
                    ctx?.arc(it.x, it.y, 5, 0 , 2 * Math.PI);
                })
                ctx.fill();
                ctx.closePath();
                ctx.beginPath();
                ctx.fillStyle = "blue";
                ctx.strokeStyle = "blue";
                ctx.moveTo(aPoint.x, aPoint.y);
                ctx.arc(aPoint.x, aPoint.y, 5, 0, 2  * Math.PI);
                ctx.fillText(output < 1 ? "圆内" : output === 1 ? "圆边界" : output > 1  ? "圆外" : "飞出宇宙?", aPoint.x + 10, aPoint.y + 10);
                ctx.fill();
                ctx.closePath();
                inEllipseArgs.output = output;
            }

            if (type.value[0] === "EllipseFocusRadius") {
                let { x, y, gutter } = descartes;
                let { points }  = Circle.GenerateEllipse(descartes, ellipseFocusRadiusArgs.laxis * gutter, ellipseFocusRadiusArgs.saxis * gutter, 50);
                let aPoint = Circle.EllipseAnyAngleXY(descartes, ellipseFocusRadiusArgs.laxis * gutter, ellipseFocusRadiusArgs.saxis * gutter, ellipseFocusRadiusArgs.angle);
                let { PF1, PF2 } = Circle.EllipseFocus(descartes, ellipseFocusRadiusArgs.saxis * gutter, ellipseFocusRadiusArgs.laxis * gutter);
                let { MR1, MR2 } = Circle.EllipseFocusRadius(aPoint, descartes, ellipseFocusRadiusArgs.saxis * gutter, ellipseFocusRadiusArgs.laxis * gutter);
                ctx.beginPath();
                ctx.fillStyle = "red";
                ctx.moveTo(x, y);
                ctx.arc(x, y, 5, 0 , 2  * Math.PI);
                ctx.moveTo(PF1.x, PF1.y);
                ctx.arc(PF1.x, PF1.y, 5, 0 , 2 * Math.PI);
                ctx.moveTo(PF2.x, PF2.y);
                ctx.arc(PF2.x, PF2.y, 5, 0 , 2 * Math.PI);
                points.forEach((it) => {
                    ctx?.moveTo(it.x, it.y);
                    ctx?.arc(it.x, it.y, 5, 0, 2  * Math.PI);
                })
                ctx.fillText("PF1", PF1.x - 10, PF1.y + 10);
                ctx.fillText("PF2", PF2.x - 10, PF2.y + 10);
                ctx.fill();
                ctx.closePath();
                ctx.beginPath();
                ctx.fillStyle = "blue";
                ctx.strokeStyle = "blue";
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.lineWidth = 2;
                ctx.moveTo(aPoint.x, aPoint.y);
                ctx.arc(aPoint.x, aPoint.y, 5, 0, 2  * Math.PI);
                ctx.fill();
                ctx.moveTo(PF1.x, PF1.y);
                ctx.lineTo(aPoint.x, aPoint.y);
                ctx.moveTo(PF2.x, PF2.y);
                ctx.lineTo(aPoint.x, aPoint.y);
                let p = { x : (aPoint.x + PF1.x) / 2, y : (aPoint.y + PF1.y) / 2 };
                ctx.moveTo(p.x, p.y);
                ctx.fillText(`MR1: ${Math.ceil(MR1 / gutter * 100) / 100}`, p.x, p.y);
                p = { x: (aPoint.x + PF2.x) / 2, y : (aPoint.y + PF2.y) / 2 };
                ctx.moveTo(p.x, p.y);
                ctx.fillText(`MR2:${Math.ceil(MR2 / gutter * 100) / 100}`,p.x, p.y);
                ctx.stroke();
                ctx.closePath();
                ellipseFocusRadiusArgs.output = [MR1 / gutter, MR2 / gutter];
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
                        <acro-collapse-item header="点与圆关系" key="InCircle">
                            <acro-form model={inCircleArgs} layout="vertical">
                                <acro-form-item label="判定点 x坐标">
                                    <acro-slider v-model={inCircleArgs.a.x} min={-20} max={ 20} step={ 1 } onChange={drawCircle} />
                                </acro-form-item>
                                <acro-form-item label="判定点 y坐标">
                                    <acro-slider v-model={inCircleArgs.a.y} min={-20} max={ 20} step={ 1 } onChange={drawCircle} />
                                </acro-form-item>
                                <acro-form-item label="圆半径">
                                    <acro-slider v-model={inCircleArgs.radius} min={0} max={ 20} step={ 1 } onChange={drawCircle} />
                                </acro-form-item>
                                <acro-form-item label="输出结果">
                                    <acro-textarea model-value={ JSON.stringify(inCircleArgs.output) } readonly />
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
                                <acro-form-item label="旋转">
                                    <acro-slider v-model={ ellipseAnyAngleXYArgs.rotate} min={0} max={360} step={ 1 } onChange={drawCircle} />
                                </acro-form-item>
                                <acro-form-item label="输出结果">
                                    <acro-textarea model-value={ JSON.stringify(ellipseAnyAngleXYArgs.output) } readonly />
                                </acro-form-item>
                            </acro-form>
                        </acro-collapse-item>
                        <acro-collapse-item header="椭圆离心率" key="EllipseEccentricity">
                            <acro-form model={ellipseEccentricityArgs} layout="vertical">
                                <acro-form-item label="长半轴">
                                    <acro-slider v-model={ ellipseEccentricityArgs.laxis} min={0} max={ 50} step={ 1 } onChange={drawCircle} />
                                </acro-form-item>
                                <acro-form-item label="短半轴">
                                    <acro-slider v-model={ ellipseEccentricityArgs.saxis} min={0} max={ 50} step={ 1 } onChange={drawCircle} />
                                </acro-form-item>
                                <acro-form-item label="输出结果">
                                    <acro-textarea model-value={ JSON.stringify(ellipseEccentricityArgs.output) } readonly />
                                </acro-form-item>
                            </acro-form>
                        </acro-collapse-item>
                        <acro-collapse-item header="椭圆焦点" key="EllipseFocus">
                            <acro-form model={ellipseFocusArgs} layout="vertical">
                                <acro-form-item label="长半轴">
                                    <acro-slider v-model={ ellipseFocusArgs.laxis} min={0} max={ 50} step={ 1 } onChange={drawCircle} />
                                </acro-form-item>
                                <acro-form-item label="短半轴">
                                    <acro-slider v-model={ ellipseFocusArgs.saxis} min={0} max={ ellipseFocusArgs.laxis } step={ 1 } onChange={drawCircle} />
                                </acro-form-item>
                                <acro-form-item label="旋转角度">
                                    <acro-slider v-model={ ellipseFocusArgs.rotate } min={0} max={ 359} step={ 1 } onChange={drawCircle} />
                                </acro-form-item>
                                <acro-form-item label="输出结果">
                                    <acro-textarea model-value={ JSON.stringify(ellipseFocusArgs.output) } readonly />
                                </acro-form-item>
                            </acro-form>
                        </acro-collapse-item>
                        <acro-collapse-item header="椭圆通径" key="EllipseFocusShortStrings">
                            <acro-form model={ellipseFocusShortStringsArgs} layout="vertical">
                                <acro-form-item label="通径方向">
                                    <acro-radio-group  v-model={ellipseFocusShortStringsArgs.isRight} type="button" size="small" onChange={drawCircle}>
                                        <acro-radio value={true}>右侧</acro-radio>
                                        <acro-radio value={false}>左侧</acro-radio>
                                    </acro-radio-group>
                                </acro-form-item>
                                <acro-form-item label="长半轴">
                                    <acro-slider v-model={ ellipseFocusShortStringsArgs.laxis} min={0} max={ 50} step={ 1 } onChange={drawCircle} />
                                </acro-form-item>
                                <acro-form-item label="短半轴">
                                    <acro-slider v-model={ ellipseFocusShortStringsArgs.saxis} min={0} max={ ellipseFocusShortStringsArgs.laxis } step={ 1 } onChange={drawCircle} />
                                </acro-form-item>
                                <acro-form-item label="输出结果">
                                    <acro-textarea model-value={ JSON.stringify(ellipseFocusShortStringsArgs.output) } readonly />
                                </acro-form-item>
                            </acro-form>
                        </acro-collapse-item>
                        <acro-collapse-item header="点与椭圆位置关系" key="InEllipse">
                            <acro-form model={inEllipseArgs} layout="vertical">
                                <acro-form-item label="长半轴">
                                    <acro-slider v-model={ inEllipseArgs.laxis} min={0} max={ 50} step={ 1 } onChange={drawCircle} />
                                </acro-form-item>
                                <acro-form-item label="短半轴">
                                    <acro-slider v-model={ inEllipseArgs.saxis} min={0} max={ inEllipseArgs.laxis } step={ 1 } onChange={drawCircle} />
                                </acro-form-item>
                                <acro-form-item label="入参点 X坐标">
                                    <acro-slider v-model={ inEllipseArgs.a.x} min={-20} max={ 20 } step={ 1 } onChange={drawCircle} />
                                </acro-form-item>
                                <acro-form-item label="入参点 Y坐标">
                                    <acro-slider v-model={ inEllipseArgs.a.y} min={-20} max={ 20 } step={ 1 } onChange={drawCircle} />
                                </acro-form-item>
                                <acro-form-item label="输出结果">
                                    <acro-textarea model-value={ JSON.stringify(inEllipseArgs.output) } readonly />
                                </acro-form-item>
                            </acro-form>
                        </acro-collapse-item>
                        <acro-collapse-item header="焦半径" key="EllipseFocusRadius">
                            <acro-form model={ellipseFocusRadiusArgs} layout="vertical">
                                <acro-form-item label="长半轴">
                                    <acro-slider v-model={ ellipseFocusRadiusArgs.laxis} min={0} max={ 50} step={ 1 } onChange={drawCircle} />
                                </acro-form-item>
                                <acro-form-item label="短半轴">
                                    <acro-slider v-model={ ellipseFocusRadiusArgs.saxis} min={0} max={ ellipseFocusRadiusArgs.laxis } step={ 1 } onChange={drawCircle} />
                                </acro-form-item>
                                <acro-form-item label="椭圆边界点">
                                    <acro-slider v-model={ ellipseFocusRadiusArgs.angle} min={0} max={360 } step={ 1 } onChange={drawCircle} />
                                </acro-form-item>
                                <acro-form-item label="输出结果">
                                    <acro-textarea model-value={ JSON.stringify(ellipseFocusRadiusArgs.output) } readonly />
                                </acro-form-item>
                            </acro-form>
                        </acro-collapse-item>
                    </acro-collapse>
                </div>
            </div>
        )
    }
})
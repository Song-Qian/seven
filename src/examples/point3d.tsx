/*
 * @Author: SongQian
 * @LastEditors: SongQian
 * @Date: 2022/07/07 10:01
 * @eMail: onlylove117225594632vip.qq.com
 * @Description: 三维点运算案例
 */
import { defineComponent, ComponentOptionsWithoutProps, SetupContext, render, onMounted, ref, reactive, withModifiers } from 'vue'
import { Scene, Object3D, PerspectiveCamera, AxesHelper, WebGLRenderer, sRGBEncoding, Color, LineBasicMaterial, BoxHelper, BoxGeometry, BufferGeometry, SphereGeometry, Float32BufferAttribute, LineSegments, MeshBasicMaterial, Mesh } from 'three'
import * as THREE from 'three'
import { AnyAnglePoint } from '~/seven/point3d'
import { Vertex3D } from '~/seven/declare'

type Props = {}

export default defineComponent<ComponentOptionsWithoutProps<Props>, any, any>({
    name: 'Point3dExamples',
    setup(props: Readonly<Props>, { emit, slots, attrs }: SetupContext): typeof render { 
        let type = ref<string[]>(["SymmetryPoint"])
        let canvas  = ref<HTMLDivElement>();
        let descartes = reactive<{ x: number, y: number, gutter: number }>({ x: 0, y: 0, gutter: 60 });
        let state = reactive({ isMove: false, move: { x: 0, y: 0, rx: 0, ry: 0 } });
        let scene = new Scene();
        scene.background = new Color(0x000);
        let body = new Object3D();
        let ctx = new Object3D();
        const renderer = new WebGLRenderer({ antialias: true });
        let camera = new PerspectiveCamera(60, 1, 1, 3000);
        camera.position.set(0, 0, 1500);
        camera.lookAt(scene.position);
        const axesHelper = new AxesHelper(100);
        const box = new BoxGeometry(1200, 1200, 1200);
        box.translate(0, 0, 0);
        const boxMaterialHelper = new LineBasicMaterial({ color: 0xffffff, linewidth: 1 });
        const boxHelper = new BoxHelper(new Mesh(box, boxMaterialHelper), 0xffffff);
        body.add(axesHelper);
        body.add(boxHelper);
        body.add(ctx);
        scene.add(body);

        let anyAngleArgs = reactive<{ x: number, y: number, z: number, radius: number, polar: number, angle: number, iscounterclockwise: boolean, output: Vertex3D }>({ x: 0, y: 0, z: 0, iscounterclockwise: false, polar: 0, radius: 0, angle: 0, output: { x: 0, y: 0, z: 0 } });
        
        const updateCameraDistance = withModifiers((e: WheelEvent) => {
            if (e.deltaY < 0) { 
                camera.position.z-=10;
                camera.position.z = camera.position.z < 1 ? 1 : camera.position.z;
            }

            if (e.deltaY > 0) { 
                camera.position.z+=10;
                camera.position.z = camera.position.z > 3000 ? 3000 : camera.position.z;
            }
            camera.updateProjectionMatrix();
        }, ["capture", "stop", "prevent"]);
        
        const updateSceneRotate = withModifiers((e: MouseEvent) => {
            if (e.type === "mousedown" && !state.isMove) { 
                state.isMove = true;
                state.move.x = e.offsetX;
                state.move.y = e.offsetY;
                state.move.rx = body.rotation.x;
                state.move.ry = body.rotation.y;
            }

            if (["mouseup", "mouseleave"].indexOf(e.type) > -1 && state.isMove) { 
                state.isMove = false;
                state.move.x = 0;
                state.move.y = 0;
                state.move.rx = body.rotation.x;
                state.move.ry = body.rotation.y;
            }

            if (e.type === "mousemove" && e.button === 0 && state.isMove) { 
                let y = e.offsetX- state.move.x;
                let x = e.offsetY - state.move.y;
                let d = (Math.PI * 2) / 3600;
                body.rotation.set(state.move.rx + (x * d), state.move.ry + (y * d), 0, "XYZ");
            }
        }, ["capture", "stop", "prevent"])

        let drawerPoint = (e : MouseEvent) => {
            if (type.value[0] === 'AnyAnglePoint') { 
                ctx.clear();
                let oGeometry = new SphereGeometry(10, 32, 64);
                let nGeometry = new SphereGeometry(10, 32, 64);
                let lineGeometry = new BufferGeometry();
                let v = AnyAnglePoint({ x: 0, y: 0, z: 0 }, anyAngleArgs.angle, anyAngleArgs.polar, anyAngleArgs.radius * descartes.gutter, anyAngleArgs.iscounterclockwise);
                lineGeometry.setAttribute("position", new Float32BufferAttribute([0,0,0, v.x,v.y,v.z], 3));
                nGeometry.translate(v.x, v.y, v.z);
                let material = new MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });
                let material1 = new MeshBasicMaterial({ color: 0x0000ff, side: THREE.DoubleSide });
                let material2 = new LineBasicMaterial({ color: 0x0000ff, linewidth: 2 });
                let mesh = new Mesh(oGeometry, material);
                let mesh1 = new Mesh(nGeometry, material1);
                let mesh2 = new LineSegments(lineGeometry, material2);
                ctx.add(mesh);
                ctx.add(mesh1);
                ctx.add(mesh2);
                anyAngleArgs.output.x = Number((v.x / descartes.gutter).toFixed(4));
                anyAngleArgs.output.y = Number((v.y / descartes.gutter).toFixed(4));
                anyAngleArgs.output.z = Number((v.z / descartes.gutter).toFixed(4));
            }
        }

        let ResetSymmetryBase = () => {
            if (!canvas.value) {
                return;
            }
            camera.aspect = canvas.value.clientWidth / canvas.value.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(canvas.value.clientWidth, canvas.value.clientHeight);
            renderer.outputEncoding = sRGBEncoding;
            canvas.value.appendChild(renderer.domElement);
            renderer.clear();
            let grid = [
                ...(new Array(20).fill(0).map((_, x) => [
                    (-(20 * descartes.gutter) / 2) + x * descartes.gutter, (20 * descartes.gutter) / 2, 0,
                    (-(20 * descartes.gutter) / 2) + x * descartes.gutter, -(20 * descartes.gutter) / 2, 0
                ]).flat(2)),
                ...(new Array(20).fill(0).map((_, y) => [
                    -(20 * descartes.gutter) / 2, (20 * descartes.gutter) / 2 - y * descartes.gutter, 0,
                    20 * descartes.gutter / 2, (20 * descartes.gutter) / 2 - y * descartes.gutter, 0
                ]).flat(2))
            ];
            let geometry = new BufferGeometry();
            geometry.setAttribute("position", new Float32BufferAttribute(grid as Array<number>, 3));
            let material = new LineBasicMaterial({ color: 0x333333, linewidth: 1, opacity: 0.5, transparent: true });
            let mash = new LineSegments(geometry, material);
            body.add(mash);
            const refresh = () => (renderer.clear(), renderer.render(scene, camera), requestAnimationFrame(refresh));
            requestAnimationFrame(refresh);
        }

        onMounted(() => {
            ResetSymmetryBase();
            window.onresize = () => { 
                if (!canvas.value) {
                    return;
                }
                camera.aspect = canvas.value.clientWidth / canvas.value.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(canvas.value.clientWidth, canvas.value.clientHeight);
            }
        })

        return () => (
            <div class="container">
                <div class="drawer-wapper" ref={canvas} onWheel={updateCameraDistance} onMousemove={updateSceneRotate} onMousedown={updateSceneRotate} onMouseup={updateSceneRotate} onMouseleave={updateSceneRotate}></div>
                <div class="drawer-args">
                    <acro-collapse v-model={[type.value, "active-key"]} accordion>
                        <acro-collapse-item header="任意角" key="AnyAnglePoint">
                            <acro-form model={anyAngleArgs} layout="vertical">
                                <acro-form-item label="x">
                                    <acro-input model-value={JSON.stringify({ x: 0, y: 0, z: 0 })} readonly></acro-input>
                                </acro-form-item>
                                <acro-form-item label="半径">
                                    <acro-slider v-model={anyAngleArgs.radius} min={0} max={20} onChange={drawerPoint} />
                                </acro-form-item>
                                <acro-form-item label="极角">
                                    <acro-slider v-model={anyAngleArgs.polar} min={0} max={359} onChange={drawerPoint} />
                                </acro-form-item>
                                <acro-form-item label="方位角">
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
                    </acro-collapse>
                </div>
            </div>
        )
    }
})
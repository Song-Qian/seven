/*
 * @Author: SongQian
 * @LastEditors: SongQian
 * @Date: 2022/08/02 13:48
 * @eMail: onlylove117225594632vip.qq.com
 * @Description: 这是一个魔术，来自Author创作，需要修改请留下大名~!
 */
import { defineComponent, ComponentOptionsWithoutProps, SetupContext, render, onMounted, ref, reactive, withModifiers } from 'vue'
import { Scene, Object3D, PerspectiveCamera, AxesHelper, WebGLRenderer, sRGBEncoding, Color, LineBasicMaterial, BoxHelper, BoxGeometry, BufferGeometry, SphereGeometry, Float32BufferAttribute, LineSegments, PointsMaterial, Points, Mesh, Line, MeshBasicMaterial } from 'three'
import * as THREE from "three"
import { Vertex3D } from "~/seven/declare"
import { Delaunay3d } from "~/seven/delaunay"
import { AnyAnglePoint } from "~/seven/point3d"

type Props = {}

export default defineComponent<ComponentOptionsWithoutProps<Props>, any, any>({
    name: "PointCloudExamples",
    setup(props: Readonly<Props>, { emit, attrs, slots }: SetupContext): typeof render { 
        
        let type = ref<string[]>(["SymmetryPoint"])
        let canvas  = ref<HTMLDivElement>();
        let descartes = reactive<{ x: number, y: number, gutter: number }>({ x: 0, y: 0, gutter: 60 });
        let state = reactive({ isMove: false, move: { x: 0, y: 0, rx: 0, ry: 0 } });
        let delaunayArgs = reactive<{ points: Array<Vertex3D>, ver: Vertex3D, total: number, output: Array<any> }>({ points: [], ver: { x: 0, y: 0, z: 0 }, total: 3, output: [] });
        
        let scene = new Scene();
        scene.background = new Color(0x000);
        let body = new Object3D();
        let ctx = new Object3D();
        const renderer = new WebGLRenderer({ antialias: true });
        let camera = new PerspectiveCamera(60, 1, 1, 3000000);
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

        let drawerPoint = () => {
            ctx.clear();
            if (type.value[0] === 'ConcaveHull') { 
                let { gutter } = descartes;
                
                let vertex = [];
                vertex.push({ x: 7, y: 150, z: 2.5 });
                vertex.push({ x: -7, y: 150, z: 2.5 });
                vertex.push(...new Array(10).fill(0).map((_, i) => AnyAnglePoint({ x: -7, y: 147, z: 2.5 }, 90 - (90 / 10 * i), 90, 3)));
                vertex.push({ x: -10, y: -150, z: 2.5 });
                vertex.push(...new Array(10).fill(0).map((_, i) => AnyAnglePoint({ x: -10, y: -150, z: 12.5 }, 270, 180 - (45 / 10 * i), 10, [0, 0, 0], true)));
                let node = AnyAnglePoint(vertex[vertex.length - 1], 270, 45, 10, [0,0,0]);
                vertex.push(node);
                vertex.push(...(new Array(10).fill(0).map((_, i) => AnyAnglePoint({ x: node.x + 3, y: node.y, z: node.z }, 0, 90 - (90 / 10 * i), 3, [45, 0, 0]))));
                vertex.push({ x: vertex[vertex.length - 1].x + 14, y: vertex[vertex.length - 1].y, z: vertex[vertex.length - 1].z });
                node = { x: node.x + 17, y: node.y, z: node.z };
                vertex.push(...(new Array(10).fill(0).map((_, i) => AnyAnglePoint(node, 0, 360 - (90 / 10 * i), 3, [45, 0, 0]))));
                node = vertex[vertex.length - 1];
                vertex.push(AnyAnglePoint(node, 0, 180, 10, [45, 0, 0]));
                vertex.push(...(new Array(10).fill(0).map((_, i) => AnyAnglePoint({ x: 10, y: -150, z: 12.5 }, 270, 90, 10, [45 + (45 / 10 * i), 0, 0]))));
                vertex.push({ x: 10, y: 147, z: 2.5 });
                vertex.push(...(new Array(10).fill(0).map((_, i) => AnyAnglePoint({ x: 7, y: 147, z: 2.5 }, 180 - (90 / 10 * i), 90, 3, [0, 0, 0]))));
                vertex.push({ x: 7, y: 150, z: 2.5 });
                vertex.push({ x: 7, y: 150, z: -2.5 });
                vertex.push({ x: -7, y: 150, z: -2.5 });
                vertex.push(...new Array(10).fill(0).map((_, i) => AnyAnglePoint({ x: -7, y: 147, z: -2.5 }, 90 - (90 / 10 * i), 90, 3)));
                vertex.push({ x: -10, y: -150, z: -2.5 });
                vertex.push(...new Array(10).fill(0).map((_, i) => AnyAnglePoint({ x: -10, y: -150, z: 12.5 }, 270, 180 - (45 / 10 * i), 15, [0, 0, 0], true)));
                node = AnyAnglePoint(vertex[vertex.length - 1], 270, 45, 10, [0,0,0]);
                vertex.push(node);
                vertex.push(...(new Array(10).fill(0).map((_, i) => AnyAnglePoint({ x: node.x + 3, y: node.y, z: node.z }, 0, 90 - (90 / 10 * i), 3, [45, 0, 0]))));
                vertex.push({ x: vertex[vertex.length - 1].x + 14, y: vertex[vertex.length - 1].y, z: vertex[vertex.length - 1].z });
                node = { x: node.x + 17, y: node.y, z: node.z };
                vertex.push(...(new Array(10).fill(0).map((_, i) => AnyAnglePoint(node, 0, 360 - (90 / 10 * i), 3, [45, 0, 0]))));
                node = vertex[vertex.length - 1];
                vertex.push(AnyAnglePoint(node, 0, 180, 10, [45, 0, 0]));
                vertex.push(...(new Array(10).fill(0).map((_, i) => AnyAnglePoint({ x: 10, y: -150, z: 12.5 }, 270, 90, 15, [45 + (45 / 10 * i), 0, 0]))));
                vertex.push({ x: 10, y: 147, z: -2.5 });
                vertex.push(...(new Array(10).fill(0).map((_, i) => AnyAnglePoint({ x: 7, y: 147, z: -2.5 }, 180 - (90 / 10 * i), 90, 3, [0, 0, 0]))));
                vertex.push({ x: 7, y: 150, z: -2.5 });
                
                let geometry = new BufferGeometry();
                let verGeometry = new SphereGeometry(10, 32, 64);
                //delaunayArgs.points.map(it => [it.x, it.y, it.z]).flat(2)
                geometry.setAttribute("position", new Float32BufferAttribute(vertex.map(it => [it.x, it.y, it.z]).flat(2), 3));
                verGeometry.translate(delaunayArgs.ver.x * gutter, delaunayArgs.ver.y * gutter, delaunayArgs.ver.z * gutter);
                let material = new PointsMaterial({ color: 0xff0000, size: 5, sizeAttenuation: false });
                let mesh = new Points(geometry, material);
                let m1 = new MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });
                let mesh2 = new Mesh(verGeometry, m1);
                ctx.add(mesh);
                ctx.add(mesh2);
                let tetrahedron = Delaunay3d(vertex);
                // for (let i = 0, len = tetrahedron.length; i < len; i += 4) { 
                //     let a = tetrahedron[i];
                //     let b = tetrahedron[i + 1];
                //     let c = tetrahedron[i + 2];
                //     let d = tetrahedron[i + 3];
                //     let tGeometry = new BufferGeometry();
                //     let tetrahedronVertex = [
                //         a.x || 0, a.y || 0, a.z || 0,
                //         b.x || 0, b.y || 0, b.z || 0,
                //         c.x || 0, c.y || 0, c.z || 0,

                //         a.x || 0, a.y || 0, a.z || 0,
                //         b.x || 0, b.y || 0, b.z || 0,
                //         d.x || 0, d.y || 0, d.z || 0,
                        
                //         a.x || 0, a.y || 0, a.z || 0,
                //         c.x || 0, c.y || 0, c.z || 0,
                //         d.x || 0, d.y || 0, d.z || 0,
                        
                //         b.x || 0, b.y || 0, b.z || 0,
                //         c.x || 0, c.y || 0, c.z || 0,
                //         d.x || 0, d.y || 0, d.z || 0
                //     ];
                //     tGeometry.setAttribute("position", new Float32BufferAttribute(tetrahedronVertex, 3));
                //     let m2 = new MeshBasicMaterial({ color: 0x0000ff, side: THREE.DoubleSide, opacity: 1, transparent: true });
                //     ctx.add(new Mesh(tGeometry, m2));
                // }
            }
        }

        const updateCameraDistance = withModifiers((e: WheelEvent) => {
            if (e.deltaY < 0) { 
                camera.position.z-=10;
                camera.position.z = camera.position.z < 1 ? 1 : camera.position.z;
            }

            if (e.deltaY > 0) { 
                camera.position.z+=10;
                camera.position.z = camera.position.z > 3000000 ? 3000000 : camera.position.z;
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

        let RoundDelaunayPoint = (e: MouseEvent) => {
            if (type.value[0] === "ConcaveHull") { 
                let { gutter } = descartes;
                delaunayArgs.points = [];
                for (let i = 0; i < delaunayArgs.total; i++)
                    delaunayArgs.points.push({ x: -600 + gutter * 20 * Math.random(), y: -600 + gutter * 20 * Math.random(), z: -600 + gutter * 20 * Math.random() });
                drawerPoint();
            }
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
                        <acro-collapse-item header="凹包点云" key="ConcaveHull">
                            <acro-form model={delaunayArgs} layout="vertical">
                                <acro-form-item label="数量">
                                    <acro-slider v-model={delaunayArgs.total} min={3} max={300} step={1} />
                                </acro-form-item>
                                <acro-form-item label="X">
                                    <acro-slider v-model={delaunayArgs.ver.x} min={-10} max={10} step={1} onChange={drawerPoint} />
                                </acro-form-item>
                                <acro-form-item label="Y">
                                    <acro-slider v-model={delaunayArgs.ver.y} min={-10} max={10} step={1} onChange={drawerPoint} />
                                </acro-form-item>
                                <acro-form-item label="Z">
                                    <acro-slider v-model={delaunayArgs.ver.z} min={-10} max={10} step={1} onChange={drawerPoint} />
                                </acro-form-item>
                                <acro-form-item label="操作">
                                    <acro-space size="mini">
                                        <acro-button type="primary" size="small" onClick={ RoundDelaunayPoint }>随机</acro-button>
                                    </acro-space>
                                </acro-form-item>
                            </acro-form>
                        </acro-collapse-item>
                    </acro-collapse>
                </div>
            </div>
        )
    }
})
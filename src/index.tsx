import { createApp, render, ref } from 'vue'
import acro from '@arco-design/web-vue'
import PointExamples from  "~/examples/point"
import LineExamples from "~/examples/line"
import CircleExamples from "~/examples/circle"

import "~/assets/styles/index"
import '@arco-design/web-vue/dist/arco.css'

//初始化根实例
const app = createApp({
    components: { PointExamples, LineExamples, CircleExamples },
    setup(): typeof render {
        let collapsed = ref<boolean>(false);
        let menukey = ref<Array<string>>(["Point"]);
        return () => (
            <acro-layout has-sider style={{ width: '100%', height: '100%' }}>
                <acro-layout-sider width={300} collapsed={collapsed.value} collapsible>
                    <acro-menu mode={"vertical"} default-open-keys={["2d"]} accordion v-model={[menukey.value, "selected-keys"]}>
                        <acro-sub-menu title={"二维几何"} key={"2d"}>
                            <acro-menu-item key="Point">点运算</acro-menu-item>
                            <acro-menu-item key="Line">线运算</acro-menu-item>
                            <acro-menu-item key="Circle">圆运算</acro-menu-item>
                            <acro-menu-item key="Arc">弧运算</acro-menu-item>
                            <acro-menu-item key="Rect">矩形运算</acro-menu-item>
                            <acro-menu-item key="Triangle">三角运算</acro-menu-item>
                        </acro-sub-menu>
                        <acro-sub-menu title={"二维物理"}>
                            <acro-menu-item key="PointA">物理A</acro-menu-item>
                            <acro-menu-item key="LineA">物理A</acro-menu-item>
                            <acro-menu-item key="CircleA">物理A</acro-menu-item>
                            <acro-menu-item key="ArcA">物理A</acro-menu-item>
                            <acro-menu-item key="RectA">物理A</acro-menu-item>
                            <acro-menu-item key="TriangleA">物理A</acro-menu-item>
                        </acro-sub-menu>
                    </acro-menu>
                </acro-layout-sider>
                <acro-layout-content>
                    {
                        menukey.value[0] === "Point" ? <point-examples></point-examples> : 
                        menukey.value[0] === "Line" ? <line-examples></line-examples> :
                        menukey.value[0] === "Circle" ? <circle-examples></circle-examples> :
                        null
                    }
                </acro-layout-content>
            </acro-layout>
        )
    }
});
app.use(acro, {
    componentPrefix: 'acro'
})
app.mount("#app");

export default app;
import { createApp, render } from 'vue'
import acro from '@arco-design/web-vue'
import Point from  "~/examples/point"

import "~/assets/styles/index"
import '@arco-design/web-vue/dist/arco.css'

//初始化根实例
const app = createApp({
    components: { Point },
    setup(): typeof render {
        return () => (
            <point></point>
        )
    }
});
app.use(acro, {
    componentPrefix: 'acro'
})
app.mount("#app");

export default app;
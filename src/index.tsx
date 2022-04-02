import { createApp, render } from 'vue'
import "~/assets/styles/index"

//初始化根实例
const app = createApp({
    setup(props, { attrs, slots, emit, expose }): typeof render {
        return () => <div></div>
    }
})
app.mount("#app");
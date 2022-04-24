/*
 * @Author: SongQian
 * @Date: 2022-04-02 13:32:33
 * @Description: 交通网图形库
 * @eMail: onlylove1172559463@vip.qq.com
 */
import { defineComponent, ComponentOptionsWithoutProps, render, SetupContext } from 'vue'

type Props = {
    width : string,
    height: string
}

/**
 * @Author: SongQian
 * @description: canvas test
 */
export default defineComponent<ComponentOptionsWithoutProps<Readonly<Props>>, any, any>({
    name : "Artboard",
    props: ["width", "height"],
    setup: (props:  ComponentOptionsWithoutProps<Readonly<Props>>, { attrs, slots, emit } : SetupContext) : typeof render => {

        return () => (
            <canvas width={props.width} height={props.height} style={{ width: props.width, height: props.height }}></canvas>
        )
    }
})
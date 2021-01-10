import { init } from 'snabbdom/build/package/init';
// h 渲染成虚拟 dom
import { h } from 'snabbdom/build/package/h';
// 修改样式用 modules class 动态赋值、attr 属性
import { styleModule } from 'snabbdom/build/package/modules/style.js'
import { eventListenersModule } from 'snabbdom/build/package/modules/eventlisteners.js'
// 注册模块
let patch = init([
    styleModule,
    eventListenersModule
]);
// h 第二个参数传入模块需要的数据
let vnode = h('div', {
    style: {
        backgroundColor: 'green'
    },
    on: {
        click: eventHandler
    }
}, [
    h('div', 'style module'),
    h('p', 'p标签')
]);
function eventHandler() {
    console.log('点击了')
}
let app = document.querySelector('#app');
console.log(0)
let oldNode = patch(app, vnode);
setTimeout(()=>{
vnode = h('div', {
    hook: {
        init(vnode) {
            console.log(vnode.elm)
        },
        create(empty, vnode) {
            console.log(vnode.elm)
        }
    },
    style: {
        backgroundColor: 'green'
    },
}, 'hi');
patch(oldNode, vnode);
}, 2000);
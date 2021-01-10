// import snabbdom from 'snabbdom';
import { init } from 'snabbdom/build/package/init';
// h 渲染成虚拟 dom
import { h } from 'snabbdom/build/package/h';

// hello world
// 参数 数组 模块
// 返回值 patch 函数，作用对比两个 vnode 的差异更新到真实 dom
let patch = init([]);
// 第一个参数是标签+选择器
// 第二个参数 如果是字符串为dom标签中内容

let vnode = h('div#containers', [
    h('h1', 'it is'),
    h('h2', 'me'),
]);

let app = document.querySelector('#app');
let oldNode = patch(app, vnode);

// 假设的时刻 创建的 vnode，并 patch 进行比较创建 dom，并进行渲染。
setTimeout(() => {
    let vnode = h('div#containers', [
        h('h1', 'it not'),
        h('h2', 'you'),
    ]);
    patch(oldNode, vnode);
    // 清空页面元素，不可以传递 null 报错
    // patch(oldNode, h('!'));
}, 2000)

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

let vnode = h('ul', [
    h('li', 1),
    h('li', 2),
    h('li', 3),
]);

let app = document.querySelector('#app');
// 第一个参数 dom 元素内部把 dom 元素转化成 vnode，或者 vnode
// 第二个参数 vnode
// 返回值 vnode
// 创建一个 hello world
let oldNode = patch(app, vnode);

// 假设的时刻 创建的 vnode，并 patch 进行比较创建 dom，并进行渲染。
vnode = h('ul', [
    h('li', 3),
    h('li', 1),
    h('li', 2),
]);
patch(oldNode, vnode);

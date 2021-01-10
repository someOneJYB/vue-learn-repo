### snabbdom 源码解析
- vnode 如何创建
- 调试

- snabbdom 核心文件
h函数创建 vnode
init 初始化，设置模块属性在 module 目录下，创建 patch
patch 比较更新视图

### h 函数创建 vnode
- 函数重载，函数名相同，参数类型不同，来根据不同的参数进行 vnode 需要的参数
- 调用 vnode 函数返回虚拟节点
```js

```
### vnode 函数
- vnode 数据结构五个参数：dom 名称，key 是在 data 上拿到的，否则是 undefined
```js
export interface VNode {
  sel: string | undefined
  data: VNodeData | undefined
  children: Array<VNode | string> | undefined
  elm: Node | undefined
  text: string | undefined
  key: Key | undefined
}
return { sel, data, children, text, elm, key }

```
### patch：vnode到真实 dom，init 函数返回 patch
- 初始化转换虚拟节点
- modules 模块
```js
init
```
### removeVnodes 
### updateChildren
#### modules 模块主要是添加有各种钩子
hook：created 和 update
### DomDiff 会创建 js 节点，其实是浪费时间的，但是视图复杂的时候就需要虚拟 dom 主要是可以根据变化进行渲染
- web 平台下提供 domApi，weex 可以使用其它操作 api 传递过去
- diff 算法 snabbdom
### 复杂方式每个节点进行比较 n的三次方
### 只针对同一层级进行比较
- patch
- patchVnode 对比节点 key 和 sel，对比属性和 text
- updateChildren 对比子节点

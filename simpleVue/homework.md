一、简答题
1、当我们点击按钮的时候动态给 data 增加的成员是否是响应式数据，如果不是的话，如何把新增成员设置成响应式数据，它的内部原理是什么。
let vm = new Vue({
el: '#el'
data: {
o: 'object',
dog: {}
},
method: {
clickHandler () {
// 该 name 属性是否是响应式的
this.dog.name = 'Trump'
}
}
})
```js
初始化执行的时候会在 data 中的数据添加 get 和 set 方法，get 中用于接收在 watcher 中的函数，在 Dep.target 中获取到，set 主要是处理 dep 对象，所以一开始会遍历所有的 data 中对象注册，但是不存在的就不会进行绑定，所以我们需要处理的是使用
this.$set(this.dog,”name”, 'Trump')
受 ES5 Object.defineproperty 的限制，Vue.js 不能检测到对象属性的添加或删除。因为 Vue.js 在初始化实例时将属性转为 getter/setter，所以属性必须在 data 对象上才能让 Vue.js 转换它，才能让它是响应的。

```

2、请简述 Diff 算法的执行过程
- vue 和 react 的 diff 思想都同一层进行比对，这样保证算法复杂度降低到 O(n);
- vue 比较的过程
1、patch 新旧节点
  - 相同 patchVnode
    patchVnode 更新过程
    1、如果是都是text为字节点，不同的部分更新
    2、旧的是child 新的是 text， 去掉旧的子元素，更新 text 内容
    3、新的是child 旧的是 text， 更新为新的 child
    4、都是 children 调用 updateChildren
  - updateChildren 过程
    循环头尾index
    - 头头
      进行新旧index同时++
    - 尾尾
      进行新旧index同时--
    - 旧头新尾
      旧头 ++，新尾--向有右边移动
    - 旧尾新头
      旧尾 --，新头++ 旧尾有左边移动
    - 新的节点在旧的 key 中寻找有更新对应 key 的旧节点
    循环结束后， 如果新节点的数组先遍历完(newStartIdx > newEndIdx)，说明老节点有剩余，把剩余节点批量删除，新节点中有剩余则添加进去。
  - 不同则直接去掉元素，创建新的虚拟 dom 对象 createElem

二、编程题
1、模拟 VueRouter 的 hash 模式的实现，实现思路和 History 模式类似，把 URL 中的 # 后面的内容作为路由的地址，可以通过 hashchange 事件监听路由地址的变化。
hash.js中

2、在模拟 Vue.js 响应式源码的基础上实现 v-html 指令，以及 v-on 指令。
- miniVue.js 中
3、snabbdom
  在 https://github.com/someOneJYB/vue-learn-repo/tree/master/snabb-dom 文件中
  ![avatar](  https://github.com/someOneJYB/vue-learn-repo/blob/master/simpleVue/1.png)
### 写一个 vue-router 模拟 route-link 方法
- vue 运行时，不支持 template，需要打包前编译。
- vue 完整版本有编译器和运行时，模版转化成 render。
VueRouter 首先在 Vue.use 注册 VueRouter
- VueRouter 中构造函数放置 routes 对象，里面包含了定义的 path 和 component
- install 注册
- initComponent 创建 route-view 和 route-link

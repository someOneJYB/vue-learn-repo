// route 中包含 url 参数，设置在路由 props true 就可以传递路由参数在 props 中，{ path: '/a/:id', props: true}
// router 中主要是路由的一些方法
// 路由主要是使用 hash 和 history 两种
// history 需要在刷新页面的时候服务器返回打包好的 html 页面，在开发过程中可以在 webpack 中配置 history 模式，
// devServer: {
//     historyApiFallback:{
//         index:'build/index.html'
//     },
// },
// devServer.historyApiFallback的意思是当路径匹配的文件不存在时不出现404,而是取配置的选项historyApiFallback.index对应的文件。
// hash 使用的是前端 url 加入 #，只要 # 后边的路径发生变化就会触发 onHashChange 方法，路由中的 push 和 replace 方法手动修改 hash，触发组件监听的 listen 方法传递 path，并且把变化路径传递到 ignorePath 防止手动改变 hash 路径 导致触发的 onHashChange 再次执行 listen 方法，所以只有触发 go 方法的时候才会执行 onhashChange 触发
// history 不兼容 IE11 所以还需要使用 hash 进行兼容性处理。pushState 和 replaceState 是不会触发 popState 事件，只有 pop 方法和浏览器前进后退键才会触发 popState 事件，所以可知 push replace 自动触发监听，go 方法才会触发 popState 方法导致 listen 执行
// 单页面应用的原理：pushState 和 replaceState 只是改变了当前的 url，popState，但是并不会发起请求，我们是通过监听事件中对应的 path 来渲染对应的组件，给人一种根据不同的 url 展示不同的路径。
// 同样的 hash 模式，# 后面的路径发生变化是不会引起页面刷新的。
// 实现一个 vueRouter 是一个类
let _Vue = null;
export default class VueRouter {
    // 判断是否被安装
    static install(Vue) {
        if (VueRouter.install.installed) {
            return;
        }
        VueRouter.install.installed = true;
        // Vue 构造函数记录到全局变量
        _Vue = Vue;
        // router 对放置到 vue 的实例上
        // mixin 可以让 vue 实例中注入某些方法
        _Vue.mixin({
            beforeCreate () {
                // vue 的 $options，全局混入放在 options 下面
                if (this.$options.router) {
                    _Vue.prototype.$router = this.$options.router;
                    this.$options.router.init();
                }
            }
        })
    }
    constructor(options) {
        this.options = options;
        this.routerMap = {};
        // vue2.6发布的一个新的api，可以处理简单的跨组件共享数据状态的问题
        this.data = _Vue.observable({
            current: '#/'
        })

    }
    init() {
        this.createRouterMap();
        this.initComponent(_Vue);
        this.initEvent()
    }
    createRouterMap() {
        this.options.routes.forEach(item => {
            this.routerMap[item.path] = item.components;
        })
    }
    initEvent() {
        window.addEventListener('popstate', () => {
            this.data.current = window.location.pathname;
        })
    }
    initComponent(Vue) {
        const self = this;
        // 创建 router-link 有一个 to
        Vue.component('router-link', {
            props: {
                to: String
            },
            // h vue 传递的解析函数接受选择器，属性，子组件默认插槽 this.$slots.default,运行时的 vue 不支持 template只能自己写 h 函数
            render(h) {
                return h('a', {
                    attrs: {
                        href: this.to,
                    },
                    on: {
                        click: this.clickMethod
                    },
                }, [this.$slots.default])
            },
            methods: {
                clickMethod(e) {
                    e.preventDefault();
                    this.$router.data.current = this.to;
                    history.pushState({}, '', this.to);
                }
            }
            // template: '<a :href="to"><slot/></a>'
        });
        Vue.component('router-view', {
            props: {
                to: String
            },
            // h vue 传递的解析函数接受选择器，属性，子组件默认插槽 this.$slots.default,运行时的 vue 不支持 template只能自己写 h 函数
            render(h) {
                const comp = self.routerMap[self.data.current];
                return h(comp)
            },
            // template: '<a :href="to"><slot/></a>'
        })
    }
}
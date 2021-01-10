### vue2 中主要使用 Object.defineProperty 进行数据的劫持。存在兼容性问题。
```js
c
let vm = {}
Object.defineProperty(vm, 'msg', {
    get() {
        return data.msg
    },
    set(newVal) {
       // 判断是否发生了变化 
       if(newVal === data.msg) return;
       data.msg = newVal;
       console.log('change')
    }
});
// 多个属性的时候
object.keys(data).forEach(item => {
    Object.defineProperty(vm, item, {
        get() {
            return data[item]
        },
        set(newVal) {
           // 判断是否发生了变化 
           if(newVal === data[item]) return;
           data[item] = newVal;
           console.log('change')
        }
    })
})
```
### vue3 中主要使用 Proxy 进行数据的劫持。IE 不支持
### 当您需要对数据进行更多控制时，代理可以派上用场。你可以根据受控规则扩展或拒绝对原始数据的访问，从而监视对象并确保正确行为。
```js
let data = {
    msg: 'huhuhu'
}
// proxy 直接可以所有属性检测，proxy 浏览器会进行性能优化
let vm = new Proxy(data, {
     get(target, property) {
            let value = target[property];
            if (!value) {
                throw new Error(`The property [${property}] does not exist`);
            }
            return value;
     },
    set(target, key, newVal) {
        if(target[key] === newVal) return;
        target[key] = newVal;
        console.log('changed');
    },
    // 删除处理
    deleteProperty() {
        throw new Error('API methods cannot be deleted!');
    }
});
vm.msg = 'bububu'
```
### 发布订阅模式
- 订阅者
- 发布者
- 信号中心
### 订阅中心隔离观察者和发布者
vue的自定义事件,在兄弟通信过程中
```js
class EventEmiter {
    constructor() {
        this.events = {};
    }
    on(props, cb) {
        this.events[props] = this.events[props] || [];
        this.events[props].push(cb)
    }
    emit(props) {
        (this.events[props] || []).forEach(item => {
            item(arguments);
        })
    }
}
```
### 观察者模式 
watcher
- update 用于更新视图
### 发布者模式 Dep
subs 存储所有观察者
addSubs 添加观察者
notify 通知观察者
### 发布者和订阅者二者进行沟通
```js
class Dep {
    constructor() {
        this.subs = [];
    }
    addSubs(sub) {
        if(sub && sub.update) {
            this.subs.push(sub);
        }
        
    }
    notify() {
        this.subs.forEach(item => item.update());
    }
    
}
class Watcher {
    update() {
        console.log('update')
    }
}
```
### vue新增的属性是非响应式式的，所以需要使用 vue.set 方法，data 上新增的属性是不会响应的，没有在 data 初始化定义时，响应 data 是在 new Vue 时候，所以结束了 vue 就无法响应了。

### vue 的虚拟 dom snabbdom 源代码
### 问什么使用虚拟 dom
- 简化 dom 的操作，解决视图和状态的同步问题
- 模版引擎没有解决状态变化，有效的更新变化的部分，跟踪状态对比差异进行更新视图
- 视图复杂使用虚拟 dom 才会提升性能
- 虚拟 dom 实现 ssr，虚拟 dom 可以进行跨平台
### 虚拟 dom 库
- snabbdom 200行
- virtual dom
```js

```
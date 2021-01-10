const arrObj = {};
class Vue {
    constructor(options) {
        this.$options = options || {};
        this.$data = options.data;
        this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el;
        // 通过属性保存选项的数据
        // data中的成员转换成 getter 和 setter 注入到 vue 中
        // 调用observable对象监听数据的变化
        // 调用 compiler 解析指令和差值表达式
        this._proxyData(this.$data);
        new Observer(this.$data);
        new Compiler(this);
    }
    // 放到 vue 实例上
    _proxyData(data) {
        Object.keys(data).forEach(item => {
            Object.defineProperty(this, item, {
                enumerable: true,
                configurable: true,
                set(newVal) {
                    if(newVal === data[item]) return;
                    data[item] = newVal;
                },
                get() {
                    return data[item];
                }
            })
        })
    }
}
// Observable把data的属性转化成响应式数据数据劫持，data 转化成 getter 和 setter
// walk 方法某个属性也是对象也使用这个方法
// 数据变化发送通知
class Observer {
    constructor(data) {
        this.walk(data);
    }
    observeArray (items, key) {
        this.defineReactiveArray(items, key)
        for (let i = 0, l = items.length; i < l; i++) {
            this.walk(items[i]);
        }
    }
    walk(data, key) {
        if(typeof data !== 'object') {
            return;
        }
        // Object.keys(data).forEach(item => {
        //     this.defineReactive(data, item, data[item]);
        // })
        if(data instanceof Array) {
            console.log(data, 'yyyyu')
            this.observeArray(data, key);
        } else {
            Object.keys(data).forEach(item => {
                this.defineReactive(data, item, data[item]);
            })
        }

    }
    defineReactiveArray(arr, key) {
            console.log(56789)
        const methodsToPatch = [
            'push',
            'pop',
            'shift',
            'unshift',
            'splice',
            'sort',
            'reverse'
        ];
        const arrayProto = Array.prototype
        const arrayMethods = Object.create(arrayProto);
        let self = this;
        methodsToPatch.forEach(function(method){
            // cache original method
            // const original = arrayProto[method];
            arrayMethods[method] = function (...args) {
              //还是先调用真正的原型方法获得正常的返回值
              const result = arrayProto[method].apply(this, args);
              //数据改变了，我们要通知视图更新
              let inserted;
              console.log(`调用了${method}方法`);
              switch (method) {
                case "push":
                case "unshift":
                  inserted = args;
                  break;
                case "splice":
                  inserted = args.slice(2);
                  break;
              }
              // if (inserted) self.walk(inserted);
              // notify change
            //   console.log(dep, "dep12345678");
            //   if (inserted) self.walk(inserted)
              console.log(arrObj[key] , key);
              arrObj[key] && arrObj[key].update(true);
              return result;
            }
            arr.__proto__ = arrayMethods;
        })
    }
    defineReactive(obj, key, value) {
        this.walk(value, key);
        const self = this;
        // dep 收集依赖发送通知给 watcher
        let dep = new Dep();
        // 转化成 getter 和 setter
                console.log(obj, key, value, "obj, key, value7");
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            set(newVal) {
                console.log(newVal === value, 'newVal === value')
                if(newVal === value) return;
                value = newVal;
                self.walk(newVal);
                // 发送通知
                console.log(dep, 'set', obj);
                dep.notify()
            },
            get() {
                console.log(Dep.target, 'Dep.target', 'get', 'key', key);
                // 收集以来
                Dep.target && dep.addSub(Dep.target)
                console.log(dep, 'dep get', key);
                arrObj[key] = arrObj[key] || Dep.target;
                console.log(0, 'oooooo');
                // return value 不是 obj【key】的原因是因为会发生死递归栈溢出一直调用 get 方法，是一个闭包，在debug这句的时候closure是有闭包的，value 在被 this.xx 就会调用 get 方法，导致里面的 get 不会被回收
                return value;
            }
        })
    }
}
// 负责编译模版，解析指令和差值表达式
// 页面的首次渲染和二次渲染
class Compiler {
  constructor(vm) {
    this.el = vm.$el;
    this.vm = vm;
    this.compile(this.el);
  }
  // 编译模版，处理文本节点和元素节点
  compile(el) {
    let childNodes = el.childNodes;
    Array.from(childNodes).forEach((node) => {
      console.log(node.attributes);
      this.isText(node) ? this.compileText(node) : this.compileElement(node);
      if (node.childNodes && node.childNodes.length) {
        this.compile(node);
      }
    });
  }
  // 编译元素节点，处理差值表达式
  compileElement(node) {
    // NamedNodeMap 是一个有长度的对象
    console.log(node.attributes);
    Array.from(node.attributes).forEach((attr) => {
      let attrName = attr.name;
      if (this.isDirective(attrName)) {
        // 取 text 和 modal 前缀的函数调用不写 if 语句
        attrName = attrName.slice(2);
        let key = attr.value;
        this.update(node, key, attrName);
      }
    });
  }
  update(node, key, attrName) {
    if (attrName.indexOf("on") > -1) {
      return this.onUpdate(node, this.vm[key], key, attrName);
    }
    let fnName = attrName + "Update";
    // console.log(node, this.vm[key], key)
    this[fnName] && this[fnName](node, this.vm[key], key);
  }
  // v-text
  textUpdate(node, value, key) {
    let real = key;
    if (key.indexOf("[") > -1) {
      real = key.split("[")[0];
      let number = key.split("[")[1][0];
      node.textContent = value || this.vm[real];
      return new Watcher(this.vm[real], number, (newVal) => {
        console.log(newVal, "78999999");
        node.textContent = newVal;
      });
    }
    console.log(value, node, real, "000");
    node.textContent = value || this.vm[real];
    new Watcher(this.vm, real, (newVal) => {
      console.log(newVal, "78999999");
      node.textContent = newVal;
    });
  }
  forUpdate(node, key, attrName) {
    console.log(node, key, attrName);
    let result = attrName.split('in');
    new Watcher(this.vm, result[1].trim(), (newVal) => {
      console.log(newVal, "789999993456789");
      node.textContent = newVal;
    });
  }
  // v-modal
  modalUpdate(node, value, key) {
    node.value = value;
    new Watcher(this.vm, key, (newVal) => {
      node.value = newVal;
    });
    node.addEventListener("input", (el) => {
      this.vm[key] = node.value;
    });
  }
  // v-on:click = "xxx"
  onUpdate(node, value, fnName, arrtName) {
    let eventName = arrtName.slice(arrtName.indexOf(":"));
    node.addEventListener(eventName, (el) => {
      this.vm.$options.methods[fnName] &&
        this.vm.$options.methods[fnName].bind(this.vm, el);
    });
  }
  // v-html
  htmlUpdate(node, value, key) {
    node.innerHTML = value;
    new Watcher(this.vm, key, (newVal) => {
      node.innerHTML = newVal;
    });
  }
  // 编译文本节点
  compileText(node) {
    console.log(node);
    const reg = /\{\{(.+?)\}\}/g;
    if (reg.test(node.textContent)) {
      let key = RegExp.$1.trim();
      node.textContent = this.vm[key];
      new Watcher(this.vm, key, (newVal) => {
        node.textContent = newVal;
      });
    }
  }
  // 判断是否是指令是否是 v- 开头
  isDirective(attrName) {
    return attrName.indexOf("v-") > -1;
  }
  // 是否是文本节点
  isText(node) {
    return node.nodeType === 3;
  }
  // 是否是元素节点
  isNode(node) {
    return node.nodeType === 1;
  }
}
// 收集依赖 Dep 通知 watcher 更新视图和收集
class Dep  {
    constructor() {
        this.subs = [];
    }
    addSub(watcher) {
        watcher.update && this.subs.push(watcher)
    }
    notify() {
        console.log(this.subs);
        this.subs.forEach(watcher => {
            console.log('subs')
            watcher.update()
        })
    }
}

// 观察者
// 更新视图
// 在 dep 中添加自身
class Watcher {
    constructor(vm, key, cb) {
        console.log(vm, key, cb);
        this.vm = vm;
        this.key = key;
        this.cb = cb;
        // 记录 watcher 对象 dep.target
        Dep.target = this;
        this.oldValue = vm[key];
        Dep.target = null;
    }
    update(force) {
        console.log('update')
        // 这里也会调用一次 set，所以要在注册之后 把 dep.target 弄成 null，不然就两次了
        let newValue = this.vm[this.key];
        if(force) {
            return this.cb(newValue);
        }
        if(this.oldValue === newValue) return;
        // 更新视图 在 compiler
        this.cb(newValue)
    }
}

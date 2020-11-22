function Sub() {
    this.listen = {};
}
Sub.prototype.add = function(evt, fn) {
    this.listen[evt] = this.listen[evt] || [];
    console.log('tree shaking')
    this.listen[evt].push(fn);
}

Sub.prototype.emit = function(evt) {
    this.listen[evt].forEach(function(item){
        console.log('tree emit')
        item(arguments);
    })
}
// 这个是sideEffects本来不应该引入到打包的文件，因为在 app.vue 引用文件没有使用，可是 add方法和emit方法都被打包进了，所以在 package.json 设置sideEffects为false让副作用代码不被打包进入dist
// 目录
const d = new Sub();
d.add('xxc', ()=>console.log(900))
export default Sub;
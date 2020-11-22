# vue-app-base
### tree-shaking sideEffects: false 的意思并不是我这个模块真的没有副作用，而只是为了在摇树时告诉 webpack：我这个包在设计的时候就是期望没有副作用的，即使他打完包后是有副作用的，webpack 同学你摇树时放心的当成无副作用包摇，但是 sideEffects 注意要排除 css 否则无法提取 css
### 1、Webpack 的构建流程主要有哪些环节？如果可以请尽可能详尽的描述 Webpack 打包的整个过程。
webpack 根据 entry，递归遍历文件收集文件依赖生成文件依赖的图，对应结构生成 可以使用 _webpack_require_ 方法引入的模块，但是并不是所有的文件都是 js 可以识别的，所以需要 loader 转化成 对应的 module.exports 形式，所以引入 loader 转化成 js 可以识别的 js 模块
但是生成了打包文件，没有html文件就无法引用啊，这时候就需要对应的插件，在webpack的生命周期，监听事件触发钩子函数，可以获得打包的 asstes，注入或者添加自己的处理。
### 2、Loader 和 Plugin 有哪些不同？请描述一下开发 Loader 和 Plugin 的思路。
loader 是在生成模块的前期执行，plugin 是在 webpack 的不同钩子阶段触发，有打包好也有开始打包的阶段
```js
// loader
function loader(source) {
    // source 字符串进行处理
    return source；
}
// webpack
class MyPlugin {
  apply (compiler) {
    console.log('MyPlugin 启动')

    compiler.hooks.emit.tap('MyPlugin', compilation => {
      // compilation => 可以理解为此次打包的上下文
      for (const name in compilation.assets) {
        // console.log(name)
        // console.log(compilation.assets[name].source())
        if (name.endsWith('.js')) {
          const contents = compilation.assets[name].source()
          const withoutComments = contents.replace(/\/\*\*+\*\//g, '')
          compilation.assets[name] = {
            source: () => withoutComments,
            size: () => withoutComments.length
          }
        }
      }
    })
  }
}
```
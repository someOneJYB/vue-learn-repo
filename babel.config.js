module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
     ['@babel/preset-env', {
        modules: false,
        useBuiltIns: "usage"
     }]
  ],
  plugins: [
     "@babel/proposal-object-rest-spread",
     "@babel/plugin-transform-runtime"
  ]
}

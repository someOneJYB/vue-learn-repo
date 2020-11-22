const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const commonConfig = require(`./webpack.common.js`);

const dirname = process.cwd();
const devConfig = {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        host: '127.0.0.1',  // 我们可以允许我们用任意方式进行访问（127.0.0.1，localhost, 本机ip）
        port: '8888',
        contentBase: path.resolve(dirname, 'dist'),
        hot: true,
        open: true,
        historyApiFallback: true,
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
}
module.exports = merge(devConfig, commonConfig(true));
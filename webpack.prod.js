const TerserPlugin = require('terser-webpack-plugin'); //开启多核压缩
const OptmizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const merge = require('webpack-merge');
const commonConfig = require(`./webpack.common.js`);

const prodConfig = {
    mode: 'production',
    optimization: {
        sideEffects: true,
        splitChunks: {
            chunks: 'all',   // initial、async和all
            minSize: 30000,   // 形成一个新代码块最小的体积
            maxAsyncRequests: 5,   // 按需加载时候最大的并行请求数
            maxInitialRequests: 3,   // 最大初始化请求数
            automaticNameDelimiter: '~',   // 打包分割符
            name: true,
        },
        minimizer: [
            // 压缩JS
            new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: true,
            }),
            new OptmizeCssAssetsWebpackPlugin({
                assetNameRegExp: /\.css$/g,
                cssProcessor: require('cssnano'),
                cssProcessorOptions: {
                    safe: true,
                    discardComments: {
                        removeAll: true
                    }
                }
            })
        ],

    },
    plugins: [new CleanWebpackPlugin(), new MiniCssExtractPlugin({
        filename: '[name].[contenthash:8].css',
        chunkFilename: '[name].[id].css'
    })]
}
module.exports = merge(prodConfig, commonConfig(false));
const webpack = require('webpack');
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const dirname = process.cwd();

module.exports = function config(isDev) {
    return {
        entry: [path.resolve(dirname, 'src/main.js')],
        output: {
            path: path.resolve(dirname, 'dist'),
            filename:  isDev ? '[name].[hash:8].js' : '[name].[contenthash:8].js',
            publicPath: '/'
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.resolve(dirname, 'public/index.html'),
                favicon: path.resolve(dirname, 'public/favicon.ico'),
            }),
            new VueLoaderPlugin()
        ],
        resolve: {
        extensions: ['.js', ".ts", ".tsx", '.jsx']
    },
        module: {
                rules: [
                    {
                        test: /\.jsx?$/,
                        exclude: /node_modules/,
                        use: [ {
                            loader: 'babel-loader',
                            options: {
                                cacheDirectory: true,
                            },
                        }],
                        include: [path.resolve(dirname, 'src'), path.resolve(dirname, 'src/component/Picker/MultiPicker.js')]
                    },
                    {
                        test: /\.vue?$/,
                        exclude: /node_modules/,
                        use: [ {
                            loader: 'vue-loader',
                            options: {
                                cacheDirectory: true,
                            },
                        }]
                    },
                    {
                        test: /\.tsx?$/,
                        exclude: /node_modules/,
                        use: [{
                            loader: 'ts-loader',
                        }],
                    },
                    {
                        test: /\.css/,
                        use: [{ loader: isDev ? 'style-loader' : MiniCssExtractPlugin.loader}, 'css-loader', 'postcss-loader'],
                        exclude: /node_modules/,
                        include: path.resolve(dirname, 'src')
                    },
                    {
                        test: /\.less/,
                        use: [{ loader: isDev ? 'style-loader' : MiniCssExtractPlugin.loader }, 'css-loader', 'postcss-loader', 'less-loader'],
                        exclude: /node_modules/,
                        include: path.resolve(dirname, 'src')
                    },
                    {
                        test: /\.(gif|jpg|png|bmp|eot|woff|woff2|ttf|svg)/,
                        use: [
                            {
                                loader: 'url-loader',
                                options: {
                                    limit: 7500,
                                    name: 'images/[name]-[hash:5].min.[ext]'
                                },
                            }
                        ]
                    }
                ]
        }
    };
}

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./pug-plugin.d.ts" />
/// <reference types="webpack-dev-server" />
import ForkTSCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import path from 'path';
import PugPlugin from 'pug-plugin';
import {Configuration} from 'webpack';
import webpackMerge from 'webpack-merge';

const common: Configuration = {
    context: path.resolve(__dirname),
    target: 'web',
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js']
    },
    entry: {
        index: ['./src/html/index.pug']
    },
    output: {
        path: path.resolve(__dirname, './dist/')
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.(tsx|ts|jsx|js|sass|scss|less|css)$/,
                exclude: /node_modules/,
                use: ['source-map-loader']
            },
            {
                test: /\.(tsx|ts)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            configFile: path.resolve(
                                __dirname,
                                './src/ts/tsconfig.json'
                            )
                        }
                    }
                ]
            },
            {
                test: /\.(pug)$/,
                exclude: /node_modules/,
                use: [PugPlugin.loader]
            },
            {
                test: /\.(scss|sass|less)$/,
                exclude: /node_modules/,
                use: ['css-loader', 'postcss-loader', 'sass-loader']
            },
            {
                test: /\.(css)$/,
                exclude: /node_modules/,
                use: ['css-loader', 'postcss-loader']
            },
            {
                test: /\.(png|jpeg|jpg|bmp|gif)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'images'
                        }
                    }
                ]
            },
            {
                test: /\.(ttf|otf|woff|woff2|eot)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'fonts'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new ForkTSCheckerWebpackPlugin({
            async: true,
            typescript: {
                configFile: path.resolve(__dirname, './src/ts/tsconfig.json')
            }
        })
    ]
};

const dev: Configuration = webpackMerge(common, {
    name: 'dev',
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        port: 8080,
        hot: false,
        liveReload: true
    },
    output: {
        filename: 'js/app.[contenthash].js'
    },
    module: {
        rules: []
    },
    plugins: [
        new PugPlugin({
            pretty: true,
            extractCss: {
                filename: 'css/app.[contenthash].css'
            }
        })
    ]
});

const prod: Configuration = webpackMerge(common, {
    name: 'dev',
    mode: 'development',
    devtool: 'hidden-source-map',
    output: {
        filename: 'js/app.[contenthash].min.js'
    },
    module: {
        rules: []
    },
    plugins: [
        new PugPlugin({
            pretty: false,
            extractCss: {
                filename: 'css/app.[contenthash].min.css'
            }
        })
    ]
});

export default [dev, prod];

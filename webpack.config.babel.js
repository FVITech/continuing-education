import {
    HotModuleReplacementPlugin,
    HashedModuleIdsPlugin,
    NamedModulesPlugin,
    optimize
} from 'webpack'
import { resolve } from 'path'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import ChunkManifestPlugin from "chunk-manifest-webpack-plugin"
import WebpackChunkHash from "webpack-chunk-hash"
import HtmlPlugin from 'html-webpack-plugin'
import ResourceHintsPlugin from 'resource-hints-webpack-plugin'
import FaviconsPlugin from 'favicons-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'

/************************************************************
    ENTRY CONFIG
************************************************************/
const entry = (env) => {
    let entryConfig = {
        index: [
            resolve(__dirname, 'src/js/index.js')
        ]
    }

    if(env === 'dev') {
        entryConfig = {
            index: [
                resolve(__dirname, 'src/js/index.js'),
                'webpack-dev-server/client?http://localhost:8080',
                'webpack/hot/only-dev-server'
            ]
        }
    }

    return entryConfig
}

/*************************************************************
    PLUGINS CONFIG
*************************************************************/
const plugins = (env) => {
    let pluginsConfig = [
        new ExtractTextPlugin(
            (env === 'prod')
            ? 'style.[chunkhash].css'
            : 'style.css'
        ),
        new HtmlPlugin({
            filename: 'index.html',
            template: 'src/index.html'
        }),
        new HtmlPlugin({
            filename: 'courses.html',
            template: 'src/courses.html'
        }),
        new ResourceHintsPlugin(),
        new optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module) {
               return module.context && module.context.indexOf('node_modules') !== -1;
            }
        }),
        new optimize.CommonsChunkPlugin({
            name: 'manifest',
            minChunks: Infinity
        }),
        new HashedModuleIdsPlugin(),
        new WebpackChunkHash(),
        new ChunkManifestPlugin({
            filename: "chunk-manifest.json",
            manifestVariable: "webpackManifest"
        }),
        new FaviconsPlugin(resolve(__dirname, 'assets', 'fvi-white-simple.png')),
        new CopyPlugin([
            {from: resolve(__dirname, 'src', '.htaccess')},
            {from: resolve(__dirname, 'src', '404.html')},
            {from: resolve(__dirname, 'src', 'crossdomain.xml')},
            {from: resolve(__dirname, 'src', 'humans.txt')},
            {from: resolve(__dirname, 'src', 'robots.txt')}
        ])
    ]

    if(env === 'dev') {
        pluginsConfig.push(
            new HotModuleReplacementPlugin(),
            new NamedModulesPlugin()
        )
    }

    return pluginsConfig
}

/************************************************************
    MAIN CONFIG
************************************************************/
const config = function(env) {
    return {
        entry: entry(env),
        output: {
            filename: (env === 'prod')
                ? '[name].[chunkhash].js'
                : '[name].js',
            chunkFilename: '[name].[chunkhash].js',
            path: resolve(__dirname, 'dist'),
            publicPath: '/'
        },
        module: {
            rules: [
                {test: /\.js?x$/,
                exclude: /(node_modules)/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['env', {modules: false}]
                        ],
                        plugins: [
                            'syntax-dynamic-import'
                        ]
                    }
                }]},
                {test: /\.scss$/,
                use: (env === 'prod')
                    ? ExtractTextPlugin.extract({
                        use: [
                            'css-loader',
                            {loader: 'postcss-loader',
                            options: {plugins: () => [require('autoprefixer')]}},
                            'sass-loader'
                        ]
                    })
                    : ['style-loader', 'css-loader', 'sass-loader']
                },
                {test: /\.(jpe?g|png|gif|svg|ico)$/,
                use: [
                    {loader: 'url-loader',
                    options: {limit: 40000, name: '[name].[ext]'}},
                    {loader: 'image-webpack-loader', options: {}}
                ]}
            ]
        },
        resolve: {
            modules: [
                resolve(__dirname, 'src'),
                'node_modules'
            ]
        },
        plugins: plugins(env),
        devtool: (env === 'dev') ? 'inline-source-map' : false,
        devServer: {
            hot: true,
            contentBase: resolve(__dirname, 'dist'),
            publicPath: '/'
        }
    }
}

module.exports = config

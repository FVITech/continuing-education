import {
    HotModuleReplacementPlugin,
    HashedModuleIdsPlugin,
    NamedModulesPlugin,
    DefinePlugin,
    optimize
} from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import ChunkManifestPlugin from "chunk-manifest-webpack-plugin"
import WebpackChunkHash from "webpack-chunk-hash"
import HtmlPlugin from 'html-webpack-plugin'
import ResourceHintsPlugin from 'resource-hints-webpack-plugin'
import FaviconsPlugin from 'favicons-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import { resolve } from 'path'

const pages = [
    'index.pug',
    'courses.pug',
    'home-health-aide.pug',
    'medical-assistant.pug',
    'medical-coding-specialist.pug',
    'pharmacy-technician.pug',
    'patient-care-technician.pug'
]

export default function plugins(env) {

    let config = [
        new DefinePlugin({
            'process.env': {
               'NODE_ENV': (env === 'dev') ? '"development"' : '"production"'
            }
        }),
        new CopyPlugin([
            {from: resolve(__dirname, '..', 'src', 'crossdomain.xml')},
            {from: resolve(__dirname, '..', 'src', 'humans.txt')},
            {from: resolve(__dirname, '..', 'src', 'robots.txt')},
            {from: resolve(__dirname, '..', 'src', '.htaccess')},
            {from: resolve(__dirname, '..', 'src', '404.html')},
            {
                from: resolve(__dirname, '..', 'src', 'js', 'aos.js'),
                to: resolve(__dirname, '..', 'dist', 'js')
            }
        ])
    ]

    const _pushPageToConfig = function(page) {
        config.push(new HtmlPlugin({
            filename: page,
            template: resolve(__dirname, '..', 'src', 'views', 'pages', page)
        }))
    }

    pages.forEach(_pushPageToConfig)

    if(env === 'dev') {
        config.push(
            new HotModuleReplacementPlugin(),
            new NamedModulesPlugin()
        )
    }

    if(env === 'prod') {
        config.push(
            new FaviconsPlugin(resolve(__dirname, '..', 'images', 'fvi-white-simple.png')),
            new ExtractTextPlugin('style.[chunkhash].css'),
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
            new ChunkManifestPlugin({
                filename: "chunk-manifest.json",
                manifestVariable: "webpackManifest"
            }),
            new ResourceHintsPlugin(),
            new HashedModuleIdsPlugin(),
            new WebpackChunkHash()
        )
    }

    return config
}

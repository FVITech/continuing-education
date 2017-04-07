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

const plugins = (env) => {
    let pluginsConfig = [
        // PAGES
        new HtmlPlugin({
            filename: 'index.html',
            template: 'src/views/pages/index.pug'
        }),
        new HtmlPlugin({
            filename: 'courses.html',
            template: 'src/views/pages/courses.pug'
        }),
        new HtmlPlugin({
            filename: 'home-health-aide.html',
            template: 'src/views/pages/home-health-aide.pug'
        }),
        new HtmlPlugin({
            filename: 'medical-assistant.html',
            template: 'src/views/pages/medical-assistant.pug'
        }),
        new HtmlPlugin({
            filename: 'medical-coding-specialist.html',
            template: 'src/views/pages/medical-coding-specialist.pug'
        }),
        new HtmlPlugin({
            filename: 'pharmacy-technician.html',
            template: 'src/views/pages/pharmacy-technician.pug'
        }),
        new HtmlPlugin({
            filename: 'patient-care-technician.html',
            template: 'src/views/pages/patient-care-technician.pug'
        }),



        new ExtractTextPlugin(
            (env === 'prod')
            ? 'style.[chunkhash].css'
            : 'style.css'
        ),
        new ResourceHintsPlugin(),
        new optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module) {
               return module.context && module.context.indexOf('node_modules') !== -1;
            }
        }),
        new DefinePlugin({
            'process.env': {
                'NODE_ENV': (env === 'dev') ? '"development"' : '"production"'
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
        new FaviconsPlugin(resolve(__dirname, 'images', 'fvi-white-simple.png')),
        new CopyPlugin([
            {from: resolve(__dirname, 'src', '.htaccess')},
            {from: resolve(__dirname, 'src', '404.html')},
            {from: resolve(__dirname, 'src', 'crossdomain.xml')},
            {from: resolve(__dirname, 'src', 'humans.txt')},
            {from: resolve(__dirname, 'src', 'robots.txt')},
            {
                from: resolve(__dirname, 'src', 'js', 'aos.js'),
                to: resolve(__dirname, 'dist', 'js')
            },
            {
                from: resolve(__dirname, 'images'),
                to: resolve(__dirname, 'dist', 'images'),
                flatten: true
            }
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

export default plugins

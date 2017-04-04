import {
    HotModuleReplacementPlugin,
    HashedModuleIdsPlugin,
    NamedModulesPlugin,
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
            template: 'src/views/index.html'
        }),
        new HtmlPlugin({
            filename: 'courses.html',
            template: 'src/views/pages/courses.html'
        }),
        new HtmlPlugin({
            filename: 'home-health-aide.html',
            template: 'src/views/pages/home-health-aide.html'
        }),
        new HtmlPlugin({
            filename: 'medical-assistant.html',
            template: 'src/views/pages/medical-assistant.html'
        }),
        new HtmlPlugin({
            filename: 'coding-specialist-test-prep.html',
            template: 'src/views/pages/coding-specialist-test-prep.html'
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
            {from: resolve(__dirname, 'src', 'robots.txt')},
            {from: resolve(__dirname, './assets/medical-hero-mobile.jpg')},
            {from: resolve(__dirname, './assets/medical-hero.jpg')},
            {from: resolve(__dirname, './assets/fvi-full-white.png')}
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

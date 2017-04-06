import { resolve } from 'path'
import ExtractTextPlugin from 'extract-text-webpack-plugin'

/************************************************************
    ENTRY CONFIG
************************************************************/
const entry = (env) => {
    let entryConfig = {
        bundle: [
            resolve(__dirname, 'src/js/index.js')
        ]
    }

    if(env === 'dev') {
        entryConfig = {
            bundle: [
                resolve(__dirname, 'src/js/index.js'),
                'webpack-dev-server/client?http://localhost:8080',
                'webpack/hot/only-dev-server'
            ]
        }
    }

    return entryConfig
}

/************************************************************
    MAIN CONFIG
************************************************************/
const config = function(env) {
    return {
        entry: entry(env),
        output: {
            filename: (env === 'prod')
                ? 'js/[name].[chunkhash].js'
                : 'js/[name].js',
            chunkFilename: 'js/[name].[chunkhash].js',
            path: resolve(__dirname, 'dist'),
            publicPath: ''
        },
        module: {
            rules: [
                {test: /\.js$/,
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
                            options: {plugins: () => [
                                require('autoprefixer')({
                                    browsers: ['last 8 versions']
                                })
                            ]}},
                            'sass-loader'
                        ]
                    })
                    : ['style-loader', 'css-loader', 'sass-loader']
                },
                {test: /\.(jpe?g|png|gif|svg|ico)$/,
                use: [
                    {loader: 'url-loader',
                        options: {
                            limit: 40000,
                            name: '[name].[ext]',
                            outputPath: 'images/'}},
                    {loader: 'image-webpack-loader', options: {}}
                ]},
                {test: /\.html$/,
                use: ['raw-loader']}
            ]
        },
        resolve: {
            modules: [
                resolve(__dirname, 'src'),
                'node_modules'
            ]
        },
        plugins: require('./webpack-plugins.babel.js').default(env),
        devtool: (env === 'dev') ? 'inline-source-map' : false,
        devServer: {
            hot: true,
            contentBase: resolve(__dirname, 'dist'),
            publicPath: ''
        }
    }
}

module.exports = config

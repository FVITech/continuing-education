import { resolve } from 'path'

const entry = (env) => {
    let entryConfig = {
        bundle: [
            resolve(__dirname, '..', 'src', 'js', 'index.js')
        ]
    }

    if(env === 'dev') {
        entryConfig = {
            bundle: [
                resolve(__dirname, '..', 'src', 'js', 'index.js'),
                'webpack-dev-server/client?http://localhost:8080',
                'webpack/hot/only-dev-server'
            ]
        }
    }

    return entryConfig
}

const config = function(env) {
    return {
        entry: entry(env),
        output: {
            filename: (env === 'prod')
                ? 'js/[name].[chunkhash].js'
                : 'js/[name].js',
            chunkFilename: 'js/[name].[chunkhash].js',
            path: resolve(__dirname, '..', 'dist'),
            publicPath: ''
        },
        module: {
            rules: require('./rules.babel.js').default(env)
        },
        resolve: {
            modules: [
                resolve(__dirname, '..', 'src'),
                'node_modules'
            ]
        },
        plugins: require('./plugins.babel.js').default(env),
        devtool: (env === 'dev') ? 'inline-source-map' : false,
        devServer: {
            hot: true,
            contentBase: resolve(__dirname, '..', 'dist'),
            publicPath: ''
        }
    }
}

export default config

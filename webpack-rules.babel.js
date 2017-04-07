import ExtractTextPlugin from 'extract-text-webpack-plugin'

function rules(env) {
    return [
        {
            test: /\.js$/,
            exclude: /(node_modules)/,
            use: [
                {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                'env', {
                                    modules: false
                                }
                            ]
                        ],
                        plugins: ['syntax-dynamic-import']
                    }
                }
            ]
        }, {
            test: /\.scss$/,
            use: (env === 'prod')
                ? ExtractTextPlugin.extract({
                    use: [
                        'css-loader', {
                            loader: 'postcss-loader',
                            options: {
                                plugins: () => [require('autoprefixer')({browsers: ['last 8 versions']})]
                            }
                        },
                        'sass-loader'
                    ]
                })
                : ['style-loader', 'css-loader', 'sass-loader']
        }, {
            test: /\.(jpe?g|png|gif|svg|ico)$/,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 40000,
                        name: '[name].[ext]',
                        outputPath: 'images/'
                    }
                }, {
                    loader: 'image-webpack-loader',
                    options: {}
                }
            ]
        }, {
            test: /\.html$/,
            use: ['raw-loader']
        }, {
            test: /\.handlebars$/,
            use: ['handlebars-loader']
        }
    ]
}

export default rules

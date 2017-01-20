import webpack  from 'webpack'
import path     from 'path'

const production = 'production' == process.env.NODE_ENV

module.exports = {

    entry   : {
        'index'             : './src/index.js',
    },

    output: {
        path            : path.join(__dirname, 'dist'),
        filename        : '[name].js',
    },

    module: {

        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|vendors)/,
                use: 'babel-loader',
            },
        ],
    },

    plugins : [
        ...(
            production
                ? [
                    // minify
                    new webpack.optimize.UglifyJsPlugin({ compress: {warnings: false} }),
                ]
                : []
        ),
    ]
}

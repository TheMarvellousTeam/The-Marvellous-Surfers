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

        // env var
        new webpack.DefinePlugin(

            [
                'COM_HOST',
                'COM_PORT',
                'NODE_ENV',
            ]
                .reduce( (o,name) =>
                    !(name in process.env)
                        ? o
                        : { ...o, [ 'process.env.'+name ] : `'${ process.env[ name ] }'`}
                ,{})
        ),

        ...(
            production
                ? [
                    // minify
                    new webpack.optimize.UglifyJsPlugin({ compress: {warnings: false} }),
                ]
                : []
        ),

    ],

    devtool : 'source-map',
}
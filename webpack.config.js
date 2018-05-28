'use strict';
var webpack = require('webpack');

module.exports = {
    entry: './src/main.js',
    output: {
        filename: './dist/tracking.min.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'imports-loader?global=>window'
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            'Promise': 'exports?global.Promise!es6-promise'
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                drop_console: true
            },
            comments: false
        })
    ]
};

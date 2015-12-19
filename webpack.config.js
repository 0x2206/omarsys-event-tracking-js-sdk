'use strict';
var webpack = require('webpack');

module.exports = {
    entry: './src/main.js',
    output: {
        filename: './dist/tracking.min.js'
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

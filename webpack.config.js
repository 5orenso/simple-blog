// var fs = require('fs');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const path = require('path');
const webpack = require('webpack');

module.exports = {
    cache: true,
    mode: 'production',
    entry: {
        custom: ['babel-polyfill', './template/bootstrap4/js/custom.js'],
    },
    output: {
        path: __dirname + '/template/bundle-js/',
        filename: '[name].min.js',
        // export itself to a global var
		libraryTarget: 'var',
		// name of the global var
		library: 'FFE'
    },
    plugins: [
        new UglifyJsPlugin()
    ]
};

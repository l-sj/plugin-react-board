var path = require('path');
var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var prodConfig = require('./webpack.prod.config');
var devConfig = require('./webpack.dev.config');
var target = (process.env.npm_lifecycle_event === 'build')? true : false;

var common = {
	entry: {
		'assets/build/defaultSkin': './assets/defaultSkin/js/index.js',
	},
	output: {
		path: path.resolve(__dirname, './'),
		filename: '[name].js',
	},
	plugins: [
		new CleanWebpackPlugin(['build'], {
			root: path.join(__dirname, './assets/'),
			verbose: true,
			dry: false,
			exclude: []
		}),
		new ExtractTextPlugin('assets/build/defaultSkin.css'),
	],
	module: {
		rules: [
			{
				test: /(\.js|\.jsx)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							cacheDirectory: true,
							presets: ['env'],
							plugins: ["transform-class-properties"]
						}
					},
				]
			},
			{
				test: /\.css/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: ["css-loader"]
				})
			}
		],
	},
	resolve: {
		extensions: ['.js', '.jsx'],
		alias: {
			utils: path.resolve(__dirname, 'assets/defaultSkin/js/utils.js'),
		},
	}
};

var config;

if (target) {
	config = webpackMerge(common, prodConfig);
} else {
	config = webpackMerge(common, devConfig);
}

module.exports = config;

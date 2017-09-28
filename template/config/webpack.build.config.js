import path from 'path';

import webpack from 'webpack';
import merge from 'webpack-merge';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

import env from './env.config.js';
import baseConfig from './base.config.js';
import { cssExtractLoaders } from '../support/utils.js';

import FormatHtmlPlugin from '../support/formatHtml.js';
import baseWebpackConfig from './webpack.base.config.js';

var Visualizer = require('webpack-visualizer-plugin');
var StatsPlugin = require('stats-webpack-plugin');

let webpackConfig = {};

webpackConfig = merge(baseWebpackConfig, {
    profile: true,
	/*vue: {
		loaders: cssExtractLoaders({
			extract: true
		})
	},*/
	output: {
		path: baseConfig.build.assetsRoot,
		filename: 'static/js/[name].[chunkhash].js',
		chunkFilename: 'static/js/[id].[chunkhash].js'
	},
	plugins: [
		new webpack.optimize.OccurrenceOrderPlugin(),
		// extract css string to file
		new ExtractTextPlugin('static/css/[name].[contenthash].css'),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks: (module, count) => {
				return (
					module.resource && /\.js$/.test(module.resource) && module.resource.indexOf(path.join(__dirname, '../node_modules')) === 0
				);
			}
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'manifest',
			chunks: ['vendor']
		}),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'index.html',
			inject: true,
			chunksSortMode: 'dependency',
			minify: {
				removeComments: true
			}
		}),
		new FormatHtmlPlugin(),
		new Visualizer({
            filename: './statistics.html'
        }),
        new StatsPlugin('stats.json', {
            chunkModules: true,
            stats: "normal"
        })
	]
});

if (env === 'production' || env === 'pre-production') {
	process.env.NODE_ENV = 'production';
	webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
		compress: {
			warnings: false
		}
	}));
}

export default webpackConfig;

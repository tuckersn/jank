const path = require('path');

module.exports = {
	context: path.join(__dirname, './src'),
	entry: './index.ts',
	devtool: 'inline-source-map',
	module: {
		rules: [
			{
				test: /\.(js|mjs|jsx|ts|tsx)$/,
				include: path.join(__dirname, './src'),
				loader: require.resolve('babel-loader'),
				options: {
					presets: [
						[
							require.resolve('@babel/preset-react'),
							{
								runtime: 'automatic',
							},
						],
					],
					plugins: [
						[
							require.resolve('babel-plugin-named-asset-import'),
							{
								loaderMap: {
									svg: {
										ReactComponent:
										'@svgr/webpack?-svgo,+titleProp,+ref![path]',
									},
								},
							},
						],
					].filter(Boolean),
					cacheDirectory: true,
					// See #6846 for context on why cacheCompression is disabled
					cacheCompression: false,
					compact: true,
				},
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
		modules: [
			path.join(__dirname, 'node_modules'),
			path.join(__dirname, "../../node_modules"),
			"node_modules",
			"../../node_modules"
		]
	},
	resolveLoader: {
		modules: [
			path.join(__dirname, 'node_modules'),
			path.join(__dirname, "../../node_modules"),
		]
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
	}
};
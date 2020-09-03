module.exports = (api) => {
	api.cache(false)

	return {
		ignore: ["**/testDirsAndFiles/**", "**/spruce-templates/src/templates/**"],
		presets: ['@babel/preset-env', '@babel/preset-typescript'],
		plugins: [
			['@sprucelabs/babel-plugin-schema', {
				cwd: __dirname,
				destination: process.env.PWD
			}],
			'@babel/plugin-transform-runtime',
			[
				'@babel/plugin-proposal-decorators',
				{
					legacy: true,
				},
			],
			['@babel/plugin-proposal-class-properties', {loose: true}],
			[
				'module-resolver',
				{
					root: ['./'],
					alias: {
						'#spruce': './src/.spruce',
					},
				},
			],
		],
	}
}

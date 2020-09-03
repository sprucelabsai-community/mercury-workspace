import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
	input: 'build/index.js',
	output: {
		file: 'rollup/mercury.js',
		format: 'cjs',
		compact: true,
		exports: 'default'
	},
	plugins: [nodeResolve(), commonjs()]
}

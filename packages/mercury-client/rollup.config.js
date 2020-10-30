import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';


export default {
	input: 'src/index.ts',
	output: {
		dir: 'browser',
		format: 'umd',
		name: 'mercury',
	},
	plugins: [
		typescript({
			tsconfig: 'tsconfig.browser.json'
		}), 
		terser()
	]
}
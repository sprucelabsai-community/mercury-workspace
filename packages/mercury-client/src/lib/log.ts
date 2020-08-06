import Debug from 'debug'

const debug = Debug('@sprucelabs/mercury')
class Log {
	public static debug(...args: any) {
		if (args.length === 1) {
			debug(args[0])
		} else {
			debug(args)
		}
	}

	public static warn(...args: any) {
		console.log('⚠️ @sprucelabs/mercury ', args)
	}
}

export default Log

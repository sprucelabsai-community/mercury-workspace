import {ConnectionOptions} from './client.types'

export default class MercuryClientFactory {
	public static async Client(connectionOptions: ConnectionOptions) {
		const client = new MercurySocketIoClient()
		return client as MercuryEventEmitter
	}
}

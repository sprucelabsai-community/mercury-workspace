import { ConnectionOptions, MercuryClient } from './client.types'
import { DEFAULT_HOST } from './constants'
import SpruceError from './errors/SpruceError'
import MercurySocketIoClient from './MercurySocketIoClient'

export default class MercuryClientFactory {
	public static async Client(connectionOptions?: ConnectionOptions) {
		const host = connectionOptions?.host ?? DEFAULT_HOST

		if (host.substr(0, 5) !== 'https') {
			throw new SpruceError({ code: 'INVALID_PROTOCOL' })
		}

		const client = new MercurySocketIoClient({ host, rejectUnauthorized: !connectionOptions?.allowSelfSignedCrt })
		
		await client.connect()
		
		return client as MercuryClient<any>
	}
}

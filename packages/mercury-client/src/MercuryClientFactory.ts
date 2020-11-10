import { EventContract } from '@sprucelabs/mercury-types'
import { SpruceSchemas } from '@sprucelabs/mercury-types/build/.spruce/schemas/schemas.types'
import { ConnectionOptions, MercuryClient } from './client.types'
import { DEFAULT_HOST } from './constants'
import SpruceError from './errors/SpruceError'
import MercurySocketIoClient from './MercurySocketIoClient'

export default class MercuryClientFactory {
	public static async Client<Contract extends EventContract>(connectionOptions: ConnectionOptions): Promise<MercuryClient<Contract>> {
		const {host = DEFAULT_HOST, contracts} = connectionOptions 

		if (host.substr(0, 5) !== 'https') {
			throw new SpruceError({ code: 'INVALID_PROTOCOL' })
		}

		if (!contracts) {
			throw new SpruceError({code: 'MISSING_PARAMETERS', parameters: ['contracts']})
		}
		
		if (!Array.isArray(contracts) || contracts.length === 0) {
			
			throw new SpruceError({code: 'INVALID_PARAMETERS', parameters: ['contracts']})
		}

		type MutableEventContract = SpruceSchemas.MercuryTypes.v2020_09_01.IEventContract

		const unifiedContract: MutableEventContract = {
			eventSignatures: []
		}

		for (const contract of contracts) {
			const c = contract as MutableEventContract
			unifiedContract.eventSignatures.push(...c.eventSignatures)
		}

		const eventContract: Contract = unifiedContract as any

		const client = new MercurySocketIoClient<Contract>({ host, rejectUnauthorized: !connectionOptions?.allowSelfSignedCrt, eventContract })
		
		await client.connect()
		
		return client
	}
}

import { EventContract } from '@sprucelabs/mercury-types'
import { eventContractUtil } from '@sprucelabs/spruce-event-utils'
import { ConnectionOptions, MercuryClient } from '../client.types'
import { DEFAULT_HOST } from '../constants'
import SpruceError from '../errors/SpruceError'
import MutableContractClient from './MutableContractClient'

export type Client<Contract extends EventContract> = MercuryClient<Contract> & {
	handlesEvent(eventNameWithOptionalNamespace: string): boolean
	mixinContract(eventContract: EventContract): void
}

export default class MercuryClientFactory {
	public static async Client<Contract extends EventContract>(
		connectionOptions?: ConnectionOptions
	): Promise<Client<Contract>> {
		const { host = DEFAULT_HOST, contracts } = connectionOptions || {
			contracts: [],
		}

		if (host.substr(0, 4) !== 'http') {
			throw new SpruceError({ code: 'INVALID_PROTOCOL' })
		}

		if (contracts && !Array.isArray(contracts)) {
			throw new SpruceError({
				code: 'INVALID_PARAMETERS',
				parameters: ['contracts'],
			})
		}

		const eventContract = eventContractUtil.unifyContracts<Contract>(
			//@ts-ignore
			contracts ?? []
		)

		const client = new MutableContractClient<Contract>({
			host,
			reconnection: false,
			rejectUnauthorized: !connectionOptions?.allowSelfSignedCrt,
			eventContract,
		})

		await client.connect()

		return client as Client<Contract>
	}
}

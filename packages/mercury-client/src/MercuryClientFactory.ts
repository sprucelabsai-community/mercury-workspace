import { EventContract } from '@sprucelabs/mercury-types'
import { ConnectionOptions, MercuryClient } from './client.types'
import { DEFAULT_HOST } from './constants'
import SpruceError from './errors/SpruceError'
import MercurySocketIoClient from './MercurySocketIoClient'
import MutableContractClient from './tests/MutableContractClient'

export default class MercuryClientFactory {
	public static async Client<Contract extends EventContract>(
		connectionOptions?: ConnectionOptions
	): Promise<MercuryClient<Contract>> {
		const {
			host = DEFAULT_HOST,
			contracts,
			isTest = false,
		} = connectionOptions || { contracts: [] }

		if (host.substr(0, 4) !== 'http') {
			throw new SpruceError({ code: 'INVALID_PROTOCOL' })
		}

		if (contracts && !Array.isArray(contracts)) {
			throw new SpruceError({
				code: 'INVALID_PARAMETERS',
				parameters: ['contracts'],
			})
		}

		const unifiedContract: EventContract = {
			eventSignatures: {},
		}

		for (const contract of contracts ?? []) {
			unifiedContract.eventSignatures = {
				...unifiedContract.eventSignatures,
				...contract.eventSignatures,
			}
		}

		const eventContract =
			contracts && contracts.length > 0
				? (unifiedContract as Contract)
				: undefined

		const Client = isTest ? MutableContractClient : MercurySocketIoClient

		//@ts-ignore
		const client = new Client<Contract>({
			host,
			reconnection: false,
			rejectUnauthorized: !connectionOptions?.allowSelfSignedCrt,
			eventContract,
		})

		await client.connect()

		return client as MercuryClient<Contract>
	}
}

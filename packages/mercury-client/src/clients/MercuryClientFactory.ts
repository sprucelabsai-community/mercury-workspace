import { EventContract } from '@sprucelabs/mercury-types'
import { eventContractUtil } from '@sprucelabs/spruce-event-utils'
import { ConnectionOptions, MercuryClient } from '../client.types'
import { DEFAULT_HOST } from '../constants'
import SpruceError from '../errors/SpruceError'
import MutableContractClient from './MutableContractClient'

export type Client<Contract extends EventContract> = MercuryClient<Contract> & {
	handlesEvent(eventName: string): boolean
	mixinContract(eventContract: EventContract): void
}

export default class MercuryClientFactory {
	private static isTestMode = false
	private static defaultContract: any

	public static async Client<Contract extends EventContract>(
		connectionOptions?: ConnectionOptions
	): Promise<Client<Contract>> {
		const { host = DEFAULT_HOST, contracts } = connectionOptions || {}

		if (host.substr(0, 4) !== 'http') {
			throw new SpruceError({ code: 'INVALID_PROTOCOL' })
		}

		if (contracts && !Array.isArray(contracts)) {
			throw new SpruceError({
				code: 'INVALID_PARAMETERS',
				parameters: ['contracts'],
			})
		}

		const eventContract =
			!contracts && this.defaultContract
				? this.defaultContract
				: //@ts-ignore
				  eventContractUtil.unifyContracts<Contract>(contracts ?? [])

		let Client = MutableContractClient

		if (this.isTestMode) {
			Client = require('../clients/MercuryTestClient').default
		}

		const client = new Client<Contract>({
			host,
			reconnection: false,
			rejectUnauthorized: !connectionOptions?.allowSelfSignedCrt,
			eventContract,
			emitTimeoutMs: connectionOptions?.emitTimeoutMs,
		})

		await client.connect()

		return client as Client<Contract>
	}

	public static isInTestMode() {
		return this.isTestMode
	}

	public static setIsTestMode(isTestMode: boolean) {
		this.isTestMode = isTestMode
	}

	public static setDefaultContract(contract: EventContract) {
		this.defaultContract = contract
	}

	public static resetTestClient() {
		const Client = require('../clients/MercuryTestClient').default
		Client.reset()
	}
}

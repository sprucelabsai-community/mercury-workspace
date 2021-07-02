import { EventContract, SkillEventContract } from '@sprucelabs/mercury-types'
import { eventContractUtil } from '@sprucelabs/spruce-event-utils'
import { DEFAULT_HOST } from '../constants'
import SpruceError from '../errors/SpruceError'
import { ConnectionOptions, MercuryClient } from '../types/client.types'
import MutableContractClient from './MutableContractClient'

export type Client<Contract extends EventContract> = MercuryClient<Contract> & {
	doesHandleEvent(eventName: string): boolean
	mixinContract(eventContract: EventContract): void
	resetContracts(): void
}

export default class MercuryClientFactory {
	private static isTestMode = false
	private static defaultContract: any
	private static timeoutMs = 30000

	public static async Client<
		Contract extends SkillEventContract = SkillEventContract
		/** @ts-ignore */
	>(connectionOptions?: ConnectionOptions): Promise<Client<Contract>> {
		const {
			host: hostOption,
			contracts,
			reconnectDelayMs,
			allowSelfSignedCrt,
			emitTimeoutMs = this.timeoutMs,
			shouldReconnect,
		} = connectionOptions || {}

		const host = hostOption ?? DEFAULT_HOST

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

		const client = new Client<any>({
			host,
			reconnection: false,
			reconnectDelayMs,
			rejectUnauthorized: !allowSelfSignedCrt,
			eventContract,
			emitTimeoutMs,
			shouldReconnect,
		})

		await client.connect()

		return client as any
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

	public static hasDefaultContract(): boolean {
		return !!this.defaultContract
	}

	public static clearDefaultContract() {
		this.defaultContract = undefined
	}

	public static resetTestClient() {
		const Client = require('../clients/MercuryTestClient').default
		Client.reset()
	}

	public static setDefaultTimeoutMs(ms: number) {
		this.timeoutMs = ms
	}
}

import { EventContract, SkillEventContract } from '@sprucelabs/mercury-types'
import { SchemaError } from '@sprucelabs/schema'
import { eventContractUtil } from '@sprucelabs/spruce-event-utils'
import { DEFAULT_HOST } from '../constants'
import SpruceError from '../errors/SpruceError'
import { ConnectionOptions, MercuryClient } from '../types/client.types'
import MutableContractClient from './MutableContractClient'

export type Client<Contract extends EventContract> = MercuryClient<Contract> & {
	doesHandleEvent(eventName: string): boolean
	mixinContract(eventContract: EventContract): void
}

export default class MercuryClientFactory {
	private static isTestMode = false
	private static defaultContract: any
	private static timeoutMs = 30000
	private static totalClients = 0
	private static clients: Client<any>[] = []
	private static shouldRequireLocalListeners = false

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
			maxEmitRetries,
		} = connectionOptions || {}

		const host = hostOption ?? DEFAULT_HOST

		if (host.substr(0, 4) !== 'http') {
			throw new SpruceError({ code: 'INVALID_PROTOCOL' })
		}

		if (contracts && !Array.isArray(contracts)) {
			throw new SchemaError({
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
			maxEmitRetries,
			//@ts-ignore
			shouldRequireLocalListeners: this.shouldRequireLocalListeners,
		})

		await client.connect()

		this.totalClients++
		this.clients.push(client)

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

	private static resetTestClient() {
		const Client = require('../clients/MercuryTestClient').default
		Client.reset()
	}

	public static setDefaultTimeoutMs(ms: number) {
		this.timeoutMs = ms
	}

	public static getTotalClients() {
		return this.totalClients
	}

	public static reset() {
		this.totalClients = 0
		this.clients = []
		this.resetTestClient()
	}

	public static getClients() {
		return this.clients
	}

	public static setShouldRequireLocalListeners(shouldRequire: boolean) {
		if (!this.isTestMode) {
			throw new Error(`You can't require local listeners unless in test mode!`)
		}
		this.shouldRequireLocalListeners = shouldRequire
	}

	public static getShouldRequireLocalListeners() {
		return this.shouldRequireLocalListeners
	}
}

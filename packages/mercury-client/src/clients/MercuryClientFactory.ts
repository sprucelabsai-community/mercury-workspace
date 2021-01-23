import { EventContract } from '@sprucelabs/mercury-types'
import {
	eventContractUtil,
	eventResponseUtil,
} from '@sprucelabs/spruce-event-utils'
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
	private static cacheDir: string

	public static async Client<Contract extends EventContract>(
		connectionOptions?: ConnectionOptions
	): Promise<Client<Contract>> {
		const { host = DEFAULT_HOST, contracts } = connectionOptions || {
			contracts: [],
		}

		if (this.isTestMode && !this.cacheDir) {
			throw new SpruceError({ code: 'MISSING_TEST_CACHE_DIR' })
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
			emitTimeoutMs: connectionOptions?.emitTimeoutMs,
		})

		await client.connect()

		if (this.isTestMode && this.cacheDir) {
			const pathUtil = require('path')
			const contractDestination = pathUtil.join(
				this.cacheDir,
				'events.contract.js'
			)
			const fsUtil = require('fs-extra')
			let contracts: any

			if (fsUtil.pathExistsSync(contractDestination)) {
				contracts = require(contractDestination)
			} else {
				fsUtil.ensureDirSync(this.cacheDir)

				//@ts-ignore
				const results = await client.emit('get-event-contracts::v2020_12_25')

				const payload = eventResponseUtil.getFirstResponseOrThrow(results)

				//@ts-ignore
				contracts = payload.contracts

				fsUtil.writeFileSync(
					contractDestination,
					`module.exports = ${JSON.stringify(contracts)}`
				)
			}

			client.mixinContract(contracts[0])
		}

		return client as Client<Contract>
	}

	public static isInTestMode() {
		return this.isTestMode
	}

	public static setIsTestMode(isTestMode: boolean) {
		this.isTestMode = isTestMode
	}

	public static setTestCacheDir(cacheDir: string) {
		this.cacheDir = cacheDir
	}
}

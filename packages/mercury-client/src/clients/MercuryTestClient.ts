import { AbstractEventEmitter } from '@sprucelabs/mercury-event-emitter'
import { EventContract } from '@sprucelabs/mercury-types'
import { Schema } from '@sprucelabs/schema'
import { eventContractUtil, EventSource } from '@sprucelabs/spruce-event-utils'
import MutableContractClient from './MutableContractClient'

class InternalEmitter<
	Contract extends EventContract
> extends AbstractEventEmitter<Contract> {
	public reset() {
		this.listenersByEvent = {}
	}

	public doesHandleEvent(eventName: string) {
		try {
			eventContractUtil.getSignatureByName(this.eventContract, eventName as any)
			return true
		} catch {
			return false
		}
	}

	protected validatePayload(
		schema: Schema | undefined | null,
		actualPayload: any,
		eventName: string
	) {
		const payload = { ...actualPayload }
		delete payload.source
		return super.validatePayload(schema, payload, eventName)
	}

	public mixinOnlyUniqueSignatures(contract: EventContract) {
		const newSigs = eventContractUtil.getNamedEventSignatures(contract)
		const oldSigs = eventContractUtil.getNamedEventSignatures(
			this.eventContract
		)

		const newContract: EventContract = {
			eventSignatures: {},
		}

		for (const newSig of newSigs) {
			const match = oldSigs.findIndex(
				(old) => old.fullyQualifiedEventName === newSig.fullyQualifiedEventName
			)
			if (match === -1) {
				newContract.eventSignatures[newSig.fullyQualifiedEventName] =
					eventContractUtil.getSignatureByName(
						contract,
						newSig.fullyQualifiedEventName
					)
			}
		}

		if (Object.keys(newContract.eventSignatures).length > 0) {
			this.mixinContract(newContract)
		}
	}
}

export default class MercuryTestClient<
	Contract extends EventContract
> extends MutableContractClient<Contract> {
	private static emitter: any
	private _isConnected = false
	private isConnectedToApi = false

	public constructor(
		options: Record<string, any> & { host: string; eventContract?: Contract }
	) {
		super(options)
		if (!MercuryTestClient.emitter) {
			MercuryTestClient.emitter = new InternalEmitter(
				options.eventContract ?? { eventSignatures: {} }
			)
		} else if (options.eventContract) {
			MercuryTestClient.emitter.mixinOnlyUniqueSignatures(options.eventContract)
		}
	}

	public static resetContracts() {
		MutableContractClient.resetContracts()
		MercuryTestClient.emitter?.resetContracts()
	}

	public mixinContract(contract: EventContract) {
		MutableContractClient.mixinContract(contract)
		MercuryTestClient.emitter.mixinContract(contract)
	}

	public doesHandleEvent(eventName: string) {
		return (
			super.doesHandleEvent(eventName) ||
			MercuryTestClient.emitter?.doesHandleEvent(eventName)
		)
	}

	public resetContracts() {
		MercuryTestClient.resetContracts()
	}

	public async on(...args: any[]) {
		return MercuryTestClient.emitter.on(...args)
	}

	public async emit(...args: any[]) {
		if (MercuryTestClient.emitter.listenCount(args[0]) > 0) {
			const source: EventSource = {}
			if (this.auth?.person) {
				source.personId = this.auth.person.id
			}

			if (this.auth?.skill) {
				source.skillId = this.auth.skill.id
			}

			const argsWithSource = [...args]
			argsWithSource[1] = {
				...argsWithSource[1],
				source,
			}
			return MercuryTestClient.emitter.emit(...argsWithSource)
		} else {
			if (!super.isConnected()) {
				this.isConnectedToApi = true
				await super.connect()
			}

			//@ts-ignore
			return super.emit(...args)
		}
	}

	public async connect() {
		this._isConnected = true
	}

	public isConnected() {
		return this._isConnected
	}

	public async disconnect() {
		if (this.isConnectedToApi) {
			await super.disconnect()
		}

		this._isConnected = false
	}

	public static reset() {
		MercuryTestClient.emitter?.reset()
		MercuryTestClient.resetContracts()
	}
}

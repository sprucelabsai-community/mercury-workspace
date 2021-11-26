import { AbstractEventEmitter } from '@sprucelabs/mercury-event-emitter'
import {
	EventContract,
	MercuryAggregateResponse,
} from '@sprucelabs/mercury-types'
import { Schema } from '@sprucelabs/schema'
import {
	eventContractUtil,
	eventNameUtil,
	eventResponseUtil,
	EventSource,
} from '@sprucelabs/spruce-event-utils'
import SpruceError from '../errors/SpruceError'
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

	protected validateEmitPayload(
		schema: Schema | undefined | null,
		actualPayload: any,
		eventName: string
	) {
		const payload = { ...actualPayload }
		delete payload.source
		return super.validateEmitPayload(schema, payload, eventName)
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

	public getContract() {
		return this.eventContract
	}
}

export default class MercuryTestClient<
	Contract extends EventContract
> extends MutableContractClient<Contract> {
	private static emitter: any
	private _isConnected = false
	private isConnectedToApi = false
	private connectPromise?: Promise<void>

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

	public async emit(...args: any[]): Promise<MercuryAggregateResponse<any>> {
		const emitter = MercuryTestClient.emitter
		const fqen = args[0]

		try {
			if (emitter.listenCount(fqen) > 0) {
				let source: EventSource = {
					...args[1]?.source,
				}
				if (this.auth?.person) {
					source.personId = this.auth.person.id
				}

				if (this.auth?.skill) {
					source.skillId = this.auth.skill.id
				}

				if (!source.proxyToken && this.getProxyToken()) {
					source.proxyToken = this.getProxyToken()
				}

				const argsWithSource = [...args]

				if (Object.keys(source).length > 0) {
					argsWithSource[1] = {
						...argsWithSource[1],
						source,
					}
				}

				const contract = emitter.getContract()
				const sig = eventContractUtil.getSignatureByName(contract, fqen)
				const { eventNamespace } = eventNameUtil.split(fqen)

				if (sig.emitPermissionContract && eventNamespace) {
					let { target } = args[1] ?? {}
					let permTarget = { ...source }

					if (target?.organizationId) {
						permTarget.organizationId = target.organizationId
					}

					const results = await this.emit(
						'does-honor-permission-contract::v2020_12_25',
						{
							target: permTarget,
							payload: {
								id: sig.emitPermissionContract.id,
								fqen,
							},
						}
					)

					if (results.totalErrors > 0) {
						return results as any
					}

					const { doesHonor } =
						eventResponseUtil.getFirstResponseOrThrow(results)

					if (!doesHonor) {
						return {
							totalContracts: 1,
							totalErrors: 1,
							totalResponses: 1,
							responses: [
								{
									errors: [
										new SpruceError({
											code: 'UNAUTHORIZED_ACCESS',
											fqen,
											action: 'emit',
											target,
											permissionContractId: sig.emitPermissionContract.id,
										}),
									],
								},
							],
						}
					}
				}

				return emitter.emit(...argsWithSource)
			} else {
				await this.connectIfNotConnected()

				//@ts-ignore
				const results = await super.emit(...args)

				const firstError = results.responses?.[0]?.errors?.[0]
				if (firstError && firstError.options?.code === 'INVALID_EVENT_NAME') {
					firstError.options.friendlyMessage = `Event not found! Make sure you are booting your skill in your test with \`await this.bootSkill()\`. If you haven't, you'll need to create a listener with \`spruce create.listener\`.\n\nOriginal Error:\n\n${firstError.options.friendlyMessage}`
				}

				return results
			}
		} catch (err: any) {
			if (err.options?.code === 'INVALID_EVENT_NAME') {
				err.message = `${err.message} Double check it's spelled correctly (types are passing) and that you've run \`spruce create.event\` to create the event.`
			}

			throw err
		}
	}

	private async connectIfNotConnected() {
		if (!this.isConnectedToApi) {
			this.isConnectedToApi = true
			this.connectPromise = super.connect()
		}

		await this.connectPromise
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

	public getIsTestClient() {
		return true
	}
}

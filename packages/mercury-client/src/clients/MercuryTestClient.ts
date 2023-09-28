import { AbstractEventEmitter } from '@sprucelabs/mercury-event-emitter'
import {
	EventContract,
	EventName,
	MercuryAggregateResponse,
	SkillEventContract,
	SpruceSchemas,
} from '@sprucelabs/mercury-types'
import { Schema } from '@sprucelabs/schema'
import {
	eventContractUtil,
	eventNameUtil,
	eventResponseUtil,
	EventSource,
} from '@sprucelabs/spruce-event-utils'
import clone from 'just-clone'
import SpruceError from '../errors/SpruceError'
import { authenticateFqen } from './MercurySocketIoClient'
import MutableContractClient from './MutableContractClient'
import { connectionStatusContract } from './statusChangePayloadSchema'

class InternalEmitter<
	Contract extends EventContract
> extends AbstractEventEmitter<Contract> {
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
		const fqens = Object.keys(contract.eventSignatures)

		for (const fqen of fqens) {
			if (!this.eventContract.eventSignatures[fqen]) {
				this.eventContract.eventSignatures[fqen] =
					contract.eventSignatures[fqen]
			}
		}
	}

	public overrideSignatures(contract: EventContract) {
		const fqens = Object.keys(contract.eventSignatures)

		for (const fqen of fqens) {
			this.eventContract.eventSignatures[fqen] = contract.eventSignatures[fqen]
		}
	}

	public getContract() {
		return this.eventContract
	}
}

export default class MercuryTestClient<
	/** @ts-ignore */
	Contract extends EventContract = SkillEventContract
> extends MutableContractClient<Contract> {
	private static emitter: InternalEmitter<any>
	private _isConnected = false
	private isConnectedToApi = false
	private connectPromise?: Promise<void>
	private static shouldCheckPermissionsOnLocalEvents = false
	private shouldHandleAuthenticateLocallyIfListenerSet = true
	private static namespacesThatHaveToBeHandledLocally: string[] = []
	private shouldWaitForDelayedConnectIfAuthing = true
	private static shouldRequireLocalListeners = false
	/** @ts-ignore */
	protected get eventContract() {
		return MercuryTestClient.emitter.getContract() as Contract
	}

	protected set eventContract(contract: Contract) {
		MercuryTestClient.getInternalEmitter().overrideSignatures(contract)
	}

	public static setShouldCheckPermissionsOnLocalEvents(should: boolean) {
		this.shouldCheckPermissionsOnLocalEvents = should
	}

	public static setNamespacesThatMustBeHandledLocally(namespaces: string[]) {
		this.namespacesThatHaveToBeHandledLocally = namespaces
	}

	public static getNamespacesThatMustBeHandledLocally() {
		return this.namespacesThatHaveToBeHandledLocally
	}

	public constructor(
		options: Record<string, any> & {
			host: string
			eventContract?: Contract
		}
	) {
		const contract = options.eventContract

		super({ ...options, eventContract: contract as Contract })

		MercuryTestClient.getInternalEmitter(contract)
	}
	/** @ts-ignore */
	public static getInternalEmitter(contract?: EventContract) {
		const mixed = mixinConnectionEvents(contract)

		if (!MercuryTestClient.emitter) {
			MercuryTestClient.emitter = new InternalEmitter({ eventSignatures: {} })
		}

		MercuryTestClient.emitter.mixinOnlyUniqueSignatures(mixed)
		/** @ts-ignore */
		return MercuryTestClient.emitter as InternalEmitter<SkillEventContract>
	}

	public async off(eventName: EventName<Contract>, cb?: any): Promise<number> {
		await MercuryTestClient.emitter?.off(eventName, cb)
		if (MercuryTestClient.emitter?.listenCount(eventName) === 0) {
			return super.off(eventName)
		} else {
			return 1
		}
	}

	public static mixinContract(contract: EventContract) {
		MutableContractClient.mixinContract(contract)
		MercuryTestClient.emitter.mixinContract(contract)
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

	public async on(...args: any[]) {
		//@ts-ignore
		return MercuryTestClient.emitter.on(...args)
	}

	public async emit(...args: any[]): Promise<MercuryAggregateResponse<any>> {
		const emitter = MercuryTestClient.emitter
		const fqen = args[0]

		try {
			if (this.shouldHandleEventLocally(emitter, fqen)) {
				return this.handleEventLocally(args)
			} else {
				if (MercuryTestClient.shouldRequireLocalListeners) {
					throw new SpruceError({
						code: 'MUST_HANDLE_LOCALLY',
						fqen,
						friendlyMessage: `You need to listen to or fake a response to '${fqen}'. Try 'spruce create.listener' or 'eventFaker.on('${fqen}')'!`,
					})
				}

				await this.connectIfNotConnected(fqen)

				//@ts-ignore
				const results = await super.emit(...args)

				const firstError = results.responses?.[0]?.errors?.[0]
				if (firstError && firstError.options?.code === 'INVALID_EVENT_NAME') {
					firstError.message = `Event not found! Make sure you are booting your skill in your test with \`await this.bootSkill()\`. If you haven't, you'll need to create a listener with \`spruce create.listener\`.\n\nOriginal Error:\n\n${firstError.options.friendlyMessage}`
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

	private shouldHandleEventLocally(emitter: any, fqen: any) {
		if (
			!this.shouldHandleAuthenticateLocallyIfListenerSet &&
			fqen === authenticateFqen
		) {
			return false
		}

		const { eventNamespace } = eventNameUtil.split(fqen)

		if (
			eventNamespace &&
			MercuryTestClient.namespacesThatHaveToBeHandledLocally.indexOf(
				eventNamespace
			) > -1
		) {
			return true
		}

		return emitter.listenCount(fqen) > 0
	}

	private async handleEventLocally(
		args: any[]
	): Promise<MercuryAggregateResponse<any>> {
		const emitter = MercuryTestClient.emitter

		const fqen = args[0]
		const payload = args[1]

		if (!MercuryTestClient.emitter.doesHandleEvent(fqen)) {
			throw new SpruceError({
				code: 'MUST_CREATE_EVENT',
				fqen,
			})
		}

		if (MercuryTestClient.emitter.listenCount(fqen) === 0) {
			throw new SpruceError({
				code: 'MUST_HANDLE_LOCALLY',
				fqen,
			})
		}

		this.assertValidEmitTargetAndPayload(fqen, payload)

		let { argsWithSource } = this.buildSource(args)

		const contract = emitter.getContract()
		const sig = eventContractUtil.getSignatureByName(contract, fqen)
		const { eventNamespace } = eventNameUtil.split(fqen)

		if (eventNamespace) {
			this.assertValidEventSignature(sig, fqen)
		}

		if (sig.emitPermissionContract && eventNamespace) {
			const doesHonor = await this.optionallyCheckPermissions(
				args,
				sig.emitPermissionContract.id,
				fqen
			)

			if (typeof doesHonor !== 'boolean') {
				return doesHonor
			}

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
									target: args[1] ?? {},
									permissionContractId: sig.emitPermissionContract.id,
								}),
							],
						},
					],
				} as any
			}
		}

		//@ts-ignore
		const results = (await emitter.emit(...argsWithSource)) as any

		return clone(results)
	}

	private assertValidEventSignature(
		sig: SpruceSchemas.Mercury.v2020_12_25.EventSignature,
		fqen: string
	) {
		if (!sig.isGlobal && !sig.emitPayloadSchema?.fields?.target) {
			throw new SpruceError({
				code: 'INVALID_EVENT_SIGNATURE',
				fqen,
				instructions:
					'Oh no! You have to either create an event using `spruce create.event`, set your event to global (event.options.ts, which requires special permissions) or add a target that includes an organizationId or locationId. Choose wisely!',
			})
		}
	}

	private async optionallyCheckPermissions(
		args: any[],
		permissionContractId: any,
		fqen: string
	): Promise<boolean | MercuryAggregateResponse<any>> {
		if (!MercuryTestClient.shouldCheckPermissionsOnLocalEvents) {
			return true
		}

		let { target } = args[1] ?? {}
		const permTarget: Record<string, any> = {}

		if (target?.organizationId) {
			permTarget.organizationId = target.organizationId
		}

		if (target?.locationId) {
			throw new Error(
				'checking permissions against a location is not supported. Add to mercury-workspace -> mercury-client'
			)
		}

		const results = await this.emit(
			'does-honor-permission-contract::v2020_12_25',
			{
				target: permTarget,
				payload: {
					id: permissionContractId,
					fqen,
				},
			}
		)

		if (results.totalErrors > 0) {
			return results as any
		}

		const { doesHonor } = eventResponseUtil.getFirstResponseOrThrow(results)

		return doesHonor
	}

	private buildSource(args: any[]) {
		let source: EventSource = {
			...args[1]?.source,
		}
		if (this.auth?.person) {
			source.personId = this.auth.person.id
		}

		if (this.auth?.skill) {
			source.skillId = this.auth.skill.id
		}

		if (
			args[0] !== 'authenticate::v2020_12_25' &&
			!source.proxyToken &&
			this.getProxyToken()
		) {
			source.proxyToken = this.getProxyToken()
		}

		const argsWithSource = [...args]

		if (
			typeof argsWithSource[1] !== 'function' &&
			Object.keys(source).length > 0
		) {
			argsWithSource[1] = {
				...argsWithSource[1],
				source,
			}
		}
		return { source, argsWithSource: clone(argsWithSource) }
	}

	private async connectIfNotConnected(fqen: string) {
		if (!this.isConnectedToApi) {
			this.isConnectedToApi = true
			this.connectPromise = this.delayedConnectAndAuth(fqen)
		}

		if (
			!this.shouldWaitForDelayedConnectIfAuthing &&
			fqen === authenticateFqen
		) {
			return
		}

		await this.connectPromise
	}

	private async delayedConnectAndAuth(fqen: string) {
		await super.connect()

		if (this.lastAuthOptions && fqen !== authenticateFqen) {
			this.authPromise = undefined
			this.shouldHandleAuthenticateLocallyIfListenerSet = false
			this.shouldWaitForDelayedConnectIfAuthing = false

			await this.authenticate(this.lastAuthOptions)
		}
	}

	public async connect() {
		if (this._isConnected) {
			await super.connect()
		}
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
		MutableContractClient.reset()
		//@ts-ignore
		MercuryTestClient.emitter = undefined
		//@ts-ignore
		MercuryTestClient.emitter = MercuryTestClient.getInternalEmitter({
			eventSignatures: {},
		})
	}

	public getIsTestClient() {
		return true
	}

	public static setShouldRequireLocalListeners(shouldRequire: boolean) {
		this.shouldRequireLocalListeners = shouldRequire
	}

	public static getShouldRequireLocalListeners() {
		return this.shouldRequireLocalListeners
	}
}
function mixinConnectionEvents<
	/** @ts-ignore */
	Contract extends EventContract = SkillEventContract
>(contract: Contract | undefined) {
	return eventContractUtil.unifyContracts([
		contract ?? { eventSignatures: {} },
		connectionStatusContract,
	])!
}

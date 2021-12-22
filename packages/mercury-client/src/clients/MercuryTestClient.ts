import { AbstractEventEmitter } from '@sprucelabs/mercury-event-emitter'
import {
	EventContract,
	EventNames,
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
import { MercuryClient } from '..'
import SpruceError from '../errors/SpruceError'
import { authenticateFqen } from './MercurySocketIoClient'
import MutableContractClient from './MutableContractClient'

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
	/** @ts-ignore */
	Contract extends EventContract = SkillEventContract
> extends MutableContractClient<Contract> {
	private static emitter: any
	private _isConnected = false
	private isConnectedToApi = false
	private connectPromise?: Promise<void>
	private static shouldCheckPermissionsOnLocalEvents = false
	private shouldHandleAuthenticateLocallyIfListenerSet = true
	private static namespacesThatHaveToBeHandledLocally: string[] = []

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
		options: Record<string, any> & { host: string; eventContract?: Contract }
	) {
		super(options)
		MercuryTestClient.getInternalEmitter(options.eventContract)
	}

	/** @ts-ignore */
	public static getInternalEmitter(contract: EventContract | undefined) {
		if (!MercuryTestClient.emitter) {
			MercuryTestClient.emitter = new InternalEmitter(
				contract ?? { eventSignatures: {} }
			)
		} else if (contract) {
			MercuryTestClient.emitter.mixinOnlyUniqueSignatures(contract)
		}

		return MercuryTestClient.emitter as MercuryClient
	}

	public async off(eventName: EventNames<Contract>): Promise<number> {
		await MercuryTestClient.emitter?.off(eventName)
		return super.off(eventName)
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
		return MercuryTestClient.emitter.on(...args)
	}

	public async emit(...args: any[]): Promise<MercuryAggregateResponse<any>> {
		const emitter = MercuryTestClient.emitter
		const fqen = args[0]

		try {
			if (this.shouldHandleEventLocally(emitter, fqen)) {
				return this.handleEventLocally(args)
			} else {
				await this.connectIfNotConnected(fqen)

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

		return emitter.emit(...argsWithSource) as any
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
					'You have to either set your event to global (event.options.ts, which requires special permissions) or add a target that includes an organizationId or locationId.',
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
		return { source, argsWithSource }
	}

	private async connectIfNotConnected(fqen: string) {
		if (!this.isConnectedToApi) {
			this.isConnectedToApi = true
			this.connectPromise = super.connect()
			if (this.lastAuthOptions && fqen !== authenticateFqen) {
				this.authPromise = undefined
				this.shouldHandleAuthenticateLocallyIfListenerSet = false
				await this.authenticate(this.lastAuthOptions)
			}
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
		MutableContractClient.reset()
		MercuryTestClient.emitter = undefined
		MercuryTestClient.emitter = MercuryTestClient.getInternalEmitter({
			eventSignatures: {},
		})
	}

	public getIsTestClient() {
		return true
	}
}

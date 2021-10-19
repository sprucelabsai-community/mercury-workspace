import {
	EventContract,
	MercuryEventEmitter,
	SkillEventContract,
	SpruceSchemas,
} from '@sprucelabs/mercury-types'

export interface ConnectionOptions {
	host?: string
	allowSelfSignedCrt?: boolean
	contracts?: EventContract[]
	emitTimeoutMs?: number
	reconnectDelayMs?: number
	shouldReconnect?: boolean
	maxEmitRetries?: number
}

export type MercuryClient<
	/** @ts-ignore */
	Contract extends EventContract = SkillEventContract
> = MercuryEventEmitter<Contract> & {
	disconnect: () => Promise<void>
	isConnected: () => boolean
	getProxyToken: () => string | null
	setProxyToken: (token: string) => void
	setShouldAutoRegisterListeners: (should: boolean) => void
	isAuthenticated(): boolean
	authenticate(options: {
		skillId?: string
		apiKey?: string
		token?: string
	}): Promise<{
		skill?: SpruceSchemas.Spruce.v2020_07_22.Skill
		person?: SpruceSchemas.Spruce.v2020_07_22.Person
	}>
}

import { EventContract, MercuryEventEmitter } from '@sprucelabs/mercury-types'

export interface ConnectionOptions {
	host?: string
	allowSelfSignedCrt?: boolean
	isTest?: boolean
	contracts: EventContract[]
}

export type MercuryClient<Contract extends EventContract> = MercuryEventEmitter<
	Contract
> & { disconnect: () => Promise<void>; isConnected: () => boolean }

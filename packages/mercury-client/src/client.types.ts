import { EventContract, MercuryEventEmitter } from '@sprucelabs/mercury-types'

export interface ConnectionOptions {
	host?: string
}

export type MercuryClient<Contract extends EventContract> = MercuryEventEmitter<
	Contract
> & { disconnect: () => Promise<void> }

import { EventContract, MercuryEventEmitter } from '@sprucelabs/mercury-types';
export interface MercuryClient<Contract extends EventContract> extends MercuryEventEmitter<Contract> {
}

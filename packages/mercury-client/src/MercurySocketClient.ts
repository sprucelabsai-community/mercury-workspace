import { EventContract, MercuryEventEmitter } from "@sprucelabs/mercury-types";

export default class MercurySocketIoClient<Contract extends EventContract> implements MercuryEventEmitter<Contract> {}
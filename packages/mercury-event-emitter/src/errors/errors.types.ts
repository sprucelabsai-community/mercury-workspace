import {
	SpruceErrorOptions,
	ErrorOptions as ISpruceErrorOptions,
} from '@sprucelabs/error'
import { SchemaErrorOptions } from '@sprucelabs/schema'

export type MercuryEventEmitterErrorOptions =
	| SpruceErrorOptions
	| SchemaErrorOptions
	| InvalidPayloadErrorOptions
	| InvalidEventNameErrorOptions
	| ListenerErrorOptions

export interface InvalidPayloadErrorOptions extends ISpruceErrorOptions {
	code: 'INVALID_PAYLOAD'
	eventNameWithOptionalNamespace: string
}

export interface InvalidEventNameErrorOptions extends ISpruceErrorOptions {
	code: 'INVALID_EVENT_NAME'
	validNames: string[]
}

export interface ListenerErrorOptions extends ISpruceErrorOptions {
	code: 'LISTENER_ERROR'
	listenerIdx: number
}

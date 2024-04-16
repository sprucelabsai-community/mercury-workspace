import { ErrorOptions as ISpruceErrorOptions } from '@sprucelabs/error'
import { SchemaErrorOptions } from '@sprucelabs/schema'

export type MercuryEventEmitterErrorOptions =
    | SchemaErrorOptions
    | InvalidPayloadErrorOptions
    | InvalidEventNameErrorOptions
    | ListenerErrorOptions
    | InvalidResponsePayloadErrorOptions

export interface InvalidPayloadErrorOptions extends ISpruceErrorOptions {
    code: 'INVALID_PAYLOAD'
    eventName: string
}

export interface InvalidResponsePayloadErrorOptions
    extends ISpruceErrorOptions {
    code: 'INVALID_RESPONSE_PAYLOAD'
    eventName: string
}

export interface InvalidEventNameErrorOptions extends ISpruceErrorOptions {
    code: 'INVALID_EVENT_NAME'
    validNames: string[]
}

export interface ListenerErrorOptions extends ISpruceErrorOptions {
    code: 'LISTENER_ERROR'
    listenerIdx: number
}

import { SpruceErrors } from "#spruce/errors/errors.types"
import { SpruceErrorOptions, ErrorOptions as ISpruceErrorOptions} from "@sprucelabs/error"
import { SchemaErrorOptions } from '@sprucelabs/schema'

export interface InvalidPayloadErrorOptions extends SpruceErrors.MercuryClient.InvalidPayload, ISpruceErrorOptions {
	code: 'INVALID_PAYLOAD'
}
export interface UnexpectedPayloadErrorOptions extends SpruceErrors.MercuryClient.UnexpectedPayload, ISpruceErrorOptions {
	code: 'UNEXPECTED_PAYLOAD'
}
export interface InvalidProtocolErrorOptions extends SpruceErrors.MercuryClient.InvalidProtocol, ISpruceErrorOptions {
	code: 'INVALID_PROTOCOL'
}
export interface ConnectionFailedErrorOptions extends SpruceErrors.MercuryClient.ConnectionFailed, ISpruceErrorOptions {
	code: 'CONNECTION_FAILED'
}

type ErrorOptions = SchemaErrorOptions | SpruceErrorOptions | InvalidPayloadErrorOptions  | UnexpectedPayloadErrorOptions  | InvalidProtocolErrorOptions  | ConnectionFailedErrorOptions 

export default ErrorOptions

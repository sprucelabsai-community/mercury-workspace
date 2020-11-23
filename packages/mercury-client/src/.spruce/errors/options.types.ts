import { SpruceErrors } from "#spruce/errors/errors.types"
import { SpruceErrorOptions, ISpruceErrorOptions} from "@sprucelabs/error"
import { SchemaErrorOptions } from '@sprucelabs/schema'

export interface IConnectionFailedErrorOptions extends SpruceErrors.MercuryClient.IConnectionFailed, ISpruceErrorOptions {
	code: 'CONNECTION_FAILED'
}
export interface IInvalidPayloadErrorOptions extends SpruceErrors.MercuryClient.IInvalidPayload, ISpruceErrorOptions {
	code: 'INVALID_PAYLOAD'
}
export interface IInvalidProtocolErrorOptions extends SpruceErrors.MercuryClient.IInvalidProtocol, ISpruceErrorOptions {
	code: 'INVALID_PROTOCOL'
}
export interface IUnexpectedPayloadErrorOptions extends SpruceErrors.MercuryClient.IUnexpectedPayload, ISpruceErrorOptions {
	code: 'UNEXPECTED_PAYLOAD'
}

type ErrorOptions = SchemaErrorOptions | SpruceErrorOptions | IConnectionFailedErrorOptions  | IInvalidPayloadErrorOptions  | IInvalidProtocolErrorOptions  | IUnexpectedPayloadErrorOptions 

export default ErrorOptions

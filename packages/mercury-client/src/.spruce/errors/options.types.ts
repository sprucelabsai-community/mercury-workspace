import { SpruceErrors } from "#spruce/errors/errors.types"
import { SpruceErrorOptions, ISpruceErrorOptions} from "@sprucelabs/error"
import { SchemaErrorOptions } from '@sprucelabs/schema'

export interface IInvalidEventNameErrorOptions extends SpruceErrors.MercuryClient.IInvalidEventName, ISpruceErrorOptions {
	code: 'INVALID_EVENT_NAME'
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
export interface IConnectionFailedErrorOptions extends SpruceErrors.MercuryClient.IConnectionFailed, ISpruceErrorOptions {
	code: 'CONNECTION_FAILED'
}

type ErrorOptions = SchemaErrorOptions | SpruceErrorOptions | IInvalidEventNameErrorOptions  | IInvalidPayloadErrorOptions  | IInvalidProtocolErrorOptions  | IUnexpectedPayloadErrorOptions  | IConnectionFailedErrorOptions 

export default ErrorOptions

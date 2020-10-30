import { SpruceErrors } from "#spruce/errors/errors.types"
import { SpruceErrorOptions, ISpruceErrorOptions} from "@sprucelabs/error"
import { SchemaErrorOptions } from '@sprucelabs/schema'

export interface IInvalidProtocolErrorOptions extends SpruceErrors.MercuryClient.IInvalidProtocol, ISpruceErrorOptions {
	code: 'INVALID_PROTOCOL'
}

type ErrorOptions = SchemaErrorOptions | SpruceErrorOptions | IInvalidProtocolErrorOptions 

export default ErrorOptions

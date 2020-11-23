import { SpruceErrors } from "#spruce/errors/errors.types"
import { SpruceErrorOptions, ISpruceErrorOptions} from "@sprucelabs/error"
import { SchemaErrorOptions } from '@sprucelabs/schema'

export interface IInvalidEventNameErrorOptions extends SpruceErrors.MercuryTypes.IInvalidEventName, ISpruceErrorOptions {
	code: 'INVALID_EVENT_NAME'
}

type ErrorOptions = SchemaErrorOptions | SpruceErrorOptions | IInvalidEventNameErrorOptions 

export default ErrorOptions

import { SpruceErrors } from "#spruce/errors/errors.types"
import { ErrorOptions as ISpruceErrorOptions} from "@sprucelabs/error"

export interface UnknownErrorErrorOptions extends SpruceErrors.MercuryClient.UnknownError, ISpruceErrorOptions {
	code: 'UNKNOWN_ERROR'
}
export interface UnexpectedPayloadErrorOptions extends SpruceErrors.MercuryClient.UnexpectedPayload, ISpruceErrorOptions {
	code: 'UNEXPECTED_PAYLOAD'
}
export interface UnauthorizedAccessErrorOptions extends SpruceErrors.MercuryClient.UnauthorizedAccess, ISpruceErrorOptions {
	code: 'UNAUTHORIZED_ACCESS'
}
export interface TimeoutErrorOptions extends SpruceErrors.MercuryClient.Timeout, ISpruceErrorOptions {
	code: 'TIMEOUT'
}
export interface NotConnectedErrorOptions extends SpruceErrors.MercuryClient.NotConnected, ISpruceErrorOptions {
	code: 'NOT_CONNECTED'
}
export interface MissingTestCacheDirErrorOptions extends SpruceErrors.MercuryClient.MissingTestCacheDir, ISpruceErrorOptions {
	code: 'MISSING_TEST_CACHE_DIR'
}
export interface InvalidProtocolErrorOptions extends SpruceErrors.MercuryClient.InvalidProtocol, ISpruceErrorOptions {
	code: 'INVALID_PROTOCOL'
}
export interface InvalidPayloadErrorOptions extends SpruceErrors.MercuryClient.InvalidPayload, ISpruceErrorOptions {
	code: 'INVALID_PAYLOAD'
}
export interface ConnectionFailedErrorOptions extends SpruceErrors.MercuryClient.ConnectionFailed, ISpruceErrorOptions {
	code: 'CONNECTION_FAILED'
}

type ErrorOptions =  | UnknownErrorErrorOptions  | UnexpectedPayloadErrorOptions  | UnauthorizedAccessErrorOptions  | TimeoutErrorOptions  | NotConnectedErrorOptions  | MissingTestCacheDirErrorOptions  | InvalidProtocolErrorOptions  | InvalidPayloadErrorOptions  | ConnectionFailedErrorOptions 

export default ErrorOptions

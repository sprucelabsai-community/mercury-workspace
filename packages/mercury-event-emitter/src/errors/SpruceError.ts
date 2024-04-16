import AbstractSpruceError from '@sprucelabs/error'
import { MercuryEventEmitterErrorOptions } from './errors.types'

export default class SpruceError extends AbstractSpruceError<MercuryEventEmitterErrorOptions> {
    public friendlyMessage(): string {
        const { options } = this

        let message: string | undefined

        switch (options?.code) {
            case 'LISTENER_ERROR':
                message = `Error in local event listener:\n\n${
                    options.originalError?.stack ??
                    options.originalError?.message ??
                    options.originalError
                }`
                break
            case 'INVALID_PAYLOAD':
                message = `The emit payload you passed to "${
                    options.eventName
                }" is invalid${
                    options.originalError
                        ? `:\n\n${options.originalError.message}`
                        : '.'
                }`
                break

            case 'INVALID_RESPONSE_PAYLOAD':
                message = `The response payload to "${options.eventName}" is invalid${
                    options.originalError
                        ? `:\n\n${options.originalError.message}`
                        : '.'
                }`
                break
            default:
                message = this.message
        }

        return message
    }
}

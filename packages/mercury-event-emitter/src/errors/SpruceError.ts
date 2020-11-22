import AbstractSpruceError from '@sprucelabs/error'
import { MercuryEventEmitterErrorOptions } from './errors.types'

export default class SpruceError extends AbstractSpruceError<MercuryEventEmitterErrorOptions> {
	public friendlyMessage(): string {
		const { options } = this

		let message: string | undefined

		switch (options?.code) {
			default:
				message = this.message
		}

		message = `${options.code}: ${message}`
		const fullMessage = `${message}${
			options.friendlyMessage ? `\n\n${options.friendlyMessage}` : ''
		}`

		return `${fullMessage}${
			this.originalError && this.originalError.message !== fullMessage
				? `\n\nOriginal error: ${this.originalError.message.replace(
						message,
						''
				  )}`
				: ''
		}`
	}
}

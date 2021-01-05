import AbstractSpruceError from '@sprucelabs/error'
import ErrorOptions from '#spruce/errors/options.types'

export default class SpruceError extends AbstractSpruceError<ErrorOptions> {
	public friendlyMessage(): string {
		const { options } = this
		let message

		switch (options?.code) {
			case 'INVALID_PROTOCOL':
				message = 'You must connect via the https protocol.'
				break

			case 'UNEXPECTED_PAYLOAD':
				message = `You passed a payload to "${options.eventName}" that has no emit payload defined.`
				break

			case 'INVALID_PAYLOAD':
				message = `The payload you passed to "${options.eventName}" is invalid.`
				break

			case 'CONNECTION_FAILED':
				message = `I couldn't connect to ${options.host}. The code I got back was ${options.statusCode}.`
				break

			case 'NOT_CONNECTED':
				message = `You cannot ${options.action} when you are not connected to the api.`
				break

			case 'TIMEOUT':
				message = `Dang it, I didn't hear back after emitting "${
					options.eventName
				}" for ${options.timeoutMs / 1000} seconds..`
				break

			default:
				message = super.friendlyMessage()
		}

		// Drop in code and friendly message
		message = `${message}`
		const fullMessage = `${message}${
			options.friendlyMessage && options.friendlyMessage !== message
				? `\n\n${options.friendlyMessage}`
				: ''
		}`

		// Handle repeating text from original message by remove it
		return `${fullMessage}${
			this.originalError &&
			this.originalError.message &&
			this.originalError.message !== message &&
			this.originalError.message !== fullMessage
				? `\n\nOriginal error: ${this.originalError.message.replace(
						message,
						''
				  )}`
				: ''
		}`
	}
}

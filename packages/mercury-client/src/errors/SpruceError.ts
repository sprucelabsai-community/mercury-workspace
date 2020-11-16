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

			case 'INVALID_EVENT_NAME':
				message = `${options.eventNameWithOptionalNamespace} is not in the event contract. Check your spelling and try pulling the latest contracts.`
				break

			case 'UNEXPECTED_PAYLOAD':
				message = 'A Unexpected payload just happened!'
				break

			case 'INVALID_PAYLOAD':
				message = 'A Invalid payload just happened!'
				break

			case 'CONNECTION_FAILED':
				message = `I couldn't connect to ${options.host}. The code I got back was ${options.statusCode}.`
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

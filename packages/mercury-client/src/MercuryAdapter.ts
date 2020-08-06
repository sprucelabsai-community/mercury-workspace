import {
	TOnPromiseHandler,
	IMercuryAdapterOnOptions,
	IMercuryEmitOptions,
	TOnConnectFunctionHandler,
	TOnErrorHandler,
} from './Mercury'

export abstract class MercuryAdapter {
	public abstract isConnected: boolean

	public abstract init(
		options: Record<string, any>,
		eventHandler: TOnPromiseHandler,
		errorHandler: TOnErrorHandler,
		onConnect: TOnConnectFunctionHandler,
		onDisconnect: TOnConnectFunctionHandler
	): void

	public abstract on(options: IMercuryAdapterOnOptions): void

	public abstract emit(options: IMercuryEmitOptions): void

	/** Disconnects the underlying connection */
	public abstract disconnect(): void

	/** Provides an event */
	// public abstract provide(options: {
	// 	eventName: string
	// 	handler: TMercuryEventHandler
	// 	authorize: TMercuryEventAuthorization
	// }): Promise<void>

	// public abstract emit(options: {
	// 	eventName: string
	// 	organizationId?: string | null
	// 	locationId?: string | null
	// 	userId?: string | null
	// 	payload?: Record<string, any>
	// }): void
}

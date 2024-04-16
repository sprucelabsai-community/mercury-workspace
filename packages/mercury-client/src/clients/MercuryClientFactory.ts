import { EventContract, SkillEventContract } from '@sprucelabs/mercury-types'
import { SchemaError } from '@sprucelabs/schema'
import { eventContractUtil } from '@sprucelabs/spruce-event-utils'
import { DEFAULT_HOST } from '../constants'
import SpruceError from '../errors/SpruceError'
import { ConnectionOptions, MercuryClient } from '../types/client.types'
import MutableContractClient from './MutableContractClient'

export default class MercuryClientFactory {
    private static isTestMode = false
    private static defaultContract: any
    private static timeoutMs = 30000
    private static totalClients = 0
    private static clients: Client<EventContract>[] = []
    public static ClientClass: new (
        ...args: any[]
    ) => MutableContractClient<EventContract>

    public static async Client<
        Contract extends SkillEventContract = SkillEventContract,
    >(connectionOptions?: ConnectionOptions): Promise<Client<Contract>> {
        const {
            host: hostOption,
            contracts,
            reconnectDelayMs,
            allowSelfSignedCrt,
            emitTimeoutMs = this.timeoutMs,
            shouldReconnect,
            maxEmitRetries,
            connectionRetries,
        } = connectionOptions || {}

        const host = hostOption ?? DEFAULT_HOST

        if (host.substr(0, 4) !== 'http') {
            throw new SpruceError({ code: 'INVALID_PROTOCOL', uri: host })
        }

        if (contracts && !Array.isArray(contracts)) {
            throw new SchemaError({
                code: 'INVALID_PARAMETERS',
                parameters: ['contracts'],
            })
        }

        const eventContract =
            !contracts && this.defaultContract
                ? this.defaultContract
                : //@ts-ignore
                  eventContractUtil.unifyContracts<Contract>(contracts ?? [])

        let Client = MutableContractClient

        if (this.isTestMode) {
            //TODO, make this something fitxures sets to make the test client available
            Client = require('../clients/MercuryTestClient').default
        }

        const client = new (MercuryClientFactory.ClientClass ??
            //@ts-ignore
            Client)<EventContract>({
            host,
            reconnection: false,
            reconnectDelayMs,
            rejectUnauthorized: !allowSelfSignedCrt,
            eventContract,
            emitTimeoutMs,
            shouldReconnect,
            maxEmitRetries,
            connectionRetries,
        })

        await client.connect()

        this.totalClients++
        this.clients.push(client)

        return client as any
    }

    public static isInTestMode() {
        return this.isTestMode
    }

    public static setIsTestMode(isTestMode: boolean) {
        this.isTestMode = isTestMode
    }

    public static setDefaultContract(contract: EventContract) {
        this.defaultContract = contract
    }

    public static hasDefaultContract(): boolean {
        return !!this.defaultContract
    }

    public static clearDefaultContract() {
        this.defaultContract = undefined
    }

    private static resetTestClient() {
        const Client = require('../clients/MercuryTestClient').default
        Client.reset()
    }

    public static setDefaultTimeoutMs(ms: number) {
        this.timeoutMs = ms
    }

    public static getTotalClients() {
        return this.totalClients
    }

    public static reset() {
        this.totalClients = 0
        this.clients = []
        this.resetTestClient()
    }

    public static getClients() {
        return this.clients
    }
}

export type Client<Contract extends EventContract> = MercuryClient<Contract> & {
    doesHandleEvent(eventName: string): boolean
    mixinContract(eventContract: EventContract): void
}

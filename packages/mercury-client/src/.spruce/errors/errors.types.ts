import { default as SchemaEntity } from '@sprucelabs/schema'
import * as SpruceSchema from '@sprucelabs/schema'

export declare namespace SpruceErrors.MercuryClient {
    export interface UnknownError {}

    export interface UnknownErrorSchema extends SpruceSchema.Schema {
        id: 'unknownError'
        namespace: 'MercuryClient'
        name: 'Unknown error'
        fields: {}
    }

    export type UnknownErrorEntity =
        SchemaEntity<SpruceErrors.MercuryClient.UnknownErrorSchema>
}

export declare namespace SpruceErrors.MercuryClient {
    export interface UnexpectedPayload {
        eventName: string
    }

    export interface UnexpectedPayloadSchema extends SpruceSchema.Schema {
        id: 'unexpectedPayload'
        namespace: 'MercuryClient'
        name: 'Unexpected payload'
        fields: {
            /** . */
            eventName: {
                type: 'text'
                isRequired: true
                options: undefined
            }
        }
    }

    export type UnexpectedPayloadEntity =
        SchemaEntity<SpruceErrors.MercuryClient.UnexpectedPayloadSchema>
}

export declare namespace SpruceErrors.MercuryClient {
    export interface UnauthorizedTarget {
        locationId?: string | undefined | null

        personId?: string | undefined | null

        organizationId?: string | undefined | null

        skillId?: string | undefined | null

        roleId?: string | undefined | null
    }

    export interface UnauthorizedTargetSchema extends SpruceSchema.Schema {
        id: 'unauthorizedTarget'
        namespace: 'MercuryClient'
        name: ''
        fields: {
            /** . */
            locationId: {
                type: 'id'
                options: undefined
            }
            /** . */
            personId: {
                type: 'id'
                options: undefined
            }
            /** . */
            organizationId: {
                type: 'id'
                options: undefined
            }
            /** . */
            skillId: {
                type: 'id'
                options: undefined
            }
            /** . */
            roleId: {
                type: 'id'
                options: undefined
            }
        }
    }

    export type UnauthorizedTargetEntity =
        SchemaEntity<SpruceErrors.MercuryClient.UnauthorizedTargetSchema>
}

export declare namespace SpruceErrors.MercuryClient {
    export interface UnauthorizedAccess {
        fqen: string

        action: 'emit'

        target: SpruceErrors.MercuryClient.UnauthorizedTarget

        permissionContractId: string
    }

    export interface UnauthorizedAccessSchema extends SpruceSchema.Schema {
        id: 'unauthorizedAccess'
        namespace: 'MercuryClient'
        name: 'Unauthorized Access'
        fields: {
            /** . */
            fqen: {
                type: 'text'
                isRequired: true
                options: undefined
            }
            /** . */
            action: {
                type: 'select'
                isRequired: true
                options: { choices: [{ value: 'emit'; label: 'emit' }] }
            }
            /** . */
            target: {
                type: 'schema'
                isRequired: true
                options: {
                    schema: SpruceErrors.MercuryClient.UnauthorizedTargetSchema
                }
            }
            /** . */
            permissionContractId: {
                type: 'id'
                isRequired: true
                options: undefined
            }
        }
    }

    export type UnauthorizedAccessEntity =
        SchemaEntity<SpruceErrors.MercuryClient.UnauthorizedAccessSchema>
}

export declare namespace SpruceErrors.MercuryClient {
    export interface Timeout {
        eventName: string

        timeoutMs: number

        isConnected?: boolean | undefined | null

        totalRetries?: number | undefined | null
    }

    export interface TimeoutSchema extends SpruceSchema.Schema {
        id: 'timeout'
        namespace: 'MercuryClient'
        name: 'Timeout'
        fields: {
            /** . */
            eventName: {
                type: 'text'
                isRequired: true
                options: undefined
            }
            /** . */
            timeoutMs: {
                type: 'number'
                isRequired: true
                options: undefined
            }
            /** . */
            isConnected: {
                type: 'boolean'
                options: undefined
            }
            /** . */
            totalRetries: {
                type: 'number'
                options: undefined
            }
        }
    }

    export type TimeoutEntity =
        SchemaEntity<SpruceErrors.MercuryClient.TimeoutSchema>
}

export declare namespace SpruceErrors.MercuryClient {
    export interface NotConnected {
        action: string

        fqen: string
    }

    export interface NotConnectedSchema extends SpruceSchema.Schema {
        id: 'notConnected'
        namespace: 'MercuryClient'
        name: 'Not connected'
        fields: {
            /** . */
            action: {
                type: 'text'
                isRequired: true
                options: undefined
            }
            /** . */
            fqen: {
                type: 'id'
                isRequired: true
                options: undefined
            }
        }
    }

    export type NotConnectedEntity =
        SchemaEntity<SpruceErrors.MercuryClient.NotConnectedSchema>
}

export declare namespace SpruceErrors.MercuryClient {
    export interface MustHandleLocally {
        fqen: string
    }

    export interface MustHandleLocallySchema extends SpruceSchema.Schema {
        id: 'mustHandleLocally'
        namespace: 'MercuryClient'
        name: 'Must handle locally'
        fields: {
            /** . */
            fqen: {
                type: 'text'
                isRequired: true
                options: undefined
            }
        }
    }

    export type MustHandleLocallyEntity =
        SchemaEntity<SpruceErrors.MercuryClient.MustHandleLocallySchema>
}

export declare namespace SpruceErrors.MercuryClient {
    export interface MustCreateEvent {
        fqen: string
    }

    export interface MustCreateEventSchema extends SpruceSchema.Schema {
        id: 'mustCreateEvent'
        namespace: 'MercuryClient'
        name: 'must create event'
        fields: {
            /** . */
            fqen: {
                type: 'text'
                isRequired: true
                options: undefined
            }
        }
    }

    export type MustCreateEventEntity =
        SchemaEntity<SpruceErrors.MercuryClient.MustCreateEventSchema>
}

export declare namespace SpruceErrors.MercuryClient {
    export interface MissingTestCacheDir {}

    export interface MissingTestCacheDirSchema extends SpruceSchema.Schema {
        id: 'missingTestCacheDir'
        namespace: 'MercuryClient'
        name: 'Missing test cache dir'
        fields: {}
    }

    export type MissingTestCacheDirEntity =
        SchemaEntity<SpruceErrors.MercuryClient.MissingTestCacheDirSchema>
}

export declare namespace SpruceErrors.MercuryClient {
    export interface InvalidProtocol {
        uri: string
    }

    export interface InvalidProtocolSchema extends SpruceSchema.Schema {
        id: 'invalidProtocol'
        namespace: 'MercuryClient'
        name: 'Invalid protocol'
        fields: {
            /** . */
            uri: {
                type: 'text'
                isRequired: true
                options: undefined
            }
        }
    }

    export type InvalidProtocolEntity =
        SchemaEntity<SpruceErrors.MercuryClient.InvalidProtocolSchema>
}

export declare namespace SpruceErrors.MercuryClient {
    export interface InvalidPayload {
        eventName: string
    }

    export interface InvalidPayloadSchema extends SpruceSchema.Schema {
        id: 'invalidPayload'
        namespace: 'MercuryClient'
        name: 'Invalid payload'
        fields: {
            /** . */
            eventName: {
                type: 'text'
                isRequired: true
                options: undefined
            }
        }
    }

    export type InvalidPayloadEntity =
        SchemaEntity<SpruceErrors.MercuryClient.InvalidPayloadSchema>
}

export declare namespace SpruceErrors.MercuryClient {
    export interface InvalidEventSignature {
        fqen: string

        instructions: string
    }

    export interface InvalidEventSignatureSchema extends SpruceSchema.Schema {
        id: 'invalidEventSignature'
        namespace: 'MercuryClient'
        name: 'Invalid event contract'
        fields: {
            /** . */
            fqen: {
                type: 'text'
                isRequired: true
                options: undefined
            }
            /** . */
            instructions: {
                type: 'text'
                isRequired: true
                options: undefined
            }
        }
    }

    export type InvalidEventSignatureEntity =
        SchemaEntity<SpruceErrors.MercuryClient.InvalidEventSignatureSchema>
}

export declare namespace SpruceErrors.MercuryClient {
    export interface ConnectionFailed {
        host: string

        statusCode: number
    }

    export interface ConnectionFailedSchema extends SpruceSchema.Schema {
        id: 'connectionFailed'
        namespace: 'MercuryClient'
        name: 'Connection failed'
        fields: {
            /** . */
            host: {
                type: 'text'
                isRequired: true
                options: undefined
            }
            /** . */
            statusCode: {
                type: 'number'
                isRequired: true
                options: undefined
            }
        }
    }

    export type ConnectionFailedEntity =
        SchemaEntity<SpruceErrors.MercuryClient.ConnectionFailedSchema>
}

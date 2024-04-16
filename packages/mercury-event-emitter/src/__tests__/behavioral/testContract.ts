import { buildEventContract } from '@sprucelabs/mercury-types'
import { buildSchema } from '@sprucelabs/schema'

export const testContract = buildEventContract({
    eventSignatures: {
        eventOne: {},
        eventTwo: {},
        eventWithEmitPayload: {
            emitPayloadSchema: buildSchema({
                id: 'emitPayloadWithOptionalTextField',
                name: 'Emit payload with optional text field',
                fields: {
                    optionalTextField: {
                        type: 'text',
                    },
                },
            }),
        },
        eventWithResponsePayload: {
            responsePayloadSchema: buildSchema({
                id: 'responsePayloadWithRequiredTextField',
                name: 'responsePayloadWithRequiredTextField',
                fields: {
                    requiredTextField: {
                        type: 'text',
                        isRequired: true,
                    },
                },
            }),
        },
        eventWithEmitAndResponsePayload: {
            emitPayloadSchema: buildSchema({
                id: 'emitPayloadWithRequiredTextField',
                name: 'emitPayloadWithRequiredTextField',
                fields: {
                    requiredTextField: {
                        type: 'text',
                        isRequired: true,
                    },
                },
            }),
            responsePayloadSchema: buildSchema({
                id: 'secondPayloadWithRequiredTextField',
                name: 'secondPayloadWithRequiredTextField',
                fields: {
                    requiredTextField: {
                        type: 'text',
                        isRequired: true,
                    },
                },
            }),
        },
    },
})
export type TestContract = typeof testContract

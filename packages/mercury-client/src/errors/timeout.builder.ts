import { buildErrorSchema } from '@sprucelabs/schema'

export default buildErrorSchema({
    id: 'timeout',
    name: 'Timeout',
    description: '',
    fields: {
        eventName: {
            type: 'text',
            isRequired: true,
        },
        timeoutMs: {
            type: 'number',
            isRequired: true,
        },
        isConnected: {
            type: 'boolean',
        },
        totalRetries: {
            type: 'number',
        },
    },
})

import { buildErrorSchema } from '@sprucelabs/schema'

export default buildErrorSchema({
    id: 'invalidPayload',
    name: 'Invalid payload',
    description: '',
    fields: {
        eventName: {
            type: 'text',
            isRequired: true,
        },
    },
})

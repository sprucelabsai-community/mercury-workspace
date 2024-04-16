import { buildErrorSchema } from '@sprucelabs/schema'

export default buildErrorSchema({
    id: 'notConnected',
    name: 'Not connected',
    description: '',
    fields: {
        action: {
            type: 'text',
            isRequired: true,
        },
        fqen: {
            type: 'id',
            isRequired: true,
        },
    },
})

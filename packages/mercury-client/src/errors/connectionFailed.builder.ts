import { buildErrorSchema } from '@sprucelabs/schema'

export default buildErrorSchema({
    id: 'connectionFailed',
    name: 'Connection failed',
    description: '',
    fields: {
        host: {
            type: 'text',
            isRequired: true,
        },
        statusCode: {
            type: 'number',
            isRequired: true,
        },
    },
})

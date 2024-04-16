import { buildErrorSchema } from '@sprucelabs/schema'

export default buildErrorSchema({
    id: 'invalidProtocol',
    name: 'Invalid protocol',
    description: '',
    fields: {
        uri: {
            type: 'text',
            isRequired: true,
        },
    },
})

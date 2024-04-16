import { buildErrorSchema } from '@sprucelabs/schema'

export default buildErrorSchema({
    id: 'invalidEventSignature',
    name: 'Invalid event contract',
    fields: {
        fqen: {
            type: 'text',
            isRequired: true,
        },
        instructions: {
            type: 'text',
            isRequired: true,
        },
    },
})

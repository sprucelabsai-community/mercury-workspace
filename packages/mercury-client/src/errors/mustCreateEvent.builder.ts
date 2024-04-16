import { buildErrorSchema } from '@sprucelabs/schema'

export default buildErrorSchema({
    id: 'mustCreateEvent',
    name: 'must create event',
    fields: {
        fqen: {
            type: 'text',
            isRequired: true,
        },
    },
})

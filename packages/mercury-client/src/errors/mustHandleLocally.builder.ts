import { buildErrorSchema } from '@sprucelabs/schema'

export default buildErrorSchema({
    id: 'mustHandleLocally',
    name: 'Must handle locally',
    fields: {
        fqen: {
            type: 'text',
            isRequired: true,
        },
    },
})

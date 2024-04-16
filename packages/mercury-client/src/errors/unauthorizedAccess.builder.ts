import { buildErrorSchema } from '@sprucelabs/schema'
import { eventTargetSchema } from '@sprucelabs/spruce-event-utils'

export default buildErrorSchema({
    id: 'unauthorizedAccess',
    name: 'Unauthorized Access',
    description: '',
    fields: {
        fqen: {
            type: 'text',
            isRequired: true,
        },
        action: {
            type: 'select',
            isRequired: true,
            options: {
                choices: [
                    {
                        value: 'emit',
                        label: 'emit',
                    },
                ],
            },
        },
        target: {
            type: 'schema',
            isRequired: true,
            options: {
                schema: {
                    id: 'unauthorizedTarget',
                    fields: eventTargetSchema.fields,
                },
            },
        },
        permissionContractId: {
            type: 'id',
            isRequired: true,
        },
    },
})

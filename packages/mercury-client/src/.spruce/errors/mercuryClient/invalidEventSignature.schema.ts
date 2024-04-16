import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceErrors } from '../errors.types'

const invalidEventSignatureSchema: SpruceErrors.MercuryClient.InvalidEventSignatureSchema =
    {
        id: 'invalidEventSignature',
        namespace: 'MercuryClient',
        name: 'Invalid event contract',
        fields: {
            /** . */
            fqen: {
                type: 'text',
                isRequired: true,
                options: undefined,
            },
            /** . */
            instructions: {
                type: 'text',
                isRequired: true,
                options: undefined,
            },
        },
    }

SchemaRegistry.getInstance().trackSchema(invalidEventSignatureSchema)

export default invalidEventSignatureSchema

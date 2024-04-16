import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceErrors } from '../errors.types'

const mustHandleLocallySchema: SpruceErrors.MercuryClient.MustHandleLocallySchema =
    {
        id: 'mustHandleLocally',
        namespace: 'MercuryClient',
        name: 'Must handle locally',
        fields: {
            /** . */
            fqen: {
                type: 'text',
                isRequired: true,
                options: undefined,
            },
        },
    }

SchemaRegistry.getInstance().trackSchema(mustHandleLocallySchema)

export default mustHandleLocallySchema

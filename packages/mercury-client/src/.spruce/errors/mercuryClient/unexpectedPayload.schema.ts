import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceErrors } from '../errors.types'

const unexpectedPayloadSchema: SpruceErrors.MercuryClient.UnexpectedPayloadSchema =
    {
        id: 'unexpectedPayload',
        namespace: 'MercuryClient',
        name: 'Unexpected payload',
        fields: {
            /** . */
            eventName: {
                type: 'text',
                isRequired: true,
                options: undefined,
            },
        },
    }

SchemaRegistry.getInstance().trackSchema(unexpectedPayloadSchema)

export default unexpectedPayloadSchema

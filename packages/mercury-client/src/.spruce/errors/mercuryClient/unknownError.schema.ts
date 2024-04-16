import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceErrors } from '../errors.types'

const unknownErrorSchema: SpruceErrors.MercuryClient.UnknownErrorSchema = {
    id: 'unknownError',
    namespace: 'MercuryClient',
    name: 'Unknown error',
    fields: {},
}

SchemaRegistry.getInstance().trackSchema(unknownErrorSchema)

export default unknownErrorSchema

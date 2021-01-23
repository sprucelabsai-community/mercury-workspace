import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceErrors } from '../errors.types'



const missingTestCacheDirSchema: SpruceErrors.MercuryClient.MissingTestCacheDirSchema  = {
	id: 'missingTestCacheDir',
	namespace: 'MercuryClient',
	name: 'Missing test cache dir',
	    fields: {
	    }
}

SchemaRegistry.getInstance().trackSchema(missingTestCacheDirSchema)

export default missingTestCacheDirSchema

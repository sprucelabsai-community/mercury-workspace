
import { AddressField } from '@sprucelabs/schema'
import { BooleanField } from '@sprucelabs/schema'
import { DateField } from '@sprucelabs/schema'
import { DateTimeField } from '@sprucelabs/schema'
import { DirectoryField } from '@sprucelabs/schema'
import { DurationField } from '@sprucelabs/schema'
import { FileField } from '@sprucelabs/schema'
import { IdField } from '@sprucelabs/schema'
import { NumberField } from '@sprucelabs/schema'
import { PhoneField } from '@sprucelabs/schema'
import { RawField } from '@sprucelabs/schema'
import { SchemaField } from '@sprucelabs/schema'
import { SelectField } from '@sprucelabs/schema'
import { TextField } from '@sprucelabs/schema'


/** Value for looking up field classes by field type */
const fieldClassMap = {
		['address']: AddressField,
		['boolean']: BooleanField,
		['date']: DateField,
		['dateTime']: DateTimeField,
		['directory']: DirectoryField,
		['duration']: DurationField,
		['file']: FileField,
		['id']: IdField,
		['number']: NumberField,
		['phone']: PhoneField,
		['raw']: RawField,
		['schema']: SchemaField,
		['select']: SelectField,
		['text']: TextField,
} as const

export default fieldClassMap

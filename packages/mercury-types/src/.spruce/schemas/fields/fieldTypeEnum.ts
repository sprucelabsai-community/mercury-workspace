enum FieldType {
	/** An address with geocoding ability *coming soon* */
	Address = 'address',
	/** A true/false. Converts false string to false, all other strings to true. */
	Boolean = 'boolean',
	/** Date and time support. */
	Date = 'date',
	/** Date and time support. */
	DateTime = 'dateTime',
	/** A way to select entire directories once! */
	Directory = 'directory',
	/** A span of time represented in { hours, minutes, seconds, ms } */
	Duration = 'duration',
	/** A way to handle files. Supports mime-type lookups. */
	File = 'file',
	/** A unique identifier field, UUID\'s in our case. */
	Id = 'id',
	/** Handles all types of numbers with min/max and clamp support */
	Number = 'number',
	/** Takes anything close to a phone number and formats it. Also great at validating numbers. */
	Phone = 'phone',
	/** Deprecated. For internal purposes only (will be deleted soon) */
	Raw = 'raw',
	/** A way to map relationships. */
	Schema = 'schema',
	/** Stored as string, lets user select between available options. */
	Select = 'select',
	/** A text field. Converts non-strings into strings by calling toString(). Size set by options. */
	Text = 'text',
}

export default FieldType

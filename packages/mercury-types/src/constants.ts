export const authorizerStatuses = [
	{
		name: 'clockedIn',
		label: 'Clocked in',
		hint: 'Is the person clocked in and ready to rock?',
	},
	{
		name: 'clockedOut',
		label: 'Clocked out',
		hint: 'When someone is not working (off the clock).',
	},
	{
		name: 'onPrem',
		label: 'On premise',
		hint: 'Are they at work (maybe working, maybe visiting).',
	},
	{
		name: 'offPrem',
		label: 'Off premise',
		hint: "They aren't at the office or shop.",
	},
] as const

require('dotenv').config()

export const TEST_HOST = process.env.TEST_HOST ?? 'https://localhost:8081'
export const DEMO_PHONE = process.env.DEMO_PHONE ?? ''
export const DEMO_PHONE_REAUTH = process.env.DEMO_PHONE_REAUTH ?? '**MISSING**'
export const DEMO_PHONE_GUEST = process.env.DEMO_PHONE_GUEST ?? '**MISSING**'
export const DEMO_PHONE_TEAMMATE =
	process.env.DEMO_PHONE_TEAMMATE ?? '**MISSING**'
export const DEMO_PHONE_PROXY = process.env.DEMO_PHONE_PROXY ?? '**MISSING**'

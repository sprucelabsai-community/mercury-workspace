require('dotenv').config()

export const TEST_HOST = process.env.TEST_HOST ?? 'https://localhost:8081'
export const DEMO_PHONE = process.env.DEMO_PHONE ?? ''

import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { readings } from './db/schema.js'


const main = async () => {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL environment variable is not set')
    }
    const client = postgres(process.env.DATABASE_URL, { prepare: false })
    const db = drizzle({ client })

    const result = await db.select().from(readings).limit(10);
    console.log('Readings:', result)
}

main()

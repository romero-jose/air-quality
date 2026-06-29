import 'dotenv/config'

import { createApp } from './app.js'
import { createDb } from './db/client.js'
import { runIngestion, startIngestionWorker, type IngestionWorker } from './ingestion/worker.js'

const { client, db } = createDb()
const app = createApp({ db })

const getPort = () => {
  const raw = process.env.PORT
  if (!raw) return 3000

  const port = Number(raw)
  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error('PORT must be a valid TCP port')
  }

  return port
}

const main = async () => {
  if (process.env.RUN_ONCE === 'true') {
    await runIngestion(db)
    await client.end()
    return
  }

  const ingestionWorker: IngestionWorker | null =
    process.env.DISABLE_INGESTION === 'true' ? null : await startIngestionWorker(db)

  const shutdown = async () => {
    ingestionWorker?.stop()
    await app.close()
    await client.end()
    process.exit(0)
  }

  process.on('SIGINT', () => {
    shutdown().catch((error: unknown) => {
      console.error('[shutdown] failed:', error)
      process.exit(1)
    })
  })

  process.on('SIGTERM', () => {
    shutdown().catch((error: unknown) => {
      console.error('[shutdown] failed:', error)
      process.exit(1)
    })
  })

  await app.listen({
    host: process.env.HOST ?? '0.0.0.0',
    port: getPort(),
  })
}

main().catch(async (error: unknown) => {
  console.error('[app] fatal error:', error)
  await app.close()
  await client.end()
  process.exit(1)
})

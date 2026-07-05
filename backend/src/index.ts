import 'dotenv/config'

import { createApp } from './app.js'
import { createDb } from './db/client.js'
import { runIngestion, startIngestionWorker, type IngestionWorker } from './ingestion/worker.js'
import { createLogger } from './logging.js'

const logger = createLogger()
const { client, db } = createDb({ logger })
const app = createApp({ db, logger })

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
    await runIngestion(db, { logger: logger.child({ component: 'ingestion' }) })
    await client.end()
    return
  }

  const ingestionLogger = logger.child({ component: 'ingestion' })
  const ingestionWorker: IngestionWorker | null =
    process.env.DISABLE_INGESTION === 'true'
      ? null
      : await startIngestionWorker(db, { logger: ingestionLogger })

  const shutdown = async () => {
    logger.info('shutdown started')
    ingestionWorker?.stop()
    await app.close()
    await client.end()
    logger.info('shutdown finished')
    process.exit(0)
  }

  process.on('SIGINT', () => {
    shutdown().catch((error: unknown) => {
      logger.error({ err: error }, 'shutdown failed')
      process.exit(1)
    })
  })

  process.on('SIGTERM', () => {
    shutdown().catch((error: unknown) => {
      logger.error({ err: error }, 'shutdown failed')
      process.exit(1)
    })
  })

  await app.listen({
    host: process.env.HOST ?? '0.0.0.0',
    port: getPort(),
  })
}

main().catch(async (error: unknown) => {
  logger.fatal({ err: error }, 'fatal app error')
  await app.close()
  await client.end()
  process.exit(1)
})

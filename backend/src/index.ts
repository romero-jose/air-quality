import 'dotenv/config'

import { createDb } from './db/client.js'
import { ingestSincaReadings } from './ingestion/sinca.js'

const DEFAULT_INGESTION_INTERVAL_MS = 15 * 60 * 1000

function getIngestionIntervalMs(): number {
  const raw = process.env.INGESTION_INTERVAL_MS
  if (!raw) return DEFAULT_INGESTION_INTERVAL_MS

  const interval = Number(raw)
  if (!Number.isFinite(interval) || interval <= 0) {
    throw new Error('INGESTION_INTERVAL_MS must be a positive number')
  }

  return interval
}

async function runIngestion() {
  const startedAt = new Date()
  console.log(`[ingestion] started at ${startedAt.toISOString()}`)

  const result = await ingestSincaReadings(db)

  console.log(
    `[ingestion] finished: stations=${result.stations} scraped=${result.scrapedReadings} written=${result.writtenReadings} failed=${result.failedStations.length}`,
  )

  for (const failure of result.failedStations) {
    console.error(`[ingestion] station ${failure.code} failed: ${failure.error}`)
  }
}

const { client, db } = createDb()
let ingestionRunning = false

const main = async () => {
  if (process.env.RUN_ONCE === 'true') {
    await runIngestion()
    await client.end()
    return
  }

  const intervalMs = getIngestionIntervalMs()
  await runIngestion()

  const interval = setInterval(() => {
    if (ingestionRunning) {
      console.warn('[ingestion] previous run is still active; skipping this tick')
      return
    }

    ingestionRunning = true
    runIngestion()
      .catch((error: unknown) => {
        console.error('[ingestion] unexpected failure:', error)
      })
      .finally(() => {
        ingestionRunning = false
      })
  }, intervalMs)

  const shutdown = async () => {
    clearInterval(interval)
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
}

main().catch(async (error: unknown) => {
  console.error('[ingestion] fatal error:', error)
  await client.end()
  process.exit(1)
})

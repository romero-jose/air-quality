const isServer = import.meta.env.SSR
const isDev = import.meta.env.DEV

const shouldLog = isServer || isDev

type LogContext = Record<string, unknown>

const formatContext = (context: LogContext = {}) =>
  Object.entries(context)
    .map(([key, value]) => `${key}=${String(value)}`)
    .join(' ')

export const logger = {
  info(message: string, context?: LogContext) {
    if (!shouldLog) return

    const details = formatContext(context)
    console.info(`[air-quality] ${message}${details ? ` ${details}` : ''}`)
  },
  error(message: string, context?: LogContext) {
    if (!shouldLog) return

    const details = formatContext(context)
    console.error(`[air-quality] ${message}${details ? ` ${details}` : ''}`)
  },
}

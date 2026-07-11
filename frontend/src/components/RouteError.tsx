import { useEffect } from 'react'

import { type ErrorComponentProps } from '@tanstack/react-router'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import * as Sentry from '@sentry/tanstackstart-react'

export function RouteError({ error }: ErrorComponentProps) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <Alert variant="destructive">
      <AlertTitle>Something went wrong</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  )
}

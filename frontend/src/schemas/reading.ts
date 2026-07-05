import { z } from 'zod'

import {
  nullableNumberFromApiSchema,
  numberFromApiSchema,
} from '@/utils/schema'

import { stationSchema } from './station'

export const readingSchema = z.object({
  id: numberFromApiSchema,
  stationId: numberFromApiSchema,
  date: z.string(),
  hour: z.string(),
  pm25: nullableNumberFromApiSchema,
  pm10: nullableNumberFromApiSchema,
  so2: nullableNumberFromApiSchema,
  no2: nullableNumberFromApiSchema,
  co: nullableNumberFromApiSchema,
  o3: nullableNumberFromApiSchema,
  preliminary: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const readingsResponseSchema = z.object({
  data: z.array(
    stationSchema.extend({
      readings: z.array(readingSchema),
    }),
  ),
})

export type Reading = z.infer<typeof readingSchema>
export type StationReadings = z.infer<
  typeof readingsResponseSchema
>['data'][number]

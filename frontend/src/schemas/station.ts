import { z } from 'zod'

import {
  nullableNumberFromApiSchema,
  numberFromApiSchema,
} from '@/utils/schema'

export const stationSchema = z.object({
  id: numberFromApiSchema,
  code: z.string(),
  domain: z.string(),
  name: z.string(),
  municipality: z.string().nullable(),
  lat: nullableNumberFromApiSchema,
  lon: nullableNumberFromApiSchema,
  createdAt: z.string(),
})

export const stationsResponseSchema = z.object({
  data: z.array(stationSchema),
})

export type Station = z.infer<typeof stationSchema>

import { z } from 'zod'

export const numberFromApiSchema = z
  .union([z.number(), z.string()])
  .pipe(z.coerce.number())
export const nullableNumberFromApiSchema = z
  .union([z.number(), z.string(), z.null()])
  .transform(value => (value === null ? null : Number(value)))

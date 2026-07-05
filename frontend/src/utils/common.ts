export function formatValue(value: number | null) {
  return value === null ? '—' : value.toFixed(1)
}
export function formatMarkerValue(value: number | null) {
  return value === null ? '—' : Math.round(value).toString()
}

import { format, parseISO } from 'date-fns'

export function formatCurrency(value, currency = 'USD') {
  const num = Number(value || 0)
  return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(num)
}

export function formatDuration(mins) {
  const m = Math.max(0, Math.round(mins || 0))
  const h = Math.floor(m / 60)
  const r = m % 60
  return `${h}h ${r}m`
}

export function toTime(isoDateTime) {
  try {
    return format(parseISO(isoDateTime), 'HH:mm')
  } catch { return '' }
}

export function toDate(isoDateTime) {
  try {
    return format(parseISO(isoDateTime), 'MMM d')
  } catch { return '' }
}

export function parseISODurationToMinutes(iso) {
  if (!iso || typeof iso !== 'string') return 0
  const h = /PT(\d+)H/.exec(iso)?.[1]
  const m = /PT(?:\d+H)?(\d+)M/.exec(iso)?.[1]
  return (h ? parseInt(h) * 60 : 0) + (m ? parseInt(m) : 0)
}

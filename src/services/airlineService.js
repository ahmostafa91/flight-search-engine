import { getAirlines } from '../repositories/airlineRepository'

const cache = new Map() // code -> name

export async function resolveNames(codes) {
  const unique = Array.from(new Set(codes)).filter(Boolean)
  const missing = unique.filter((c) => !cache.has(c))
  if (missing.length) {
    try {
      const res = await getAirlines({ airlineCodes: missing.join(',') })
      for (const a of res.data || []) {
        const name = a.commonName || a.businessName || a.name || a.carrierName || a.iataCode
        cache.set(a.iataCode, name)
      }
      // Fill still-missing as code
      for (const c of missing) if (!cache.has(c)) cache.set(c, c)
    } catch (e) {
      // On failure, at least return codes as-is
      for (const c of missing) if (!cache.has(c)) cache.set(c, c)
    }
  }
  const map = {}
  for (const c of unique) map[c] = cache.get(c)
  return map
}

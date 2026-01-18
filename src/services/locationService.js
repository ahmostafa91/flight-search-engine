import { searchLocations } from '../repositories/locationRepository'
import { countrySynonyms, curatedAirports } from '../data/locationsCurated'

const cache = new Map() // key -> normalized[]

function normalize(item) {
  const iata = item.iataCode || item.address?.iataCode || item.airportCode
  const name = item.name || item.detailedName || item.cityName || iata
  const city = item.address?.cityName || item.cityName || ''
  const country = item.address?.countryName || item.address?.countryCode || ''
  const countryCode = item.address?.countryCode || ''
  const type = item.subType || item.type || 'AIRPORT' // 'AIRPORT' | 'CITY'
  return { code: iata, name, city, country, countryCode, type }
}

function score(item, q, preferCountry) {
  const query = q.toLowerCase()
  const codeEq = item.code?.toLowerCase() === query
  const nameEq = item.name?.toLowerCase() === query || item.city?.toLowerCase() === query
  const starts = item.name?.toLowerCase().startsWith(query) || item.city?.toLowerCase().startsWith(query)
  const countryBoost = preferCountry && item.countryCode?.toLowerCase() === preferCountry.toLowerCase()
  const isAirport = item.type === 'AIRPORT'
  let s = 0
  if (codeEq) s += 100
  if (nameEq) s += 50
  if (starts) s += 30
  if (countryBoost) s += 25
  if (isAirport) s += 10
  return s
}

export async function findLocations(keyword, { preferCountry, limit = 20 } = {}) {
  const q = (keyword || '').trim()
  if (q.length < 2) return []

  // Country-only query detection
  const qLower = q.toLowerCase()
  const matchedCountry = Object.entries(countrySynonyms).find(([cc, arr]) => arr.includes(qLower))
  const countryCodeFromKeyword = matchedCountry ? matchedCountry[0].toUpperCase() : undefined
  const effectiveCountry = (preferCountry || countryCodeFromKeyword || '').toUpperCase() || undefined

  const cacheKey = `${q}|${effectiveCountry || ''}|${limit}`
  if (cache.has(cacheKey)) return cache.get(cacheKey)

  // If query is country-like, return curated airports instantly
  if (countryCodeFromKeyword && curatedAirports[countryCodeFromKeyword]) {
    const curated = curatedAirports[countryCodeFromKeyword].slice(0, limit)
    cache.set(cacheKey, curated)
    // Fire-and-forget background enrichment using popular city seeds
    // (non-blocking: we do not await; results will be loaded during further typing)
    setTimeout(async () => {
      try {
        const seeds = (await import('../data/locationsCurated')).curatedCitySeeds?.[countryCodeFromKeyword] || []
        const chunks = await Promise.all(
          seeds.map((seed) => searchLocations({ keyword: seed, countryCode: countryCodeFromKeyword, limit }))
        )
        const mergedRaw = chunks.flatMap((res) => (res?.data || []).map(normalize)).filter(x => x.code)
        const ranked = mergedRaw
          .map(x => ({ ...x, __score: score(x, q, countryCodeFromKeyword) }))
          .sort((a, b) => b.__score - a.__score)
        const deduped = []
        const seen = new Set(curated.map(c => c.code))
        for (const x of ranked) {
          if (seen.has(x.code)) continue
          seen.add(x.code)
          deduped.push(x)
          if (curated.length + deduped.length >= limit) break
        }
        const enriched = [...curated, ...deduped]
        cache.set(cacheKey, enriched)
      } catch {}
    }, 0)
    return curated
  }

  try {
    const res = await searchLocations({ keyword: q, limit })
    const raw = (res?.data || []).map(normalize).filter(x => x.code)
    const ranked = raw
      .map(x => ({ ...x, __score: score(x, q, effectiveCountry) }))
      .sort((a, b) => b.__score - a.__score)
    const deduped = []
    const seen = new Set()
    for (const x of ranked) {
      if (seen.has(x.code)) continue
      seen.add(x.code)
      deduped.push(x)
      if (deduped.length >= limit) break
    }
    cache.set(cacheKey, deduped)
    return deduped
  } catch (e) {
    cache.set(cacheKey, [])
    return []
  }
}

import { searchOffers } from '../repositories/flightRepository'
import { resolveNames } from './airlineService'
import { priceHistogram } from '../utils/math'
import { mapSearchParams, mapFlightOffer } from '../adapters/flightOfferAdapter'



export async function searchFlights(uiParams) {
  const params = mapSearchParams(uiParams)

  const raw = await searchOffers(params)
  const offers = raw?.data || []
  const flights = offers.map(mapFlightOffer)

  const prices = flights.map(f => Number(f.price.total)).filter(n => !Number.isNaN(n))
  const priceMin = prices.length ? Math.min(...prices) : 0
  const priceMax = prices.length ? Math.max(...prices) : 0
  const histogram = priceHistogram(prices)

  const airlineCodes = Array.from(new Set(flights.flatMap(f => f.carriers.marketing)))
  const airlineMap = await resolveNames(airlineCodes)
  const currency = uiParams?.currency || 'USD'

  return {
    flights,
    stats: { priceMin, priceMax, histogram },
    airlines: { codes: airlineCodes, map: airlineMap },
    currency,
  }
}

import { parseISODurationToMinutes } from '../utils/formatters'

export function mapSearchParams(ui) {
  const {
    origin, destination, departureDate, returnDate,
    adults = 1, cabin = 'ECONOMY', nonStop = false, currency = 'USD',
  } = ui
  return {
    originLocationCode: origin,
    destinationLocationCode: destination,
    departureDate,
    ...(returnDate ? { returnDate } : {}),
    adults,
    currencyCode: currency,
    nonStop,
    max: 50,
    travelClass: cabin,
  }
}

export function mapFlightOffer(offer) {
  const price = offer.price || {}
  const currency = price.currency || offer.price?.currency || 'USD'

  const itineraries = (offer.itineraries || []).map(it => {
    const segments = (it.segments || []).map(seg => ({
      from: seg.departure?.iataCode,
      to: seg.arrival?.iataCode,
      departure: seg.departure?.at,
      arrival: seg.arrival?.at,
      carrierCode: seg.carrierCode || seg.marketingCarrier || seg.operating?.carrierCode,
      number: seg.number,
      aircraft: seg.aircraft?.code,
      durationMinutes: parseISODurationToMinutes(seg.duration),
    }))
    return {
      durationMinutes: parseISODurationToMinutes(it.duration),
      segments,
    }
  })

  const allSegs = itineraries.flatMap(i => i.segments)
  const firstDeparture = allSegs[0]?.departure
  const stopsPerLeg = itineraries.map(i => Math.max(0, (i.segments?.length || 1) - 1))
  const stopsCount = Math.max(0, ...stopsPerLeg)
  const totalDurationMinutes = itineraries.reduce((sum, i) => sum + (i.durationMinutes || 0), 0)
  const marketing = Array.from(new Set(allSegs.map(s => s.carrierCode).filter(Boolean)))

  return {
    id: offer.id,
    price: { total: Number(price.total), currency },
    totalDurationMinutes,
    firstDeparture,
    stopsCount,
    carriers: { marketing, operating: [] },
    itineraries,
  }
}

// Pure filtering/sorting utils for flights

export function applyFilters(flights, { priceRange, stops, airlinesSelected }) {
  return flights.filter(f => {
    if (priceRange) {
      const [min, max] = priceRange
      const price = Number(f.price.total)
      if (price < min || price > max) return false
    }
    if (stops !== 'any') {
      const s = f.stopsCount
      if (stops === 0 && s !== 0) return false
      if (stops === 1 && s !== 1) return false
      if (stops === '2+' && s < 2) return false
    }
    if (airlinesSelected?.length) {
      const has = f.carriers.marketing.some(c => airlinesSelected.includes(c))
      if (!has) return false
    }
    return true
  })
}

export function sortFlights(flights, sortBy) {
  const arr = [...flights]
  switch (sortBy) {
    case 'price-asc':
      arr.sort((a, b) => Number(a.price.total) - Number(b.price.total)); break
    case 'price-desc':
      arr.sort((a, b) => Number(b.price.total) - Number(a.price.total)); break
    case 'duration':
      arr.sort((a, b) => a.totalDurationMinutes - b.totalDurationMinutes); break
    case 'depart-time':
      arr.sort((a, b) => new Date(a.firstDeparture).getTime() - new Date(b.firstDeparture).getTime()); break
    default:
      break
  }
  return arr
}

import { useCallback, useMemo, useState } from 'react'
import { searchFlights as searchSvc } from '../services/flightService'
import { applyFilters, sortFlights } from '../utils/filterFlights'

export function useFlights() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [flights, setFlights] = useState([])
  const [stats, setStats] = useState({ priceMin: 0, priceMax: 0, histogram: [] })
  const [airlines, setAirlines] = useState({ codes: [], map: {} })
  const [currency, setCurrency] = useState('USD')

  // filters
  const [priceRange, setPriceRange] = useState([0, 0])
  const [stops, setStops] = useState('any') // 'any' | 0 | 1 | '2+'
  const [airlinesSelected, setAirlinesSelected] = useState([])

  // sorting
  const [sort, setSort] = useState('price-asc')

  const search = useCallback(async (uiParams) => {
    setLoading(true); setError(null)
    try {
      const res = await searchSvc(uiParams)
      setFlights(res.flights)
      setStats(res.stats)
      setAirlines(res.airlines)
      setCurrency(res.currency)
      setPriceRange([res.stats.priceMin, res.stats.priceMax])
      setStops('any')
      setAirlinesSelected([])
      setSort('price-asc')
    } catch (e) {
      setError(e?.message || 'Failed to fetch flights')
    } finally {
      setLoading(false)
    }
  }, [])

  const filtered = useMemo(() => applyFilters(flights, { priceRange, stops, airlinesSelected }), [flights, priceRange, stops, airlinesSelected])
  const filteredAndSorted = useMemo(() => sortFlights(filtered, sort), [filtered, sort])

  const reset = useCallback(() => {
    setFlights([])
    setStats({ priceMin: 0, priceMax: 0, histogram: [] })
    setAirlines({ codes: [], map: {} })
    setPriceRange([0, 0])
    setStops('any')
    setAirlinesSelected([])
    setSort('price-asc')
    setError(null)
  }, [])

  return {
    loading, error,
    flights, stats, airlines, currency,
    filteredFlights: filteredAndSorted,
    filters: {
      priceRange, setPriceRange,
      stops, setStops,
      airlinesSelected, setAirlinesSelected,
    },
    sort, setSort,
    search,
    reset,
  }
}

import { useEffect, useMemo, useState } from 'react'
import { useDebounce } from './useDebounce'
import { findLocations } from '../services/locationService'

export function useLocationSearch(initial = '', { preferCountry, limit } = {}) {
  const [query, setQuery] = useState(initial)
  const debounced = useDebounce(query, 350)
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function run() {
      const q = debounced.trim()
      if (q.length < 2) { setSuggestions([]); setError(null); return }
      setLoading(true); setError(null)
      try {
        const res = await findLocations(q, { preferCountry, limit })
        if (!cancelled) setSuggestions(res)
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Failed to search locations')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [debounced, preferCountry, limit])

  return {
    query, setQuery,
    suggestions, loading, error,
    clear: () => setSuggestions([]),
  }
}

import { useEffect, useState } from 'react'
import { useDebounce } from '../../hooks/useDebounce'

export default function PriceRange({ min=0, max=0, value=[0,0], onChange, currency='USD' }) {
  const [localMin, setLocalMin] = useState(value[0] ?? min)
  const [localMax, setLocalMax] = useState(value[1] ?? max)
  const debounced = useDebounce([localMin, localMax], 300)

  useEffect(() => { setLocalMin(value[0]); setLocalMax(value[1]) }, [value[0], value[1]])
  useEffect(() => { onChange?.(debounced) }, [debounced])

  const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi)

  return (
    <div className="mb-3">
      <div className="form-label d-flex justify-content-between align-items-center">
        <span>Price range</span>
        <span className="badge text-bg-secondary">{currency} {Math.round(localMin)} - {Math.round(localMax)}</span>
      </div>
      <div className="d-flex align-items-center gap-2">
        <input type="number" className="form-control" value={Math.round(localMin)} min={min} max={localMax} onChange={e => setLocalMin(clamp(Number(e.target.value), min, localMax))} />
        <span>to</span>
        <input type="number" className="form-control" value={Math.round(localMax)} min={localMin} max={max} onChange={e => setLocalMax(clamp(Number(e.target.value), localMin, max))} />
      </div>
      <div className="mt-2">
        <input type="range" className="form-range" min={min} max={max} value={localMin} onChange={e => setLocalMin(Math.min(Number(e.target.value), localMax))} />
        <input type="range" className="form-range" min={min} max={max} value={localMax} onChange={e => setLocalMax(Math.max(Number(e.target.value), localMin))} />
      </div>
    </div>
  )
}

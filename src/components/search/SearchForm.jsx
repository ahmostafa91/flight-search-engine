import { useState } from 'react'

const cabins = [
  { value: 'ECONOMY', label: 'Economy' },
  { value: 'PREMIUM_ECONOMY', label: 'Premium Economy' },
  { value: 'BUSINESS', label: 'Business' },
  { value: 'FIRST', label: 'First' },
]

import LocationAutocomplete from '../common/LocationAutocomplete'

export default function SearchForm({ onSearch, onReset, loading }) {
  function todayLocalISO() {
    const d = new Date()
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
    return d.toISOString().slice(0, 10)
  }
  const today = todayLocalISO()
  const [origin, setOrigin] = useState('CAI')
  const [destination, setDestination] = useState('DXB')
  const [departureDate, setDepartureDate] = useState(today)
  const [returnDate, setReturnDate] = useState('')
  const [adults, setAdults] = useState(1)
  const [cabin, setCabin] = useState('ECONOMY')
  const [nonStop, setNonStop] = useState(false)
  const [currency, setCurrency] = useState('USD')
  const currencyToCountry = { EGP: 'EG', AED: 'AE', SAR: 'SA', GBP: 'GB', USD: 'US' }
  const preferCountry = currencyToCountry[currency]

  const isIata = (v) => /^[A-Z]{3}$/.test(v || '')
  const canSubmit = isIata(origin) && isIata(destination) && departureDate && departureDate >= today && adults >= 1 && origin !== destination && !loading

  function handleSwap() {
    const o = origin
    setOrigin(destination)
    setDestination(o)
  }

  function handleReset() {
    setOrigin('')
    setDestination('')
    setDepartureDate(today)
    setReturnDate('')
    setAdults(1)
    setCabin('ECONOMY')
    setNonStop(false)
    setCurrency('USD')
    onReset?.()
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!canSubmit) return
    if (departureDate < today) { setDepartureDate(today); return }
    const params = { origin, destination, departureDate, returnDate: returnDate || undefined, adults, cabin, nonStop, currency }
    onSearch?.(params)
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Row 1: From / Swap / To (always on top) */}
      <div className="row g-3 align-items-end">
        <div className="col-12 col-md-5">
          <LocationAutocomplete label="From" value={origin} onChange={setOrigin} placeholder="City or airport" preferCountry={preferCountry} />
        </div>
        <div className="col-12 col-md-2 d-flex justify-content-center align-items-end">
          <button type="button" className="btn btn-outline-secondary w-100" onClick={handleSwap} title="Swap">⇄</button>
        </div>
        <div className="col-12 col-md-5">
          <LocationAutocomplete label="To" value={destination} onChange={setDestination} placeholder="City or airport" preferCountry={preferCountry} />
        </div>
      </div>

      {/* Row 2: Dates and basic inputs */}
      <div className="row g-3 mt-1">
        <div className="col-6 col-md-3">
          <label className="form-label">Depart</label>
          <input type="date" className="form-control" value={departureDate} min={today} onChange={e => setDepartureDate(e.target.value)} />
        </div>
        <div className="col-6 col-md-3">
          <label className="form-label">Return (optional)</label>
          <input type="date" className="form-control" value={returnDate} min={departureDate || today} onChange={e => setReturnDate(e.target.value)} />
        </div>
        <div className="col-6 col-md-2">
          <label className="form-label">Adults</label>
          <input type="number" className="form-control" value={adults} min={1} max={9} onChange={e => setAdults(Number(e.target.value))} />
        </div>
        <div className="col-6 col-md-2">
          <label className="form-label">Cabin</label>
          <select className="form-select" value={cabin} onChange={e => setCabin(e.target.value)}>
            {cabins.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div className="col-6 col-md-2">
          <label className="form-label">Currency</label>
          <select className="form-select" value={currency} onChange={e => setCurrency(e.target.value)}>
            {['USD','EUR','EGP','AED','GBP','SAR'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Row 3: Non-stop and Actions */}
      <div className="row g-3 mt-1 align-items-start align-items-md-center">
        {/* Buttons first on mobile, second on desktop */}
        <div className="col-12 col-md-2 order-1 order-md-2">
          <div className="d-grid gap-2">
            <button className="btn btn-primary" disabled={!canSubmit} type="submit">
              {loading ? 'Searching…' : 'Search'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleReset} disabled={loading}>Reset</button>
          </div>
        </div>
        {/* Checkbox second on mobile, first on desktop */}
        <div className="col-12 col-md-10 order-2 order-md-1 d-flex justify-content-md-end">
          <div className="form-check m-0 d-flex align-items-center">
            <input className="form-check-input" type="checkbox" id="nonStop" checked={nonStop} onChange={e => setNonStop(e.target.checked)} />
            <label className="form-check-label ms-2" htmlFor="nonStop">Non-stop only</label>
          </div>
        </div>
      </div>
    </form>
  )
}

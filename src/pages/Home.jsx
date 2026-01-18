import { lazy, Suspense } from 'react'
import SearchForm from '../components/search/SearchForm'
import Loader from '../components/common/Loader'
import Error from '../components/common/Error'
import StopsFilter from '../components/filters/StopsFilter'
import AirlineFilter from '../components/filters/AirlineFilter'
import PriceRange from '../components/filters/PriceRange'
import SortBar from '../components/filters/SortBar'
import FlightList from '../components/flights/FlightList'
import { useFlights } from '../hooks/useFlights'

const PriceChart = lazy(() => import('../components/common/PriceChart'))

export default function Home() {
  const {
    loading, error,
    filteredFlights, stats, airlines, currency,
    filters: { priceRange, setPriceRange, stops, setStops, airlinesSelected, setAirlinesSelected },
    sort, setSort,
    search,
    reset,
  } = useFlights()

  return (
    <div className="container container-narrow py-4">
      <div className="mb-4">
        <h2 className="section-title mb-3">Flight Search</h2>
        <SearchForm onSearch={search} onReset={reset} loading={loading} />
      </div>

      {error && <Error message={error} onRetry={() => search()} />}
      {loading && <Loader text="Fetching flights…" />}

      {!loading && stats?.histogram?.length > 0 && (
        <div className="row g-4">
          <div className="col-12 col-lg-3">
            <div className="filters-panel">
              <div className="title">Filters</div>
              <StopsFilter value={stops} onChange={setStops} />
              <PriceRange min={stats.priceMin} max={stats.priceMax} value={priceRange} onChange={setPriceRange} currency={currency} />
              <AirlineFilter codes={airlines.codes} map={airlines.map} selected={airlinesSelected} onChange={setAirlinesSelected} />
            </div>
          </div>
          <div className="col-12 col-lg-9">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="text-muted">{filteredFlights.length} results</div>
              <SortBar value={sort} onChange={setSort} />
            </div>
            <Suspense fallback={<div className="chart-card p-3">Loading chart…</div>}>
              <PriceChart data={stats.histogram} />
            </Suspense>
            <div className="mt-3">
              <FlightList flights={filteredFlights} airlineMap={airlines.map} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

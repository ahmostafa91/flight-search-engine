import { formatCurrency, formatDuration, toTime, toDate } from '../../utils/formatters'

export default function FlightCard({ flight, airlineMap = {} }) {
  const { price, totalDurationMinutes, stopsCount, itineraries, carriers } = flight
  const priceLabel = formatCurrency(price.total, price.currency)

  return (
    <div className="flight-card mb-3">
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
        <div>
          <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
            {carriers.marketing.map(code => (
              <span key={code} className="badge rounded-pill carrier-badge">{airlineMap[code] || code}</span>
            ))}
          </div>
          <div className="meta">{stopsCount === 0 ? 'Non-stop' : `${stopsCount} stop${stopsCount>1?'s':''}`} • Total {formatDuration(totalDurationMinutes)}</div>
        </div>
        <div className="text-end">
          <div className="price h4 mb-0">{priceLabel}</div>
        </div>
      </div>

      <hr className="section my-3" />

      <div className="row g-3">
        {itineraries.map((it, idx) => (
          <div key={idx} className="col-12">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div className="fw-semibold">Leg {idx+1} · {formatDuration(it.durationMinutes)}</div>
              <div className="text-muted small ms-auto">{it.segments[0]?.from} → {it.segments.at(-1)?.to}</div>
            </div>
            <div className="mt-2">
              {it.segments.map((s, i) => (
                <div key={i} className="d-flex justify-content-between align-items-center py-2 flex-wrap gap-2" style={{borderTop: '1px dashed rgba(255,255,255,.08)'}}>
                  <div className="me-auto">
                    <div className="fw-semibold">{toTime(s.departure)} · {s.from} → {s.to} · {toTime(s.arrival)}</div>
                    <div className="text-muted small">{airlineMap[s.carrierCode] || s.carrierCode} · {formatDuration(s.durationMinutes)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

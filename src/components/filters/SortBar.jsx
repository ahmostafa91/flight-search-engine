export default function SortBar({ value, onChange }) {
  return (
    <div className="d-flex flex-wrap align-items-center gap-2">
      <span className="text-muted">Sort by</span>
      <select className="form-select form-select-sm w-auto" value={value} onChange={e => onChange(e.target.value)}>
        <option value="price-asc">Price (low to high)</option>
        <option value="price-desc">Price (high to low)</option>
        <option value="duration">Duration</option>
        <option value="depart-time">Departure time</option>
      </select>
    </div>
  )
}

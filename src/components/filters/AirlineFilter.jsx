export default function AirlineFilter({ codes = [], map = {}, selected = [], onChange }) {
  function toggle(code) {
    if (selected.includes(code)) onChange(selected.filter(c => c !== code))
    else onChange([...selected, code])
  }
  return (
    <div className="mb-3">
      <div className="form-label">Airlines</div>
      <div className="d-flex flex-column gap-1" style={{maxHeight: 220, overflowY: 'auto'}}>
        {codes.map(code => (
          <label key={code} className="form-check">
            <input className="form-check-input" type="checkbox" checked={selected.includes(code)} onChange={() => toggle(code)} />
            <span className="form-check-label">{map[code] || code}</span>
          </label>
        ))}
        {!codes.length && <div className="text-muted small">No airlines yet</div>}
      </div>
    </div>
  )
}

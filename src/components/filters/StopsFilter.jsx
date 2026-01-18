export default function StopsFilter({ value, onChange }) {
  const opts = [
    { label: 'Any', value: 'any' },
    { label: 'Non-stop', value: 0 },
    { label: '1 stop', value: 1 },
    { label: '2+ stops', value: '2+' },
  ]
  return (
    <div className="mb-3">
      <div className="form-label">Stops</div>
      <div className="d-flex gap-2 flex-wrap">
        {opts.map(o => (
          <button
            key={o.label}
            type="button"
            className={`btn btn-sm ${String(value)===String(o.value)?'btn-primary':'btn-outline-secondary'}`}
            onClick={() => onChange(o.value)}
          >{o.label}</button>
        ))}
      </div>
    </div>
  )
}

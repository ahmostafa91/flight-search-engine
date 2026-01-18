export default function Loader({ text = 'Loading…' }) {
  return (
    <div className="d-flex align-items-center justify-content-center py-5">
      <div className="spinner-border text-primary me-3" role="status" aria-hidden="true" />
      <span>{text}</span>
    </div>
  )
}

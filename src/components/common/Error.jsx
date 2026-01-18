export default function Error({ message, onRetry }) {
  if (!message) return null
  return (
    <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
      <div>{message}</div>
      {onRetry && <button className="btn btn-sm btn-outline-light" onClick={onRetry}>Retry</button>}
    </div>
  )
}

export default function Empty({ title = 'No results found', subtitle = 'Try adjusting your search or filters.' }) {
  return (
    <div className="text-center text-muted py-5">
      <h5 className="mb-2">{title}</h5>
      <p className="mb-0">{subtitle}</p>
    </div>
  )
}

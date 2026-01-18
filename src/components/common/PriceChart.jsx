import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function PriceChart({ data = [] }) {
  if (!data.length) return null
  return (
    <div className="chart-card">
      <div className="section-title mb-3">Price distribution</div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.1)" />
          <XAxis dataKey="label" tick={{ fill: '#9fb3c8', fontSize: 12 }} angle={-25} textAnchor="end" height={50} interval={0} />
          <YAxis tick={{ fill: '#9fb3c8', fontSize: 12 }} allowDecimals={false} />
          <Tooltip formatter={(v) => [v, 'Offers']} />
          <Bar dataKey="count" fill="#3b82f6" radius={[6,6,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

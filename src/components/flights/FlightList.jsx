import Empty from '../common/Empty'
import FlightCard from './FlightCard'

export default function FlightList({ flights = [], airlineMap = {} }) {
  if (!flights.length) return <Empty />
  return (
    <div>
      {flights.map(f => (
        <FlightCard key={f.id} flight={f} airlineMap={airlineMap} />
      ))}
    </div>
  )
}

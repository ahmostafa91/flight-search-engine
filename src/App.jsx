import ErrorBoundary from './components/common/ErrorBoundary'
import Home from './pages/Home'

export default function App() {
  return (
    <ErrorBoundary>
      <Home />
    </ErrorBoundary>
  )
}

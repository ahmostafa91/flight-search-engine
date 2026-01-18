import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // You could send this to an error reporting service
    // console.error('ErrorBoundary caught', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    if (typeof this.props.onReset === 'function') this.props.onReset()
  }

  render() {
    if (this.state.hasError) {
      const message = this.state.error?.message || 'Something went wrong.'
      return (
        <div className="container py-4">
          <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
            <div>{message}</div>
            <button className="btn btn-sm btn-outline-light" onClick={this.handleReset} aria-label="Try again">Try again</button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

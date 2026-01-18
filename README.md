# Flight Search Engine

A modern React + Vite application that lets users search commercial flight offers, filter and sort results, and visualize a price distribution chart. It integrates with the Amadeus Self‑Service APIs for locations, airlines, and flight offers.

## Demo
- ![FSE](./public/fse.jpg)
 

## Features
- Powerful search form
  - Origin/destination airports or cities with accessible, debounced autocomplete
  - One‑way or round‑trip dates, cabin, passengers, currency selector
  - Optional non‑stop only filter
- Result exploration
  - Filters: price range, stops, airlines
  - Sorting: price low→high / high→low, total duration, departure time
  - Price distribution chart (Recharts) is lazy‑loaded for smaller bundle size
- Great UX by default
  - Debounced location queries, in‑memory caching and ranking for relevant suggestions
  - Error and loading states, inline retry
  - Dark theme with Bootstrap + custom SCSS design system
- Accessibility
  - Location combobox implements proper ARIA roles (combobox, listbox, option), keyboard navigation (Up/Down/Enter/Escape), and polite announcements
- Clear, testable architecture
  - Adapters → Repositories → Services → Hooks → Components → Styles → Utils

## Architecture
High‑level layers and responsibilities:

- src/api
  - httpClient.js: Axios instance, auth header injection, simple 401 retry
  - tokenManager.js: DEV‑ONLY client OAuth (see “Security”)
- src/repositories (API IO only)
  - flightRepository.js, locationRepository.js, airlineRepository.js
- src/services (domain logic)
  - flightService.js: orchestrates search, maps data, builds stats (histogram)
  - locationService.js: ranking, dedupe, curated fallbacks, caching
  - airlineService.js: resolves airline codes to readable names with caching
- src/adapters
  - flightOfferAdapter.js: maps UI params → API params and API offers → UI model
- src/hooks
  - useFlights.js: fetch, filter, sort; exposes derived state to screens
  - useLocationSearch.js + useDebounce.js
- src/components
  - search, filters, flights, and common UI (Error, Loader, Empty, PriceChart)
- src/styles
  - base (variables, mixins, reset) and components (flight-card, filters, chart)
- src/pages/Home.jsx: the main screen composition

Data flow example (search):
SearchForm → useFlights.search → flightService.searchFlights → repositories (API calls) → adapters and services build UI shape → useFlights exposes filtered/sorted list → FlightList/FlightCard render; PriceChart uses stats.histogram.

## Getting Started
### Prerequisites
- Node.js 18+ and npm 9+

### Install
```bash
npm install
```

### Environment variables
Create .env.local from .env.example and fill in your Amadeus credentials:

```
VITE_AMADEUS_CLIENT_ID=your_client_id
VITE_AMADEUS_CLIENT_SECRET=your_client_secret
VITE_AMADEUS_BASE_URL=https://test.api.amadeus.com
```

Note: These are visible to anyone using a built site (VITE_ prefix exposes values at build time). Use only for local development while you implement a backend proxy for production.

### Development
```bash
npm run dev
```
- Starts Vite on http://localhost:5173 (default). Hot reloading enabled.

### Linting
```bash
npm run lint
```
- ESLint (flat config) with React hooks and React Refresh plugins.

### Production build
```bash
npm run build
```

## API Integration
This app uses a subset of the Amadeus Self‑Service API (test environment):
- OAuth: POST /v1/security/oauth2/token (client credentials)
- Locations: GET /v1/reference-data/locations
- Airlines: GET /v1/reference-data/airlines
- Flight Offers: GET /v2/shopping/flight-offers

Repositories encapsulate each endpoint; services add domain logic (mapping, ranking, caching, stats).

## Accessibility
- Location autocomplete follows the combobox pattern (ARIA roles for combobox/listbox/option, aria‑expanded/controls/activedescendant) with keyboard navigation and polite live‑region updates for loading and result counts.
- Form labels are associated via htmlFor, and core controls include accessible names.
- Visual contrast is tuned for the dark theme; consider running axe or Lighthouse for an automated pass.

## License
MIT (see LICENSE). If no LICENSE file is present yet, create one with the MIT text.

## Acknowledgements
- [Vite](https://vite.dev/) • [React](https://react.dev/) • [Recharts](https://recharts.org/) • [Bootstrap](https://getbootstrap.com/)
- Amadeus Self‑Service APIs for test datasets

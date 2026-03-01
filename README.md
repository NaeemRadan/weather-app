# Weather App

A production-minded weather dashboard built with Vite and vanilla JavaScript.

## Highlights

- Current weather by city name or browser geolocation.
- 5-day forecast rendering.
- Arabic / English / Russian UI.
- Favorites with validated and deduplicated localStorage persistence.
- Light / dark theme.
- Improved error UX for API key, rate limit, network, and missing city.
- Request cancellation (`AbortController`) to prevent stale API results.
- Better accessibility (ARIA states, keyboard escape to close favorites, focus-visible styles).

## Setup

1. Install dependencies:
   ```bash
   npm ci
   ```
2. Create `.env` in project root:
   ```bash
   VITE_API_KEY=your_openweathermap_api_key
   ```
3. Run development server:
   ```bash
   npm run dev
   ```

## Build

```bash
npm run build
```

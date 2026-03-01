# Weather App (Professional Edition)

واجهة طقس حديثة مبنية بـ Vite + JavaScript وتدعم تجربة أكثر احترافية.

## What’s improved

- Auto-detect user location on first load with graceful fallback city.
- Manual “My location” refresh button.
- Enhanced UI: status chips, glassmorphism layout, metric cards, refined forecast grid.
- Rich weather details: feels-like, pressure, visibility, humidity, wind.
- Better request reliability with `AbortController` (prevents stale results).
- Safer favorites persistence (validation + deduplication).
- Full multi-language support (Arabic / English / Russian).
- Better accessibility and keyboard behavior.

## Setup

```bash
npm ci
```

Create `.env` in project root:

```bash
VITE_API_KEY=your_openweathermap_api_key
```

## Run

```bash
npm run dev
```

## Build

```bash
npm run build
```

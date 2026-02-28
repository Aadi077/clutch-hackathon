# clutch-hackathon

## Charts — Win probability (Teammate B)

**GET** `/analyses/{analysisId}/charts/winProbability` — returns chart-ready win-probability series.

- **Query params (optional):** `window`, `interval` (positive integers).
- **Response:** `ChartSeriesResponse` with `meta` (analysisId, metric, intervalSec, window, count) and `points` (sorted by `t`).
- **Errors:** 404 if analysis not found; 400 if `window`/`interval` invalid.

### cURL

```bash
curl -s "http://localhost:3000/analyses/a_01JABCDEF0123456789XYZ/charts/winProbability"
curl -s "http://localhost:3000/analyses/a_01JABCDEF0123456789XYZ/charts/winProbability?window=300&interval=5"
```

### Example response

See `src/charts/examples/charts.winProbability.example.json`. Full API details: `docs/charts-winprobability.md`.

### Run

```bash
npm install && npm start
# Server on port 3000 (or PORT env).
npm test
```

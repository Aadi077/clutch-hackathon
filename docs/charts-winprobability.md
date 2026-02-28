# Charts API (win probability)

**Owner:** Teammate B — charts only.

## Endpoint

**GET** `/analyses/{analysisId}/charts/winProbability`

Returns the win-probability series for an analysis as a chart-ready payload. Data is read from the canonical stored analysis (via the app’s `getAnalysisById`); points are always sorted ascending by time offset `t`.

### Query parameters (optional)

| Param     | Type   | Description                          |
|----------|--------|--------------------------------------|
| `window` | number | Positive integer (seconds).          |
| `interval` | number | Positive integer (seconds); if provided, series is resampled to this interval. |

If omitted, the stored series is returned as-is (sorted). Invalid values (non-positive, non-integer) return `400 Bad Request`.

### Response: `ChartSeriesResponse`

- **meta**: `analysisId`, `metric` (`"winProbability"`), `intervalSec` (if `interval` was sent), `window` (if `window` was sent), `count` (number of points).
- **points**: array of `{ t, v }` sorted by `t` ascending; never `null` (empty array if series is missing).

### Errors

- **404** — Analysis not found. Body: `{ "apiVersion": "v1", "error": { "code": "NOT_FOUND", "message": "Analysis not found" } }`.
- **400** — Invalid query (e.g. invalid `interval` or `window`). Body: `{ "apiVersion": "v1", "error": { "code": "BAD_REQUEST", "message": "..." } }`.

### cURL example

```bash
# No query params — returns stored series as-is
curl -s "http://localhost:3000/analyses/a_01JABCDEF0123456789XYZ/charts/winProbability"

# With optional window and interval
curl -s "http://localhost:3000/analyses/a_01JABCDEF0123456789XYZ/charts/winProbability?window=300&interval=5"
```

### Example response

See [src/charts/examples/charts.winProbability.example.json](../src/charts/examples/charts.winProbability.example.json).

# clutch-hackathon

Clutch — Moment Analysis API. See [docs/analysis-contract.md](docs/analysis-contract.md) for the data contract.

## Setup

```bash
npm install
npm run build
```

## Run

```bash
npm run dev
# or
npm start
```

Server runs at `http://localhost:3000`.

## Teammate A Endpoints (curl examples)

### POST /analyses — create analysis

```bash
curl -X POST http://localhost:3000/analyses \
  -H "Content-Type: application/json" \
  -d '{
    "sport": "nba",
    "player": { "playerId": "p_123", "fullName": "First Last", "teamIdAtGame": "t_456" },
    "game": { "gameId": "g_789", "date": "2026-02-27", "homeTeamId": "t_home", "awayTeamId": "t_away" },
    "moment": { "period": 4, "clock": "08:32", "scoreDifferential": -11 }
  }'
```

Example response:

```json
{
  "analysisId": "a_01JABCDEF0123456789XYZ",
  "status": "ready",
  "links": {
    "self": "/analyses/a_01JABCDEF0123456789XYZ",
    "charts": "/analyses/a_01JABCDEF0123456789XYZ/charts/winProbability",
    "turningPoints": "/analyses/a_01JABCDEF0123456789XYZ/turningPoints",
    "similar": "/analyses/a_01JABCDEF0123456789XYZ/similar"
  }
}
```

### GET /analyses/{analysisId} — fetch stored analysis

```bash
curl http://localhost:3000/analyses/a_01JABCDEF0123456789XYZ
```

Returns the stored `Analysis` object or `404 Not found`.

## Fixture

See [docs/fixtures/analysis.example.json](docs/fixtures/analysis.example.json) for a full example conforming to the contract.

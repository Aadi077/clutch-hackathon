# Moment Analysis Data Contract (v1)

This repo uses a shared, stable contract for the **stored Analysis object** and the **GET responses** derived from it.  
Everyone should build to this doc so frontend, backend, and analytics can work in parallel.

---

## Goals

- **POST** creates and stores one canonical `Analysis` object.
- **GET** endpoints either:
  - return the stored object as-is, or
  - return graph-ready slices derived from it.

This contract is intentionally small and stable.

---

## Conventions

### IDs
- `analysisId`: `"a_" + ULID` (string)
- `playerId`: `"p_" + stable id`
- `gameId`: `"g_" + stable id`
- `eventId`: `"e_" + stable id`
- `teamId`: `"t_" + stable id`

### Time
- `createdAt`, `updatedAt`: RFC3339 UTC strings, e.g. `"2026-02-28T03:14:15Z"`
- **Relative time** uses `t` or `timeOffsetSec`: integer seconds relative to the moment
  - negative = before moment
  - positive = after moment
  - moment itself is `0`

### Score Differential
- `scoreDifferential` is from the **player’s team** perspective.
  - negative = losing
  - positive = winning

### Win Probability
- `winProbability` values in `[0.0, 1.0]`

### Window
- A window is centered on the moment: `[-windowBeforeSec, +windowAfterSec]`
- Default: 300s before and 300s after

### Versioning
- Stored object includes: `schemaVersion: "1.0.0"`
- Responses include: `apiVersion: "v1"`

---

## Canonical Stored Object

### `Analysis` (stored by POST, returned by `GET /analyses/{analysisId}`)

> This is the single source of truth.  
> Other endpoints return slices of this data or precomputed outputs.

```json
{
  "apiVersion": "v1",
  "schemaVersion": "1.0.0",

  "analysisId": "a_01JABCDEF0123456789XYZ",

  "createdAt": "2026-02-28T03:14:15Z",
  "updatedAt": "2026-02-28T03:14:15Z",

  "status": "ready",

  "sport": "nba",
  "league": "NBA",
  "season": "2025-26",

  "player": {
    "playerId": "p_123",
    "fullName": "First Last",
    "teamIdAtGame": "t_456"
  },

  "game": {
    "gameId": "g_789",
    "date": "2026-02-27",
    "homeTeamId": "t_home",
    "awayTeamId": "t_away"
  },

  "moment": {
    "period": 4,
    "clock": "08:32",
    "timeRemainingSecInPeriod": 512,

    "timeOffsetAnchor": {
      "type": "event",
      "eventId": "e_555"
    },

    "score": {
      "home": 92,
      "away": 103
    },

    "scoreDifferential": -11
  },

  "params": {
    "windowBeforeSec": 300,
    "windowAfterSec": 300,
    "seriesIntervalSec": 5,
    "similarLimit": 20,
    "turningPointThreshold": 0.05
  },

  "derived": {
    "winProbAtMoment": 0.18,
    "winProbEndOfWindow": 0.31,
    "winProbDelta": 0.13,

    "scoreDifferentialEndOfWindow": -4,
    "scoreDifferentialDelta": 7,

    "playerStatsInWindow": {
      "points": 9,
      "assists": 1,
      "rebounds": 2,
      "turnovers": 0
    }
  },

  "series": {
    "winProbability": [
      { "t": -300, "v": 0.22 },
      { "t": -295, "v": 0.21 },
      { "t": 0, "v": 0.18 },
      { "t": 300, "v": 0.31 }
    ],
    "scoreDifferential": [
      { "t": -300, "v": -9 },
      { "t": 0, "v": -11 },
      { "t": 300, "v": -4 }
    ]
  },

  "events": [
    {
      "eventId": "e_1001",
      "t": 42,

      "type": "SCORE",
      "subtype": "3PT_MADE",

      "description": "Player made 3PT",

      "teamId": "t_456",
      "playerId": "p_123",

      "scoreAfter": { "home": 95, "away": 103 },
      "scoreDifferentialAfter": -8,

      "winProbAfter": 0.25,
      "winProbDelta": 0.07
    }
  ],

  "turningPoints": [
    {
      "eventId": "e_1001",
      "t": 42,
      "winProbDelta": 0.07,
      "label": "3PT Made"
    }
  ],

  "similar": {
    "items": [
      {
        "gameId": "g_222",
        "playerId": "p_123",
        "moment": {
          "period": 4,
          "clock": "07:58",
          "scoreDifferential": -10
        },
        "outcome": {
          "won": true,
          "winProbAtMoment": 0.21,
          "winProbEndOfWindow": 0.38,
          "winProbDelta": 0.17,
          "playerPointsInWindow": 11,
          "scoreDifferentialDelta": 9
        }
      }
    ],
    "aggregate": {
      "count": 20,
      "comebackRate": 0.27,
      "avgWinProbDelta": 0.06,
      "avgPlayerPointsInWindow": 8.4
    }
  }
}
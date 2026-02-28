/**
 * Analysis types - Teammate A scope.
 * Matches docs/analysis-contract.md.
 */

export interface CreateAnalysisRequest {
  sport: string;
  league?: string;
  season?: string;
  player: {
    playerId: string;
    fullName?: string;
    teamIdAtGame?: string;
  };
  game: {
    gameId: string;
    date?: string;
    homeTeamId?: string;
    awayTeamId?: string;
  };
  moment: {
    period: number;
    clock: string;
    timeRemainingSecInPeriod?: number;
    timeOffsetAnchor?: { type: string; eventId: string };
    score?: { home: number; away: number };
    scoreDifferential: number;
  };
  params?: {
    windowBeforeSec?: number;
    windowAfterSec?: number;
    seriesIntervalSec?: number;
    similarLimit?: number;
    turningPointThreshold?: number;
  };
}

export interface Analysis extends CreateAnalysisRequest {
  apiVersion: string;
  schemaVersion: string;
  analysisId: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  derived: {
    winProbAtMoment: number;
    winProbEndOfWindow?: number;
    winProbDelta?: number;
    scoreDifferentialEndOfWindow?: number;
    scoreDifferentialDelta?: number;
    playerStatsInWindow?: {
      points?: number;
      assists?: number;
      rebounds?: number;
      turnovers?: number;
    };
  };
  series: {
    winProbability: Array<{ t: number; v: number }>;
    scoreDifferential: Array<{ t: number; v: number }>;
  };
  events: Array<Record<string, unknown>>;
  turningPoints: Array<Record<string, unknown>>;
  similar: {
    items: Array<Record<string, unknown>>;
    aggregate: Record<string, unknown>;
  };
}

export interface CreateAnalysisResponse {
  analysisId: string;
  status: string;
  links: {
    self: string;
    charts?: string;
    turningPoints?: string;
    similar?: string;
  };
}

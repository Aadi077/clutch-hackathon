/**
 * Analysis service - Teammate A scope.
 * Builds canonical Analysis from request and persists.
 */

import { ulid } from "ulid";
import type { Analysis, CreateAnalysisResponse } from "../types/analysis.types";
import type { CreateAnalysisInput } from "../validation/createAnalysis.schema";
import { analysisRepository } from "../repository/analysis.repository";

const SCHEMA_VERSION = "1.0.0";
const API_VERSION = "v1";

function toRfc3339(d: Date): string {
  return d.toISOString();
}

export function buildAnalysis(input: CreateAnalysisInput): Analysis {
  const analysisId = `a_${ulid()}`;
  const now = toRfc3339(new Date());

  const params = input.params ?? {};
  const windowBeforeSec = params.windowBeforeSec ?? 300;
  const windowAfterSec = params.windowAfterSec ?? 300;
  const seriesIntervalSec = params.seriesIntervalSec ?? 5;

  return {
    apiVersion: API_VERSION,
    schemaVersion: SCHEMA_VERSION,
    analysisId,
    createdAt: now,
    updatedAt: now,
    status: "ready",
    sport: input.sport,
    league: input.league ?? "",
    season: input.season ?? "",
    player: input.player,
    game: input.game,
    moment: input.moment,
    params: {
      windowBeforeSec,
      windowAfterSec,
      seriesIntervalSec,
      similarLimit: params.similarLimit ?? 20,
      turningPointThreshold: params.turningPointThreshold ?? 0.05,
    },
    derived: {
      winProbAtMoment: 0,
      winProbEndOfWindow: 0,
      winProbDelta: 0,
      scoreDifferentialEndOfWindow: 0,
      scoreDifferentialDelta: 0,
      playerStatsInWindow: {
        points: 0,
        assists: 0,
        rebounds: 0,
        turnovers: 0,
      },
    },
    series: {
      winProbability: [],
      scoreDifferential: [],
    },
    events: [],
    turningPoints: [],
    similar: {
      items: [],
      aggregate: {
        count: 0,
        comebackRate: 0,
        avgWinProbDelta: 0,
        avgPlayerPointsInWindow: 0,
      },
    },
  };
}

export function createAnalysis(input: CreateAnalysisInput): CreateAnalysisResponse {
  const analysis = buildAnalysis(input);
  analysisRepository.create(analysis);
  return {
    analysisId: analysis.analysisId,
    status: analysis.status,
    links: {
      self: `/analyses/${analysis.analysisId}`,
      charts: `/analyses/${analysis.analysisId}/charts/winProbability`,
      turningPoints: `/analyses/${analysis.analysisId}/turningPoints`,
      similar: `/analyses/${analysis.analysisId}/similar`,
    },
  };
}

export function getAnalysisById(analysisId: string): Analysis | null {
  return analysisRepository.getById(analysisId);
}

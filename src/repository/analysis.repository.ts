/**
 * Analysis repository - Teammate A scope.
 * In-memory store; easily swappable for DB later.
 */

import type { Analysis } from "../types/analysis.types";

const store = new Map<string, Analysis>();

export const analysisRepository = {
  create(analysis: Analysis): Analysis {
    store.set(analysis.analysisId, analysis);
    return analysis;
  },

  getById(analysisId: string): Analysis | null {
    return store.get(analysisId) ?? null;
  },
};

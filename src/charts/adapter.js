/**
 * Minimal adapter to get analysis by id.
 * Uses whatever function is provided by the app (e.g. Teammate A's repository).
 * We do not implement storage; we only call the provided getAnalysisById.
 *
 * @param { (id: string) => Promise<Object | null> | Object | null } getAnalysisById - function that returns analysis or null
 * @returns { Promise<Object | null> }
 */
async function getAnalysis(getAnalysisById, analysisId) {
  const result = await Promise.resolve(getAnalysisById(analysisId));
  return result ?? null;
}

module.exports = { getAnalysis };

/**
 * Similar controller — GET /analyses/{analysisId}/similar
 * Teammate C (Insights + Similarity). MVP: returns stored analysis.similar only.
 * No real similarity search unless explicitly requested.
 */

/** Default aggregate when analysis.similar is missing (per contract). */
const DEFAULT_AGGREGATE = {
  count: 0,
  comebackRate: 0,
  avgWinProbDelta: 0,
  avgPlayerPointsInWindow: 0,
};

/**
 * Get the similar response for an analysis.
 * Returns stored analysis.similar if present with valid shape; otherwise
 * returns { items: [], aggregate: { count: 0, comebackRate: 0, avgWinProbDelta: 0, avgPlayerPointsInWindow: 0 } }.
 * Does not mutate the stored object.
 *
 * @param {object} analysis - Stored Analysis object
 * @returns {object} Response body: { items, aggregate }
 */
function getSimilar(analysis) {
  const similar = analysis && analysis.similar;
  if (similar && typeof similar === 'object') {
    const items = Array.isArray(similar.items) ? similar.items : [];
    const aggregate =
      similar.aggregate && typeof similar.aggregate === 'object'
        ? {
            count: typeof similar.aggregate.count === 'number' ? similar.aggregate.count : 0,
            comebackRate: typeof similar.aggregate.comebackRate === 'number' ? similar.aggregate.comebackRate : 0,
            avgWinProbDelta: typeof similar.aggregate.avgWinProbDelta === 'number' ? similar.aggregate.avgWinProbDelta : 0,
            avgPlayerPointsInWindow:
              typeof similar.aggregate.avgPlayerPointsInWindow === 'number' ? similar.aggregate.avgPlayerPointsInWindow : 0,
          }
        : DEFAULT_AGGREGATE;
    return { items, aggregate };
  }
  return {
    items: [],
    aggregate: { ...DEFAULT_AGGREGATE },
  };
}

/**
 * Express-style handler for GET /analyses/:analysisId/similar.
 * Expects req.analysis to be set by upstream middleware.
 * Responds 404 if analysis is missing, 200 with body otherwise.
 *
 * @param {object} req - Express req (req.analysis, req.params)
 * @param {object} res - Express res
 * @param {function} next - Express next
 */
function handleGetSimilar(req, res, next) {
  const analysis = req.analysis;
  if (!analysis) {
    return res.status(404).json({ error: 'Analysis not found', analysisId: req.params.analysisId });
  }
  try {
    const body = getSimilar(analysis);
    res.status(200).json(body);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getSimilar,
  handleGetSimilar,
  DEFAULT_AGGREGATE,
};

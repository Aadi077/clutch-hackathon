/**
 * Threshold utilities for Teammate C (Insights + Similarity).
 * Used only by insights.controller for turning point computation.
 */

/** Default win-probability delta threshold when not in params (per contract). */
const DEFAULT_TURNING_POINT_THRESHOLD = 0.05;

/**
 * Get the turning point threshold for an analysis.
 * Reads from analysis.params.turningPointThreshold; falls back to default.
 * @param {object} analysis - Stored Analysis object (may have params)
 * @returns {number} Threshold (>= this winProbDelta counts as turning point)
 */
function getTurningPointThreshold(analysis) {
  const params = analysis && analysis.params;
  if (params && typeof params.turningPointThreshold === 'number') {
    return params.turningPointThreshold;
  }
  return DEFAULT_TURNING_POINT_THRESHOLD;
}

module.exports = {
  getTurningPointThreshold,
  DEFAULT_TURNING_POINT_THRESHOLD,
};

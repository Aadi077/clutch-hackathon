/**
 * Insights controller — GET /analyses/{analysisId}/turningPoints
 * Teammate C (Insights + Similarity). Reads only from stored Analysis; never mutates.
 */

const { getTurningPointThreshold } = require('../utils/threshold.utils');

/**
 * Build a turning point entry from an event (for computed turning points).
 * @param {object} event - From analysis.events (has eventId, t, winProbDelta, type/subtype/description)
 * @returns {object} { eventId, t, winProbDelta, label }
 */
function turningPointFromEvent(event) {
  const label =
    event.label ??
    event.description ??
    (event.subtype || event.type || 'Event');
  return {
    eventId: event.eventId,
    t: event.t,
    winProbDelta: event.winProbDelta,
    label: String(label),
  };
}

/**
 * Compute turning points from analysis.events using threshold.
 * Filters by winProbDelta >= threshold, sorts by winProbDelta DESC.
 * @param {object} analysis - Stored Analysis object
 * @returns {Array<object>} Sorted array of { eventId, t, winProbDelta, label }
 */
function computeTurningPointsFromEvents(analysis) {
  const events = analysis && Array.isArray(analysis.events) ? analysis.events : [];
  const threshold = getTurningPointThreshold(analysis);

  const points = events
    .filter((e) => typeof e.winProbDelta === 'number' && e.winProbDelta >= threshold)
    .map(turningPointFromEvent);

  points.sort((a, b) => (b.winProbDelta !== a.winProbDelta ? b.winProbDelta - a.winProbDelta : (a.t ?? 0) - (b.t ?? 0)));
  return points;
}

/**
 * Get turning points for an analysis.
 * Uses analysis.turningPoints if present; otherwise computes from analysis.events.
 * Always returns a consistent shape; never mutates the stored object.
 *
 * @param {object} analysis - Stored Analysis object (from store; not modified)
 * @returns {object} Response body: { apiVersion, items } with items sorted by winProbDelta DESC
 */
function getTurningPoints(analysis) {
  const stored = analysis && Array.isArray(analysis.turningPoints) ? analysis.turningPoints : null;
  const items = stored
    ? [...stored].sort((a, b) => (b.winProbDelta !== a.winProbDelta ? (b.winProbDelta ?? 0) - (a.winProbDelta ?? 0) : (a.t ?? 0) - (b.t ?? 0)))
    : computeTurningPointsFromEvents(analysis);

  return {
    apiVersion: 'v1',
    items,
  };
}

/**
 * Express-style handler for GET /analyses/:analysisId/turningPoints.
 * Expects req.analysis to be set by upstream middleware (e.g. load analysis by id).
 * Responds 404 if analysis is missing, 200 with body otherwise.
 *
 * @param {object} req - Express req (req.analysis, req.params, req.query)
 * @param {object} res - Express res
 * @param {function} next - Express next
 */
function handleGetTurningPoints(req, res, next) {
  const analysis = req.analysis;
  if (!analysis) {
    return res.status(404).json({ error: 'Analysis not found', analysisId: req.params.analysisId });
  }
  try {
    const body = getTurningPoints(analysis);
    res.status(200).json(body);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getTurningPoints,
  handleGetTurningPoints,
  computeTurningPointsFromEvents,
  turningPointFromEvent,
};

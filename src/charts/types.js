/**
 * Types for charts endpoint (Teammate B — charts owner).
 * Kept local to charts/ to avoid changing shared contracts.
 */

/**
 * @typedef {{ t: number, v: number }} SeriesPoint
 */

/**
 * @typedef {Object} ChartSeriesMeta
 * @property {string} analysisId
 * @property {string} metric
 * @property {number} [intervalSec]
 * @property {number} [window]
 * @property {number} count
 */

/**
 * @typedef {Object} ChartSeriesResponse
 * @property {string} apiVersion
 * @property {ChartSeriesMeta} meta
 * @property {SeriesPoint[]} points
 */

module.exports = {};

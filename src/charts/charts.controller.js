/**
 * Charts controller — GET /analyses/:analysisId/charts/winProbability
 * Teammate B — charts owner. Reads analysis via provided getAnalysisById; returns ChartSeriesResponse.
 */

const { getAnalysis } = require('./adapter');
const { resampleSeries } = require('./resampleSeries');

const API_VERSION = 'v1';
const METRIC = 'winProbability';

/**
 * Parse and validate optional positive integer query param.
 * @param {string|undefined} raw
 * @returns {{ valid: boolean, value?: number, status?: number, message?: string }}
 */
function parsePositiveInt(raw) {
  if (raw === undefined || raw === '') return { valid: true };
  const n = Number(raw);
  if (Number.isNaN(n) || n <= 0 || Math.floor(n) !== n) {
    return { valid: false, status: 400, message: 'Must be a positive integer' };
  }
  return { valid: true, value: n };
}

/**
 * Build ChartSeriesResponse for winProbability.
 * @param {string} analysisId
 * @param {Array<{ t: number, v: number }>} points - will be sorted by t
 * @param {{ intervalSec?: number, window?: number }} options
 */
function buildResponse(analysisId, points, options = {}) {
  let result = Array.isArray(points) ? [...points] : [];
  result.sort((a, b) => a.t - b.t);

  const intervalSec = options.intervalSec;
  if (intervalSec != null && intervalSec > 0) {
    result = resampleSeries(result, intervalSec);
  }

  const meta = {
    analysisId,
    metric: METRIC,
    count: result.length,
  };
  if (intervalSec != null) meta.intervalSec = intervalSec;
  if (options.window != null) meta.window = options.window;

  return {
    apiVersion: API_VERSION,
    meta,
    points: result,
  };
}

/**
 * Register charts routes on the given router. getAnalysisById is provided by the app (e.g. from Teammate A's repository).
 *
 * @param {import('express').Router} router
 * @param {(id: string) => Promise<Object|null>|Object|null} getAnalysisById
 */
function registerChartsRoutes(router, getAnalysisById) {
  router.get(
    '/:analysisId/charts/winProbability',
    async (req, res) => {
      const { analysisId } = req.params;
      const windowRaw = req.query.window;
      const intervalRaw = req.query.interval;

      const windowResult = parsePositiveInt(windowRaw);
      if (!windowResult.valid) {
        return res.status(windowResult.status).json({
          apiVersion: API_VERSION,
          error: { code: 'BAD_REQUEST', message: `Invalid window: ${windowResult.message}` },
        });
      }
      const intervalResult = parsePositiveInt(intervalRaw);
      if (!intervalResult.valid) {
        return res.status(intervalResult.status).json({
          apiVersion: API_VERSION,
          error: { code: 'BAD_REQUEST', message: `Invalid interval: ${intervalResult.message}` },
        });
      }

      const analysis = await getAnalysis(getAnalysisById, analysisId);
      if (!analysis) {
        return res.status(404).json({
          apiVersion: API_VERSION,
          error: { code: 'NOT_FOUND', message: 'Analysis not found' },
        });
      }

      const series = analysis.series;
      const points = series && Array.isArray(series.winProbability) ? series.winProbability : [];

      const response = buildResponse(analysisId, points, {
        intervalSec: intervalResult.value,
        window: windowResult.value,
      });
      return res.json(response);
    }
  );
}

module.exports = { registerChartsRoutes, buildResponse, parsePositiveInt };

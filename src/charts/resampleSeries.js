/**
 * Resample series points to a target interval (seconds).
 * Produces points at intervalSec spacing; preserves first/last timestamps within the data range.
 *
 * @param {Array<{ t: number, v: number }>} points - sorted by t
 * @param {number} intervalSec - target interval in seconds (must be positive)
 * @returns {Array<{ t: number, v: number }>}
 */
function resampleSeries(points, intervalSec) {
  if (!Array.isArray(points) || points.length === 0 || intervalSec <= 0) {
    return [];
  }
  const sorted = [...points].sort((a, b) => a.t - b.t);
  const tMin = sorted[0].t;
  const tMax = sorted[sorted.length - 1].t;
  const out = [];
  for (let t = tMin; t <= tMax; t += intervalSec) {
    const v = interpolate(sorted, t);
    out.push({ t, v });
  }
  return out;
}

/**
 * Linear interpolation at time t given sorted points by t.
 * @param {Array<{ t: number, v: number }>} points
 * @param {number} t
 * @returns {number}
 */
function interpolate(points, t) {
  if (points.length === 0) return 0;
  if (points.length === 1 || t <= points[0].t) return points[0].v;
  if (t >= points[points.length - 1].t) return points[points.length - 1].v;
  let i = 0;
  while (i < points.length - 1 && points[i + 1].t < t) i++;
  const a = points[i];
  const b = points[i + 1];
  const frac = (t - a.t) / (b.t - a.t);
  return a.v + frac * (b.v - a.v);
}

module.exports = { resampleSeries };

/**
 * Unit tests for GET /analyses/:analysisId/charts/winProbability.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const express = require('express');
const { createChartsRouter } = require('../src/charts/router');

function createApp(getAnalysisById) {
  const app = express();
  app.use('/analyses', createChartsRouter(getAnalysisById));
  return app;
}

describe('GET /analyses/:analysisId/charts/winProbability', () => {
  it('returns points sorted', async () => {
    const analysis = {
      series: {
        winProbability: [
          { t: 0, v: 0.18 },
          { t: -300, v: 0.22 },
          { t: 300, v: 0.31 },
        ],
      },
    };
    const getAnalysisById = (id) => (id === 'a_01' ? analysis : null);
    const app = createApp(getAnalysisById);
    const { status, body } = await request(app)
      .get('/analyses/a_01/charts/winProbability');
    assert.strictEqual(status, 200);
    assert.strictEqual(body.meta.analysisId, 'a_01');
    assert.strictEqual(body.meta.metric, 'winProbability');
    assert.strictEqual(body.meta.count, 3);
    assert.strictEqual(body.points[0].t, -300);
    assert.strictEqual(body.points[1].t, 0);
    assert.strictEqual(body.points[2].t, 300);
  });

  it('handles missing series -> empty points', async () => {
    const analysis = { series: {} };
    const getAnalysisById = (id) => (id === 'a_02' ? analysis : null);
    const app = createApp(getAnalysisById);
    const { status, body } = await request(app)
      .get('/analyses/a_02/charts/winProbability');
    assert.strictEqual(status, 200);
    assert.deepStrictEqual(body.points, []);
    assert.strictEqual(body.meta.count, 0);
  });

  it('handles missing series when analysis has no series key', async () => {
    const analysis = {};
    const getAnalysisById = (id) => (id === 'a_noseries' ? analysis : null);
    const app = createApp(getAnalysisById);
    const { status, body } = await request(app)
      .get('/analyses/a_noseries/charts/winProbability');
    assert.strictEqual(status, 200);
    assert.deepStrictEqual(body.points, []);
    assert.strictEqual(body.meta.count, 0);
  });

  it('invalid interval/window -> 400', async () => {
    const getAnalysisById = () => null;
    const app = createApp(getAnalysisById);

    const r1 = await request(app)
      .get('/analyses/a_01/charts/winProbability')
      .query({ interval: '-1' });
    assert.strictEqual(r1.status, 400);
    assert.ok(r1.body.error?.code === 'BAD_REQUEST');

    const r2 = await request(app)
      .get('/analyses/a_01/charts/winProbability')
      .query({ window: 'x' });
    assert.strictEqual(r2.status, 400);
    assert.ok(r2.body.error?.code === 'BAD_REQUEST');

    const r3 = await request(app)
      .get('/analyses/a_01/charts/winProbability')
      .query({ interval: '0' });
    assert.strictEqual(r3.status, 400);
  });

  it('analysis not found -> 404', async () => {
    const getAnalysisById = () => null;
    const app = createApp(getAnalysisById);
    const { status, body } = await request(app)
      .get('/analyses/a_nonexistent/charts/winProbability');
    assert.strictEqual(status, 404);
    assert.strictEqual(body.error?.code, 'NOT_FOUND');
    assert.ok(body.error?.message?.toLowerCase().includes('not found'));
  });

  it('resamples when interval query param provided', async () => {
    const analysis = {
      series: {
        winProbability: [
          { t: 0, v: 0.18 },
          { t: 10, v: 0.2 },
          { t: 20, v: 0.22 },
        ],
      },
    };
    const getAnalysisById = (id) => (id === 'a_resample' ? analysis : null);
    const app = createApp(getAnalysisById);
    const { status, body } = await request(app)
      .get('/analyses/a_resample/charts/winProbability')
      .query({ interval: '5' });
    assert.strictEqual(status, 200);
    assert.strictEqual(body.meta.intervalSec, 5);
    assert.strictEqual(body.points.length, 5);
    assert.strictEqual(body.points[0].t, 0);
    assert.strictEqual(body.points[body.points.length - 1].t, 20);
  });
});

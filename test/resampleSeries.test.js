/**
 * Unit tests for resampleSeries helper.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert');
const { resampleSeries } = require('../src/charts/resampleSeries');

describe('resampleSeries', () => {
  it('resampleSeries produces correct interval spacing', () => {
    const points = [
      { t: 0, v: 1 },
      { t: 10, v: 2 },
      { t: 20, v: 3 },
    ];
    const out = resampleSeries(points, 5);
    assert.ok(Array.isArray(out));
    assert.strictEqual(out.length, 5); // t=0,5,10,15,20
    assert.strictEqual(out[0].t, 0);
    assert.strictEqual(out[1].t, 5);
    assert.strictEqual(out[2].t, 10);
    assert.strictEqual(out[3].t, 15);
    assert.strictEqual(out[4].t, 20);
    assert.strictEqual(out[0].v, 1);
    assert.strictEqual(out[2].v, 2);
    assert.strictEqual(out[4].v, 3);
  });

  it('resampleSeries preserves first/last timestamps within window', () => {
    const points = [
      { t: -300, v: 0.22 },
      { t: 0, v: 0.18 },
      { t: 300, v: 0.31 },
    ];
    const out = resampleSeries(points, 100);
    assert.ok(out.length >= 2);
    assert.strictEqual(out[0].t, -300);
    assert.strictEqual(out[out.length - 1].t, 300);
    assert.strictEqual(out[0].v, 0.22);
    assert.strictEqual(out[out.length - 1].v, 0.31);
  });

  it('returns empty array for empty points', () => {
    assert.deepStrictEqual(resampleSeries([], 5), []);
  });

  it('returns empty array for invalid interval', () => {
    assert.deepStrictEqual(resampleSeries([{ t: 0, v: 1 }], 0), []);
    assert.deepStrictEqual(resampleSeries([{ t: 0, v: 1 }], -1), []);
  });
});

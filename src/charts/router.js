/**
 * Charts router factory. Mount at /analyses (so GET /analyses/:analysisId/charts/winProbability).
 * getAnalysisById must be provided by the app (e.g. Teammate A's repository).
 */

const express = require('express');
const { registerChartsRoutes } = require('./charts.controller');

/**
 * @param {(id: string) => Promise<Object|null>|Object|null} getAnalysisById
 * @returns {import('express').Router}
 */
function createChartsRouter(getAnalysisById) {
  const router = express.Router({ mergeParams: true });
  registerChartsRoutes(router, getAnalysisById);
  return router;
}

module.exports = { createChartsRouter };

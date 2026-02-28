/**
 * Analysis routes - Teammate A scope.
 * A: POST /analyses, GET /analyses/:analysisId
 * B/C: placeholders only (501)
 */

import { Router } from "express";
import { postAnalyses, getAnalysis } from "../controllers/analysis.controller";
import { getAnalysisById } from "../services/analysis.service";
const { createChartsRouter } = require("../charts/router");

const router = Router();

// --- Teammate A: implemented ---
router.post("/", postAnalyses);

// --- Teammate B: charts winProbability (must be before :analysisId) ---
router.use("/", createChartsRouter(getAnalysisById));

// --- Owned by Teammate C: placeholders ---
router.get("/:analysisId/turningPoints", (_req, res) => {
  res.status(501).json({ error: "Not Implemented", ownedBy: "Teammate C" });
});
router.get("/:analysisId/similar", (_req, res) => {
  res.status(501).json({ error: "Not Implemented", ownedBy: "Teammate C" });
});

// --- Teammate A: implemented (after more specific routes) ---
router.get("/:analysisId", getAnalysis);

export default router;

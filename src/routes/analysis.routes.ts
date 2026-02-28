/**
 * Analysis routes - Teammate A scope.
 * A: POST /analyses, GET /analyses/:analysisId
 * B/C: placeholders only (501)
 */

import { Router } from "express";
import { postAnalyses, getAnalysis } from "../controllers/analysis.controller";

const router = Router();

// --- Teammate A: implemented ---
router.post("/", postAnalyses);

// --- Owned by Teammate B: placeholder (must be before :analysisId) ---
router.get("/:analysisId/charts/winProbability", (_req, res) => {
  res.status(501).json({ error: "Not Implemented", ownedBy: "Teammate B" });
});

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

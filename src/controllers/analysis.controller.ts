/**
 * Analysis controller - Teammate A scope.
 * POST /analyses, GET /analyses/:analysisId
 */

import { Request, Response } from "express";
import { createAnalysisSchema } from "../validation/createAnalysis.schema";
import { createAnalysis, getAnalysisById } from "../services/analysis.service";

export function postAnalyses(req: Request, res: Response): void {
  const parsed = createAnalysisSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: "Bad request",
      details: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  const result = createAnalysis(parsed.data);
  res.status(201).json(result);
}

export function getAnalysis(req: Request, res: Response): void {
  const { analysisId } = req.params;
  const analysis = getAnalysisById(analysisId);
  if (!analysis) {
    res.status(404).json({ error: "Not found", analysisId });
    return;
  }
  res.json(analysis);
}

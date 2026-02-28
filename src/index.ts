/**
 * Clutch API - Entry point.
 * Teammate A: POST /analyses, GET /analyses/:analysisId
 */

import express from "express";
import analysisRoutes from "./routes/analysis.routes";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());
app.use("/analyses", analysisRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Clutch API listening on http://localhost:${PORT}`);
});

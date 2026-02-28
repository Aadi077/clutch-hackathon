/**
 * Minimal app entry. Registers charts route only.
 * getAnalysisById is a stub until Teammate A provides repository; replace when available.
 */

const express = require('express');
const { createChartsRouter } = require('./charts/router');

const app = express();
app.use(express.json());

// Stub: replace with Teammate A's repository when available.
function getAnalysisById(/* id */) {
  return null;
}

app.use('/analyses', createChartsRouter(getAnalysisById));

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;

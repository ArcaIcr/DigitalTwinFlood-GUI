import { Router } from 'express';
import { getRainfall, getSimulation } from '../data/simulation.js';

const router = Router();

// GET /api/telemetry/rainfall
router.get('/rainfall', (req, res) => {
  try {
    const rainfall = getRainfall();
    res.json(rainfall);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rainfall data' });
  }
});

// GET /api/telemetry/simulation
router.get('/simulation', (req, res) => {
  try {
    const simulation = getSimulation();
    res.json(simulation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch simulation data' });
  }
});

export default router;

import { Router } from 'express';
import { getRainfall, getSimulation, updateRainfall } from '../data/simulation.js';

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

// POST /api/telemetry/sensor-data - For ESP32 nodes to send sensor data
router.post('/sensor-data', (req, res) => {
  try {
    const { intensity_mmhr, node_id } = req.body;

    if (typeof intensity_mmhr !== 'number') {
      return res.status(400).json({ error: 'Invalid intensity value' });
    }

    // Update rainfall data with sensor reading
    const updatedRainfall = updateRainfall(intensity_mmhr);
    
    res.json({
      success: true,
      rainfall: updatedRainfall,
      node_id: node_id || 'unknown',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process sensor data' });
  }
});

export default router;

import { Router } from 'express';
import { getThresholds, updateThresholds, getRainfallHistory, getSimulation, getNodes } from '../data/simulation.js';

const router = Router();

// GET /api/admin/thresholds
router.get('/thresholds', (req, res) => {
  try {
    const thresholds = getThresholds();
    res.json(thresholds);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch thresholds' });
  }
});

// PUT /api/admin/thresholds
router.put('/thresholds', (req, res) => {
  try {
    const { moderate_threshold, high_threshold } = req.body;

    if (typeof moderate_threshold !== 'number' || typeof high_threshold !== 'number') {
      return res.status(400).json({ error: 'Invalid threshold values' });
    }

    if (moderate_threshold >= high_threshold) {
      return res.status(400).json({ error: 'Moderate threshold must be less than high threshold' });
    }

    if (moderate_threshold < 0 || high_threshold < 0) {
      return res.status(400).json({ error: 'Thresholds must be positive' });
    }

    const updatedThresholds = updateThresholds({ moderate_threshold, high_threshold });
    res.json(updatedThresholds);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update thresholds' });
  }
});

// GET /api/admin/report
router.get('/report', (req, res) => {
  try {
    const format = (req.query.format as string) || 'json';
    
    const report = {
      generated_at: new Date().toISOString(),
      thresholds: getThresholds(),
      current_simulation: getSimulation(),
      current_nodes: getNodes(),
      rainfall_history: getRainfallHistory(),
      summary: {
        total_readings: getRainfallHistory().length,
        average_intensity: getRainfallHistory().length > 0 
          ? getRainfallHistory().reduce((sum, log) => sum + log.intensity_mmhr, 0) / getRainfallHistory().length 
          : 0,
        max_intensity: getRainfallHistory().length > 0 
          ? Math.max(...getRainfallHistory().map(log => log.intensity_mmhr)) 
          : 0,
        active_nodes: getNodes().filter(n => n.status === 'Active').length,
        total_nodes: getNodes().length,
      }
    };

    if (format === 'json') {
      res.json(report);
    } else if (format === 'csv') {
      // Generate CSV for rainfall history
      const csvHeader = 'Timestamp,Intensity (mm/hr),Synced\n';
      const csvRows = getRainfallHistory()
        .map(log => `${log.timestamp},${log.intensity_mmhr},${log.is_synced}`)
        .join('\n');
      const csv = csvHeader + csvRows;
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="flood-report-${Date.now()}.csv"`);
      res.send(csv);
    } else {
      res.status(400).json({ error: 'Invalid format. Use "json" or "csv"' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

export default router;

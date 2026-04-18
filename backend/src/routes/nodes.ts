import { Router } from 'express';
import { getNodes, updateNodeStatus } from '../data/simulation.js';

const router = Router();

// GET /api/nodes
router.get('/', (req, res) => {
  try {
    const nodes = getNodes();
    res.json(nodes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch nodes' });
  }
});

// POST /api/nodes/:id/status
router.post('/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || (status !== 'Active' && status !== 'Offline')) {
      return res.status(400).json({ error: 'Invalid status. Must be "Active" or "Offline"' });
    }

    const updatedNode = updateNodeStatus(id, status);
    if (!updatedNode) {
      return res.status(404).json({ error: 'Node not found' });
    }

    res.json(updatedNode);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update node status' });
  }
});

export default router;

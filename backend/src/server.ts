import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import telemetryRoutes from './routes/telemetry.js';
import nodesRoutes from './routes/nodes.js';
import adminRoutes from './routes/admin.js';
import authRoutes from './routes/auth.js';
import { startRainfallSimulation, startNodeSimulation } from './data/simulation.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/nodes', nodesRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start simulations (remove in production when using real data)
startRainfallSimulation();
startNodeSimulation();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints:`);
  console.log(`   POST /api/auth/register`);
  console.log(`   POST /api/auth/login`);
  console.log(`   GET  /api/telemetry/rainfall`);
  console.log(`   GET  /api/telemetry/simulation`);
  console.log(`   POST /api/telemetry/sensor-data`);
  console.log(`   GET  /api/nodes`);
  console.log(`   POST /api/nodes/:id/status`);
  console.log(`   GET  /api/admin/thresholds (requires auth)`);
  console.log(`   PUT  /api/admin/thresholds (requires auth)`);
  console.log(`   GET  /api/admin/report?format=json|csv (requires auth)`);
  console.log(`\nDefault admin credentials: username=admin, password=admin123`);
});

import type { RainfallLog, FloodSimulation, IoTNode, RiskThresholds } from '../types.js';

// In-memory data store (replace with database in production)
let rainfallData: RainfallLog = {
  intensity_mmhr: 0,
  timestamp: new Date().toISOString(),
  is_synced: true,
};

let simulationData: FloodSimulation = {
  calculated_volume: 0,
  risk_level: 'Low',
  last_updated: new Date().toISOString(),
};

let nodesData: IoTNode[] = [
  { id: 'ESP32-01', location: 'Main Drainage', status: 'Active', last_seen: new Date().toISOString() },
  { id: 'ESP32-02', location: 'Science Complex', status: 'Active', last_seen: new Date().toISOString() },
  { id: 'ESP32-03', location: 'Library Walkway', status: 'Offline', last_seen: new Date(Date.now() - 3600000).toISOString() },
];

let riskThresholds: RiskThresholds = {
  moderate_threshold: 20,
  high_threshold: 50,
};

// Simulation parameters
const RUNOFF_COEFFICIENT = 0.8; // Concrete runoff coefficient
const AREA_SQM = 5000; // Estimated campus area

export function getRainfall(): RainfallLog {
  return rainfallData;
}

export function updateRainfall(intensity: number): RainfallLog {
  rainfallData = {
    intensity_mmhr: Number(intensity.toFixed(2)),
    timestamp: new Date().toISOString(),
    is_synced: true,
  };

  // Add to history for reports
  addToRainfallHistory(rainfallData);

  // Trigger flood simulation update
  updateFloodSimulation();

  return rainfallData;
}

export function getSimulation(): FloodSimulation {
  return simulationData;
}

function updateFloodSimulation(): void {
  // Rational Method calculation: V = C * I * A * dt
  // Simplified: incremental volume correlated to intensity
  const newVolume = simulationData.calculated_volume + (RUNOFF_COEFFICIENT * rainfallData.intensity_mmhr * 0.001 * AREA_SQM);
  
  let risk: 'Low' | 'Moderate' | 'High' = 'Low';
  if (rainfallData.intensity_mmhr > riskThresholds.high_threshold) risk = 'High';
  else if (rainfallData.intensity_mmhr > riskThresholds.moderate_threshold) risk = 'Moderate';

  simulationData = {
    calculated_volume: Number(newVolume.toFixed(2)),
    risk_level: risk,
    last_updated: new Date().toISOString(),
  };
}

export function getThresholds(): RiskThresholds {
  return riskThresholds;
}

export function updateThresholds(thresholds: RiskThresholds): RiskThresholds {
  riskThresholds = {
    moderate_threshold: thresholds.moderate_threshold,
    high_threshold: thresholds.high_threshold,
  };
  
  // Recalculate simulation with new thresholds
  updateFloodSimulation();
  
  return riskThresholds;
}

// Historical data for reports
let rainfallHistory: RainfallLog[] = [];

export function getRainfallHistory(): RainfallLog[] {
  return rainfallHistory;
}

export function addToRainfallHistory(log: RainfallLog): void {
  rainfallHistory.push(log);
  // Keep last 100 entries
  if (rainfallHistory.length > 100) {
    rainfallHistory = rainfallHistory.slice(-100);
  }
}

export function getNodes(): IoTNode[] {
  return nodesData;
}

export function updateNodeStatus(nodeId: string, status: 'Active' | 'Offline'): IoTNode | null {
  const nodeIndex = nodesData.findIndex(n => n.id === nodeId);
  if (nodeIndex === -1) return null;

  nodesData[nodeIndex] = {
    ...nodesData[nodeIndex],
    status,
    last_seen: new Date().toISOString(),
  };

  return nodesData[nodeIndex];
}

// Simulate real-time rainfall updates (replace with actual sensor data in production)
export function startRainfallSimulation(): void {
  setInterval(() => {
    const currentIntensity = rainfallData.intensity_mmhr;
    const newIntensity = Math.max(0, currentIntensity + (Math.random() * 10 - 5));
    updateRainfall(newIntensity);
  }, 3000);
}

// Simulate node status changes (replace with actual IoT heartbeat in production)
export function startNodeSimulation(): void {
  setInterval(() => {
    nodesData = nodesData.map(node => {
      if (Math.random() < 0.05) {
        return {
          ...node,
          status: node.status === 'Active' ? 'Offline' : 'Active',
          last_seen: new Date().toISOString(),
        };
      }
      return {
        ...node,
        last_seen: node.status === 'Active' ? new Date().toISOString() : node.last_seen,
      };
    });
  }, 10000);
}

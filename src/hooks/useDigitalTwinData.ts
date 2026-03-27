import { useState, useEffect } from 'react';
import type { RainfallLog, FloodSimulation, IoTNode } from '../types/schema';

export const useDigitalTwinData = () => {
  const [rainfall, setRainfall] = useState<RainfallLog>({
    intensity_mmhr: 0,
    timestamp: new Date().toISOString(),
    is_synced: true,
  });

  const [simulation, setSimulation] = useState<FloodSimulation>({
    calculated_volume: 0,
    risk_level: 'Low',
    last_updated: new Date().toISOString(),
  });

  const [nodes, setNodes] = useState<IoTNode[]>([
    { id: 'ESP32-01', location: 'Main Drainage', status: 'Active', last_seen: new Date().toISOString() },
    { id: 'ESP32-02', location: 'Science Complex', status: 'Active', last_seen: new Date().toISOString() },
    { id: 'ESP32-03', location: 'Library Walkway', status: 'Offline', last_seen: new Date(Date.now() - 3600000).toISOString() },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time rainfall data pulse
      setRainfall(prev => {
        const newIntensity = Math.max(0, prev.intensity_mmhr + (Math.random() * 10 - 5));
        return {
          intensity_mmhr: Number(newIntensity.toFixed(2)),
          timestamp: new Date().toISOString(),
          is_synced: true,
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Rational Method calculation: V = C * I * A * dt
    // Simplified for demonstration: incremental volume correlated to intensity
    const C = 0.8; // Concrete runoff coefficient
    const A = 5000; // estimated sqm
    
    // incremental volume every update
    const newVolume = simulation.calculated_volume + (C * rainfall.intensity_mmhr * 0.001 * A);
    let risk: 'Low' | 'Moderate' | 'High' = 'Low';
    
    if (rainfall.intensity_mmhr > 50) risk = 'High';
    else if (rainfall.intensity_mmhr > 20) risk = 'Moderate';

    setSimulation({
      calculated_volume: Number(newVolume.toFixed(2)),
      risk_level: risk,
      last_updated: new Date().toISOString(),
    });

  }, [rainfall]); // Dependency on rainfall updates

  useEffect(() => {
    const nodeInterval = setInterval(() => {
      // Randomly drop or reconnect a node occasionally to demonstrate diagnostic tracking
      setNodes(prev => prev.map(node => {
        if (Math.random() < 0.05) {
          return { 
            ...node, 
            status: node.status === 'Active' ? 'Offline' : 'Active', 
            last_seen: new Date().toISOString() 
          };
        }
        return { 
          ...node, 
          last_seen: node.status === 'Active' ? new Date().toISOString() : node.last_seen 
        };
      }));
    }, 10000);

    return () => clearInterval(nodeInterval);
  }, []);

  return { rainfall, simulation, nodes };
};

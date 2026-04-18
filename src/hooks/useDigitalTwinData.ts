import { useState, useEffect } from 'react';
import type { RainfallLog, FloodSimulation, IoTNode } from '../types/schema';

const API_BASE_URL = 'http://localhost:3001/api';

export const useDigitalTwinData = () => {
  const [rainfall, setRainfall] = useState<RainfallLog | null>(null);
  const [simulation, setSimulation] = useState<FloodSimulation | null>(null);
  const [nodes, setNodes] = useState<IoTNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch rainfall data
  const fetchRainfall = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/telemetry/rainfall`);
      if (!response.ok) throw new Error('Failed to fetch rainfall data');
      const data = await response.json();
      setRainfall(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  // Fetch simulation data
  const fetchSimulation = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/telemetry/simulation`);
      if (!response.ok) throw new Error('Failed to fetch simulation data');
      const data = await response.json();
      setSimulation(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  // Fetch nodes data
  const fetchNodes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/nodes`);
      if (!response.ok) throw new Error('Failed to fetch nodes');
      const data = await response.json();
      setNodes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  // Initial fetch and polling
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchRainfall(), fetchSimulation(), fetchNodes()]);
      setIsLoading(false);
    };

    fetchData();

    // Poll for updates every 3 seconds
    const interval = setInterval(() => {
      fetchRainfall();
      fetchSimulation();
    }, 3000);

    // Poll nodes less frequently (every 10 seconds)
    const nodeInterval = setInterval(() => {
      fetchNodes();
    }, 10000);

    return () => {
      clearInterval(interval);
      clearInterval(nodeInterval);
    };
  }, []);

  return { rainfall, simulation, nodes, isLoading, error };
};

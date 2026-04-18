export interface RainfallLog {
  intensity_mmhr: number;
  timestamp: string;
  is_synced: boolean;
}

export interface CampusZone {
  id: string;
  name: string;
  runoff_coefficient: number;
  area_sqm: number;
}

export interface FloodSimulation {
  calculated_volume: number;
  risk_level: 'Low' | 'Moderate' | 'High';
  last_updated: string;
}

export interface IoTNode {
  id: string;
  location: string;
  status: 'Active' | 'Offline';
  last_seen: string;
}

export interface RiskThresholds {
  moderate_threshold: number; // mm/hr
  high_threshold: number; // mm/hr
}

import { CloudRain, Droplets, Clock } from 'lucide-react';
import type { RainfallLog, FloodSimulation } from '../types/schema';

interface TelemetryPanelProps {
  rainfall: RainfallLog;
  simulation: FloodSimulation;
}

const TelemetryPanel = ({ rainfall, simulation }: TelemetryPanelProps) => {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 overflow-hidden flex flex-col">
      <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-800 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <CloudRain className="w-4 h-4 text-blue-400" />
          Live Telemetry
        </h3>
        {rainfall.is_synced && (
          <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-emerald-500 tracking-wider">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            Synced
          </span>
        )}
      </div>
      
      <div className="p-4 flex flex-col gap-4">
        {/* Rainfall Intensity */}
        <div className="flex justify-between items-end">
          <div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Rainfall Intensity</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-bold font-mono text-slate-100">{rainfall.intensity_mmhr}</span>
              <span className="text-xs text-slate-500 font-mono">mm/hr</span>
            </div>
          </div>
          <div className="h-8 w-8 rounded bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <CloudRain className="w-4 h-4 text-blue-400" />
          </div>
        </div>

        <div className="h-px bg-slate-800 w-full" />

        {/* Calculated Volume */}
        <div className="flex justify-between items-end">
          <div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Est. Runoff Volume</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold font-mono text-blue-400">{simulation.calculated_volume.toLocaleString()}</span>
              <span className="text-xs text-slate-500 font-mono">m³</span>
            </div>
          </div>
          <div className="h-8 w-8 rounded bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
            <Droplets className="w-4 h-4 text-cyan-400" />
          </div>
        </div>

        <div className="mt-2 text-[10px] text-slate-500 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Last packet: {new Date(rainfall.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default TelemetryPanel;

import { Activity, Wifi, WifiOff } from 'lucide-react';
import type { IoTNode } from '../types/schema';

interface IoTMonitorProps {
  nodes: IoTNode[];
}

const IoTMonitor = ({ nodes }: IoTMonitorProps) => {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 overflow-hidden flex flex-col">
      <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-800 flex items-center gap-2">
        <Activity className="w-4 h-4 text-emerald-400" />
        <h3 className="text-sm font-semibold text-slate-200">Field Node Diagnostics</h3>
      </div>
      
      <div className="flex flex-col">
        {nodes.map((node, index) => (
          <div 
            key={node.id} 
            className={`px-4 py-3 flex items-center justify-between ${index !== nodes.length - 1 ? 'border-b border-slate-800/50' : ''}`}
          >
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-300 font-mono">{node.id}</span>
              <span className="text-[11px] text-slate-500">{node.location}</span>
            </div>
            <div className="flex flex-col items-end gap-1">
              {node.status === 'Active' ? (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <Wifi className="w-3.5 h-3.5" />
                  Online
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <WifiOff className="w-3.5 h-3.5" />
                  Offline
                </div>
              )}
              <span className="text-[10px] text-slate-600 font-mono">
                {new Date(node.last_seen).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IoTMonitor;

import TelemetryPanel from './TelemetryPanel';
import IoTMonitor from './IoTMonitor';
import AdminControls from './AdminControls';
import type { RainfallLog, FloodSimulation, IoTNode } from '../types/schema';

interface SidebarProps {
  rainfall: RainfallLog;
  simulation: FloodSimulation;
  nodes: IoTNode[];
}

const Sidebar = ({ rainfall, simulation, nodes }: SidebarProps) => {
  return (
    <aside className="w-full lg:w-[360px] xl:w-[400px] flex flex-col lg:h-full bg-slate-950 lg:border-l border-slate-800 shrink-0 shadow-xl z-20 pb-8 lg:pb-0">
      <div className="p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-10">
        <h2 className="font-semibold text-slate-200 tracking-tight">System Dashboard</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 custom-scrollbar">
        <TelemetryPanel rainfall={rainfall} simulation={simulation} />
        <IoTMonitor nodes={nodes} />
        <AdminControls />
      </div>
    </aside>
  );
};

export default Sidebar;

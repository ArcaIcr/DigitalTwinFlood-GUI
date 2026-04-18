import Header from './components/Header'
import WebGLCanvas from './components/WebGLCanvas'
import Sidebar from './components/Sidebar'
import { useDigitalTwinData } from './hooks/useDigitalTwinData'

function App() {
  const { rainfall, simulation, nodes, isLoading, error } = useDigitalTwinData();

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-950 text-slate-200">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading Digital Twin...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-950 text-slate-200">
        <div className="text-center">
          <p className="text-red-400 mb-2">Error loading data</p>
          <p className="text-slate-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!rainfall || !simulation) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-950 text-slate-200">
        <p className="text-slate-400">Waiting for data...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-200 font-sans overflow-x-hidden overflow-y-auto lg:overflow-hidden">
      <Header riskLevel={simulation.risk_level} />
      <div className="flex-1 flex flex-col lg:flex-row relative">
        <main className="flex-1 min-h-[50vh] lg:min-h-0 relative p-4 lg:p-6 bg-slate-900/50 shadow-[inset_0_0_80px_rgba(0,0,0,0.5)] flex flex-col border-b lg:border-b-0 border-slate-800">
          <WebGLCanvas />
        </main>
        <Sidebar rainfall={rainfall} simulation={simulation} nodes={nodes} />
      </div>
    </div>
  )
}

export default App

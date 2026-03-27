import Header from './components/Header'
import WebGLCanvas from './components/WebGLCanvas'
import Sidebar from './components/Sidebar'
import { useDigitalTwinData } from './hooks/useDigitalTwinData'

function App() {
  const { rainfall, simulation, nodes } = useDigitalTwinData();

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

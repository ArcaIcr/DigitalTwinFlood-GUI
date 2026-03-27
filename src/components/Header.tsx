export const Header = ({ riskLevel }: { riskLevel: 'Low' | 'Moderate' | 'High' }) => {
  const getBadgeColor = () => {
    switch (riskLevel) {
      case 'High': return 'bg-red-900/50 text-red-400 border-red-800';
      case 'Moderate': return 'bg-amber-900/50 text-amber-400 border-amber-800';
      case 'Low':
      default: return 'bg-emerald-900/50 text-emerald-400 border-emerald-800';
    }
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-950 shrink-0">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
          <span className="font-bold text-blue-400">USTP</span>
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-100">CDO Flood Digital Twin</h1>
          <p className="text-xs text-slate-400">Process 4.0 IoT Analytics</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-slate-400">Global Risk Status:</span>
        <div className={`px-4 py-1.5 rounded-full text-sm font-bold border flex items-center gap-2 ${getBadgeColor()}`}>
          <div className={`w-2 h-2 rounded-full ${riskLevel === 'High' ? 'bg-red-500 animate-pulse' : riskLevel === 'Moderate' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
          {riskLevel.toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default Header;

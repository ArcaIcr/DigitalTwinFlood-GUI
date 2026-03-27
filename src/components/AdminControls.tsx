import { FileText, Settings2 } from 'lucide-react';

const AdminControls = () => {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 overflow-hidden flex flex-col">
      <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-800">
        <h3 className="text-sm font-semibold text-slate-200">Administrator Actions</h3>
      </div>
      
      <div className="p-4 flex flex-col gap-3">
        <button className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-md transition-colors shadow-sm cursor-pointer">
          <FileText className="w-4 h-4" />
          Generate Planning Report
        </button>
        
        <button className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-md border border-slate-700 transition-colors cursor-pointer">
          <Settings2 className="w-4 h-4" />
          Configure Risk Thresholds
        </button>
      </div>
    </div>
  );
};

export default AdminControls;

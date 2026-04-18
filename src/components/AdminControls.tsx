import { Settings2, Download, X, Lock } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface RiskThresholds {
  moderate_threshold: number;
  high_threshold: number;
}

const AdminControls = () => {
  const { token, isAuthenticated, isAdmin } = useAuth();
  const [showThresholdDialog, setShowThresholdDialog] = useState(false);
  const [thresholds, setThresholds] = useState<RiskThresholds>({
    moderate_threshold: 20,
    high_threshold: 50,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleGenerateReport = async (format: 'json' | 'csv') => {
    try {
      const response = await fetch(`http://localhost:3001/api/admin/report?format=${format}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to generate report');
      
      if (format === 'csv') {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `flood-report-${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `flood-report-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
      alert('Failed to generate report - authentication required');
    }
  };

  const handleLoadThresholds = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/admin/thresholds', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to load thresholds');
      const data = await response.json();
      setThresholds(data);
    } catch (error) {
      console.error('Failed to load thresholds:', error);
      alert('Failed to load thresholds - authentication required');
    }
  };

  const handleSaveThresholds = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('http://localhost:3001/api/admin/thresholds', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(thresholds),
      });
      if (!response.ok) throw new Error('Failed to save thresholds');
      setSaveMessage('Thresholds saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save thresholds:', error);
      setSaveMessage('Failed to save thresholds - authentication required');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenThresholdDialog = async () => {
    if (!isAuthenticated) {
      alert('Please login to access admin features');
      return;
    }
    await handleLoadThresholds();
    setShowThresholdDialog(true);
  };

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="rounded-lg border border-slate-800 bg-slate-900 overflow-hidden flex flex-col">
        <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-800">
          <h3 className="text-sm font-semibold text-slate-200">Administrator Actions</h3>
        </div>
        
        <div className="p-4 flex flex-col gap-3">
          <div className="flex items-center justify-center gap-2 py-6 text-slate-500">
            <Lock className="w-5 h-5" />
            <span className="text-sm">Login required for admin access</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border border-slate-800 bg-slate-900 overflow-hidden flex flex-col">
        <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-800">
          <h3 className="text-sm font-semibold text-slate-200">Administrator Actions</h3>
        </div>
        
        <div className="p-4 flex flex-col gap-3">
          <div className="flex gap-2">
            <button 
              onClick={() => handleGenerateReport('json')}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-md transition-colors shadow-sm cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              JSON
            </button>
            <button 
              onClick={() => handleGenerateReport('csv')}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-md transition-colors shadow-sm cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              CSV
            </button>
          </div>
          
          <button 
            onClick={handleOpenThresholdDialog}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-md border border-slate-700 transition-colors cursor-pointer"
          >
            <Settings2 className="w-4 h-4" />
            Configure Risk Thresholds
          </button>
        </div>
      </div>

      {showThresholdDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-slate-200">Configure Risk Thresholds</h3>
              <button 
                onClick={() => setShowThresholdDialog(false)}
                className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Moderate Risk Threshold (mm/hr)
                </label>
                <input
                  type="number"
                  value={thresholds.moderate_threshold}
                  onChange={(e) => setThresholds({ ...thresholds, moderate_threshold: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="1"
                />
                <p className="text-xs text-slate-500 mt-1">Rainfall intensity above this triggers Moderate risk</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  High Risk Threshold (mm/hr)
                </label>
                <input
                  type="number"
                  value={thresholds.high_threshold}
                  onChange={(e) => setThresholds({ ...thresholds, high_threshold: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="1"
                />
                <p className="text-xs text-slate-500 mt-1">Rainfall intensity above this triggers High risk</p>
              </div>

              {saveMessage && (
                <p className={`text-sm ${saveMessage.includes('success') ? 'text-emerald-400' : 'text-red-400'}`}>
                  {saveMessage}
                </p>
              )}
            </div>
            
            <div className="px-6 py-4 border-t border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setShowThresholdDialog(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-md border border-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveThresholds}
                disabled={isSaving || thresholds.moderate_threshold >= thresholds.high_threshold}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminControls;

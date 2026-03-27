import { Box } from 'lucide-react';

const WebGLCanvas = () => {
  return (
    <div className="w-full h-full rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden relative">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900 via-slate-950 to-slate-950"></div>
      
      <div className="flex flex-col items-center gap-4 z-10 text-slate-500">
        <Box className="w-16 h-16 opacity-50" />
        <div className="text-center">
          <h2 className="text-lg font-medium text-slate-300">Unity WebGL Viewport</h2>
          <p className="text-sm">Georeferenced Campus Mesh (Pending Asset Load)</p>
        </div>
      </div>

      <div className="absolute top-4 left-4 flex gap-2">
        <span className="px-2 py-1 rounded bg-slate-900/80 border border-slate-800 text-xs text-slate-400 font-mono tracking-wider">
          FPS: 60
        </span>
        <span className="px-2 py-1 rounded bg-slate-900/80 border border-slate-800 text-xs text-slate-400 font-mono tracking-wider">
          Viewport: Depth Map
        </span>
      </div>
    </div>
  );
};

export default WebGLCanvas;

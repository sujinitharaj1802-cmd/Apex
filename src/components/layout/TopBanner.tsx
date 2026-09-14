import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export const TopBanner: React.FC = () => {
  return (
    <div className="w-full bg-slate-900 border-b border-amber-500/40 text-slate-200 px-4 py-1.5 font-mono text-[11px] select-none sticky top-0 z-50 shadow-md">
      <div className="max-w-[1750px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-1">
        {/* Primary Notice */}
        <div className="flex items-center space-x-2 text-amber-400 font-bold tracking-wider">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
          <span>PROTOTYPE • SIMULATED DATA • NOT CONNECTED TO LIVE SYSTEMS</span>
        </div>

        {/* Secondary Technical Boundaries */}
        <div className="flex items-center space-x-2 text-white text-[11px] tracking-normal">
          <span className="hidden md:inline bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-white font-bold">
            NO LIVE CCTV • NO REAL BIOMETRICS • NO GOVERNMENT API CONNECTIONS
          </span>
          <span className="text-amber-400 font-bold uppercase">
            STAKEHOLDER EVALUATION DEMO
          </span>
        </div>
      </div>
    </div>
  );
};

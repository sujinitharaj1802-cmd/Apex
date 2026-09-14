import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export const TopBanner: React.FC = () => {
  return (
    <div className="w-full bg-[#0B1120] border-b border-amber-500/40 text-slate-300 px-4 py-1.5 text-xs select-none sticky top-0 z-50">
      <div className="max-w-[1750px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-1">
        {/* Primary Notice */}
        <div className="flex items-center space-x-2 text-amber-400 font-bold tracking-tight">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
          <span>Prototype • Simulated Data • Not Connected to Live Systems</span>
        </div>

        {/* Secondary Technical Boundaries */}
        <div className="flex items-center space-x-2 text-slate-300 text-xs tracking-tight">
          <span className="hidden md:inline bg-slate-900 px-2 py-0.5 rounded-xs border border-slate-800 text-slate-300 font-medium">
            No Live CCTV • No Real Biometrics • No Government API Connections
          </span>
          <span className="text-amber-400 font-semibold">
            Stakeholder Evaluation Demo
          </span>
        </div>
      </div>
    </div>
  );
};

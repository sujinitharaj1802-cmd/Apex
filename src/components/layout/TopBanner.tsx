import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export const TopBanner: React.FC = () => {
  return (
    <div className="w-full bg-surface border-b border-border text-text-muted px-4 py-1.5 text-xs select-none sticky top-0 z-50">
      <div className="max-w-[1750px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-1">
        {/* Primary Notice */}
        <div className="flex items-center space-x-2 text-accent font-bold tracking-tight">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-accent" />
          <span>Prototype • Simulated Data • Not Connected to Live Systems</span>
        </div>

        {/* Secondary Technical Boundaries */}
        <div className="flex items-center space-x-2 text-text-muted text-xs tracking-tight">
          <span className="hidden md:inline bg-bg px-2 py-0.5 rounded-xs border border-border text-text-muted font-medium">
            No Live CCTV • No Real Biometrics • No Government API Connections
          </span>
          <span className="text-accent font-semibold">
            Stakeholder Evaluation Demo
          </span>
        </div>
      </div>
    </div>
  );
};

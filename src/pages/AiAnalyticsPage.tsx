import React, { useState } from 'react';
import { AI_MODULES_CATALOG } from '../services/mockDataService';
import { AiModuleSpec } from '../types';
import {
  Cpu,
  Car,
  UserCheck,
  Package,
  Users,
  ShieldAlert,
  Clock,
  Gauge,
  Info,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const AiAnalyticsPage: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<AiModuleSpec>(AI_MODULES_CATALOG[0]);

  const getModuleIcon = (id: string) => {
    switch (id) {
      case 'AI-ANPR-01':
        return Car;
      case 'AI-FACE-02':
        return UserCheck;
      case 'AI-OBJ-03':
        return Package;
      case 'AI-CROWD-04':
        return Users;
      case 'AI-PERI-05':
        return ShieldAlert;
      case 'AI-ABN-06':
        return Clock;
      case 'AI-VEH-07':
        return Gauge;
      default:
        return Cpu;
    }
  };

  return (
    <div className="p-4 max-w-[1750px] mx-auto space-y-4 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-blue-400" />
            <h1 className="text-lg font-bold text-text">Central AI Analytics & Edge Neural Modules</h1>
          </div>
          <p className="text-xs text-text-muted font-mono">
            Proposed computer vision pipelines deployed across edge cameras and state GPU clusters
          </p>
        </div>

        <div className="text-xs font-mono bg-surface border border-border px-3 py-1.5 rounded text-text-muted">
          Analytics Pipeline: <strong className="text-blue-400">7 Proposed Modules</strong> (Simulated)
        </div>
      </div>

      {/* Mandatory Non-Biometric / Simulation Notice */}
      <div className="bg-surface border border-border rounded-lg p-3.5 flex items-start space-x-3 text-xs">
        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-text leading-relaxed">
          <strong className="text-text">Workflow Demonstration Notice:</strong> The analytics models showcased below represent the architectural inference pipeline specified in the Apex proposal. All plates (e.g. <span className="text-amber-400 font-bold">GJ-01-XX-4821</span>) and watchlist lookups (e.g. <span className="text-blue-300 font-bold">WL-0027</span>) are synthetic vectors. No real identity inference or live face recognition is performed.
        </div>
      </div>

      {/* Grid: Left Modules List (5 cols) + Right Interactive Studio (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Modules List */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="text-xs font-mono text-text-muted uppercase font-bold px-1">
            Proposed Vision Modules
          </div>

          <div className="space-y-2">
            {AI_MODULES_CATALOG.map((mod) => {
              const Icon = getModuleIcon(mod.id);
              const isSelected = selectedModule.id === mod.id;

              return (
                <div
                  key={mod.id}
                  onClick={() => setSelectedModule(mod)}
                  className={`p-3 rounded border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-950/40 border-blue-500 shadow ring-1 ring-blue-500/50'
                      : 'bg-surface border-border hover:border-border hover:bg-surface'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className={`p-2 rounded ${isSelected ? 'bg-blue-600 text-text' : 'bg-slate-800 text-text-muted'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-text">{mod.title}</div>
                        <div className="text-[10px] text-text-muted font-mono">{mod.category}</div>
                      </div>
                    </div>

                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-surface text-text-muted border border-border">
                      {mod.status}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-text-muted pt-2 border-t border-slate-850">
                    <span>Target: <strong className="text-text-muted">{mod.latencyTarget}</strong></span>
                    <span>Confidence: <strong className="text-emerald-400">{mod.syntheticConfidence}%</strong></span>
                    <span className="text-slate-500">{mod.edgeOrCentral}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Module Deep Dive */}
        <div className="lg:col-span-7 space-y-3">
          <div className="bg-surface border border-border rounded-lg p-5 space-y-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
              <div>
                <span className="text-[10px] font-mono text-blue-400 font-bold">{selectedModule.id}</span>
                <h2 className="text-base font-bold text-text">{selectedModule.title}</h2>
                <div className="text-xs text-text-muted font-mono mt-0.5">{selectedModule.category}</div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="bg-surface border border-border text-text px-2.5 py-1 rounded text-xs font-mono">
                  {selectedModule.status}
                </span>
                <span className="bg-blue-950 border border-blue-800 text-blue-300 px-2.5 py-1 rounded text-xs font-mono">
                  {selectedModule.edgeOrCentral}
                </span>
              </div>
            </div>

            <p className="text-xs text-text-muted leading-relaxed font-sans">
              {selectedModule.description}
            </p>

            {/* Interactive Simulation Display Area */}
            <div className="bg-bg border border-border rounded p-4 space-y-3 font-mono text-xs">
              <div className="text-[10px] text-text-muted uppercase tracking-wider font-bold border-b border-border pb-1 flex items-center justify-between">
                <span>Synthetic Execution Pipeline</span>
                <span className="text-emerald-400">Benchmark: {selectedModule.latencyTarget}</span>
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-slate-500 block text-[10px]">SIMULATED INGESTION INPUT:</span>
                  <div className="bg-surface p-2 rounded border border-border text-text mt-1">
                    {selectedModule.sampleInput}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px]">MODEL OUTPUT SIGNATURE:</span>
                  <div className="bg-surface p-2 rounded border border-border text-emerald-300 font-bold mt-1">
                    {selectedModule.sampleOutput}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-text-muted">
                <span>Synthetic Validation Score:</span>
                <strong className="text-emerald-400 font-bold text-xs">{selectedModule.syntheticConfidence}% Vector Score</strong>
              </div>
            </div>

            {/* Specific Guidance Breakdown */}
            {selectedModule.id === 'AI-ANPR-01' && (
              <div className="p-3 bg-surface/60 border border-border rounded text-xs space-y-1">
                <div className="font-bold text-text font-mono">Simulated ANPR Protocol:</div>
                <div className="text-text-muted text-[11px] leading-relaxed">
                  Demonstrates automated vehicle flagging. Simulated plate format <span className="font-mono text-amber-400">GJ-01-XX-4821</span> is synthetic. In production, this module correlates with the proposed VAHAN federation gateway for statutory e-challans.
                </div>
              </div>
            )}

            {selectedModule.id === 'AI-FACE-02' && (
              <div className="p-3 bg-surface/60 border border-border rounded text-xs space-y-1">
                <div className="font-bold text-text font-mono">Watchlist Matching Protocol:</div>
                <div className="text-text-muted text-[11px] leading-relaxed">
                  Demonstrates cosine distance lookups against indexed watchlist identifier <span className="font-mono text-blue-400">WL-0027</span>. Zero real faces or personal biometric records are stored or queried in this prototype.
                </div>
              </div>
            )}

            {selectedModule.id === 'AI-OBJ-03' && (
              <div className="p-3 bg-surface/60 border border-border rounded text-xs space-y-2">
                <div className="font-bold text-text font-mono">Supported Class Labels:</div>
                <div className="flex flex-wrap gap-2 text-xs font-mono">
                  {['PERSON', 'VEHICLE', 'BAG', 'MOTORCYCLE'].map((cls) => (
                    <span key={cls} className="bg-slate-800 border border-border text-text px-2.5 py-1 rounded">
                      {cls}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

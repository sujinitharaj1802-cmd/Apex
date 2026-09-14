import React from 'react';
import {
  Layers,
  Cpu,
  Network,
  Database,
  ArrowDown,
  Shield,
  CheckCircle2,
  Server,
  Radio,
  Camera,
} from 'lucide-react';
import { STATEWIDE_METRICS } from '../services/mockDataService';

export const ArchitecturePage: React.FC = () => {
  return (
    <div className="p-4 max-w-[1750px] mx-auto space-y-5 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <h1 className="text-lg font-bold text-text">Three-Tier System Architecture</h1>
          </div>
          <p className="text-xs text-text-muted font-mono">
            Architectural blueprint for unified state-wide surveillance governance and hybrid intelligence
          </p>
        </div>

        <div className="text-xs font-mono bg-surface border border-border px-3 py-1.5 rounded text-text-muted">
          Architecture Style: <strong className="text-blue-400">Federated Hybrid Bus</strong>
        </div>
      </div>

      {/* Hero Principle Banner */}
      <div className="bg-surface border-2 border-blue-500/80 rounded-lg p-5 text-center shadow-lg">
        <div className="text-[11px] text-text font-bold uppercase tracking-widest mb-1">
          APEX CORE DESIGN PRINCIPLE
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-text tracking-tight">
          PRESERVE EXISTING INFRASTRUCTURE. ADD A UNIFIED INTELLIGENCE LAYER.
        </h2>
        <p className="text-xs text-text max-w-2xl mx-auto mt-2 leading-relaxed">
          Rather than costly "rip-and-replace" procurement, Apex layers an AI and forensic federation engine over Gujarat's existing 80,000+ cameras and municipal VMS systems.
        </p>
      </div>

      {/* 3-Tier Layer Flow Diagram */}
      <div className="space-y-3 max-w-4xl mx-auto">
        {/* LAYER 3: CENTRAL INTELLIGENCE ENGINE */}
        <div className="bg-surface border border-border rounded-lg p-5 space-y-3 shadow-sm relative">
          <div className="flex items-center justify-between border-b border-border pb-2.5">
            <div className="flex items-center space-x-2.5">
              <span className="px-2 py-0.5 rounded bg-blue-600 text-text font-mono text-[10px] font-bold">
                LAYER 3
              </span>
              <h3 className="text-sm font-bold text-text uppercase font-mono">
                CENTRAL INTELLIGENCE ENGINE
              </h3>
            </div>
            <span className="text-[11px] font-mono text-blue-400">State AI Cloud & Police HQ Core</span>
          </div>

          <p className="text-xs text-text-muted font-sans">
            High-throughput analytics engines, event correlation pipelines, and forensic chain-of-custody ledgers.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
            <div className="bg-bg p-2 rounded border border-border text-text">
              • ANPR & Plate Search
            </div>
            <div className="bg-bg p-2 rounded border border-border text-text">
              • AI Analytics & Vision
            </div>
            <div className="bg-bg p-2 rounded border border-border text-text">
              • Real-Time Alert Engine
            </div>
            <div className="bg-bg p-2 rounded border border-border text-text">
              • Investigation Workspace
            </div>
            <div className="bg-bg p-2 rounded border border-border text-text">
              • Forensic Audit Trail (SHA-256)
            </div>
            <div className="bg-bg p-2 rounded border border-border text-text">
              • Cross-District Tracking
            </div>
          </div>
        </div>

        {/* Down Arrow Connector */}
        <div className="flex justify-center text-slate-500">
          <ArrowDown className="w-6 h-6 animate-bounce-short text-blue-400" />
        </div>

        {/* LAYER 2: VMS FEDERATION MIDDLEWARE */}
        <div className="bg-surface border border-border rounded-lg p-5 space-y-3 shadow-sm relative">
          <div className="flex items-center justify-between border-b border-border pb-2.5">
            <div className="flex items-center space-x-2.5">
              <span className="px-2 py-0.5 rounded bg-purple-600 text-text font-mono text-[10px] font-bold">
                LAYER 2
              </span>
              <h3 className="text-sm font-bold text-text uppercase font-mono">
                VMS FEDERATION MIDDLEWARE
              </h3>
            </div>
            <span className="text-[11px] font-mono text-purple-400">Interoperability & Protocol Abstraction</span>
          </div>

          <p className="text-xs text-text-muted font-sans">
            Abstracts proprietary vendor protocols (CP Plus, Dahua, Hikvision, Bosch, Axis) into standard REST, WebRTC, and RTSP video proxies.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div className="bg-bg p-2 rounded border border-border text-text text-center">
              ONVIF Profile S/G/T
            </div>
            <div className="bg-bg p-2 rounded border border-border text-text text-center">
              RTSP / WebRTC Stream Proxy
            </div>
            <div className="bg-bg p-2 rounded border border-border text-text text-center">
              Metadata Normalizer
            </div>
            <div className="bg-bg p-2 rounded border border-border text-text text-center">
              Vendor Hardware Adapters
            </div>
          </div>
        </div>

        {/* Down Arrow Connector */}
        <div className="flex justify-center text-slate-500">
          <ArrowDown className="w-6 h-6 animate-bounce-short text-purple-400" />
        </div>

        {/* LAYER 1: REGISTRY & GIS FOUNDATION */}
        <div className="bg-surface border border-border rounded-lg p-5 space-y-3 shadow-sm relative">
          <div className="flex items-center justify-between border-b border-border pb-2.5">
            <div className="flex items-center space-x-2.5">
              <span className="px-2 py-0.5 rounded bg-emerald-600 text-text font-mono text-[10px] font-bold">
                LAYER 1
              </span>
              <h3 className="text-sm font-bold text-text uppercase font-mono">
                REGISTRY & GIS FOUNDATION
              </h3>
            </div>
            <span className="text-[11px] font-mono text-emerald-400">Asset Baseline & Network Mapping</span>
          </div>

          <p className="text-xs text-text-muted font-sans">
            Authoritative registry establishing ground-truth asset identification, geographic indexing, and heartbeat diagnostics.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div className="bg-bg p-2 rounded border border-border text-text text-center">
              Camera Registry Index
            </div>
            <div className="bg-bg p-2 rounded border border-border text-text text-center">
              GIS Centroid Layers
            </div>
            <div className="bg-bg p-2 rounded border border-border text-text text-center">
              Health & O&M Monitoring
            </div>
            <div className="bg-bg p-2 rounded border border-border text-text text-center">
              Network Topology Mapping
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Infrastructure Footprint Summary */}
      <div className="bg-surface border border-border rounded-lg p-4 max-w-4xl mx-auto text-xs font-mono flex flex-wrap items-center justify-around gap-4 text-center">
        <div>
          <div className="text-xl font-bold text-blue-400">{STATEWIDE_METRICS.totalCameras}</div>
          <div className="text-text-muted text-[10px] uppercase">EXISTING CAMERAS IN GUJARAT</div>
        </div>
        <div className="h-8 w-px bg-slate-800 hidden sm:block" />
        <div>
          <div className="text-xl font-bold text-purple-400">{STATEWIDE_METRICS.departmentsCount}</div>
          <div className="text-text-muted text-[10px] uppercase">PARTICIPATING DEPARTMENTS</div>
        </div>
        <div className="h-8 w-px bg-slate-800 hidden sm:block" />
        <div>
          <div className="text-xl font-bold text-emerald-400">MULTIPLE</div>
          <div className="text-text-muted text-[10px] uppercase">VMS VENDORS INTEROPERABLE</div>
        </div>
      </div>
    </div>
  );
};

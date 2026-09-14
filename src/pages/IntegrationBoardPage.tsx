import React, { useState } from 'react';
import { INTEGRATION_NODES } from '../services/mockDataService';
import { DepartmentNode } from '../types';
import { StatusPill } from '../components/common/StatusPill';
import {
  Network,
  Activity,
  Layers,
  Server,
  Shield,
  X,
  ExternalLink,
  Cpu,
} from 'lucide-react';

export const IntegrationBoardPage: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<DepartmentNode | null>(null);
  const [sectorFilter, setSectorFilter] = useState<string>('all');

  const filteredNodes = INTEGRATION_NODES.filter((n) => {
    if (sectorFilter === 'all') return true;
    return n.sector === sectorFilter;
  });

  const connectedCount = INTEGRATION_NODES.filter((n) => n.status === 'SIMULATED CONNECTED').length;
  const pendingCount = INTEGRATION_NODES.filter((n) => n.status === 'PENDING').length;
  const notOnboardedCount = INTEGRATION_NODES.filter((n) => n.status === 'NOT ONBOARDED').length;

  return (
    <div className="p-4 max-w-[1750px] mx-auto space-y-4 font-sans">
      {/* Top Banner: Mandatory Illustrative Integration Notice */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded bg-blue-600/20 text-blue-400 border border-blue-500/30 shrink-0">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-bold text-white uppercase font-mono">
                ILLUSTRATIVE INTEGRATION • VMS FEDERATION MIDDLEWARE
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                PROPOSED ARCHITECTURE
              </span>
            </div>
            <p className="text-xs text-slate-200 mt-0.5">
              Visualizing how Gujarat's 26 disparate department camera networks and statutory databases federate through Apex's central intelligence bus.
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-200 bg-[#0B1120] border border-slate-800 px-3 py-1.5 rounded shrink-0">
          Federation Scope: <strong className="text-white">{INTEGRATION_NODES.length} Architecture Nodes</strong>
        </div>
      </div>

      {/* Central Hub Visualization: Apex Central Intelligence Layer in Center */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-5 text-center relative overflow-hidden">
        <div className="max-w-xl mx-auto space-y-2 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-blue-900/40 border border-blue-500 text-white text-xs font-bold uppercase">
            <Cpu className="w-4 h-4 text-blue-400" />
            <span>APEX CENTRAL INTELLIGENCE LAYER</span>
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            Acts as the common intelligence, ANPR, facial embedding, and forensic audit layer while preserving existing field cameras, municipal VMS systems, and local department ownership.
          </p>
        </div>

        {/* 3 Status Summaries */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto mt-4 text-xs font-mono">
          <div className="bg-[#0B1120] p-2 rounded border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">SIMULATED CONNECTED:</span>
            <strong className="text-emerald-400 font-bold">{connectedCount} Nodes</strong>
          </div>
          <div className="bg-[#0B1120] p-2 rounded border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">PENDING ONBOARDING:</span>
            <strong className="text-amber-400 font-bold">{pendingCount} Nodes</strong>
          </div>
          <div className="bg-[#0B1120] p-2 rounded border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">NOT ONBOARDED:</span>
            <strong className="text-slate-500 font-bold">{notOnboardedCount} Nodes</strong>
          </div>
        </div>
      </div>

      {/* Filter Sector Strip */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
        {[
          { id: 'all', label: 'All Federation Nodes' },
          { id: 'External Proposed Database', label: 'Proposed Core Databases (VAHAN, eGujCop...)' },
          { id: 'Municipal & Smart City', label: 'Municipal Corporations (AMC, SMC...)' },
          { id: 'Transport & Corridors', label: 'Transport & Highways (GSRTC, NHAI...)' },
          { id: 'Critical Infrastructure', label: 'Critical Infrastructure (Ports, Power...)' },
        ].map((sec) => (
          <button
            key={sec.id}
            onClick={() => setSectorFilter(sec.id)}
            className={`px-3 py-1.5 rounded text-xs transition-colors ${
              sectorFilter === sec.id
                ? 'bg-blue-600 text-white font-bold'
                : 'bg-[#0F172A] border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* Grid of Department Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredNodes.map((node) => (
          <div
            key={node.id}
            onClick={() => setSelectedNode(node)}
            className="bg-[#0F172A] border border-slate-800 hover:border-slate-700 rounded-lg p-4 cursor-pointer transition-all hover:bg-slate-850 flex flex-col justify-between space-y-3 shadow-sm"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-blue-400 font-bold">{node.id}</span>
                  <h3 className="text-sm font-bold text-white">{node.name}</h3>
                </div>
                <StatusPill status={node.status} size="sm" />
              </div>

              <p className="text-xs text-slate-300 font-sans line-clamp-2">
                {node.purpose}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-[#0B1120] p-2 rounded border border-slate-800">
                <span className="text-[9px] text-slate-500 uppercase block">Protocol</span>
                <strong className="text-slate-300 text-[11px] truncate block">{node.protocol}</strong>
              </div>
              <div className="bg-[#0B1120] p-2 rounded border border-slate-800">
                <span className="text-[9px] text-slate-500 uppercase block">Data Category</span>
                <strong className="text-slate-300 text-[11px] truncate block">{node.dataCategory}</strong>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
              <span>Sync: {node.lastSync}</span>
              <span className="text-blue-400 underline">View System Specs</span>
            </div>
          </div>
        ))}
      </div>

      {/* Node Details Drawer / Modal */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-slate-700 rounded-lg w-full max-w-lg p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-xs text-blue-400 font-bold">{selectedNode.id}</span>
                <h3 className="text-base font-bold text-white">{selectedNode.name}</h3>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#0B1120] border border-slate-800 rounded p-4 space-y-2.5 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Integration Status:</span>
                <StatusPill status={selectedNode.status} />
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Sector Domain:</span>
                <span className="text-white">{selectedNode.sector}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Custodial Agency:</span>
                <span className="text-white">{selectedNode.contactDept}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Protocol Interface:</span>
                <span className="text-blue-400 font-bold">{selectedNode.protocol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Data Category:</span>
                <span className="text-slate-200">{selectedNode.dataCategory}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated Ingestion:</span>
                <span className="text-emerald-400">{selectedNode.throughputRps} rps ({selectedNode.latencyMs} ms)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Last Simulated Sync:</span>
                <span className="text-slate-300">{selectedNode.lastSync}</span>
              </div>
            </div>

            <div className="p-3 bg-[#0B1120] border border-slate-800 rounded text-xs text-slate-300 font-sans space-y-1">
              <div className="font-bold text-white font-mono">System Purpose:</div>
              <p className="text-[11px] text-slate-400">{selectedNode.purpose}</p>
            </div>

            <button
              onClick={() => setSelectedNode(null)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold rounded transition-colors"
            >
              Close Node Specifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

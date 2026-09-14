import React from 'react';
import {
  Calendar,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Layers,
  Scale,
  Users,
  Server,
  Lock,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const roadmapPhases = [
    {
      phase: 'PHASE 1',
      title: 'Ahmedabad Urban Core Pilot',
      duration: '0 – 6 Months',
      badgeColor: 'bg-blue-600 text-white',
      objective: 'Deploy and validate the Apex federation middleware across 500 edge nodes in Ahmedabad.',
      capabilities: [
        'VMS federation of AMC Smart City feeds with city traffic police',
        'Edge AI ANPR deployment across SG Highway & Ring Road',
        'Real-time alert dispatch to 20 PCR patrol mobile vans',
        'Initial SHA-256 evidence chain-of-custody logging',
      ],
      expectedOutcome: 'Sub-30-second average incident response verified; zero disruption to legacy AMC infrastructure.',
    },
    {
      phase: 'PHASE 2',
      title: 'Major City-Wide Rollout',
      duration: '6 – 12 Months',
      badgeColor: 'bg-purple-600 text-white',
      objective: 'Scale federation across Surat, Vadodara, and Rajkot Municipal Corporations.',
      capabilities: [
        'Interoperability across ~15,000 cameras across 4 commissionerates',
        'Corridor vehicle tracking connecting Ahmedabad ➔ Vadodara ➔ Surat',
        'Automated predictive maintenance ticketing with SLA tracking',
        'Federated search across city-level ANPR hotlists',
      ],
      expectedOutcome: 'Inter-district criminal transit tracking demonstrated live; 40% reduction in camera downtime.',
    },
    {
      phase: 'PHASE 3',
      title: 'State-Wide 33-District Expansion',
      duration: '12 – 24 Months',
      badgeColor: 'bg-emerald-600 text-white',
      objective: 'Federate all 26 participating Gujarat state departments into a single sovereign platform.',
      capabilities: [
        'Unified intelligence layer over 80,000+ statewide surveillance nodes',
        'Integration of GSRTC depots, NHAI tolls, Ports, Forest corridors',
        'Simulated gateway link to national CCTNS and ICJS repositories',
        'Enterprise Hyperledger Fabric blockchain deployment for courts',
      ],
      expectedOutcome: 'Complete state-wide surveillance unification covering 1,600 km coastal & border zones.',
    },
    {
      phase: 'PHASE 4',
      title: 'Central AI & Predictive Optimization',
      duration: '24 – 36 Months',
      badgeColor: 'bg-amber-600 text-white font-bold',
      objective: 'Deploy state GPU clusters for advanced predictive policing and behavioral flow optimization.',
      capabilities: [
        'Predictive crime pattern heatmapping using historical incident vectors',
        'Multi-modal trajectory extrapolation across road, rail, and transit',
        'Automated drone tethering integration for major state events/festivals',
        'Continuous self-healing network diagnostics for edge IoT nodes',
      ],
      expectedOutcome: 'Gujarat becomes India\'s most technologically advanced, privacy-compliant smart policing state.',
    },
  ];

  return (
    <div className="p-4 max-w-[1750px] mx-auto space-y-5 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            <h1 className="text-lg font-bold text-white">Project Proposal Roadmap & Deployment Governance</h1>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Strategic 36-month rollout schedule and mandatory institutional pre-requisites for production
          </p>
        </div>

        <div className="text-xs font-mono bg-[#0F172A] border border-slate-800 px-3 py-1.5 rounded text-slate-300">
          Proposal Scope: <strong className="text-white">Months 0 – 36</strong>
        </div>
      </div>

      {/* 4-Phase Roadmap Grid */}
      <div className="space-y-3">
        <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
          Phased Implementation Plan
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5">
          {roadmapPhases.map((p) => (
            <div
              key={p.phase}
              className="bg-[#0F172A] border border-slate-800 rounded-lg p-4 flex flex-col justify-between space-y-3 shadow-sm"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${p.badgeColor}`}>
                    {p.phase}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">{p.duration}</span>
                </div>

                <h3 className="text-sm font-bold text-white leading-snug">{p.title}</h3>

                <div className="text-xs text-slate-300 font-sans leading-relaxed">
                  <strong className="text-slate-200">Objective:</strong> {p.objective}
                </div>

                <div className="space-y-1 pt-1.5 border-t border-slate-800">
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">
                    Major Capabilities:
                  </span>
                  {p.capabilities.map((cap, cIdx) => (
                    <div key={cIdx} className="flex items-start space-x-1.5 text-[11px] text-slate-400">
                      <span className="text-blue-400 font-bold">•</span>
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-2.5 bg-[#0B1120] border border-slate-800 rounded text-[11px] font-sans text-slate-300">
                <strong className="text-emerald-400 block font-mono text-[10px] uppercase">Expected Outcome:</strong>
                {p.expectedOutcome}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Comparative Sections: Prototype vs Real Deployment Requirements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
        {/* WHAT THIS PROTOTYPE DEMONSTRATES */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-5 space-y-3">
          <div className="flex items-center space-x-2 text-blue-400 font-mono font-bold text-xs uppercase tracking-wider border-b border-slate-800 pb-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>WHAT THIS PROTOTYPE DEMONSTRATES</span>
          </div>

          <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed font-sans">
            <p>
              • <strong>Unified Command & Control:</strong> Proves that a single interface can visualize state-wide camera health and alerts across district boundaries.
            </p>
            <p>
              • <strong>Cross-District Interoperability:</strong> Illustrates how vehicle trajectory reconstruction can bridge municipal VMS silos in under 30 seconds.
            </p>
            <p>
              • <strong>Tamper-Evident Evidence:</strong> Functionally verifies SHA-256 cryptographic chain-of-custody logging in the client browser.
            </p>
            <p>
              • <strong>Federation Model:</strong> Validates the architectural viability of adding an intelligence middleware layer without replacing existing hardware.
            </p>
            <p>
              • <strong>Operational Workflow:</strong> Demonstrates the end-to-end triaging path from edge detection to patrol dispatch and case disposition.
            </p>
          </div>
        </div>

        {/* WHAT WOULD BE REQUIRED FOR REAL DEPLOYMENT */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-5 space-y-3">
          <div className="flex items-center space-x-2 text-amber-400 font-mono font-bold text-xs uppercase tracking-wider border-b border-slate-800 pb-2">
            <AlertTriangle className="w-4 h-4" />
            <span>WHAT WOULD BE REQUIRED FOR REAL DEPLOYMENT</span>
          </div>

          <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed font-sans">
            <p>
              • <strong>Government Approvals & MoUs:</strong> Formal inter-departmental data-sharing agreements between Home Dept, Municipal Corporations, NHAI, and Ports.
            </p>
            <p>
              • <strong>Statutory Privacy & DPDP Review:</strong> Data Protection Impact Assessment (DPIA) under the Digital Personal Data Protection Act 2023.
            </p>
            <p>
              • <strong>Cert-In Security Audit:</strong> Mandatory external penetration testing and code security certification of all gateway nodes.
            </p>
            <p>
              • <strong>Sovereign Infrastructure:</strong> High-security deployment on State Data Center (SDC) or MeghRaj government cloud with HSM timestamping.
            </p>
            <p>
              • <strong>Human Oversight Protocols:</strong> Strict SOPs prohibiting automated enforcement; requiring two-tier human officer verification for all dispatches.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

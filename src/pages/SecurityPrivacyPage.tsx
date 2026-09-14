import React from 'react';
import {
  ShieldCheck,
  Lock,
  Key,
  EyeOff,
  FileCheck,
  Server,
  Layers,
  CheckCircle2,
  Info,
  AlertTriangle,
} from 'lucide-react';

export const SecurityPrivacyPage: React.FC = () => {
  const securityPillars = [
    {
      title: 'ZERO TRUST NETWORK ACCESS',
      icon: Lock,
      desc: 'No perimeter implicit trust. Every client workstation, operator console, and edge camera must authenticate on each transaction.',
    },
    {
      title: 'ROLE-BASED ACCESS CONTROL (RBAC)',
      icon: Key,
      desc: 'Strict least-privilege role scoping. Operators view live alerts; SPs authorize dispatches; State Admins access statewide telemetry.',
    },
    {
      title: 'MULTI-FACTOR AUTHENTICATION (MFA)',
      icon: ShieldCheck,
      desc: 'Hardware security token / OTP verification mandatory for all sworn officer logins prior to accessing surveillance feeds.',
    },
    {
      title: 'AES-256 & TLS 1.3 ENCRYPTION',
      icon: Server,
      desc: 'End-to-end encryption for all video streams in transit via TLS 1.3 and at-rest on edge storage using FIPS-validated AES-256.',
    },
    {
      title: 'NETWORK SEGMENTATION',
      icon: Layers,
      desc: 'Dedicated state police VLAN/VPN isolates surveillance camera telemetry completely from public internet routing.',
    },
    {
      title: 'TAMPER-PROOF AUDIT LOGGING',
      icon: FileCheck,
      desc: 'Every search query, alert view, and video export is permanently anchored into a cryptographic SHA-256 hash ledger.',
    },
    {
      title: 'AUTOMATED PRIVACY MASKING',
      icon: EyeOff,
      desc: 'Non-biometric default principle: automated redaction/blurring of non-target bystanders and residential windows.',
    },
    {
      title: 'DATA MINIMIZATION & RETENTION',
      icon: CheckCircle2,
      desc: 'Strict DPDP Act 2023 compliance with automated rolling 30-day purge schedules for unflagged video metadata.',
    },
  ];

  return (
    <div className="p-4 max-w-[1750px] mx-auto space-y-4 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h1 className="text-lg font-bold text-white">PROPOSED SECURITY ARCHITECTURE</h1>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Zero Trust and Privacy-by-Design governance framework for statewide law enforcement operations
          </p>
        </div>

        <div className="text-xs font-mono bg-amber-950/60 border border-amber-800 text-amber-300 px-3 py-1.5 rounded">
          Status: <strong className="text-white">Proposed Security Architecture</strong>
        </div>
      </div>

      {/* DPDP Act 2023 Notice */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-3.5 flex items-start space-x-3 text-xs">
        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-slate-200 leading-relaxed">
          <strong className="text-white">Governance & Statutory Compliance Notice:</strong> This page outlines the mandatory cybersecurity and privacy controls specified in the Apex proposal. Prior to production, an independent Cert-In empaneled security audit and a Data Protection Impact Assessment (DPIA) under the Digital Personal Data Protection (DPDP) Act 2023 must be formally conducted.
        </div>
      </div>

      {/* 8 Core Security Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {securityPillars.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div
              key={idx}
              className="bg-[#0F172A] border border-slate-800 rounded-lg p-4 space-y-2.5 shadow-sm hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded bg-slate-900 border border-slate-700 text-blue-400">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-white">{p.title}</h3>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {p.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Privacy by Design Four Principles */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-5 space-y-3">
        <div className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
          FOUR PILLARS OF APEX PRIVACY-BY-DESIGN
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="bg-[#0B1120] p-3 rounded border border-slate-800 space-y-1">
            <span className="text-emerald-400 font-bold block">1. PRIVACY BY DESIGN</span>
            <p className="text-slate-400 text-[11px] font-sans">
              Privacy controls embedded directly into camera firmware and ingestion APIs rather than bolted on.
            </p>
          </div>

          <div className="bg-[#0B1120] p-3 rounded border border-slate-800 space-y-1">
            <span className="text-blue-400 font-bold block">2. DATA MINIMIZATION</span>
            <p className="text-slate-400 text-[11px] font-sans">
              Only metadata hashes and verified alert vectors are transmitted to central servers; raw video stays local.
            </p>
          </div>

          <div className="bg-[#0B1120] p-3 rounded border border-slate-800 space-y-1">
            <span className="text-purple-400 font-bold block">3. ACCESS CONTROL</span>
            <p className="text-slate-400 text-[11px] font-sans">
              Cryptographic tokens tied to officer badge number and case FIR reference to prevent unauthorized lookups.
            </p>
          </div>

          <div className="bg-[#0B1120] p-3 rounded border border-slate-800 space-y-1">
            <span className="text-amber-400 font-bold block">4. AUDITABILITY</span>
            <p className="text-slate-400 text-[11px] font-sans">
              Complete mathematical chain-of-custody logging preventing any untraceable operator queries or redactions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

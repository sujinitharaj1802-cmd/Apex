import React from 'react';
import { Shield, ArrowRight, UserCheck, ShieldAlert, Cpu, Eye, CheckCircle2 } from 'lucide-react';
import { useRole } from '../context/RoleContext';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { DEMO_ROLES } from '../services/mockDataService';

export const LoginPage: React.FC = () => {
  const { role, setRole } = useRole();
  const { setCurrentScreen } = useApp();

  const handleSelectRole = (selectedRole: UserRole) => {
    setRole(selectedRole);
    // Role affects initial priority view
    if (selectedRole === 'operator') {
      setCurrentScreen('dashboard');
    } else if (selectedRole === 'sp') {
      setCurrentScreen('alerts');
    } else {
      setCurrentScreen('dashboard');
    }
  };

  return (
    <div className="min-h-full py-8 px-4 flex flex-col items-center justify-center max-w-5xl mx-auto space-y-6 font-sans">
      {/* Concept Hero */}
      <div className="text-center space-y-2.5 max-w-2xl">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-[#0F172A] border border-blue-500/40 text-white text-xs font-bold">
          <Shield className="w-3.5 h-3.5 text-blue-400" />
          <span>APEX • OPERATIONAL DEMO HUB</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Role-Based Operational Perspectives
        </h1>

        <p className="text-xs text-slate-200 leading-relaxed">
          Select an operational persona below to explore how Apex tailors information priority across command tiers. Switch personas at any time from the top navigation bar.
        </p>

        <div className="bg-[#0F172A] border border-slate-800 rounded p-2.5 text-xs text-slate-200 text-center">
          <span className="text-amber-400 font-bold mr-1.5">Simulation Notice:</span>
          Zero credentials or real authentication. Role switching is purely simulated for stakeholder review.
        </div>
      </div>

      {/* Role Picker Cards */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
        {(Object.keys(DEMO_ROLES) as UserRole[]).map((rKey) => {
          const config = DEMO_ROLES[rKey];
          const isSelected = role === rKey;

          return (
            <div
              key={rKey}
              onClick={() => handleSelectRole(rKey)}
              className={`cursor-pointer rounded-lg p-5 border transition-all duration-150 flex flex-col justify-between space-y-4 relative ${
                isSelected
                  ? 'bg-[#0F172A] border-blue-500 shadow ring-1 ring-blue-500'
                  : 'bg-[#0F172A] border-slate-800 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 bg-blue-600 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded">
                  ACTIVE PERSONA
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center space-x-2.5">
                  <div className={`p-2 rounded border ${config.badgeColor}`}>
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{config.title}</h3>
                    <div className="text-[10px] font-mono text-slate-400">{config.subtitle}</div>
                  </div>
                </div>

                <div className="bg-[#0B1120] p-2.5 rounded border border-slate-800 text-xs font-mono">
                  <span className="text-slate-500 text-[10px] uppercase block font-bold">Primary Interface Focus:</span>
                  <strong className="text-blue-300 text-[11px] block mt-0.5">{config.primaryFocus}</strong>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">{config.description}</p>

                <div className="space-y-1 pt-1.5 border-t border-slate-800">
                  <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">
                    Console Permissions:
                  </div>
                  {config.permissions.map((perm, idx) => (
                    <div key={idx} className="flex items-center space-x-1.5 text-[11px] text-slate-400 font-mono">
                      <span className="text-blue-400">•</span>
                      <span className="truncate">{perm}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectRole(rKey);
                }}
                className={`w-full py-2 px-3 rounded text-xs font-mono font-bold flex items-center justify-center space-x-1.5 transition-colors ${
                  isSelected
                    ? 'bg-blue-600 hover:bg-blue-500 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                <span>Launch Console as {config.title.split(' ')[0]}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

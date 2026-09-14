import React from 'react';
import {
  LayoutDashboard,
  Camera,
  AlertCircle,
  Navigation,
  Activity,
  FileCheck2,
  Network,
  Info,
  KeyRound,
  Cpu,
  MapPin,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useRole } from '../../context/RoleContext';

interface NavGroup {
  groupTitle: string;
  items: {
    id: string;
    label: string;
    icon: React.ElementType;
    badge?: number | string;
    badgeColor?: string;
  }[];
}

export const Sidebar: React.FC = () => {
  const { currentScreen, setCurrentScreen, alerts, workOrders, isPresentationMode } = useApp();
  const { roleConfig } = useRole();

  const activeAlerts = alerts.filter((a) => a.status === 'Detected' || a.status === 'AI Analysis' || a.status === 'Acknowledged').length;
  const openWorkOrders = workOrders.filter((w) => w.status === 'Open' || w.status === 'Assigned').length;

  const navGroups: NavGroup[] = [
    {
      groupTitle: 'OVERVIEW',
      items: [
        {
          id: 'dashboard',
          label: 'Command & Control',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      groupTitle: 'OPERATIONS',
      items: [
        {
          id: 'alerts',
          label: 'Live Incident Center',
          icon: AlertCircle,
          badge: activeAlerts > 0 ? activeAlerts : undefined,
          badgeColor: 'bg-red-900/80 text-red-200 border border-red-700/60',
        },
        {
          id: 'tracking',
          label: 'Cross-District Tracking',
          icon: Navigation,
        },
        {
          id: 'cameras',
          label: 'Camera Registry',
          icon: Camera,
          badge: '405 Demo',
          badgeColor: 'bg-slate-800 text-slate-300 border border-slate-700',
        },
      ],
    },
    {
      groupTitle: 'INTELLIGENCE',
      items: [
        {
          id: 'analytics',
          label: 'AI Analytics',
          icon: Cpu,
          badge: '7 Models',
          badgeColor: 'bg-blue-950 text-blue-300 border border-blue-800',
        },
        {
          id: 'topology',
          label: 'GIS & Network Topology',
          icon: MapPin,
        },
      ],
    },
    {
      groupTitle: 'SYSTEM',
      items: [
        {
          id: 'health',
          label: 'Health & O&M',
          icon: Activity,
          badge: openWorkOrders > 0 ? openWorkOrders : undefined,
          badgeColor: 'bg-amber-950 text-amber-300 border border-amber-800',
        },
        {
          id: 'audit',
          label: 'Forensic Audit Trail',
          icon: FileCheck2,
          badge: 'SHA-256',
          badgeColor: 'bg-emerald-950 text-emerald-300 border border-emerald-800',
        },
        {
          id: 'integration',
          label: 'Integration Board',
          icon: Network,
          badge: '26 Depts',
          badgeColor: 'bg-purple-950 text-purple-300 border border-purple-800',
        },
        {
          id: 'security',
          label: 'Security & Privacy',
          icon: ShieldCheck,
        },
      ],
    },
    {
      groupTitle: 'PROJECT',
      items: [
        {
          id: 'architecture',
          label: 'Architecture View',
          icon: Layers,
          badge: '3-Layer',
          badgeColor: 'bg-blue-950 text-blue-300 border border-blue-800',
        },
        {
          id: 'about',
          label: 'Proposal & Roadmap',
          icon: Info,
        },
        {
          id: 'login',
          label: 'Demo Role Hub',
          icon: KeyRound,
        },
      ],
    },
  ];

  return (
    <aside
      className={`w-64 bg-[#0B1120] border-r border-slate-800 flex flex-col justify-between shrink-0 select-none transition-opacity duration-300 ${
        isPresentationMode ? 'opacity-35 hover:opacity-100' : 'opacity-100'
      }`}
    >
      <div className="p-3 space-y-4 overflow-y-auto flex-1">
        {navGroups.map((group) => (
          <div key={group.groupTitle} className="space-y-1">
            <div className="px-3 text-[10px] font-bold tracking-wider text-white uppercase">
              {group.groupTitle}
            </div>

            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentScreen(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-left transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-xs border border-blue-400'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent font-semibold'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-white' : 'text-slate-400'
                      }`}
                    />
                    <span className="text-xs truncate">{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`ml-2 px-1.5 py-0.2 rounded text-[10px] shrink-0 font-bold ${
                        item.badgeColor || 'bg-slate-800 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Role Context Bar in Sidebar Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/80">
        <div className="text-[10px] text-slate-200 uppercase tracking-wider font-bold mb-1">
          Active Console Scope
        </div>
        <div className="text-xs font-bold text-white">{roleConfig.title}</div>
        <div className="text-[11px] text-slate-200 mt-0.5">{roleConfig.districtFocus}</div>
      </div>
    </aside>
  );
};

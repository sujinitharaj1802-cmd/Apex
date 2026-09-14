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
      groupTitle: 'Overview',
      items: [
        {
          id: 'dashboard',
          label: 'Command & Control',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      groupTitle: 'Operations',
      items: [
        {
          id: 'alerts',
          label: 'Live Incident Center',
          icon: AlertCircle,
          badge: activeAlerts > 0 ? activeAlerts : undefined,
          badgeColor: 'bg-alert text-text border border-alert',
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
          badgeColor: 'bg-bg text-text-muted border border-border',
        },
      ],
    },
    {
      groupTitle: 'Intelligence',
      items: [
        {
          id: 'analytics',
          label: 'AI Analytics',
          icon: Cpu,
          badge: '7 Models',
          badgeColor: 'bg-bg text-accent border border-border',
        },
        {
          id: 'topology',
          label: 'GIS & Network Topology',
          icon: MapPin,
        },
      ],
    },
    {
      groupTitle: 'System',
      items: [
        {
          id: 'health',
          label: 'Health & O&M',
          icon: Activity,
          badge: openWorkOrders > 0 ? openWorkOrders : undefined,
          badgeColor: 'bg-bg text-accent border border-border',
        },
        {
          id: 'audit',
          label: 'Forensic Audit Trail',
          icon: FileCheck2,
          badge: 'SHA-256',
          badgeColor: 'bg-bg text-text border border-border',
        },
        {
          id: 'integration',
          label: 'Integration Board',
          icon: Network,
          badge: '26 Depts',
          badgeColor: 'bg-bg text-text-muted border border-border',
        },
        {
          id: 'security',
          label: 'Security & Privacy',
          icon: ShieldCheck,
        },
      ],
    },
    {
      groupTitle: 'Project',
      items: [
        {
          id: 'architecture',
          label: 'Architecture View',
          icon: Layers,
          badge: '3-Layer',
          badgeColor: 'bg-bg text-accent border border-border',
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
      className={`w-64 bg-surface border-r border-border flex flex-col justify-between shrink-0 select-none transition-opacity duration-300 ${
        isPresentationMode ? 'opacity-35 hover:opacity-100' : 'opacity-100'
      }`}
    >
      <div className="p-3 space-y-4 overflow-y-auto flex-1">
        {navGroups.map((group) => (
          <div key={group.groupTitle} className="space-y-1">
            <div className="px-3 text-[11px] font-bold tracking-normal text-text-muted">
              {group.groupTitle}
            </div>

            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentScreen(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xs text-left transition-all ${
                    isActive
                      ? 'bg-accent text-bg font-bold border border-accent'
                      : 'text-text-muted hover:text-text hover:bg-bg border border-transparent font-medium'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-bg' : 'text-text-muted'
                      }`}
                    />
                    <span className="text-xs truncate">{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`ml-2 px-1.5 py-0.2 rounded-xs text-[10px] shrink-0 font-bold ${
                        item.badgeColor || 'bg-bg text-text-muted border border-border'
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
      <div className="p-3 border-t border-border bg-bg">
        <div className="text-[10px] text-text-muted font-bold mb-1">
          Active Console Scope
        </div>
        <div className="text-xs font-bold text-text">{roleConfig.title}</div>
        <div className="text-[11px] text-text-muted mt-0.5">{roleConfig.districtFocus}</div>
      </div>
    </aside>
  );
};

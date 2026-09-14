import React from 'react';

interface StatusPillProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusPill: React.FC<StatusPillProps> = ({ status, size = 'sm' }) => {
  let style = 'bg-slate-800 text-slate-300 border-slate-700';
  let dotColor = 'bg-slate-400';

  const normalized = status.toUpperCase();

  switch (normalized) {
    case 'CRITICAL':
    case 'OFFLINE':
    case 'NOT ONBOARDED':
      style = 'bg-red-950/80 text-white font-bold border-red-700';
      dotColor = 'bg-red-500';
      break;

    case 'HIGH':
      style = 'bg-orange-950/80 text-white font-bold border-orange-700';
      dotColor = 'bg-orange-500';
      break;

    case 'MEDIUM':
    case 'DEGRADED':
    case 'PENDING':
    case 'ACKNOWLEDGED':
    case 'AI ANALYSIS':
    case 'ASSIGNED':
    case 'IN-PROGRESS':
      style = 'bg-amber-950/80 text-white font-bold border-amber-600';
      dotColor = 'bg-amber-400';
      break;

    case 'ONLINE':
    case 'SIMULATED CONNECTED':
    case 'CONNECTED':
    case 'RESOLVED':
      style = 'bg-emerald-950/80 text-white font-bold border-emerald-600';
      dotColor = 'bg-emerald-400';
      break;

    case 'DISPATCHED':
      style = 'bg-blue-950/80 text-white font-bold border-blue-600';
      dotColor = 'bg-blue-400';
      break;

    case 'DETECTED':
    case 'LOW':
    default:
      style = 'bg-slate-800 text-white font-bold border-slate-700';
      dotColor = 'bg-slate-300';
      break;
  }

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center space-x-1.5 rounded border font-mono font-medium ${sizeClass} ${style}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{status}</span>
    </span>
  );
};

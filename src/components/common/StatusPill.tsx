import React from 'react';

interface StatusPillProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusPill: React.FC<StatusPillProps> = ({ status, size = 'sm' }) => {
  let style = 'bg-surface text-text-muted border-border';
  let dotColor = 'bg-text-muted';

  const normalized = status.toUpperCase();

  switch (normalized) {
    case 'CRITICAL':
    case 'OFFLINE':
    case 'NOT ONBOARDED':
      style = 'bg-alert text-text font-bold border-alert';
      dotColor = 'bg-text';
      break;

    case 'HIGH':
    case 'MEDIUM':
    case 'DEGRADED':
    case 'PENDING':
    case 'ACKNOWLEDGED':
    case 'AI ANALYSIS':
    case 'ASSIGNED':
    case 'IN-PROGRESS':
      style = 'bg-surface text-accent font-bold border-accent';
      dotColor = 'bg-accent';
      break;

    case 'ONLINE':
    case 'SIMULATED CONNECTED':
    case 'CONNECTED':
    case 'RESOLVED':
    case 'DISPATCHED':
      style = 'bg-surface text-text font-bold border-border';
      dotColor = 'bg-text';
      break;

    case 'DETECTED':
    case 'LOW':
    default:
      style = 'bg-bg text-text-muted font-medium border-border';
      dotColor = 'bg-text-muted';
      break;
  }

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center space-x-1.5 rounded-xs border font-medium ${sizeClass} ${style}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{status}</span>
    </span>
  );
};

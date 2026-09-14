import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: string;
  trendPositive?: boolean;
  icon: React.ElementType;
  color?: 'blue' | 'emerald' | 'amber' | 'rose' | 'purple';
  targetTag?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  trend,
  trendPositive,
  icon: Icon,
  color = 'blue',
  targetTag = 'Target / simulated',
}) => {
  return (
    <div className="bg-surface border border-border border-l-4 border-l-accent rounded-sm p-4 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-semibold text-text-muted tracking-tight">
            {label}
          </div>
          <div className="text-3xl font-bold text-text mt-1.5 tracking-tight">
            {value}
          </div>
        </div>
        <div className="p-2 rounded border border-border bg-bg text-accent">
          <Icon className="w-5 h-5 shrink-0" />
        </div>
      </div>

      <div className="mt-3.5 flex items-center justify-between text-xs text-text-muted pt-2.5 border-t border-border">
        <div className="truncate">
          {trend && (
            <span className={`font-bold mr-1.5 ${trendPositive ? 'text-accent' : 'text-alert'}`}>
              {trend}
            </span>
          )}
          <span className="font-medium">{subtext || 'Simulated benchmark'}</span>
        </div>
        <span className="text-[11px] text-text-muted bg-bg px-2 py-0.5 rounded-xs border border-border shrink-0 ml-2 font-medium">
          {targetTag}
        </span>
      </div>
    </div>
  );
};

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
  const accentBorder = {
    blue: 'border-l-4 border-l-blue-600',
    emerald: 'border-l-4 border-l-emerald-600',
    amber: 'border-l-4 border-l-amber-600',
    rose: 'border-l-4 border-l-red-600',
    purple: 'border-l-4 border-l-purple-600',
  };

  const iconColorMap = {
    blue: 'text-blue-400 bg-slate-900 border-slate-700',
    emerald: 'text-emerald-400 bg-slate-900 border-slate-700',
    amber: 'text-amber-400 bg-slate-900 border-slate-700',
    rose: 'text-red-400 bg-slate-900 border-slate-700',
    purple: 'text-purple-400 bg-slate-900 border-slate-700',
  };

  return (
    <div className={`bg-[#0E1626] border border-slate-800 rounded-sm p-4 flex flex-col justify-between ${accentBorder[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-semibold text-slate-400 tracking-tight">
            {label}
          </div>
          <div className="text-3xl font-bold text-white mt-1.5 tracking-tight">
            {value}
          </div>
        </div>
        <div className={`p-2 rounded border ${iconColorMap[color]}`}>
          <Icon className="w-5 h-5 shrink-0" />
        </div>
      </div>

      <div className="mt-3.5 flex items-center justify-between text-xs text-slate-300 pt-2.5 border-t border-slate-800/80">
        <div className="truncate">
          {trend && (
            <span className={`font-bold mr-1.5 ${trendPositive ? 'text-emerald-400' : 'text-amber-400'}`}>
              {trend}
            </span>
          )}
          <span className="font-medium">{subtext || 'Simulated benchmark'}</span>
        </div>
        <span className="text-[11px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded-xs border border-slate-800 shrink-0 ml-2 font-medium">
          {targetTag}
        </span>
      </div>
    </div>
  );
};

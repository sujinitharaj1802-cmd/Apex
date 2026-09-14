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
  const colorTopBorder = {
    blue: 'border-t-4 border-t-blue-500',
    emerald: 'border-t-4 border-t-emerald-500',
    amber: 'border-t-4 border-t-amber-500',
    rose: 'border-t-4 border-t-red-500',
    purple: 'border-t-4 border-t-purple-500',
  };

  const iconColorMap = {
    blue: 'text-blue-400 bg-blue-950/60 border-blue-700/60',
    emerald: 'text-emerald-400 bg-emerald-950/60 border-emerald-700/60',
    amber: 'text-amber-400 bg-amber-950/60 border-amber-700/60',
    rose: 'text-red-400 bg-red-950/60 border-red-700/60',
    purple: 'text-purple-400 bg-purple-950/60 border-purple-700/60',
  };

  return (
    <div className={`bg-[#0F172A] border border-slate-800 rounded-lg p-4 shadow-md flex flex-col justify-between transition-all hover:shadow-lg ${colorTopBorder[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] font-bold text-white uppercase tracking-wider">
            {label}
          </div>
          <div className="text-3xl font-bold text-white mt-1.5 tracking-tight">
            {value}
          </div>
        </div>
        <div className={`p-2.5 rounded-lg border shadow-xs ${iconColorMap[color]}`}>
          <Icon className="w-5 h-5 shrink-0" />
        </div>
      </div>

      <div className="mt-3.5 flex items-center justify-between text-[11px] text-slate-200 pt-2.5 border-t border-slate-800/80">
        <div className="truncate">
          {trend && (
            <span className={`font-bold mr-1.5 ${trendPositive ? 'text-emerald-400' : 'text-amber-400'}`}>
              {trend}
            </span>
          )}
          <span className="font-semibold">{subtext || 'Simulated benchmark'}</span>
        </div>
        <span className="text-[10px] text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-700 shrink-0 ml-2 font-bold uppercase tracking-wider">
          {targetTag}
        </span>
      </div>
    </div>
  );
};

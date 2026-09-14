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
  const iconColorMap = {
    blue: 'text-blue-400 bg-slate-800 border-slate-700',
    emerald: 'text-emerald-400 bg-slate-800 border-slate-700',
    amber: 'text-amber-400 bg-slate-800 border-slate-700',
    rose: 'text-red-400 bg-slate-800 border-slate-700',
    purple: 'text-purple-400 bg-slate-800 border-slate-700',
  };

  return (
    <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-3.5 shadow-sm flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[12px] font-bold text-white uppercase tracking-wider">
            {label}
          </div>
          <div className="text-3xl font-bold text-white mt-1 tracking-tight">
            {value}
          </div>
        </div>
        <div className={`p-2 rounded border ${iconColorMap[color]}`}>
          <Icon className="w-5 h-5 shrink-0" />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-[12px] text-slate-200 pt-2 border-t border-slate-800">
        <div className="truncate">
          {trend && (
            <span className={`font-bold mr-1.5 ${trendPositive ? 'text-emerald-400' : 'text-amber-400'}`}>
              {trend}
            </span>
          )}
          <span>{subtext || 'Simulated benchmark'}</span>
        </div>
        <span className="text-[10px] text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-700 shrink-0 ml-2 font-bold">
          {targetTag}
        </span>
      </div>
    </div>
  );
};

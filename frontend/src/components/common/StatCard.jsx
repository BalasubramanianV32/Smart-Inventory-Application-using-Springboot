import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({
  title,
  value,
  trend,
  trendLabel = 'vs last month',
  icon: Icon,
  iconBgColor = 'bg-blue-50 text-blue-600',
}) => {
  const isPositive = trend > 0;
  const isNegative = trend < 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-lg ${iconBgColor} shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
      </div>

      {trend !== undefined && (
        <div className="mt-3 flex items-center text-xs">
          <span
            className={`inline-flex items-center font-semibold ${
              isPositive
                ? 'text-emerald-600'
                : isNegative
                ? 'text-rose-600'
                : 'text-slate-500'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
            ) : isNegative ? (
              <TrendingDown className="w-3.5 h-3.5 mr-1" />
            ) : null}
            {isPositive && '+'}
            {trend}%
          </span>
          <span className="ml-1.5 text-slate-400 font-normal">{trendLabel}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;

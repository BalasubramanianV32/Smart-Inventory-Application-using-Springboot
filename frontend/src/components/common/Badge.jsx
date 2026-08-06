import React from 'react';
import { getStatusBadgeVariant } from '../../utils/formatters';

const Badge = ({ children, status, variant, className = '' }) => {
  const badgeVariant = variant || (status ? getStatusBadgeVariant(status) : 'default');

  const variants = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    warning: 'bg-amber-50 text-amber-700 border-amber-200/80',
    danger: 'bg-rose-50 text-rose-700 border-rose-200/80',
    primary: 'bg-blue-50 text-blue-700 border-blue-200/80',
    secondary: 'bg-slate-100 text-slate-700 border-slate-200',
    default: 'bg-slate-50 text-slate-600 border-slate-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[badgeVariant]} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-75" />
      {children || status}
    </span>
  );
};

export default Badge;

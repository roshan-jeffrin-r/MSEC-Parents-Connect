import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  headerBorder?: boolean;
  density?: 'compact' | 'normal';
  accent?: 'blue' | 'emerald' | 'amber' | 'rose' | 'indigo' | 'slate' | 'none';
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  action,
  headerBorder = true,
  density = 'compact',
  accent = 'none',
  noPadding = false
}) => {
  const accentBorderStyles = {
    none: '',
    blue: 'border-t-2 border-t-blue-600',
    emerald: 'border-t-2 border-t-emerald-600',
    amber: 'border-t-2 border-t-amber-500',
    rose: 'border-t-2 border-t-rose-600',
    indigo: 'border-t-2 border-t-indigo-600',
    slate: 'border-t-2 border-t-slate-700'
  };

  const headerPadding = density === 'compact' ? 'px-4 py-3' : 'px-5 py-4';
  const bodyPadding = noPadding ? '' : density === 'compact' ? 'p-4' : 'p-5';

  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden transition-all duration-150 ${accentBorderStyles[accent]} ${className}`}
    >
      {(title || subtitle || action) && (
        <div
          className={`${headerPadding} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 ${
            headerBorder ? 'border-b border-slate-100 bg-slate-50/60' : ''
          }`}
        >
          <div className="min-w-0">
            {title && (
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2 truncate">
                {title}
              </h3>
            )}
            {subtitle && <p className="text-[11px] text-slate-500 mt-0.5 truncate">{subtitle}</p>}
          </div>
          {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
        </div>
      )}
      <div className={bodyPadding}>{children}</div>
    </div>
  );
};

import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  compact?: boolean;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  action,
  compact = false,
  className = ''
}) => {
  return (
    <div
      className={`text-center flex flex-col items-center justify-center ${
        compact ? 'p-4 sm:p-5' : 'p-8'
      } ${className}`}
    >
      <div
        className={`rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mb-2.5 ${
          compact ? 'w-9 h-9' : 'w-12 h-12'
        }`}
      >
        <Icon className={compact ? 'w-4 h-4' : 'w-6 h-6'} />
      </div>
      <h4 className="text-xs sm:text-sm font-bold text-slate-800">{title}</h4>
      {description && (
        <p className="text-[11px] sm:text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">
          {description}
        </p>
      )}
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-3 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold shadow-2xs transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

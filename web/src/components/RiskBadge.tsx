import { RiskBand } from '../types/api';

interface RiskBadgeProps {
  band: RiskBand;
  size?: 'sm' | 'md' | 'lg';
}

export function RiskBadge({ band, size = 'md' }: RiskBadgeProps) {
  const getStyles = () => {
    switch (band) {
      case 'High':
        return {
          pill: 'bg-red-50 text-red-700 border-red-200',
          dot: 'bg-red-500',
        };
      case 'Suspicious':
        return {
          pill: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
        };
      case 'Low / Inconclusive':
      default:
        return {
          pill: 'bg-zinc-100 text-zinc-700 border-zinc-200',
          dot: 'bg-zinc-400',
        };
    }
  };

  const config = getStyles();
  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-xs' 
    : size === 'lg' 
    ? 'px-3.5 py-1.5 text-sm font-semibold' 
    : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.pill} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} aria-hidden="true" />
      <span>{band}</span>
    </span>
  );
}

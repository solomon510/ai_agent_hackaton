import { Indicator } from '../types/api';
import { AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';

interface IndicatorCardProps {
  indicator: Indicator;
}

// HARD RULES: Indicator status has exactly three states and each must look different:
// detected | not_detected | not_assessable (with a reason shown).
// Status is NEVER color alone: always include a text label (and icon).
export function IndicatorCard({ indicator }: IndicatorCardProps) {
  const getStatusConfig = () => {
    switch (indicator.status) {
      case 'detected':
        return {
          icon: <AlertCircle className="w-4 h-4 text-red-600" />,
          label: 'Detected',
          bg: 'bg-red-50/50',
          border: 'border-red-200',
          text: 'text-red-700',
        };
      case 'not_detected':
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
          label: 'Not detected',
          bg: 'bg-white',
          border: 'border-zinc-200',
          text: 'text-zinc-600',
        };
      case 'not_assessable':
        return {
          icon: <HelpCircle className="w-4 h-4 text-zinc-400" />,
          label: 'Not assessable',
          bg: 'bg-zinc-50/50',
          border: 'border-dashed border-zinc-300',
          text: 'text-zinc-500',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`border rounded-lg p-3 transition-colors ${config.bg} ${config.border}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="flex-shrink-0 mt-0.5">{config.icon}</div>
          <div className="min-w-0">
            <h4 className="text-xs font-semibold text-zinc-900">{indicator.label}</h4>
            {indicator.status === 'not_assessable' && indicator.reason && (
              <p className="text-[11px] text-zinc-500 mt-0.5">{indicator.reason}</p>
            )}
            <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-zinc-400">
              <span>Tool: {indicator.tool}</span>
              {indicator.evidence && indicator.evidence.length > 0 && (
                <span className="text-amber-700 font-medium font-sans">
                  · {indicator.evidence.length} evidence span{indicator.evidence.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </div>

        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.text} bg-white border border-zinc-200 flex-shrink-0`}>
          {config.label}
        </span>
      </div>
    </div>
  );
}

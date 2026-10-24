import { Info } from 'lucide-react';

// HARD RULES: The uncertainty banner is always visible on Results, Review, and Incident detail pages:
// "No warning signs detected does not mean this message is safe."
export function UncertaintyBanner() {
  return (
    <div
      className="bg-zinc-50 border border-zinc-200 rounded-lg p-3 flex items-start gap-2.5 text-xs text-zinc-700"
      role="note"
      aria-live="polite"
    >
      <Info className="w-4 h-4 text-zinc-500 flex-shrink-0 mt-0.5" />
      <div>
        <span className="font-semibold text-zinc-900 mr-1.5">Uncertainty Notice:</span>
        <span>No warning signs detected does not mean this message is safe.</span>
      </div>
    </div>
  );
}

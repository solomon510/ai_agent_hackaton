import { AttackStep } from '../types/api';

interface AttackSequenceProps {
  steps: AttackStep[];
}

export function AttackSequence({ steps }: AttackSequenceProps) {
  if (steps.length === 0) {
    return (
      <div className="text-xs text-zinc-500 italic p-3 rounded-lg bg-zinc-50 border border-zinc-200">
        No attack sequence inferred from message content
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      <div className="relative pl-6 space-y-3 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-px before:bg-zinc-200">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center font-mono text-[10px] font-bold">
              {index + 1}
            </div>

            <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200">
              <p className="text-xs font-semibold text-zinc-900 mb-1">
                {step.step}
              </p>
              {step.evidence && step.evidence.length > 0 && (
                <div className="space-y-1 mt-1.5">
                  {step.evidence.map((e, i) => (
                    <div
                      key={i}
                      className="text-xs font-mono text-zinc-700 bg-white px-2 py-1 rounded border border-zinc-200 break-words"
                    >
                      "{e.text}"
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-zinc-400 italic">
        Inferred from message text; does not verify recipient actions.
      </p>
    </div>
  );
}

import { Check } from 'lucide-react';

interface StepperProps {
  currentStep: number; // 1-4
}

export function Stepper({ currentStep }: StepperProps) {
  const steps = [
    { number: 1, label: 'Message Input' },
    { number: 2, label: 'Forensic Analysis' },
    { number: 3, label: 'Human Review' },
    { number: 4, label: 'Saved Incident' },
  ];
  
  return (
    <nav aria-label="Investigation progress" className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-2 max-w-3xl mx-auto">
        {steps.map((step, idx) => {
          const isCurrent = step.number === currentStep;
          const isComplete = step.number < currentStep;
          
          return (
            <div key={step.number} className="flex items-center gap-2">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-colors ${
                  isCurrent
                    ? 'bg-zinc-900 text-white font-semibold'
                    : isComplete
                    ? 'bg-zinc-100 text-zinc-900 font-medium'
                    : 'text-zinc-400'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    isCurrent
                      ? 'bg-white text-zinc-900 font-bold'
                      : isComplete
                      ? 'bg-zinc-900 text-white'
                      : 'bg-zinc-200 text-zinc-500'
                  }`}
                >
                  {isComplete ? <Check className="w-2.5 h-2.5" /> : step.number}
                </div>
                <span>{step.label}</span>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden sm:block w-6 h-px bg-zinc-200" />
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}

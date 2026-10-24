import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useInvestigation } from '../../state/InvestigationContext';

interface StepperProps {
  currentStep: number; // 1-4
}

export function Stepper({ currentStep }: StepperProps) {
  const navigate = useNavigate();
  const { getAssessment } = useInvestigation();
  const assessment = getAssessment();

  const steps = [
    { number: 1, label: 'Message Input', path: '/' },
    { number: 2, label: 'Analysis', path: '/results', requiresAssessment: true },
    { number: 3, label: 'Review', path: '/review', requiresAssessment: true },
    { number: 4, label: 'Saved Incident', path: '/incidents' },
  ];

  const handleStepClick = (step: typeof steps[0]) => {
    if (step.requiresAssessment && !assessment) {
      navigate('/');
      return;
    }
    navigate(step.path);
  };
  
  return (
    <nav aria-label="Investigation progress" className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-2 max-w-3xl mx-auto">
        {steps.map((step, idx) => {
          const isCurrent = step.number === currentStep;
          const isComplete = step.number < currentStep;
          const isClickable = !step.requiresAssessment || !!assessment;
          
          return (
            <div key={step.number} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleStepClick(step)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-zinc-900 text-white font-semibold shadow-2xs hover:bg-zinc-800'
                    : isComplete
                    ? 'bg-zinc-100 text-zinc-900 font-medium hover:bg-zinc-200'
                    : isClickable
                    ? 'bg-transparent text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100'
                    : 'bg-transparent text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100'
                }`}
                aria-current={isCurrent ? 'step' : undefined}
                title={`Go to step ${step.number}: ${step.label}`}
              >
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    isCurrent
                      ? 'bg-white text-zinc-900 font-bold'
                      : isComplete
                      ? 'bg-zinc-900 text-white'
                      : 'bg-zinc-200 text-zinc-600'
                  }`}
                >
                  {isComplete ? <Check className="w-2.5 h-2.5" /> : step.number}
                </div>
                <span>{step.label}</span>
              </button>

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

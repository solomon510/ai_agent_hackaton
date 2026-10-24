import { useState } from 'react';
import { HelpCircle, CornerDownLeft, Loader2 } from 'lucide-react';

interface ClarificationPromptProps {
  question: string;
  originalMessage: string;
  onContinue: (answer: string) => void;
  isLoading?: boolean;
}

export function ClarificationPrompt({ question, originalMessage, onContinue, isLoading = false }: ClarificationPromptProps) {
  const [answer, setAnswer] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim()) {
      onContinue(answer.trim());
    }
  };
  
  return (
    <div className="space-y-4 max-w-2xl mx-auto py-4">
      <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-start gap-3.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0 text-zinc-900">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-semibold block mb-1">
              Clarification Request
            </span>
            <p className="text-sm text-zinc-900 font-semibold leading-relaxed">{question}</p>
          </div>
        </div>

        <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3.5 mb-4">
          <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
            Quarantined Message Context:
          </div>
          <p className="text-xs text-zinc-700 font-mono whitespace-pre-wrap">{originalMessage}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="clarification-answer" className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Your Answer / Additional Context
            </label>
            <input
              id="clarification-answer"
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm"
              placeholder="e.g. Yes, verified internal email or User reported SMS"
              disabled={isLoading}
              autoFocus
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!answer.trim() || isLoading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Continue Investigation</span>
                  <CornerDownLeft className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

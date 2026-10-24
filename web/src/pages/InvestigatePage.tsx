import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { AppShell } from '../components/layout/AppShell';
import { sampleMessages } from '../data/sampleMessages';
import { investigateMessage } from '../api/investigate';
import { useInvestigation } from '../state/InvestigationContext';
import { ErrorBanner } from '../components/ErrorBanner';
import { NoticeBanner } from '../components/NoticeBanner';
import { ClarificationPrompt } from '../components/ClarificationPrompt';
import { ChevronDown, ChevronRight, Play, Loader2, Sparkles, X } from 'lucide-react';

export function InvestigatePage() {
  const navigate = useNavigate();
  const { state, setMessage, setOptionalDetails, setResponse, reset } = useInvestigation();
  
  const [message, setMessageLocal] = useState(state.message || '');
  const [sender, setSender] = useState(state.sender || '');
  const [displayName, setDisplayName] = useState(state.display_name || '');
  const [headers, setHeaders] = useState(state.headers || '');
  const [showOptional, setShowOptional] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  
  // Keep local form fields synchronized with investigation context
  useEffect(() => {
    setMessageLocal(state.message || '');
    setSender(state.sender || '');
    setDisplayName(state.display_name || '');
    setHeaders(state.headers || '');
  }, [state.message, state.sender, state.display_name, state.headers]);

  const mutation = useMutation({
    mutationFn: investigateMessage,
    onSuccess: (response) => {
      setResponse(response);
      if (response.type === 'assessment') {
        navigate('/results');
      }
    },
  });
  
  const isValid = message.trim().length > 0 && message.length <= 3000;
  
  const handleSampleClick = (sampleMsg: string) => {
    setMessageLocal(sampleMsg);
    setMessage(sampleMsg);
  };
  
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessageLocal(value);
    setMessage(value);
  };

  const handleClear = () => {
    reset();
    setMessageLocal('');
    setSender('');
    setDisplayName('');
    setHeaders('');
  };
  
  const handleAnalyze = () => {
    if (!isValid) return;
    
    setOptionalDetails({ sender, display_name: displayName, headers });
    
    setProgressStep(1);
    const interval = setInterval(() => {
      setProgressStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 450);
    
    mutation.mutate(
      { 
        message: message.trim(), 
        sender: sender.trim() || undefined,
        display_name: displayName.trim() || undefined,
        headers: headers.trim() || undefined,
      },
      {
        onSettled: () => {
          clearInterval(interval);
          setProgressStep(0);
        },
      }
    );
  };
  
  const handleClarificationContinue = (answer: string) => {
    setOptionalDetails({ sender, display_name: displayName, headers });
    setProgressStep(1);
    const interval = setInterval(() => {
      setProgressStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 450);
    
    mutation.mutate(
      { 
        message: message.trim(),
        sender: sender.trim() || undefined,
        display_name: displayName.trim() || undefined,
        headers: headers.trim() || undefined,
        clarification_answer: answer,
      },
      {
        onSettled: () => {
          clearInterval(interval);
          setProgressStep(0);
        },
      }
    );
  };
  
  const progressSteps = [
    "Inspecting indicators & defanging links offline",
    "Verifying domain reputations & social engineering markers", 
    "Searching security handbook guidelines",
    "Scoring risk & drafting guidance"
  ];
  
  return (
    <AppShell showStepper={true}>
      <div className="max-w-3xl mx-auto space-y-8 py-2">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-medium text-zinc-800">
            <Sparkles className="w-3.5 h-3.5 text-zinc-600" />
            <span>Autonomous Security Investigation</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950">
            Next-gen Message Investigation Desk
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 max-w-xl mx-auto leading-relaxed">
            Analyze suspicious messages for phishing and social engineering offline, verify domain reputations, and draft guidance tickets with human-in-the-loop sign-off.
          </p>

          <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 font-medium pt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span><strong className="text-zinc-900">Deterministic</strong> Scoring</span>
            <span className="text-zinc-300">·</span>
            <span>Zero External Network Calls</span>
          </div>
        </div>
        
        {mutation.isError && (
          <ErrorBanner
            message={mutation.error instanceof Error ? mutation.error.message : 'Analysis failed. Please retry.'}
            onRetry={handleAnalyze}
          />
        )}
        
        {mutation.data?.type === 'clarification' ? (
          <ClarificationPrompt
            question={mutation.data.question}
            originalMessage={message}
            onContinue={handleClarificationContinue}
            isLoading={mutation.isPending}
          />
        ) : (
          <div className="space-y-5">
            {/* Sample Scenarios Bar */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-semibold text-zinc-900">
                  Sample messages (fictitious)
                </span>
                <span className="text-[11px] text-zinc-400">Click to prefill</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {sampleMessages.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSampleClick(sample.message)}
                    className="px-3 py-1.5 text-xs font-medium bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-200 rounded-lg transition-colors shadow-2xs cursor-pointer"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Input Card */}
            <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="message" className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
                  Suspicious message
                </label>
                <div className="flex items-center gap-3">
                  {(message.length > 0 || sender || displayName || headers) && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-950 font-medium underline cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                      <span>Clear inputs</span>
                    </button>
                  )}
                  <span className={`text-xs font-mono ${message.length > 3000 ? 'text-red-600 font-bold' : 'text-zinc-400'}`}>
                    {message.length} / 3000
                  </span>
                </div>
              </div>

              <textarea
                id="message"
                value={message}
                onChange={handleMessageChange}
                className="w-full px-3.5 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 font-mono text-xs leading-relaxed min-h-[140px] resize-y"
                placeholder="Paste the suspicious email, SMS, or chat text here..."
                disabled={mutation.isPending}
              />

              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400">All links defanged into hxxp[://] offline</span>
                {message.length > 3000 && (
                  <span className="text-red-600 font-medium">Message too long</span>
                )}
                {message.trim().length === 0 && message.length > 0 && (
                  <span className="text-red-600 font-medium">Message cannot be empty</span>
                )}
              </div>
            </div>
            
            {/* Optional Details Accordion */}
            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-2xs">
              <button
                onClick={() => setShowOptional(!showOptional)}
                className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors text-left cursor-pointer"
                aria-expanded={showOptional}
              >
                <span className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
                  Optional details (sender, display name, headers)
                </span>
                {showOptional ? (
                  <ChevronDown className="w-4 h-4 text-zinc-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                )}
              </button>
              
              {showOptional && (
                <div className="p-4 space-y-4 border-t border-zinc-100 bg-zinc-50/50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="sender" className="block text-xs font-medium text-zinc-700 mb-1">
                        Sender address
                      </label>
                      <input
                        id="sender"
                        type="text"
                        value={sender}
                        onChange={(e) => setSender(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                        placeholder="e.g. suspicious@example.com"
                        disabled={mutation.isPending}
                      />
                    </div>
                    <div>
                      <label htmlFor="displayName" className="block text-xs font-medium text-zinc-700 mb-1">
                        Display name
                      </label>
                      <input
                        id="displayName"
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                        placeholder="e.g. IT Support"
                        disabled={mutation.isPending}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="headers" className="block text-xs font-medium text-zinc-700 mb-1">
                      Headers
                    </label>
                    <textarea
                      id="headers"
                      value={headers}
                      onChange={(e) => setHeaders(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 font-mono min-h-[70px]"
                      placeholder="Email headers..."
                      disabled={mutation.isPending}
                    />
                  </div>
                </div>
              )}
            </div>
            
            <NoticeBanner message="Links are extracted as text and are never opened. Analysis is text-only." />
            
            {/* Progress or Actions */}
            {mutation.isPending && progressStep > 0 ? (
              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Loader2 className="w-4 h-4 text-zinc-900 animate-spin" />
                  <p className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
                    Analyzing message...
                  </p>
                </div>
                <ul className="space-y-2">
                  {progressSteps.map((step, index) => {
                    const isPassed = index + 1 <= progressStep;
                    return (
                      <li key={index} className="flex items-center gap-2.5 text-xs">
                        <div
                          className={`w-2 h-2 rounded-full transition-colors ${
                            isPassed ? 'bg-zinc-900' : 'bg-zinc-300'
                          }`}
                        />
                        <span className={isPassed ? 'text-zinc-900 font-medium' : 'text-zinc-400'}>
                          {step}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <div className="pt-2">
                <button
                  onClick={handleAnalyze}
                  disabled={!isValid || mutation.isPending}
                  className="w-full py-3.5 px-6 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold rounded-lg shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Analyze Message</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { AppShell } from '../components/layout/AppShell';
import { useInvestigation } from '../state/InvestigationContext';
import { createIncident } from '../api/incidents';
import { RiskBadge } from '../components/RiskBadge';
import { UncertaintyBanner } from '../components/UncertaintyBanner';
import { EvidenceHighlight } from '../components/EvidenceHighlight';
import { GuidanceCard } from '../components/GuidanceCard';
import { ErrorBanner } from '../components/ErrorBanner';
import { Spinner } from '../components/Spinner';
import { CheckCircle2, ExternalLink, ShieldCheck, ArrowLeft, AlertTriangle } from 'lucide-react';

export function ReviewPage() {
  const navigate = useNavigate();
  const { getAssessment, state, setEditedDraft, setReviewerName, setCheckboxChecked, setSaveResult, reset } = useInvestigation();
  const assessment = getAssessment();
  
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  
  if (!assessment) {
    navigate('/');
    return null;
  }
  
  const originalDraft = assessment.draft;
  const editedDraft = state.editedDraft ?? originalDraft;
  const draftEdited = editedDraft !== originalDraft;
  
  const allEvidence = [
    ...assessment.indicators.flatMap(i => i.evidence),
    ...assessment.social_engineering.flatMap(i => i.evidence),
  ];
  
  const mutation = useMutation({
    mutationFn: createIncident,
    onSuccess: (result) => {
      setSaveResult(result);
    },
  });
  
  const canSave = state.checkboxChecked && !mutation.isPending;
  
  const handleSave = () => {
    if (!canSave) return;
    
    mutation.mutate({
      approved: true,
      reviewed_by: state.reviewerName?.trim() || undefined,
      draft: editedDraft,
      draft_edited: draftEdited,
      assessment: assessment,
    });
  };
  
  const handleDiscard = () => {
    reset();
    navigate('/');
  };
  
  // Show success state
  if (mutation.isSuccess && state.saveResult) {
    return (
      <AppShell showStepper={true}>
        <div className="max-w-xl mx-auto py-12">
          <div className="bg-white border border-zinc-200 rounded-2xl p-8 text-center shadow-sm">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4 text-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-zinc-950 mb-1">Incident Saved</h1>
            <p className="text-sm text-zinc-600 mb-6">
              The investigation has been successfully reviewed and saved to the database.
            </p>
            
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 mb-6 text-left space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center py-1 border-b border-zinc-200">
                <span className="text-zinc-500">Incident ID:</span>
                <span className="text-zinc-950 font-bold">{state.saveResult.id}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-zinc-200">
                <span className="text-zinc-500">Status:</span>
                <span className="text-emerald-700 font-semibold uppercase">{state.saveResult.status}</span>
              </div>
              {state.reviewerName && (
                <div className="flex justify-between items-center py-1">
                  <span className="text-zinc-500">Reviewed by:</span>
                  <span className="text-zinc-900">{state.reviewerName}</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate(`/incidents/${state.saveResult!.id}`)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
              >
                <span>View in Saved Incidents</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => { reset(); navigate('/'); }}
                className="inline-flex items-center justify-center px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-lg text-xs font-semibold transition-colors"
              >
                Investigate another message
              </button>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }
  
  return (
    <AppShell showStepper={true}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950 mb-1">
            Review & Save
          </h1>
          <p className="text-sm text-zinc-600">
            Review the investigation results, adjust guidance if needed, and confirm to persist.
          </p>
        </div>
        
        {mutation.isError && (
          <ErrorBanner
            message={mutation.error instanceof Error ? mutation.error.message : 'Failed to save incident record'}
            onRetry={handleSave}
          />
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Read-only summary */}
          <div className="space-y-4">
            <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
              <h2 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-2">
                Original message
              </h2>
              <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3.5 mb-3">
                <EvidenceHighlight text={assessment.message} evidences={allEvidence} />
              </div>

              <h3 className="text-xs font-semibold text-zinc-900 mb-2">
                Evidence summary
              </h3>
              <div className="space-y-1.5">
                {assessment.indicators
                  .filter(i => i.status === 'detected' && i.evidence.length > 0)
                  .flatMap(i => i.evidence)
                  .slice(0, 5)
                  .map((evidence, index) => (
                    <div key={index} className="text-xs text-amber-900 font-mono bg-amber-50 px-2.5 py-1.5 rounded border border-amber-200">
                      "{evidence.text}"
                    </div>
                  ))}
              </div>
            </div>
            
            <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
              <h2 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-3">
                Guidance
              </h2>
              <div className="space-y-2">
                {assessment.guidance.map((guidance) => (
                  <GuidanceCard key={guidance.id} guidance={guidance} />
                ))}
              </div>
            </div>
            
            <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-3">
              <h2 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
                Assessment
              </h2>
              <p className="text-sm text-zinc-700 leading-relaxed">{assessment.assessment}</p>
              
              <div className="flex items-center gap-2">
                <RiskBadge band={assessment.risk.band} />
                <span className="text-xs text-zinc-500 font-mono">Score: {assessment.risk.score} / 100</span>
              </div>
              
              <UncertaintyBanner />
              
              <div className="pt-2">
                <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-2">
                  Next steps
                </h3>
                <ol className="list-decimal list-inside space-y-1 text-xs text-zinc-600">
                  {assessment.next_steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
          
          {/* Right Column: Editable Draft & Approval */}
          <div className="space-y-4">
            <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
                  User guidance draft
                </h2>
                {draftEdited && (
                  <span className="text-[10px] font-mono text-zinc-600 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded">
                    Edited
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 mb-3">
                Nothing is sent automatically; you can edit this draft.
              </p>
              <textarea
                value={editedDraft}
                onChange={(e) => setEditedDraft(e.target.value)}
                className="w-full px-3.5 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 font-mono text-xs leading-relaxed min-h-[200px]"
                disabled={mutation.isPending}
              />
            </div>
            
            {/* The Strict Approval Panel */}
            <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
              <div>
                <label htmlFor="reviewer" className="block text-xs font-medium text-zinc-700 mb-1">
                  Your name or initials (optional)
                </label>
                <input
                  id="reviewer"
                  type="text"
                  value={state.reviewerName || ''}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  placeholder="e.g. JD"
                  disabled={mutation.isPending}
                />
              </div>
              
              <label className="flex items-start gap-2.5 p-3 bg-zinc-50 border border-zinc-200 rounded-lg cursor-pointer hover:bg-zinc-100/70 transition-colors">
                <input
                  type="checkbox"
                  checked={state.checkboxChecked}
                  onChange={(e) => setCheckboxChecked(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-zinc-900 rounded border-zinc-300 focus:ring-0 cursor-pointer"
                  disabled={mutation.isPending}
                />
                <span className="text-xs text-zinc-800 leading-normal select-none">
                  I have reviewed the evidence and approve saving this incident.
                </span>
              </label>
              
              <button
                onClick={handleSave}
                disabled={!canSave}
                className="w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                {mutation.isPending ? (
                  <>
                    <Spinner className="w-4 h-4 text-white" />
                    <span>Saving incident...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Approve & Save Incident</span>
                  </>
                )}
              </button>
              
              <p className="text-[11px] text-zinc-400 text-center font-mono">
                The incident ID and status appear only after the database confirms the save.
              </p>
              
              <div className="pt-2 border-t border-zinc-100 flex gap-2">
                <button
                  onClick={() => navigate('/results')}
                  className="flex-1 py-2 px-3 border border-zinc-200 hover:bg-zinc-50 text-zinc-700 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Results</span>
                </button>
                <button
                  onClick={() => setShowDiscardDialog(true)}
                  disabled={mutation.isPending}
                  className="py-2 px-3 border border-zinc-200 hover:bg-red-50 hover:border-red-200 text-red-600 rounded-lg text-xs font-medium transition-colors"
                >
                  Discard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Discard Confirmation Modal */}
      {showDiscardDialog && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-2xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-zinc-200 rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-base font-bold text-zinc-950 mb-2">
              Discard investigation?
            </h3>
            <p className="text-xs text-zinc-600 mb-6 leading-relaxed">
              This will remove all current investigation data. This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowDiscardDialog(false)}
                className="px-4 py-2 border border-zinc-200 text-zinc-700 hover:bg-zinc-50 rounded-lg text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDiscard}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

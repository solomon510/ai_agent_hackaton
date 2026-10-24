import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AppShell } from '../components/layout/AppShell';
import { getIncident } from '../api/incidents';
import { RiskBadge } from '../components/RiskBadge';
import { UncertaintyBanner } from '../components/UncertaintyBanner';
import { EvidenceHighlight } from '../components/EvidenceHighlight';
import { UrlList } from '../components/UrlList';
import { AttackSequence } from '../components/AttackSequence';
import { GuidanceCard } from '../components/GuidanceCard';
import { IndicatorCard } from '../components/IndicatorCard';
import { ActivityLog } from '../components/ActivityLog';
import { ErrorBanner } from '../components/ErrorBanner';
import { Spinner } from '../components/Spinner';
import { ArrowLeft } from 'lucide-react';
import { formatDate } from '../lib/format';

export function IncidentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: incident, isLoading, isError, error } = useQuery({
    queryKey: ['incident', id],
    queryFn: () => getIncident(id!),
    enabled: !!id,
  });
  
  if (isLoading) {
    return (
      <AppShell showStepper={true}>
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Spinner className="w-8 h-8 text-zinc-900" />
          <span className="text-xs text-zinc-500">Loading incident...</span>
        </div>
      </AppShell>
    );
  }
  
  if (isError || !incident) {
    return (
      <AppShell showStepper={true}>
        <div className="max-w-xl mx-auto py-10 space-y-4">
          <ErrorBanner
            message={error instanceof Error ? error.message : 'Incident not found'}
          />
          <button
            onClick={() => navigate('/incidents')}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-zinc-800 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to incidents</span>
          </button>
        </div>
      </AppShell>
    );
  }
  
  const assessment = incident.assessment;
  const allEvidence = [
    ...assessment.indicators.flatMap(i => i.evidence),
    ...assessment.social_engineering.flatMap(i => i.evidence),
  ];
  
  return (
    <AppShell showStepper={true}>
      <div className="space-y-6">
        {/* Header Breadcrumb & Status */}
        <div>
          <button
            onClick={() => navigate('/incidents')}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-950 mb-3 transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to incidents</span>
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
                Incident #{incident.id}
              </h1>
            </div>

            <div>
              <RiskBadge band={assessment.risk.band} size="lg" />
            </div>
          </div>
          
          {/* Metadata bar */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 mt-2.5 pt-2.5 border-t border-zinc-100">
            <span>Created: {formatDate(incident.created_at)}</span>
            <span>Approved: {formatDate(incident.approved_at)}</span>
            <span>Status: <strong className="text-zinc-900 font-semibold">{incident.status}</strong></span>
            {incident.reviewed_by && (
              <span>Reviewed by: <strong className="text-zinc-900 font-semibold">{incident.reviewed_by}</strong></span>
            )}
            <span>Draft edited: {incident.draft_edited ? 'Yes' : 'No'}</span>
          </div>
        </div>
        
        {/* Risk Overview HUD */}
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <RiskBadge band={assessment.risk.band} />
            <h2 className="text-base font-semibold text-zinc-950">
              Risk Assessment
            </h2>
          </div>
          <p className="text-sm text-zinc-700 leading-relaxed">{assessment.assessment}</p>
          <UncertaintyBanner />
        </div>
        
        {/* Two-Column Telemetry */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
              <h2 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-2">
                Original message
              </h2>
              <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3.5 overflow-x-auto">
                <EvidenceHighlight text={assessment.message} evidences={allEvidence} />
              </div>
            </div>
            
            <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
              <UrlList urls={assessment.urls} />
            </div>
            
            <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
              <h2 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-3 pb-2 border-b border-zinc-100">
                Attack sequence
              </h2>
              <AttackSequence steps={assessment.attack_sequence} />
            </div>
            
            <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
              <h2 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-3 pb-2 border-b border-zinc-100">
                Retrieved guidance
              </h2>
              <div className="space-y-2">
                {assessment.guidance.map((guidance) => (
                  <GuidanceCard key={guidance.id} guidance={guidance} />
                ))}
              </div>
            </div>
            
            <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
              <h2 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-2">
                Final draft
              </h2>
              <pre className="text-xs text-zinc-800 font-mono whitespace-pre-wrap bg-zinc-50 p-3.5 rounded-lg border border-zinc-200 leading-relaxed">
                {incident.final_draft}
              </pre>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-4">
            <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
              <div>
                <h2 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-3">
                  Indicator checks
                </h2>
                <div className="space-y-2">
                  {['credential_request', 'urgency', 'ip_address_link', 'trusted_domain_mismatch'].map((id) => {
                    const indicator = assessment.indicators.find(i => i.id === id);
                    if (indicator) {
                      return <IndicatorCard key={indicator.id} indicator={indicator} />;
                    }
                    return null;
                  })}
                  
                  {assessment.indicators
                    .filter(i => !['credential_request', 'urgency', 'ip_address_link', 'trusted_domain_mismatch'].includes(i.id))
                    .map((indicator) => (
                      <IndicatorCard key={indicator.id} indicator={indicator} />
                    ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-2">
                  Social engineering tactics
                </h3>
                {assessment.social_engineering.length === 0 ? (
                  <p className="text-xs text-zinc-500 italic p-2.5 rounded-lg bg-zinc-50 border border-zinc-200">
                    None detected
                  </p>
                ) : (
                  <div className="space-y-2">
                    {assessment.social_engineering.map((indicator) => (
                      <IndicatorCard key={indicator.id} indicator={indicator} />
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-2">
                  Domain reputation
                </h3>
                {assessment.domain_reputation.length === 0 ? (
                  <p className="text-xs text-zinc-500 italic p-2.5 rounded-lg bg-zinc-50 border border-zinc-200">
                    No domains checked
                  </p>
                ) : (
                  <div className="space-y-1.5 mb-2">
                    {assessment.domain_reputation.map((domain, index) => (
                      <div key={index} className="text-xs p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-zinc-900 font-medium">{domain.host}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                            domain.status === 'known_safe' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            domain.status === 'known_suspicious' ? 'bg-red-50 text-red-700 border border-red-200' :
                            'bg-zinc-100 text-zinc-700 border border-zinc-200'
                          }`}>
                            {domain.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-500">Source: {domain.source}</div>
                        {domain.note && <div className="text-[11px] text-zinc-500 mt-0.5">{domain.note}</div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="pt-3 border-t border-zinc-100">
                <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-2">
                  Risk breakdown
                </h3>
                <div className="space-y-1.5 bg-zinc-50 p-3 rounded-lg border border-zinc-200 text-xs">
                  {assessment.risk.breakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-zinc-600">
                      <span>{item.rule}</span>
                      <span className="text-zinc-900 font-mono font-medium">+{item.points}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between font-bold pt-2 border-t border-zinc-200 mt-2 text-zinc-900">
                    <span>Total Score</span>
                    <span className="font-mono">{assessment.risk.score} / 100</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
              <h2 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-2">
                Next steps
              </h2>
              <ol className="list-decimal list-inside space-y-1.5 text-xs text-zinc-600">
                {assessment.next_steps.map((step, index) => (
                  <li key={index} className="leading-relaxed">{step}</li>
                ))}
              </ol>
            </div>
            
            {assessment.activity && assessment.activity.length > 0 && (
              <ActivityLog activities={assessment.activity} />
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

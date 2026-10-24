import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { useInvestigation } from '../state/InvestigationContext';
import { RiskBadge } from '../components/RiskBadge';
import { UncertaintyBanner } from '../components/UncertaintyBanner';
import { EvidenceHighlight } from '../components/EvidenceHighlight';
import { UrlList } from '../components/UrlList';
import { AttackSequence } from '../components/AttackSequence';
import { GuidanceCard } from '../components/GuidanceCard';
import { IndicatorCard } from '../components/IndicatorCard';
import { ActivityLog } from '../components/ActivityLog';
import { ArrowLeft, ArrowRight, AlertTriangle } from 'lucide-react';

export function ResultsPage() {
  const navigate = useNavigate();
  const { getAssessment } = useInvestigation();
  const assessment = getAssessment();
  
  if (!assessment) {
    navigate('/');
    return null;
  }
  
  // Collect all evidence from indicators and social engineering
  const allEvidence = [
    ...assessment.indicators.flatMap(i => i.evidence),
    ...assessment.social_engineering.flatMap(i => i.evidence),
  ];
  
  return (
    <AppShell showStepper={true}>
      <div className="space-y-6">
        {/* Top Diagnostic HUD */}
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <RiskBadge band={assessment.risk.band} size="lg" />
                <span className="text-xs font-mono text-zinc-500">
                  Score: <strong className="text-zinc-900 font-bold">{assessment.risk.score} pts</strong>
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight">
                {assessment.assessment}
              </h1>
            </div>

            <button
              onClick={() => navigate('/review')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm flex-shrink-0"
            >
              <span>Continue to Review</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <UncertaintyBanner />
        </div>
        
        {/* Split Telemetry Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Quarantined Text with Highlights */}
            <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-100">
                <h2 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
                  Original message
                </h2>
                <span className="text-[11px] font-mono text-zinc-500">
                  {allEvidence.length} marked evidence span{allEvidence.length === 1 ? '' : 's'}
                </span>
              </div>
              <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3.5 overflow-x-auto">
                <EvidenceHighlight text={assessment.message} evidences={allEvidence} />
              </div>
            </div>
            
            {/* Extracted Defanged URLs */}
            <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
              <UrlList urls={assessment.urls} />
            </div>
            
            {/* Attack Sequence */}
            <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
              <h2 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-3 pb-2 border-b border-zinc-100">
                Attack sequence
              </h2>
              <AttackSequence steps={assessment.attack_sequence} />
            </div>
            
            {/* Retrieved Handbook Guidance */}
            <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-100">
                <h2 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
                  Retrieved guidance
                </h2>
                <span className="text-[11px] text-zinc-400">
                  {assessment.guidance.length} section{assessment.guidance.length === 1 ? '' : 's'}
                </span>
              </div>
              <div className="space-y-2">
                {assessment.guidance.map((guidance) => (
                  <GuidanceCard key={guidance.id} guidance={guidance} />
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-4">
            {/* Indicator Checks */}
            <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
              <div>
                <h2 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-1">
                  Indicator checks
                </h2>
                <p className="text-[11px] text-zinc-500 mb-3">
                  Credential request, Urgency, IP-address link, Trusted-domain mismatch
                </p>
                
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

              {/* Social Engineering Tactics */}
              <div>
                <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-2">
                  Social engineering tactics
                </h3>
                {assessment.social_engineering.length === 0 ? (
                  <div className="text-xs text-zinc-500 italic p-2.5 rounded-lg bg-zinc-50 border border-zinc-200">
                    None detected
                  </div>
                ) : (
                  <div className="space-y-2">
                    {assessment.social_engineering.map((indicator) => (
                      <IndicatorCard key={indicator.id} indicator={indicator} />
                    ))}
                  </div>
                )}
              </div>

              {/* Domain Reputation */}
              <div>
                <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-2">
                  Domain reputation
                </h3>
                {assessment.domain_reputation.length === 0 ? (
                  <div className="text-xs text-zinc-500 italic p-2.5 rounded-lg bg-zinc-50 border border-zinc-200">
                    No domains to check
                  </div>
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
                <p className="text-[10px] text-zinc-400 italic font-mono">Unknown is not the same as safe or malicious.</p>
              </div>

              {/* Risk Breakdown */}
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
                <p className="text-[10px] text-zinc-400 italic mt-1 font-mono">Heuristic score, not a probability.</p>
              </div>
            </div>
            
            {/* Validation Issues Alert */}
            {!assessment.validation.passed && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-wider mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Validation Issues</span>
                </div>
                <ul className="space-y-1">
                  {assessment.validation.issues.map((issue, index) => (
                    <li key={index} className="text-xs text-amber-700">• {issue}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Activity Trace */}
            <ActivityLog activities={assessment.activity} />
          </div>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-zinc-200">
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-zinc-300 hover:bg-zinc-50 text-zinc-700 rounded-lg text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Edit message</span>
          </button>
          
          <button
            onClick={() => navigate('/review')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
          >
            <span>Continue to Review</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </AppShell>
  );
}

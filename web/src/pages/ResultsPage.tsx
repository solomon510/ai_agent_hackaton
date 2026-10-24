import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { useInvestigation } from '../state/InvestigationContext';
import { UncertaintyBanner } from '../components/UncertaintyBanner';
import { EvidenceHighlight } from '../components/EvidenceHighlight';
import { UrlList } from '../components/UrlList';
import { AttackSequence } from '../components/AttackSequence';
import { GuidanceCard } from '../components/GuidanceCard';
import { IndicatorCard } from '../components/IndicatorCard';
import { ActivityLog } from '../components/ActivityLog';
import { ArrowLeft, ArrowRight, ShieldAlert, AlertTriangle, Link2, CheckCircle2, Scan, ShieldCheck } from 'lucide-react';

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

  const detectedSignalsCount = 
    assessment.indicators.filter(i => i.status === 'detected').length + 
    assessment.social_engineering.filter(i => i.status === 'detected').length;

  const isHighRisk = assessment.risk.band === 'High';
  const isSuspicious = assessment.risk.band === 'Suspicious';

  const headerConfig = isHighRisk ? {
    bg: 'bg-[#FFF5F5]',
    border: 'border-red-200/80',
    iconBg: 'bg-red-600',
    eyebrowColor: 'text-red-700',
    eyebrowText: 'IMMEDIATE ATTENTION RECOMMENDED',
    badgeBorder: 'border-red-200',
    badgeBg: 'bg-white',
    badgeText: 'text-red-700',
    scoreColor: 'text-red-600',
    pinColor: 'bg-red-600',
    dividerColor: 'border-red-200/60',
  } : isSuspicious ? {
    bg: 'bg-[#FFFBEB]',
    border: 'border-amber-200/80',
    iconBg: 'bg-amber-600',
    eyebrowColor: 'text-amber-800',
    eyebrowText: 'FURTHER CAUTION & VERIFICATION RECOMMENDED',
    badgeBorder: 'border-amber-200',
    badgeBg: 'bg-white',
    badgeText: 'text-amber-800',
    scoreColor: 'text-amber-600',
    pinColor: 'bg-amber-600',
    dividerColor: 'border-amber-200/60',
  } : {
    bg: 'bg-zinc-50',
    border: 'border-zinc-200',
    iconBg: 'bg-zinc-800',
    eyebrowColor: 'text-zinc-600',
    eyebrowText: 'STANDARD VIGILANCE RECOMMENDED',
    badgeBorder: 'border-zinc-200',
    badgeBg: 'bg-white',
    badgeText: 'text-zinc-700',
    scoreColor: 'text-zinc-700',
    pinColor: 'bg-zinc-800',
    dividerColor: 'border-zinc-200',
  };
  
  return (
    <AppShell showStepper={true}>
      <div className="space-y-6">
        {/* Title & Continue CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight">
            Message analysis
          </h1>

          <button
            onClick={() => navigate('/review')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
          >
            <span>Continue to Review</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Top Diagnostic HUD Widget (matching the exact design from the reference screenshot) */}
        <div className={`${headerConfig.bg} ${headerConfig.border} border rounded-2xl p-6 sm:p-7 shadow-xs`}>
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
            {/* Left section: Icon + Eyebrow + Title + Description */}
            <div className="flex items-start gap-4 flex-1">
              <div className={`w-12 h-12 rounded-xl ${headerConfig.iconBg} text-white flex items-center justify-center shadow-sm flex-shrink-0 mt-0.5`}>
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${headerConfig.eyebrowColor} block font-sans`}>
                  {headerConfig.eyebrowText}
                </span>

                <div className="flex items-center gap-2.5">
                  <h2 className="text-2xl font-bold text-zinc-950 tracking-tight">
                    {assessment.risk.band} risk
                  </h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${headerConfig.badgeBg} ${headerConfig.badgeBorder} ${headerConfig.badgeText} border shadow-2xs`}>
                    {assessment.risk.band}
                  </span>
                </div>

                <p className="text-sm text-zinc-700 leading-relaxed max-w-2xl">
                  {assessment.assessment}
                </p>
              </div>
            </div>

            {/* Right section: Elevated Risk Score Widget with Gradient Spectrum Track */}
            <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs w-full lg:w-72 flex-shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  RISK SCORE
                </span>
                <div className="text-2xl font-extrabold text-zinc-950 font-mono tracking-tight">
                  <span className={headerConfig.scoreColor}>{assessment.risk.score}</span>
                  <span className="text-xs font-normal text-zinc-400">/100</span>
                </div>
              </div>

              {/* Gradient Track Slider with Dynamic Thumb */}
              <div className="relative my-3.5">
                <div className="h-2 w-full rounded-full bg-gradient-to-r from-sky-300 via-amber-400 to-red-500" />
                <div
                  className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full ${headerConfig.pinColor} border-2 border-white shadow-md transition-all duration-500`}
                  style={{ left: `${Math.min(Math.max(assessment.risk.score, 4), 96)}%` }}
                  title={`Risk Score: ${assessment.risk.score}/100`}
                />
              </div>

              <div className="flex justify-between text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                <span>LOW</span>
                <span>SUSPICIOUS</span>
                <span>HIGH</span>
              </div>

              <p className="text-[11px] text-zinc-400 text-center mt-3">
                Heuristic score, not a probability.
              </p>
            </div>
          </div>

          {/* Bottom section: 3 Metric Columns with Divider */}
          <div className={`border-t ${headerConfig.dividerColor} mt-6 pt-5 grid grid-cols-1 sm:grid-cols-3 gap-6`}>
            {/* Metric 1: Signals Detected */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-100/70 border border-red-200 flex items-center justify-center text-red-600 flex-shrink-0">
                <Scan className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xl font-bold text-zinc-950 font-mono leading-none mb-1">
                  {detectedSignalsCount}
                </div>
                <div className="text-xs text-zinc-500">
                  signals detected
                </div>
              </div>
            </div>

            {/* Metric 2: Links Extracted */}
            <div className="flex items-center gap-3 sm:border-l sm:border-zinc-200/80 sm:pl-6">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 flex-shrink-0">
                <Link2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xl font-bold text-zinc-950 font-mono leading-none mb-1">
                  {assessment.urls.length}
                </div>
                <div className="text-xs text-zinc-500">
                  links extracted
                </div>
              </div>
            </div>

            {/* Metric 3: Evidence Validation */}
            <div className="flex items-center gap-3 sm:border-l sm:border-zinc-200/80 sm:pl-6">
              <div className="w-9 h-9 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700 flex-shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xl font-bold text-zinc-950 leading-none mb-1">
                  {assessment.validation.passed ? 'Passed' : 'Review'}
                </div>
                <div className="text-xs text-zinc-500">
                  evidence validation
                </div>
              </div>
            </div>
          </div>
        </div>

        <UncertaintyBanner />
        
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
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-zinc-300 hover:bg-zinc-50 text-zinc-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Edit message</span>
          </button>
          
          <button
            onClick={() => navigate('/review')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm cursor-pointer"
          >
            <span>Continue to Review</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </AppShell>
  );
}

import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AppShell } from '../components/layout/AppShell';
import { getIncidents } from '../api/incidents';
import { RiskBadge } from '../components/RiskBadge';
import { EmptyState } from '../components/EmptyState';
import { ErrorBanner } from '../components/ErrorBanner';
import { Skeleton } from '../components/Spinner';
import { formatDate } from '../lib/format';
import { ChevronRight, Plus } from 'lucide-react';

export function IncidentsPage() {
  const navigate = useNavigate();
  
  const { data: incidents, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['incidents'],
    queryFn: getIncidents,
  });
  
  return (
    <AppShell showStepper={true}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-950 mb-1">
              Saved Incidents
            </h1>
            <p className="text-sm text-zinc-600">
              History of reviewed and saved investigations
            </p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold transition-colors flex-shrink-0 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Investigation</span>
          </button>
        </div>
        
        {isError && (
          <ErrorBanner
            message={error instanceof Error ? error.message : 'Failed to load incidents'}
            onRetry={() => refetch()}
          />
        )}
        
        {isLoading && (
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden p-6 space-y-4 shadow-sm">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 py-2">
                <Skeleton className="h-4 w-28 bg-zinc-200" />
                <Skeleton className="h-4 w-32 bg-zinc-200" />
                <Skeleton className="h-6 w-24 bg-zinc-200" />
                <Skeleton className="h-4 w-20 bg-zinc-200" />
                <Skeleton className="h-4 w-24 bg-zinc-200 ml-auto" />
              </div>
            ))}
          </div>
        )}
        
        {!isLoading && !isError && incidents && incidents.length === 0 && (
          <EmptyState
            message="No incidents saved yet."
            actionText="Start Investigation"
            onAction={() => navigate('/')}
          />
        )}
        
        {!isLoading && !isError && incidents && incidents.length > 0 && (
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-zinc-50 border-b border-zinc-200">
                  <tr>
                    <th scope="col" className="text-xs font-semibold text-zinc-700 px-5 py-3.5">
                      ID
                    </th>
                    <th scope="col" className="text-xs font-semibold text-zinc-700 px-5 py-3.5">
                      Date
                    </th>
                    <th scope="col" className="text-xs font-semibold text-zinc-700 px-5 py-3.5">
                      Risk
                    </th>
                    <th scope="col" className="text-xs font-semibold text-zinc-700 px-5 py-3.5">
                      Status
                    </th>
                    <th scope="col" className="text-xs font-semibold text-zinc-700 px-5 py-3.5">
                      Reviewer
                    </th>
                    <th scope="col" className="text-xs font-semibold text-zinc-700 px-5 py-3.5 text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-xs">
                  {incidents.map((incident) => (
                    <tr
                      key={incident.id}
                      className="hover:bg-zinc-50/80 cursor-pointer transition-colors"
                      onClick={() => navigate(`/incidents/${incident.id}`)}
                    >
                      <td className="px-5 py-3.5 text-zinc-950 font-mono font-medium">
                        {incident.id}
                      </td>
                      <td className="px-5 py-3.5 text-zinc-600">
                        {formatDate(incident.created_at)}
                      </td>
                      <td className="px-5 py-3.5">
                        <RiskBadge band={incident.risk_band} size="sm" />
                      </td>
                      <td className="px-5 py-3.5 text-zinc-700 font-medium">
                        {incident.status}
                      </td>
                      <td className="px-5 py-3.5 text-zinc-600">
                        {incident.reviewed_by || '-'}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          className="inline-flex items-center gap-1 text-xs text-zinc-900 font-semibold hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/incidents/${incident.id}`);
                          }}
                          aria-label={`Open ${incident.id}`}
                        >
                          <span>Open</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

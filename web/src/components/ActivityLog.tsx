import { ActivityEntry } from '../types/api';
import { ChevronDown, ChevronRight, Activity } from 'lucide-react';
import { useState } from 'react';
import { formatDate } from '../lib/format';

interface ActivityLogProps {
  activities: ActivityEntry[];
}

export function ActivityLog({ activities }: ActivityLogProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  
  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };
  
  if (activities.length === 0) {
    return null;
  }
  
  return (
    <div className="border border-zinc-200 rounded-lg bg-white overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3.5 hover:bg-zinc-50 transition-colors text-left"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-zinc-500" />
          <span className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
            Agent Execution Activity ({activities.length} steps)
          </span>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-zinc-500" />
        ) : (
          <ChevronRight className="w-4 h-4 text-zinc-500" />
        )}
      </button>
      
      {isExpanded && (
        <div className="border-t border-zinc-200 divide-y divide-zinc-100 bg-zinc-50/50">
          {activities.map((activity, index) => (
            <div key={index} className="p-3 text-xs">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono text-zinc-400">
                  {formatDate(activity.at)}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-zinc-100 text-zinc-700 border border-zinc-200 rounded">
                  {activity.kind}
                </span>
                {activity.tool_name && (
                  <span className="text-[10px] font-mono text-zinc-900 font-medium">{activity.tool_name}</span>
                )}
              </div>
              <p className="text-xs text-zinc-800 font-mono mb-1">{activity.summary}</p>
              {activity.payload !== undefined && (
                <div>
                  <button
                    onClick={() => toggleItem(index)}
                    className="text-[11px] text-zinc-600 hover:text-zinc-950 font-medium mt-1"
                  >
                    {expandedItems.has(index) ? 'Hide payload' : 'Inspect payload'}
                  </button>
                  {expandedItems.has(index) && (
                    <pre className="mt-2 p-2.5 bg-white rounded border border-zinc-200 text-[11px] font-mono text-zinc-700 overflow-x-auto">
                      {JSON.stringify(activity.payload, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

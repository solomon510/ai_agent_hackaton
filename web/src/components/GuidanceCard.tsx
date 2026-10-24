import { GuidanceRef } from '../types/api';
import { BookOpen } from 'lucide-react';

interface GuidanceCardProps {
  guidance: GuidanceRef;
}

export function GuidanceCard({ guidance }: GuidanceCardProps) {
  return (
    <div className="border border-zinc-200 rounded-lg p-3 bg-white hover:border-zinc-300 transition-colors">
      <div className="flex items-start gap-2.5">
        <div className="p-1 rounded bg-zinc-100 text-zinc-600 mt-0.5">
          <BookOpen className="w-3.5 h-3.5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-semibold text-zinc-700 bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 rounded">
              {guidance.id}
            </span>
            <h4 className="text-xs font-semibold text-zinc-900">{guidance.title}</h4>
          </div>
          <p className="text-xs text-zinc-600 leading-relaxed">{guidance.excerpt}</p>
        </div>
      </div>
    </div>
  );
}

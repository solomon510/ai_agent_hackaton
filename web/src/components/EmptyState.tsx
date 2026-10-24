import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
  actionText?: string;
  onAction?: () => void;
}

export function EmptyState({
  message = "No records found.",
  actionText,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-4 rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50">
      <div className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center mx-auto mb-3 text-zinc-400 shadow-sm">
        <Inbox className="w-5 h-5" />
      </div>
      <p className="text-sm text-zinc-600 max-w-sm mx-auto mb-4">{message}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg transition-colors shadow-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

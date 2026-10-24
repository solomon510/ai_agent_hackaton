import { Info } from 'lucide-react';

interface NoticeBannerProps {
  message: string;
}

export function NoticeBanner({ message }: NoticeBannerProps) {
  return (
    <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3 flex items-start gap-2.5 text-xs text-zinc-700" role="note">
      <Info className="w-4 h-4 text-zinc-500 flex-shrink-0 mt-0.5" />
      <p>{message}</p>
    </div>
  );
}

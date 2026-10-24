import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  className?: string;
}

export function Spinner({ className = "w-5 h-5 text-cobalt-400" }: SpinnerProps) {
  return <Loader2 className={`animate-spin ${className}`} />;
}

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-secBorder-subtle/80 rounded ${className}`} />
  );
}

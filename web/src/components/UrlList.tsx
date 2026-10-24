import { UrlItem } from '../types/api';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface UrlListProps {
  urls: UrlItem[];
}

// HARD RULES: URLs are shown DEFANGED (http -> hxxp, "." -> "[.]" in hosts) as plain, non-clickable text.
// Never fetch, opens, or links to any URL from a message
export function UrlList({ urls }: UrlListProps) {
  const [copied, setCopied] = useState(false);
  
  const copyDefanged = async () => {
    const defangedList = urls.map(u => u.defanged).join('\n');
    try {
      await navigator.clipboard.writeText(defangedList);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard error
    }
  };
  
  if (urls.length === 0) {
    return (
      <div className="text-xs text-zinc-500 italic p-3 rounded-lg bg-zinc-50 border border-zinc-200">
        No URLs extracted from message
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
          Extracted Defanged Indicators ({urls.length})
        </h4>
        <button
          onClick={copyDefanged}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-zinc-700 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200 rounded-md transition-colors"
          aria-label="Copy indicators"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Defanged</span>
            </>
          )}
        </button>
      </div>
      <ul className="space-y-1.5">
        {urls.map((url, index) => (
          <li
            key={index}
            className="font-mono text-xs text-zinc-800 bg-zinc-50 px-3 py-2 rounded-lg border border-zinc-200 break-all select-all flex items-center justify-between gap-2"
          >
            <span>{url.defanged}</span>
            <span className="text-[10px] text-zinc-400 font-sans uppercase border border-zinc-200 bg-white px-1.5 py-0.5 rounded flex-shrink-0">
              Safe Non-Resolving
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

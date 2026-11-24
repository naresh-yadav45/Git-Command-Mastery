import { useState, type ReactNode } from 'react';
import { Check, Copy, Printer, AlertTriangle, Inbox } from 'lucide-react';
import type { Difficulty } from '../types';

const diffStyle: Record<Difficulty, string> = {
  Beginner: 'bg-emerald-50 text-ok border-emerald-200',
  Intermediate: 'bg-blue-50 text-brand border-blue-200',
  Advanced: 'bg-violet-tint text-violet border-violet-200',
  Expert: 'bg-rose-50 text-bad border-rose-200',
};

export function DifficultyBadge({ level }: { level: Difficulty }) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${diffStyle[level]}`}>{level}</span>;
}

export function CopyButton({ text, label = 'Copy', className = '' }: { text: string; label?: string; className?: string }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch { /* ignore */ }
      document.body.removeChild(ta);
    }
    setDone(true);
    setTimeout(() => setDone(false), 1600);
  };
  return (
    <button onClick={copy} aria-label={`${label}: ${text.split('\n')[0]}`}
      className={`inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/10 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/20 ${className}`}>
      {done ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
      <span aria-live="polite">{done ? 'Copied' : label}</span>
    </button>
  );
}

export function CodeBlock({ code, title }: { code: string; title?: string }) {
  return (
    <div className="term overflow-hidden rounded-xl border border-slate-800">
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-2">
        <span className="truncate text-xs text-slate-400">{title ?? 'terminal'}</span>
        <CopyButton text={code} />
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed"><code>{code}</code></pre>
    </div>
  );
}

export function PrintButton({ label = 'Export PDF' }: { label?: string }) {
  return (
    <button onClick={() => window.print()} className="btn-ghost no-print" title="Opens your browser's print dialog. Choose “Save as PDF”.">
      <Printer size={16} /> {label}
    </button>
  );
}

export function Warning({ children }: { children: ReactNode }) {
  return (
    <div role="note" className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <AlertTriangle size={18} className="mt-0.5 shrink-0 text-warn" />
      <div>{children}</div>
    </div>
  );
}

export function Empty({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-line p-10 text-center">
      <Inbox className="text-slate-400" />
      <p className="font-bold text-ink">{title}</p>
      {hint && <p className="text-sm text-muted">{hint}</p>}
    </div>
  );
}

export function PageHead({ title, intro, children }: { title: string; intro?: string; children?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{title}</h1>
        {intro && <p className="mt-2 leading-relaxed text-muted">{intro}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

export function Page({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">{children}</div>;
}

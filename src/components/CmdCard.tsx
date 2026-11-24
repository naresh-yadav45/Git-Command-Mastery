import { Link } from 'react-router-dom';
import { Bookmark, CheckCircle2 } from 'lucide-react';
import type { Cmd } from '../types';
import { DifficultyBadge } from './shared';
import { useStore } from '../store';

export function CmdCard({ c }: { c: Cmd }) {
  const { bookmarks, learned } = useStore();
  return (
    <Link to={`/commands/${c.slug}`} className="card group flex flex-col gap-2 p-4 transition-colors hover:border-brand">
      <div className="flex items-start justify-between gap-2">
        <span className="font-mono text-sm font-semibold text-ink group-hover:text-brand">{c.kind === 'hook' ? c.name : c.name}</span>
        <span className="flex items-center gap-1.5">
          {learned.includes(c.slug) && <CheckCircle2 size={15} className="text-ok" aria-label="Marked as learned" />}
          {bookmarks.includes(c.slug) && <Bookmark size={15} className="fill-brand text-brand" aria-label="Bookmarked" />}
        </span>
      </div>
      <p className="line-clamp-2 text-sm text-muted">{c.summary}</p>
      <div className="mt-auto flex items-center gap-2 pt-1">
        <DifficultyBadge level={c.difficulty} />
        {c.kind !== 'porcelain' && <span className="chip">{c.kind}</span>}
      </div>
    </Link>
  );
}

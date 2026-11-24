import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Github, GitBranch, Library, Menu, Search, X } from 'lucide-react';
import { searchCommands } from '../utils/search';
import { DifficultyBadge } from './shared';

export const GITHUB = 'https://github.com/naresh-yadav45';

export const NAV: { to: string; label: string; short: string }[] = [
  { to: '/', label: 'Overview', short: 'Overview' },
  { to: '/commands', label: 'All Git Commands', short: 'Commands' },
  { to: '/categories', label: 'Git Categories', short: 'Categories' },
  { to: '/visualizer', label: 'Interactive Git Visualizer', short: 'Visualizer' },
  { to: '/terminal', label: 'Git Terminal Simulator', short: 'Terminal' },
  { to: '/branches', label: 'Branch Visualizer', short: 'Branches' },
  { to: '/learn', label: 'Learning Paths', short: 'Learning Paths' },
  { to: '/resources', label: 'Git Resources', short: 'Resources' },
  { to: '/cheatsheets', label: 'Git Cheat Sheets', short: 'Cheat Sheets' },
  { to: '/troubleshooting', label: 'Troubleshooting', short: 'Troubleshooting' },
  { to: '/glossary', label: 'Git Glossary', short: 'Glossary' },
  { to: '/internals', label: 'Git Internals', short: 'Internals' },
  { to: '/workflows', label: 'Git Workflows', short: 'Workflows' },
  { to: '/best-practices', label: 'Git Best Practices', short: 'Best Practices' },
  { to: '/about', label: 'About', short: 'About' },
];

function SearchModal({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const nav = useNavigate();
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => ref.current?.focus(), []);
  const results = searchCommands(q, 8);
  const go = (slug: string) => { nav(`/commands/${slug}`); onClose(); };
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 p-4 pt-[10vh] no-print" role="dialog" aria-modal="true" aria-label="Search commands" onClick={onClose}>
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search size={18} className="text-slate-400" />
          <input ref={ref} value={q} onChange={(e) => { setQ(e.target.value); setActive(0); }} placeholder="Search commands, flags or keywords (try: undo, --amend, branch)"
            aria-label="Search commands" className="h-14 w-full bg-transparent text-sm outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Escape') onClose();
              if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
              if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
              if (e.key === 'Enter' && results[active]) go(results[active].slug);
            }} />
          <button onClick={onClose} aria-label="Close search" className="rounded p-1 text-slate-500 hover:bg-soft"><X size={18} /></button>
        </div>
        <ul className="max-h-[50vh] overflow-y-auto p-2">
          {!q.trim() && <li className="p-4 text-sm text-muted">Type to search all commands. Use ↑ ↓ and Enter to open one.</li>}
          {q.trim() && results.length === 0 && <li className="p-4 text-sm text-muted">No command matches “{q}”. Try a shorter word, a flag such as --amend, or browse All Git Commands.</li>}
          {results.map((c, i) => (
            <li key={c.slug}>
              <button onClick={() => go(c.slug)} onMouseEnter={() => setActive(i)} className={`flex w-full items-start justify-between gap-3 rounded-lg px-3 py-2.5 text-left ${i === active ? 'bg-brand-tint' : ''}`}>
                <span><span className="font-mono text-sm font-semibold text-ink">{c.name}</span><span className="mt-0.5 line-clamp-1 block text-xs text-muted">{c.summary}</span></span>
                <DifficultyBadge level={c.difficulty} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Layout() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);
  const loc = useLocation();
  useEffect(() => { setOpen(false); window.scrollTo(0, 0); }, [loc.pathname]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearch(true); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const link = ({ isActive }: { isActive: boolean }) =>
    `whitespace-nowrap rounded-md px-2.5 py-1.5 text-[13px] font-semibold transition-colors ${isActive ? 'bg-brand-tint text-brand' : 'text-muted hover:bg-soft hover:text-ink'}`;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-white">Skip to content</a>
      <header className="sticky top-0 z-40 border-b border-line bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <button className="rounded-lg p-2 hover:bg-soft lg:hidden" onClick={() => setOpen(true)} aria-label="Open navigation menu"><Menu size={22} /></button>
          <Link to="/" className="flex items-center gap-2.5" aria-label="Git Command Mastery home">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand text-white"><GitBranch size={20} /></span>
            <span className="text-[15px] font-extrabold leading-tight tracking-tight">Git Command<br className="hidden" /> Mastery</span>
          </Link>
          <button onClick={() => setSearch(true)} className="ml-auto flex h-10 w-full max-w-sm items-center gap-2 rounded-lg border border-line bg-soft px-3 text-sm text-slate-500 hover:border-slate-300 sm:ml-6" aria-label="Search commands (Ctrl+K)">
            <Search size={16} /> <span className="flex-1 text-left">Search commands</span>
            <kbd className="hidden rounded border border-line bg-white px-1.5 py-0.5 font-mono text-[11px] sm:block">Ctrl K</kbd>
          </button>
          <Link to="/library" className="hidden rounded-lg p-2.5 text-muted hover:bg-soft sm:block" aria-label="My library: bookmarks, progress and notes" title="My library"><Library size={20} /></Link>
          <a href={GITHUB} target="_blank" rel="noreferrer" className="rounded-lg p-2.5 text-muted hover:bg-soft" aria-label="GitHub profile of Naresh Yadav" title="GitHub"><Github size={20} /></a>
        </div>
        <nav aria-label="Main" className="hidden border-t border-line lg:block">
          <div className="mx-auto flex max-w-7xl items-center gap-0.5 overflow-x-auto px-4 py-1.5 sm:px-6">
            {NAV.map((n) => <NavLink key={n.to} to={n.to} end={n.to === '/'} className={link}>{n.short}</NavLink>)}
          </div>
        </nav>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden no-print" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 flex h-full w-[84%] max-w-sm flex-col bg-white shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-line px-4">
              <span className="font-extrabold">Git Command Mastery</span>
              <button onClick={() => setOpen(false)} className="rounded-lg p-2 hover:bg-soft" aria-label="Close menu"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              {NAV.map((n) => (
                <NavLink key={n.to} to={n.to} end={n.to === '/'} className={({ isActive }) => `flex min-h-[46px] items-center rounded-lg px-3 text-[15px] font-semibold ${isActive ? 'bg-brand-tint text-brand' : 'text-ink hover:bg-soft'}`}>{n.label}</NavLink>
              ))}
              <NavLink to="/library" className="flex min-h-[46px] items-center rounded-lg px-3 text-[15px] font-semibold text-ink hover:bg-soft">My Library</NavLink>
            </div>
          </div>
        </div>
      )}
      {search && <SearchModal onClose={() => setSearch(false)} />}

      <main id="main" className="flex-1"><Outlet /></main>

      <footer className="border-t border-line bg-soft">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          <div>
            <p className="font-extrabold">Git Command Mastery</p>
            <p className="mt-2 text-sm text-muted">Master Every Git Command. Understand Every Workflow.</p>
          </div>
          <div>
            <p className="text-sm font-bold">Explore</p>
            <ul className="mt-2 space-y-1.5 text-sm text-muted">
              {NAV.slice(1, 6).map((n) => <li key={n.to}><Link className="hover:text-brand" to={n.to}>{n.label}</Link></li>)}
              <li><Link className="hover:text-brand" to="/setup">Install & Setup</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-bold">Learn</p>
            <ul className="mt-2 space-y-1.5 text-sm text-muted">
              {NAV.slice(6, 14).map((n) => <li key={n.to}><Link className="hover:text-brand" to={n.to}>{n.label}</Link></li>)}
            </ul>
          </div>
          <div>
            <p className="text-sm font-bold">Official sources</p>
            <ul className="mt-2 space-y-1.5 text-sm text-muted">
              <li><a className="hover:text-brand" href="https://git-scm.com/docs" target="_blank" rel="noreferrer">Git documentation</a></li>
              <li><a className="hover:text-brand" href="https://git-scm.com/book/en/v2" target="_blank" rel="noreferrer">Pro Git book</a></li>
              <li><a className="hover:text-brand" href={GITHUB} target="_blank" rel="noreferrer">GitHub: naresh-yadav45</a></li>
              <li><Link className="hover:text-brand" to="/about">About the creator</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-line py-4 text-center text-sm font-semibold text-muted">Designed &amp; Developed by Naresh Yadav</div>
      </footer>
    </div>
  );
}

import { useEffect, useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Bookmark, CheckCircle2, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { bySlug, categories, commands } from '../data';
import { CodeBlock, DifficultyBadge, Empty, Page, PrintButton, Warning } from '../components/shared';
import { useStore } from '../store';

function Section({ n, title, id, children }: { n: number; title: string; id: string; children: ReactNode }) {
  return (
    <section id={id} className="card scroll-mt-40 p-5 sm:p-6">
      <h2 className="mb-4 flex items-center gap-3 text-xl font-extrabold tracking-tight">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-tint text-sm text-brand">{n}</span>{title}
      </h2>
      {children}
    </section>
  );
}

const sections = ['Name & category', 'Simple definition', 'Why & when', 'Syntax', 'Flags & options', 'Step-by-step working', 'Basic example', 'Real-world example', 'Expected output', 'Common errors', 'Related commands', 'Official documentation'];

export default function CommandDetail() {
  const { slug = '' } = useParams();
  const c = bySlug.get(slug);
  const { bookmarks, toggleBookmark, learned, toggleLearned, markViewed, notes, setNote } = useStore();
  const [tab, setTab] = useState<'basic' | 'real'>('basic');
  useEffect(() => { if (c) markViewed(c.slug); document.title = c ? `${c.kind === 'hook' ? c.name + ' hook' : c.name} | Git Command Mastery` : 'Git Command Mastery'; }, [c?.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!c) return <Page><Empty title={`No command called “${slug}”`} hint="Use the search (Ctrl K) or browse the full list." /><p className="mt-4 text-center"><Link className="font-semibold text-brand" to="/commands">All commands</Link></p></Page>;

  const i = commands.findIndex((x) => x.slug === c.slug);
  const prev = commands[i - 1], next = commands[i + 1];
  const isB = bookmarks.includes(c.slug), isL = learned.includes(c.slug);
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const title = c.kind === 'hook' ? `${c.name} (hook)` : c.name;

  return (
    <Page>
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted no-print"><Link className="hover:text-brand" to="/commands">Commands</Link> / <span className="font-mono text-ink">{title}</span></nav>
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="no-print hidden lg:block">
          <div className="sticky top-36">
            <p className="mb-2 text-sm font-bold">On this page</p>
            <ol className="space-y-0.5 text-sm">
              {sections.map((s, k) => <li key={s}><button onClick={() => scrollTo(`s${k + 1}`)} className="w-full rounded px-2 py-1 text-left text-muted hover:bg-soft hover:text-brand">{k + 1}. {s}</button></li>)}
            </ol>
          </div>
        </aside>

        <div className="min-w-0 space-y-6">
          <Section n={1} id="s1" title="Command name & category">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-mono text-2xl font-bold text-ink">{title}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <DifficultyBadge level={c.difficulty} />
                  <span className="chip">{c.kind === 'porcelain' ? 'Built-in (porcelain)' : c.kind === 'plumbing' ? 'Built-in (plumbing)' : c.kind === 'hook' ? 'Hook script (not a subcommand)' : 'Built-in utility'}</span>
                  {c.categories.map((id) => <Link key={id} to={`/categories/${id}`} className="chip">{categories.find((x) => x.id === id)?.name}</Link>)}
                </div>
                <p className="mt-3 text-sm text-muted"><strong className="text-ink">Version note:</strong> {c.since}</p>
              </div>
              <div className="no-print flex flex-wrap gap-2">
                <button onClick={() => toggleBookmark(c.slug)} aria-pressed={isB} className={`btn-ghost ${isB ? 'border-brand text-brand' : ''}`}><Bookmark size={16} className={isB ? 'fill-brand' : ''} />{isB ? 'Bookmarked' : 'Bookmark'}</button>
                <button onClick={() => toggleLearned(c.slug)} aria-pressed={isL} className={`btn-ghost ${isL ? 'border-ok text-ok' : ''}`}><CheckCircle2 size={16} />{isL ? 'Learned' : 'Mark as learned'}</button>
                <PrintButton label="Export PDF" />
              </div>
            </div>
          </Section>

          {c.warning && <Warning><strong>Warning.</strong> {c.warning}</Warning>}

          <Section n={2} id="s2" title="Simple definition"><p className="text-lg leading-relaxed text-ink">{c.summary}</p></Section>

          <Section n={3} id="s3" title="Why & when to use it">
            <div className="prose-g"><p>{c.why}</p><p><strong>When not to use it:</strong> {c.avoid}</p></div>
          </Section>

          <Section n={4} id="s4" title="Syntax"><CodeBlock code={c.syntax.join('\n')} title="syntax" /></Section>

          <Section n={5} id="s5" title="Important flags & options">
            <div className="space-y-3">
              {c.flags.map((f) => (
                <div key={f.flag} className="rounded-lg border border-line p-4">
                  <p className="font-mono text-sm font-bold text-violet">{f.flag}</p>
                  <p className="mt-1 text-sm text-ink">{f.purpose}</p>
                  <p className="mt-1 text-sm text-muted"><strong className="text-ink">When:</strong> {f.when}</p>
                  <div className="mt-2"><CodeBlock code={f.example} title="example" /></div>
                </div>
              ))}
            </div>
          </Section>

          <Section n={6} id="s6" title="Step-by-step working">
            <p className="mb-3 text-sm text-muted">What this command changes in each of the four areas.</p>
            <div className="table-wrap"><table>
              <thead><tr><th>Area</th><th>Effect</th></tr></thead>
              <tbody>
                <tr><td className="font-semibold text-ink">Working directory</td><td>{c.working.wd}</td></tr>
                <tr><td className="font-semibold text-ink">Staging area (index)</td><td>{c.working.index}</td></tr>
                <tr><td className="font-semibold text-ink">Local repository</td><td>{c.working.repo}</td></tr>
                <tr><td className="font-semibold text-ink">Remote repository</td><td>{c.working.remote}</td></tr>
              </tbody></table></div>
          </Section>

          <Section n={7} id="s7" title="Basic & real-world examples">
            <div role="tablist" className="mb-4 flex gap-2 no-print" aria-label="Example type">
              <button role="tab" aria-selected={tab === 'basic'} className={`chip ${tab === 'basic' ? 'chip-on' : ''}`} onClick={() => setTab('basic')}>Basic example</button>
              <button role="tab" aria-selected={tab === 'real'} className={`chip ${tab === 'real' ? 'chip-on' : ''}`} onClick={() => setTab('real')}>Real-world example</button>
            </div>
            <div className={tab === 'basic' ? '' : 'hidden print:block'}>
              <h3 className="mb-2 font-bold">Basic example</h3>
              <CodeBlock code={c.basic.cmd} />
              <p className="mt-3 text-sm text-muted">{c.basic.explain}</p>
            </div>
            <div className={tab === 'real' ? '' : 'hidden print:block'} id="s8">
              <h3 className="mb-2 font-bold print:mt-4">Real-world practical example</h3>
              <p className="mb-3 text-sm text-muted"><strong className="text-ink">Scenario:</strong> {c.real.scenario}</p>
              <CodeBlock code={c.real.cmds.join('\n')} />
            </div>
          </Section>

          <Section n={9} id="s9" title="Expected terminal output">
            <CodeBlock code={c.output.text} title="illustrative output" />
            <p className="mt-3 text-sm text-muted">{c.output.note} Output varies by Git version, configuration and repository, so treat it as illustrative.</p>
          </Section>

          <Section n={10} id="s10" title="Common errors & solutions">
            <div className="space-y-3">
              {c.errors.map((e) => (
                <div key={e.msg} className="rounded-lg border border-line p-4 text-sm">
                  <p className="whitespace-pre-wrap font-mono text-[13px] font-semibold text-bad">{e.msg}</p>
                  <p className="mt-2 text-muted"><strong className="text-ink">Why:</strong> {e.reason}</p>
                  <p className="mt-1 text-muted"><strong className="text-ink">Safe fix:</strong> {e.fix}</p>
                  <p className="mt-1 text-muted"><strong className="text-ink">Prevent:</strong> {e.prevent}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section n={11} id="s11" title="Related commands">
            {c.related.length === 0 ? <p className="text-sm text-muted">No related commands are linked for this entry.</p> : (
              <ul className="space-y-2">
                {c.related.map((r) => (
                  <li key={r.slug} className="rounded-lg border border-line p-3 text-sm">
                    <Link to={`/commands/${r.slug}`} className="font-mono font-bold text-brand">{bySlug.get(r.slug)?.name}</Link>
                    <span className="text-muted"> — {r.diff}</span>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section n={12} id="s12" title="Official documentation">
            <ul className="space-y-2 text-sm">
              <li><a className="inline-flex items-center gap-1.5 font-semibold text-brand" href={c.docs} target="_blank" rel="noreferrer">{c.docs}<ExternalLink size={14} /></a></li>
              {c.book.map((b) => <li key={b.url}><a className="inline-flex items-center gap-1.5 text-brand" href={b.url} target="_blank" rel="noreferrer">{b.title}<ExternalLink size={14} /></a></li>)}
            </ul>
            <p className="mt-3 text-sm text-muted">Offline, run <code className="inline">git help {c.kind === 'hook' ? 'hooks' : c.slug}</code>.</p>
          </Section>

          <div className="card no-print p-5">
            <label htmlFor="note" className="font-bold">Your notes for {title}</label>
            <p className="text-sm text-muted">Saved in this browser only.</p>
            <textarea id="note" className="input mt-3 min-h-[110px]" value={notes[c.slug] ?? ''} onChange={(e) => setNote(c.slug, e.target.value)} placeholder="Write what you want to remember…" />
          </div>

          <div className="no-print flex justify-between gap-3">
            {prev ? <Link to={`/commands/${prev.slug}`} className="btn-ghost"><ChevronLeft size={16} /> {prev.name}</Link> : <span />}
            {next ? <Link to={`/commands/${next.slug}`} className="btn-ghost">{next.name} <ChevronRight size={16} /></Link> : <span />}
          </div>
        </div>
      </div>
    </Page>
  );
}

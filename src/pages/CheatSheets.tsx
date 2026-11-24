import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { cheat } from '../data/cheat';
import { CopyButton, Empty, Page, PageHead, PrintButton } from '../components/shared';

export default function CheatSheets() {
  const [q, setQ] = useState(''); const [g, setG] = useState('all');
  const groups = useMemo(() => cheat.filter((x) => g === 'all' || x.id === g).map((x) => ({ ...x, items: x.items.filter((i) => (i.cmd + i.desc).toLowerCase().includes(q.toLowerCase())) })).filter((x) => x.items.length), [q, g]);
  return (
    <Page>
      <PageHead title="Git cheat sheets" intro="Quick reference you can search, copy and print. Use Export PDF, then choose “Save as PDF” in the print dialog."><PrintButton /><Link to="/compare" className="btn-ghost no-print">Compare commands</Link></PageHead>
      <div className="card no-print mb-6 space-y-3 p-4">
        <input className="input" placeholder="Search the cheat sheet" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search cheat sheet" />
        <div className="flex flex-wrap gap-2" role="group" aria-label="Category"><button className={`chip ${g === 'all' ? 'chip-on' : ''}`} onClick={() => setG('all')}>All</button>{cheat.map((x) => <button key={x.id} className={`chip ${g === x.id ? 'chip-on' : ''}`} onClick={() => setG(x.id)} aria-pressed={g === x.id}>{x.title}</button>)}</div>
      </div>
      {groups.length === 0 ? <Empty title="Nothing matches your search" hint="Try a shorter word." /> : (
        <div className="grid gap-5 lg:grid-cols-2">
          {groups.map((x) => (
            <section key={x.id} className="card p-5"><h2 className="mb-3 font-extrabold">{x.title}</h2>
              <ul className="divide-y divide-line">{x.items.map((i) => (
                <li key={i.cmd} className="flex items-start justify-between gap-3 py-2.5">
                  <div className="min-w-0"><code className="break-words font-mono text-[13px] font-semibold text-violet">{i.cmd}</code><p className="text-sm text-muted">{i.desc}</p></div>
                  <span className="no-print shrink-0"><CopyButton text={i.cmd} className="!border-line !bg-soft !text-ink hover:!bg-slate-100" /></span>
                </li>))}</ul></section>
          ))}
        </div>
      )}
    </Page>
  );
}

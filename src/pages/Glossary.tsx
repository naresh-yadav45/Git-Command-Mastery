import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { glossary } from '../data/glossary';
import { bySlug } from '../data';
import { Empty, Page, PageHead } from '../components/shared';

export default function Glossary() {
  const [q, setQ] = useState(''); const [letter, setLetter] = useState(''); const [grp, setGrp] = useState('All');
  const groups = ['All', 'Basics', 'Branches & history', 'Remotes', 'Internals'];
  const letters = Array.from(new Set(glossary.map((t) => t.term[0].toUpperCase()))).sort();
  const list = useMemo(() => glossary.filter((t) => (!letter || t.term[0].toUpperCase() === letter) && (grp === 'All' || t.group === grp) && (t.term + t.def).toLowerCase().includes(q.toLowerCase())).sort((a, b) => a.term.localeCompare(b.term)), [q, letter, grp]);
  return (
    <Page>
      <PageHead title="Git glossary" intro={`${glossary.length} terms in plain language, each linked to the commands that use it.`} />
      <div className="card mb-6 space-y-3 p-4">
        <input className="input" placeholder="Search terms" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search glossary" />
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Alphabet"><button className={`chip ${!letter ? 'chip-on' : ''}`} onClick={() => setLetter('')}>All</button>{letters.map((l) => <button key={l} className={`chip ${letter === l ? 'chip-on' : ''}`} onClick={() => setLetter(l)} aria-pressed={letter === l}>{l}</button>)}</div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Group">{groups.map((x) => <button key={x} className={`chip ${grp === x ? 'chip-on' : ''}`} onClick={() => setGrp(x)} aria-pressed={grp === x}>{x}</button>)}</div>
      </div>
      {list.length === 0 ? <Empty title="No terms match" hint="Clear the filters or search again." /> : (
        <dl className="grid gap-4 sm:grid-cols-2">
          {list.map((t) => (
            <div key={t.term} className="card p-5"><dt className="flex items-center justify-between gap-2 font-extrabold">{t.term}<span className="chip">{t.group}</span></dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">{t.def}</dd>
              <dd className="mt-3 flex flex-wrap gap-2">{t.cmds.filter((c) => bySlug.has(c)).map((c) => <Link key={c} to={`/commands/${c}`} className="chip font-mono">git {c}</Link>)}</dd></div>
          ))}
        </dl>
      )}
    </Page>
  );
}

import { useMemo, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { resources } from '../data/resources';
import { Empty, Page, PageHead } from '../components/shared';

export default function Resources() {
  const [topic, setTopic] = useState('All'); const [lvl, setLvl] = useState('All'); const [q, setQ] = useState('');
  const topics = ['All', ...Array.from(new Set(resources.map((r) => r.topic)))];
  const list = useMemo(() => resources.filter((r) => (topic === 'All' || r.topic === topic) && (lvl === 'All' || r.level === lvl) && (r.title + r.desc).toLowerCase().includes(q.toLowerCase())), [topic, lvl, q]);
  return (
    <Page>
      <PageHead title="Git resources" intro="A short, curated list of official documentation and well-known learning material. Links open external sites; run npm run check-links in the project to re-verify them." />
      <div className="card mb-6 space-y-3 p-4">
        <input className="input" placeholder="Search resources" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search resources" />
        <div className="flex flex-wrap gap-2" role="group" aria-label="Topic">{topics.map((t) => <button key={t} className={`chip ${topic === t ? 'chip-on' : ''}`} onClick={() => setTopic(t)} aria-pressed={topic === t}>{t}</button>)}</div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Difficulty">{['All', 'Beginner', 'Intermediate', 'Advanced'].map((t) => <button key={t} className={`chip ${lvl === t ? 'chip-on' : ''}`} onClick={() => setLvl(t)} aria-pressed={lvl === t}>{t}</button>)}</div>
      </div>
      {list.length === 0 ? <Empty title="No resources match" hint="Clear a filter to see more." /> : (
        <div className="grid gap-4 sm:grid-cols-2">
          {list.map((r) => (
            <a key={r.url} href={r.url} target="_blank" rel="noreferrer" className="card flex flex-col gap-2 p-5 transition-colors hover:border-brand">
              <div className="flex items-start justify-between gap-3"><span className="font-bold">{r.title}</span><ExternalLink size={16} className="shrink-0 text-slate-400" /></div>
              <p className="text-sm text-muted">{r.desc}</p>
              <p className="mt-auto flex flex-wrap gap-2 pt-1 text-xs"><span className="chip">{r.type}</span><span className="chip">{r.level}</span><span className="chip">{r.topic}</span><span className="self-center text-slate-500">{r.source}</span></p>
            </a>
          ))}
        </div>
      )}
    </Page>
  );
}

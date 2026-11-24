import { Link } from 'react-router-dom';
import { problems } from '../data/troubleshooting';
import { bySlug } from '../data';
import { Page, PageHead, Warning } from '../components/shared';

export default function Troubleshooting() {
  return (
    <Page>
      <PageHead title="Git troubleshooting guide" intro="Twelve common problems, each with what it is, why it happens, how to spot it, a step-by-step fix and how to prevent it." />
      <div className="mb-6 flex flex-wrap gap-2 no-print">{problems.map((p) => <button key={p.id} className="chip" onClick={() => document.getElementById(p.id)?.scrollIntoView({ behavior: 'smooth' })}>{p.title}</button>)}</div>
      <div className="space-y-5">
        {problems.map((p) => (
          <section id={p.id} key={p.id} className="card scroll-mt-40 space-y-3 p-5 sm:p-6">
            <h2 className="text-xl font-extrabold">{p.title}</h2>
            <div className="prose-g text-sm"><p><strong>1. Problem.</strong> {p.what}</p><p><strong>2. Why it happens.</strong> {p.why}</p><p><strong>3. How to identify it.</strong> {p.identify}</p></div>
            {p.danger && <Warning>{p.danger}</Warning>}
            <div><p className="mb-1 text-sm font-bold">4. Step-by-step solution</p><ol className="list-decimal space-y-1 pl-5 text-sm text-muted">{p.steps.map((s) => <li key={s}>{s}</li>)}</ol></div>
            <p className="text-sm text-muted"><strong className="text-ink">5. Prevention.</strong> {p.prevent}</p>
            <p className="flex flex-wrap items-center gap-2 text-sm"><strong>6. Related commands</strong>{p.cmds.filter((c) => bySlug.has(c)).map((c) => <Link key={c} to={`/commands/${c}`} className="chip font-mono">git {c}</Link>)}</p>
          </section>
        ))}
      </div>
    </Page>
  );
}

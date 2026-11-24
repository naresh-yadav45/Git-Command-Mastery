import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, Circle } from 'lucide-react';
import { paths } from '../data/learning';
import { bySlug } from '../data';
import { CodeBlock, DifficultyBadge, Page, PageHead, PrintButton } from '../components/shared';
import { useStore } from '../store';

export default function LearningPaths() {
  const { pathId } = useParams();
  const { lessonsDone, toggleLesson } = useStore();
  const p = paths.find((x) => x.id === pathId);
  const pct = (id: string) => { const q = paths.find((x) => x.id === id)!; return Math.round((q.lessons.filter((l) => lessonsDone.includes(l.id)).length / q.lessons.length) * 100); };

  if (!p) {
    return (
      <Page>
        <PageHead title="Learning paths" intro="Six structured journeys from first commit to Git internals. Progress is saved in this browser." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paths.map((x) => (
            <Link key={x.id} to={`/learn/${x.id}`} className="card flex flex-col gap-3 p-5 transition-colors hover:border-brand">
              <div className="flex items-start justify-between gap-2"><h2 className="font-bold">{x.title}</h2><DifficultyBadge level={x.level as 'Beginner'} /></div>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted">{x.goal.map((g) => <li key={g}>{g}</li>)}</ul>
              <div className="mt-auto"><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-brand" style={{ width: `${pct(x.id)}%` }} /></div><p className="mt-1 text-xs font-semibold text-muted">{pct(x.id)}% · {x.lessons.length} lessons</p></div>
            </Link>
          ))}
        </div>
      </Page>
    );
  }
  const nextLesson = p.lessons.find((l) => !lessonsDone.includes(l.id));
  return (
    <Page>
      <nav className="mb-4 text-sm text-muted no-print"><Link className="hover:text-brand" to="/learn">Learning paths</Link> / {p.title}</nav>
      <PageHead title={p.title} intro={`Level: ${p.level}. ${pct(p.id)}% complete.`}><PrintButton label="Export roadmap PDF" /></PageHead>
      <div className="card mb-6 p-5"><p className="font-bold">Learning objectives</p><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">{p.goal.map((g) => <li key={g}>{g}</li>)}</ul>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-brand" style={{ width: `${pct(p.id)}%` }} /></div></div>
      {nextLesson ? <p className="mb-6 rounded-lg bg-brand-tint p-3 text-sm font-semibold text-brand">Next recommended lesson: {nextLesson.title}</p> : <p className="mb-6 rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-900">Path complete. Try another path from the list.</p>}
      <ol className="space-y-4">
        {p.lessons.map((l, i) => {
          const done = lessonsDone.includes(l.id);
          return (
            <li key={l.id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-extrabold">{i + 1}. {l.title}</h2>
                <button onClick={() => toggleLesson(l.id)} aria-pressed={done} className={`btn-ghost no-print ${done ? 'border-ok text-ok' : ''}`}>{done ? <CheckCircle2 size={16} /> : <Circle size={16} />}{done ? 'Done' : 'Mark done'}</button>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{l.body}</p>
              <div className="mt-3"><CodeBlock code={l.example} /></div>
              <p className="mt-3 flex flex-wrap items-center gap-2 text-sm"><span className="font-bold">Related commands</span>{l.cmds.filter((c) => bySlug.has(c)).map((c) => <Link key={c} to={`/commands/${c}`} className="chip font-mono">git {c}</Link>)}</p>
            </li>
          );
        })}
      </ol>
    </Page>
  );
}

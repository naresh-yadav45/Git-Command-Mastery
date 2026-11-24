import { Link } from 'react-router-dom';
import { categories, commands, bySlug, commandsInCategory } from '../data';
import { paths } from '../data/learning';
import { CmdCard } from '../components/CmdCard';
import { Empty, Page, PageHead, PrintButton } from '../components/shared';
import { useStore } from '../store';

export default function MyLibrary() {
  const { bookmarks, learned, viewed, recent, notes, lessonsDone, resetAll } = useStore();
  const done = categories.filter((c) => commandsInCategory(c.id).every((x) => learned.includes(x.slug)));
  const noteKeys = Object.keys(notes).filter((k) => bySlug.has(k));
  return (
    <Page>
      <PageHead title="My library" intro="Everything here is stored in this browser only."><PrintButton label="Export notes PDF" />
        <button className="btn-ghost no-print" onClick={() => { if (window.confirm('Clear all bookmarks, progress and notes from this browser?')) resetAll(); }}>Clear my data</button></PageHead>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[['Commands viewed', `${viewed.filter((v) => bySlug.has(v)).length} / ${commands.length}`], ['Marked as learned', `${learned.filter((v) => bySlug.has(v)).length}`], ['Categories completed', `${done.length} / ${categories.length}`], ['Lessons done', `${lessonsDone.length}`]].map(([l, v]) => <div key={l} className="card p-5"><p className="text-sm text-muted">{l}</p><p className="mt-1 text-2xl font-extrabold">{v}</p></div>)}
      </div>
      <h2 className="h2 mb-4">Learning path progress</h2>
      <div className="mb-10 grid gap-3 sm:grid-cols-2">{paths.map((p) => { const n = p.lessons.filter((l) => lessonsDone.includes(l.id)).length; return <Link key={p.id} to={`/learn/${p.id}`} className="card p-4"><p className="font-bold">{p.title}</p><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-brand" style={{ width: `${(n / p.lessons.length) * 100}%` }} /></div><p className="mt-1 text-xs text-muted">{n} of {p.lessons.length} lessons</p></Link>; })}</div>
      <h2 className="h2 mb-4">Bookmarks</h2>
      {bookmarks.filter((b) => bySlug.has(b)).length === 0 ? <Empty title="No bookmarks yet" hint="Open a command and press Bookmark." /> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{bookmarks.filter((b) => bySlug.has(b)).map((b) => <CmdCard key={b} c={bySlug.get(b)!} />)}</div>}
      <h2 className="h2 mb-4 mt-10">Recently viewed</h2>
      {recent.filter((b) => bySlug.has(b)).length === 0 ? <Empty title="Nothing viewed yet" hint="Commands you open appear here." /> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{recent.filter((b) => bySlug.has(b)).map((b) => <CmdCard key={b} c={bySlug.get(b)!} />)}</div>}
      <h2 className="h2 mb-4 mt-10">My notes</h2>
      {noteKeys.length === 0 ? <Empty title="No notes yet" hint="Write notes at the bottom of any command page." /> : <div className="space-y-3">{noteKeys.map((k) => <div key={k} className="card p-4"><Link to={`/commands/${k}`} className="font-mono font-bold text-brand">{bySlug.get(k)!.name}</Link><p className="mt-2 whitespace-pre-wrap text-sm text-muted">{notes[k]}</p></div>)}</div>}
    </Page>
  );
}

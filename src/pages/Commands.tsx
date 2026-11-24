import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { categories, commands } from '../data';
import { searchCommands } from '../utils/search';
import { CmdCard } from '../components/CmdCard';
import { Empty, Page, PageHead } from '../components/shared';
import type { Difficulty } from '../types';

const levels: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export default function Commands() {
  const { id } = useParams();
  const fixedCat = id ? Number(id) : null;
  const cat = fixedCat ? categories.find((c) => c.id === fixedCat) : undefined;
  const [q, setQ] = useState('');
  const [cats, setCats] = useState<number | 0>(0);
  const [lvl, setLvl] = useState<Difficulty | ''>('');
  const [special, setSpecial] = useState<'' | 'common' | 'advanced'>('');
  const activeCat = fixedCat ?? cats;

  const list = useMemo(() => {
    let base = q.trim() ? searchCommands(q, 200) : commands;
    if (activeCat) base = base.filter((c) => c.categories.includes(activeCat));
    if (lvl) base = base.filter((c) => c.difficulty === lvl);
    if (special === 'common') base = base.filter((c) => c.common);
    if (special === 'advanced') base = base.filter((c) => c.categories.includes(13));
    return base;
  }, [q, activeCat, lvl, special]);

  if (id && !cat) {
    return <Page><Empty title="Category not found" hint="Pick a category from the Categories page." /><p className="mt-4 text-center"><Link className="font-semibold text-brand" to="/categories">Back to categories</Link></p></Page>;
  }

  return (
    <Page>
      <PageHead title={cat ? cat.name : 'All Git commands'} intro={cat ? cat.blurb : `${commands.length} commands, each with 12 sections: definition, syntax, flags, working, examples, output, errors, related commands and official docs.`}>
        <Link to="/compare" className="btn-ghost">Compare commands</Link>
      </PageHead>

      <div className="card mb-6 space-y-4 p-4">
        <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter by name, description, flag or keyword" aria-label="Filter commands" />
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Difficulty filter">
          <span className="text-xs font-bold text-muted">Difficulty</span>
          <button className={`chip ${lvl === '' ? 'chip-on' : ''}`} onClick={() => setLvl('')} aria-pressed={lvl === ''}>All</button>
          {levels.map((l) => <button key={l} className={`chip ${lvl === l ? 'chip-on' : ''}`} onClick={() => setLvl(l)} aria-pressed={lvl === l}>{l}</button>)}
          <span className="ml-3 text-xs font-bold text-muted">Show</span>
          <button className={`chip ${special === 'common' ? 'chip-on' : ''}`} onClick={() => setSpecial(special === 'common' ? '' : 'common')} aria-pressed={special === 'common'}>Commonly used</button>
          <button className={`chip ${special === 'advanced' ? 'chip-on' : ''}`} onClick={() => setSpecial(special === 'advanced' ? '' : 'advanced')} aria-pressed={special === 'advanced'}>Advanced utilities</button>
        </div>
        {!fixedCat && (
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Category filter">
            <span className="text-xs font-bold text-muted">Category</span>
            <button className={`chip ${cats === 0 ? 'chip-on' : ''}`} onClick={() => setCats(0)} aria-pressed={cats === 0}>All</button>
            {categories.map((c) => <button key={c.id} className={`chip ${cats === c.id ? 'chip-on' : ''}`} onClick={() => setCats(c.id)} aria-pressed={cats === c.id}>{c.name.split(' & ')[0].replace(' Commands', '')}</button>)}
          </div>
        )}
      </div>

      <p className="mb-3 text-sm text-muted" aria-live="polite">{list.length} {list.length === 1 ? 'command' : 'commands'}</p>
      {list.length === 0 ? <Empty title="No commands match these filters" hint="Clear a filter or try a different keyword." /> : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map((c) => <CmdCard key={c.slug} c={c} />)}</div>
      )}
    </Page>
  );
}

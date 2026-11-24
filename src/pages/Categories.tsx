import { Link } from 'react-router-dom';
import { categories, commandsInCategory } from '../data';
import { DifficultyBadge, Page, PageHead } from '../components/shared';

export default function Categories() {
  return (
    <Page>
      <PageHead title="Git categories" intro="Commands grouped by what you are trying to do. Counts show the commands in this library; the official Git command list is larger and changes between versions." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => {
          const list = commandsInCategory(c.id);
          return (
            <Link key={c.id} to={`/categories/${c.id}`} className="card flex flex-col gap-3 p-5 transition-colors hover:border-brand">
              <div className="flex items-start justify-between gap-2"><h2 className="font-bold">{c.name}</h2><DifficultyBadge level={c.difficulty} /></div>
              <p className="text-sm text-muted">{c.blurb}</p>
              <p className="line-clamp-2 font-mono text-xs text-slate-500">{list.slice(0, 6).map((x) => x.slug).join(', ')}{list.length > 6 ? ', …' : ''}</p>
              <p className="mt-auto text-sm font-semibold text-brand">{list.length} commands · Explore</p>
            </Link>
          );
        })}
      </div>
    </Page>
  );
}

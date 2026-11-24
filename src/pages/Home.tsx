import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpenText, Bug, GitBranch, GitMerge, Layers, Map, NotebookText, SquareTerminal, Workflow } from 'lucide-react';
import { categories, commands, commandsInCategory, bySlug, popularSlugs } from '../data';
import { paths } from '../data/learning';
import { CmdCard } from '../components/CmdCard';
import { DifficultyBadge, Page } from '../components/shared';

const quick = [
  { to: '/commands', icon: BookOpenText, title: 'All Git Commands', text: `${commands.length} commands with 12 sections each.` },
  { to: '/visualizer', icon: Workflow, title: 'Interactive Git Visualizer', text: 'Watch commands move changes between the four areas.' },
  { to: '/terminal', icon: SquareTerminal, title: 'Git Terminal Simulator', text: 'Practise safely in a simulated repository.' },
  { to: '/branches', icon: GitBranch, title: 'Branch Visualizer', text: 'Commit, branch, merge, rebase and cherry-pick on a graph.' },
  { to: '/learn', icon: Map, title: 'Learning Paths', text: 'Six guided journeys with progress tracking.' },
  { to: '/cheatsheets', icon: NotebookText, title: 'Git Cheat Sheets', text: 'Searchable, printable quick reference.' },
  { to: '/troubleshooting', icon: Bug, title: 'Troubleshooting', text: 'Fix conflicts, detached HEAD, rejected pushes and more.' },
  { to: '/glossary', icon: Layers, title: 'Git Glossary', text: 'Plain-language definitions linked to commands.' },
  { to: '/resources', icon: GitMerge, title: 'Git Resources', text: 'Official docs, books and interactive practice.' },
];

function Illustration() {
  const stages = [
    { label: 'Working directory', sub: 'edit files', color: '#2563EB' },
    { label: 'Staging area', sub: 'git add', color: '#7C3AED' },
    { label: 'Local repository', sub: 'git commit', color: '#059669' },
    { label: 'Remote repository', sub: 'git push', color: '#D97706' },
  ];
  return (
    <div className="card p-5" aria-label="Diagram: working directory, staging area, local repository, remote repository">
      <div className="grid gap-3 sm:grid-cols-4">
        {stages.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 * i }}
            className="relative rounded-lg border border-line bg-white p-3" style={{ borderTop: `4px solid ${s.color}` }}>
            <p className="text-sm font-bold">{s.label}</p>
            <p className="mt-0.5 font-mono text-xs text-muted">{s.sub}</p>
            {i < 3 && <ArrowRight size={16} className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white text-slate-400 sm:block" />}
          </motion.div>
        ))}
      </div>
      <pre className="term mt-4 overflow-x-auto rounded-lg p-4 text-[13px] leading-relaxed"><code>{`$ git add src/cart.ts
$ git commit -m "Add quantity limits"
$ git push origin main`}</code></pre>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <section className="border-b border-line">
        <Page>
          <div className="grid items-center gap-10 py-4 lg:grid-cols-2">
            <div>
              <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">Master Git. From Your First Command to Advanced Version Control.</h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">Explore the complete Git command library, understand version control workflows, practise in an interactive terminal, and build real-world Git skills through structured learning.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/commands" className="btn-primary">Explore All Commands <ArrowRight size={16} /></Link>
                <Link to="/learn" className="btn-ghost">Start Learning</Link>
              </div>
            </div>
            <Illustration />
          </div>
        </Page>
      </section>

      <Page>
        <h2 className="h2">Jump in</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quick.map(({ to, icon: Icon, title, text }) => (
            <Link key={to} to={to} className="card flex gap-4 p-5 transition-colors hover:border-brand">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-tint text-brand"><Icon size={20} /></span>
              <span><span className="block font-bold">{title}</span><span className="mt-1 block text-sm text-muted">{text}</span></span>
            </Link>
          ))}
        </div>
      </Page>

      <section className="bg-soft">
        <Page>
          <h2 className="h2">Explore categories</h2>
          <p className="mt-2 text-muted">Counts are the number of commands in this library for each category. A command can appear in more than one category.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <Link key={c.id} to={`/categories/${c.id}`} className="card flex flex-col gap-2 p-5 transition-colors hover:border-brand">
                <div className="flex items-start justify-between gap-2"><span className="font-bold">{c.name}</span><DifficultyBadge level={c.difficulty} /></div>
                <p className="text-sm text-muted">{c.blurb}</p>
                <p className="mt-auto pt-2 text-sm font-semibold text-brand">{commandsInCategory(c.id).length} commands · Explore</p>
              </Link>
            ))}
          </div>
        </Page>
      </section>

      <Page>
        <div className="flex items-end justify-between"><h2 className="h2">Popular commands</h2><Link to="/commands" className="text-sm font-semibold text-brand">See all</Link></div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popularSlugs.map((s) => bySlug.get(s)).filter(Boolean).map((c) => <CmdCard key={c!.slug} c={c!} />)}
        </div>
      </Page>

      <section className="bg-soft">
        <Page>
          <h2 className="h2">Learning paths</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paths.map((p) => (
              <Link key={p.id} to={`/learn/${p.id}`} className="card p-5 transition-colors hover:border-brand">
                <div className="flex items-start justify-between gap-2"><span className="font-bold">{p.title}</span><DifficultyBadge level={p.level as 'Beginner'} /></div>
                <p className="mt-2 text-sm text-muted">{p.lessons.length} lessons · {p.goal[0]}</p>
              </Link>
            ))}
          </div>
        </Page>
      </section>

      <Page>
        <h2 className="h2">Interactive tools</h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <Link to="/terminal" className="card overflow-hidden transition-colors hover:border-brand">
            <pre className="term p-4 text-[12.5px] leading-relaxed"><code>{`$ git init
Initialized empty Git repository
$ git switch -c feature/login
Switched to a new branch 'feature/login'`}</code></pre>
            <div className="p-4"><p className="font-bold">Git Terminal Simulator</p><p className="mt-1 text-sm text-muted">A controlled simulation. It never runs real system commands.</p></div>
          </Link>
          <Link to="/visualizer" className="card overflow-hidden transition-colors hover:border-brand">
            <div className="grid grid-cols-4 gap-1.5 bg-soft p-4">
              {['#2563EB', '#7C3AED', '#059669', '#D97706'].map((c, i) => <div key={c} className="h-14 rounded-md border border-line bg-white" style={{ borderTop: `4px solid ${c}` }}><span className="sr-only">{i}</span></div>)}
            </div>
            <div className="p-4"><p className="font-bold">Workflow Visualizer</p><p className="mt-1 text-sm text-muted">See which area each command changes, before and after.</p></div>
          </Link>
          <Link to="/branches" className="card overflow-hidden transition-colors hover:border-brand">
            <svg viewBox="0 0 300 90" className="w-full bg-soft p-3" role="img" aria-label="Small commit graph preview">
              <line x1="30" y1="60" x2="270" y2="60" stroke="#CBD5E1" strokeWidth="3" />
              <path d="M90 60 C110 60 110 25 130 25 L190 25 C210 25 210 60 230 60" stroke="#7C3AED" strokeWidth="3" fill="none" />
              {[30, 90, 230, 270].map((x) => <circle key={x} cx={x} cy="60" r="8" fill="#2563EB" />)}
              {[130, 190].map((x) => <circle key={x} cx={x} cy="25" r="8" fill="#7C3AED" />)}
            </svg>
            <div className="p-4"><p className="font-bold">Branch Visualizer</p><p className="mt-1 text-sm text-muted">Apply operations and watch the graph update.</p></div>
          </Link>
        </div>
      </Page>
    </>
  );
}

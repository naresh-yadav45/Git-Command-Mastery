import { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Page, PageHead } from '../components/shared';

interface C { id: string; parents: string[]; lane: number; label: string }
interface G { commits: C[]; branches: Record<string, string>; lanes: Record<string, number>; head: string; tags: Record<string, string>; n: number; log: string }

const init = (): G => ({
  commits: [{ id: 'c1', parents: [], lane: 0, label: 'C1' }, { id: 'c2', parents: ['c1'], lane: 0, label: 'C2' }],
  branches: { main: 'c2' }, lanes: { main: 0 }, head: 'main', tags: {}, n: 3, log: 'Start: main has two commits.',
});
const anc = (g: G, id: string): Set<string> => { const s = new Set<string>(); const st = [id]; while (st.length) { const x = st.pop()!; if (s.has(x)) continue; s.add(x); st.push(...g.commits.find((c) => c.id === x)!.parents); } return s; };

export default function BranchVisualizer() {
  const [g, setG] = useState<G>(init());
  const [name, setName] = useState('feature');
  const [msg, setMsg] = useState('');
  const upd = (f: (n: G) => string | void) => { const n: G = JSON.parse(JSON.stringify(g)); const m = f(n); if (m) { setMsg(m); return; } setMsg(''); setG(n); };
  const cur = g.branches[g.head];
  const lane = (n: G) => n.lanes[n.head];
  const add = (n: G, parents: string[], l: number): string => { const id = `c${n.n}`; n.commits.push({ id, parents, lane: l, label: `C${n.n}` }); n.n++; n.branches[n.head] = id; return id; };

  const ops = {
    commit: () => upd((n) => { add(n, [n.branches[n.head]], lane(n)); n.log = `commit: new commit on ${n.head}.`; }),
    branch: () => upd((n) => { const b = name.trim(); if (!b || b in n.branches) return `A branch called “${b}” already exists or the name is empty.`; n.branches[b] = n.branches[n.head]; n.lanes[b] = Object.keys(n.lanes).length; n.head = b; n.log = `switch -c ${b}: created and switched. The new branch points at the same commit.`; }),
    checkout: (b: string) => upd((n) => { n.head = b; n.log = `switch ${b}: HEAD now points to ${b}.`; }),
    merge: () => upd((n) => {
      const other = Object.keys(n.branches).find((b) => b !== n.head && !anc(n, n.branches[n.head]).has(n.branches[b]));
      if (!other) return 'Nothing to merge: every other branch is already included in the current branch.';
      const ours = n.branches[n.head], theirs = n.branches[other];
      if (anc(n, theirs).has(ours)) { n.branches[n.head] = theirs; n.log = `merge ${other}: fast-forward, the pointer simply moved.`; return; }
      add(n, [ours, theirs], lane(n)); n.log = `merge ${other}: merge commit with two parents.`;
    }),
    rebase: () => upd((n) => {
      if (n.head === 'main') return 'Switch to a feature branch first, then rebase it onto main.';
      const mainTip = n.branches.main, mine = n.branches[n.head];
      if (anc(n, mine).has(mainTip)) return 'Nothing to do: this branch already contains the latest main.';
      const mb = [...anc(n, mine)].filter((x) => anc(n, mainTip).has(x));
      const baseSet = new Set(mb); const own: C[] = []; let x: string | undefined = mine;
      while (x && !baseSet.has(x)) { const c = n.commits.find((k) => k.id === x)!; own.unshift(c); x = c.parents[0]; }
      let parent = mainTip;
      own.forEach((c) => { const id = `c${n.n}`; n.commits.push({ id, parents: [parent], lane: lane(n), label: `${c.label}'` }); n.n++; parent = id; });
      n.branches[n.head] = parent; n.log = `rebase onto main: your commits were replayed as new commits (marked with ').`;
    }),
    cherry: () => upd((n) => {
      if (n.head === 'main') return 'Switch to another branch, then cherry-pick the latest main commit onto it.';
      const src = n.commits.find((c) => c.id === n.branches.main)!;
      const mine = anc(n, n.branches[n.head]);
      if (mine.has(src.id)) return 'The latest main commit is already in this branch.';
      add(n, [n.branches[n.head]], lane(n)); n.commits[n.commits.length - 1].label = `${src.label}*`; n.log = `cherry-pick: copied the change of ${src.label} as a new commit (marked with *).`;
    }),
    tag: () => upd((n) => { const t = `v${Object.keys(n.tags).length + 1}.0`; n.tags[t] = n.branches[n.head]; n.log = `tag ${t}: a fixed name on the current commit.`; }),
  };

  const pos = useMemo(() => { const p: Record<string, { x: number; y: number }> = {}; g.commits.forEach((c, i) => { p[c.id] = { x: 50 + i * 62, y: 40 + c.lane * 56 }; }); return p; }, [g]);
  const w = Math.max(560, 80 + g.commits.length * 62), h = 40 + (Object.keys(g.lanes).length) * 56 + 30;
  const colors = ['#2563EB', '#7C3AED', '#059669', '#D97706', '#DC2626'];

  return (
    <Page>
      <PageHead title="Branch visualizer" intro="Choose an operation and watch the commit graph change. This is a teaching model of Git's behaviour, kept deliberately small." />
      <div className="card mb-4 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <button className="btn-ghost" onClick={ops.commit}>commit</button>
          <input className="input !w-36" value={name} onChange={(e) => setName(e.target.value)} aria-label="New branch name" />
          <button className="btn-ghost" onClick={ops.branch}>switch -c</button>
          <button className="btn-ghost" onClick={ops.merge}>merge</button>
          <button className="btn-ghost" onClick={ops.rebase}>rebase onto main</button>
          <button className="btn-ghost" onClick={ops.cherry}>cherry-pick main</button>
          <button className="btn-ghost" onClick={ops.tag}>tag</button>
          <button className="btn-ghost ml-auto" onClick={() => { setG(init()); setMsg(''); }}><RotateCcw size={15} /> Reset</button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2"><span className="text-xs font-bold text-muted">Current branch</span>
          {Object.keys(g.branches).map((b) => <button key={b} onClick={() => ops.checkout(b)} aria-pressed={b === g.head} className={`chip font-mono ${b === g.head ? 'chip-on' : ''}`}>{b}</button>)}</div>
        {msg && <p role="alert" className="mt-3 text-sm font-semibold text-warn">{msg}</p>}
      </div>
      <div className="card overflow-x-auto p-4">
        <svg width={w} height={h} role="img" aria-label="Commit graph">
          {g.commits.flatMap((c) => c.parents.map((p) => <line key={c.id + p} x1={pos[p].x} y1={pos[p].y} x2={pos[c.id].x} y2={pos[c.id].y} stroke="#CBD5E1" strokeWidth="3" />))}
          {g.commits.map((c) => <g key={c.id}><circle cx={pos[c.id].x} cy={pos[c.id].y} r="15" fill={colors[c.lane % colors.length]} /><text x={pos[c.id].x} y={pos[c.id].y + 4} textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">{c.label}</text></g>)}
          {Object.entries(g.branches).map(([b, id], k) => <g key={b}><rect x={pos[id].x - 26} y={pos[id].y - 44 - (k % 2) * 0} width="52" height="18" rx="9" fill={b === g.head ? '#0F172A' : '#fff'} stroke="#0F172A" /><text x={pos[id].x} y={pos[id].y - 31} textAnchor="middle" fontSize="10" fontWeight="700" fill={b === g.head ? '#fff' : '#0F172A'}>{b.length > 8 ? b.slice(0, 7) + '…' : b}</text></g>)}
          {Object.entries(g.tags).map(([t, id]) => <text key={t} x={pos[id].x} y={pos[id].y + 32} textAnchor="middle" fontSize="10" fontWeight="700" fill="#D97706">🏷 {t}</text>)}
          <text x={pos[cur].x + 20} y={pos[cur].y + 4} fontSize="11" fontWeight="700" fill="#DC2626">HEAD→{g.head}</text>
        </svg>
      </div>
      <p className="mt-3 text-sm text-muted" aria-live="polite"><strong className="text-ink">What happened:</strong> {g.log}</p>
    </Page>
  );
}

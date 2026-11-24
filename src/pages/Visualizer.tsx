import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Play, RotateCcw } from 'lucide-react';
import { Page, PageHead, CodeBlock } from '../components/shared';

const stages = [
  { name: 'Working directory', color: '#2563EB', note: 'Files you edit' },
  { name: 'Staging area', color: '#7C3AED', note: 'Next commit preview' },
  { name: 'Local repository', color: '#059669', note: 'Your commits' },
  { name: 'Remote repository', color: '#D97706', note: 'Shared server' },
];
type State = [string[], string[], string[], string[]];
interface V { slug: string; cmd: string; affects: number[]; before: State; after: State; says: string[] }

const base: State = [['app.js (modified)'], [], ['C1', 'C2'], ['C1', 'C2']];
const vs: V[] = [
  { slug: 'init', cmd: 'git init', affects: [2], before: [['app.js'], [], ['(no repository)'], []], after: [['app.js'], [], ['.git created (empty)'], []], says: ['Creates the hidden .git directory.', 'Your files are not changed or tracked yet.'] },
  { slug: 'add', cmd: 'git add app.js', affects: [0, 1], before: base, after: [['app.js (modified)'], ['app.js (staged)'], ['C1', 'C2'], ['C1', 'C2']], says: ['Copies the current content of app.js into the staging area.', 'The file in your working directory is untouched.'] },
  { slug: 'commit', cmd: 'git commit -m "Update app"', affects: [1, 2], before: [['app.js'], ['app.js (staged)'], ['C1', 'C2'], ['C1', 'C2']], after: [['app.js'], [], ['C1', 'C2', 'C3 new'], ['C1', 'C2']], says: ['Turns the staged snapshot into commit C3.', 'The branch moves to C3. The remote does not know about it yet.'] },
  { slug: 'push', cmd: 'git push origin main', affects: [2, 3], before: [['app.js'], [], ['C1', 'C2', 'C3'], ['C1', 'C2']], after: [['app.js'], [], ['C1', 'C2', 'C3'], ['C1', 'C2', 'C3 new']], says: ['Uploads commits the remote lacks.', 'The remote branch now points to C3.'] },
  { slug: 'fetch', cmd: 'git fetch origin', affects: [2, 3], before: [['app.js'], [], ['C1', 'C2'], ['C1', 'C2', 'C3']], after: [['app.js'], [], ['C1', 'C2', 'origin/main → C3 new'], ['C1', 'C2', 'C3']], says: ['Downloads C3 and updates origin/main.', 'Your branch and files do not change.'] },
  { slug: 'pull', cmd: 'git pull', affects: [0, 1, 2, 3], before: [['app.js'], [], ['C1', 'C2'], ['C1', 'C2', 'C3']], after: [['app.js (updated)'], [], ['C1', 'C2', 'C3 new'], ['C1', 'C2', 'C3']], says: ['fetch plus merge (or rebase).', 'Your branch and working files now include C3.'] },
  { slug: 'reset', cmd: 'git reset HEAD~1', affects: [0, 1, 2], before: [['app.js'], [], ['C1', 'C2', 'C3'], ['C1', 'C2']], after: [['app.js (modified)'], [], ['C1', 'C2'], ['C1', 'C2']], says: ['Default (mixed) reset moves the branch back to C2 and unstages.', 'Your changes remain in the working directory. --hard would discard them.'] },
  { slug: 'restore', cmd: 'git restore app.js', affects: [0], before: base, after: [['app.js'], [], ['C1', 'C2'], ['C1', 'C2']], says: ['Replaces the working file with the staged/committed version.', 'Your uncommitted edits are lost.'] },
];

export default function Visualizer() {
  const [i, setI] = useState(1);
  const [phase, setPhase] = useState<'before' | 'after'>('before');
  const [key, setKey] = useState(0);
  const v = vs[i];
  const st = phase === 'before' ? v.before : v.after;
  const play = () => { setPhase('before'); setKey((k) => k + 1); setTimeout(() => setPhase('after'), 700); };
  return (
    <Page>
      <PageHead title="Interactive Git visualizer" intro="Pick a command, then press Play to see how it moves content between the four areas. The example uses one modified file, app.js." />
      <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Commands">
        {vs.map((x, k) => <button key={x.slug} role="tab" aria-selected={k === i} onClick={() => { setI(k); setPhase('before'); }} className={`chip font-mono ${k === i ? 'chip-on' : ''}`}>git {x.slug}</button>)}
      </div>
      <div className="card p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <code className="rounded-lg bg-soft px-3 py-2 font-mono text-sm font-semibold">{v.cmd}</code>
          <div className="flex gap-2">
            <button onClick={play} className="btn-primary"><Play size={16} /> Play</button>
            <button onClick={() => setPhase(phase === 'before' ? 'after' : 'before')} className="btn-ghost"><RotateCcw size={16} /> Show {phase === 'before' ? 'after' : 'before'}</button>
          </div>
        </div>
        <p className="mb-3 text-sm font-bold" aria-live="polite">State: {phase === 'before' ? 'Before the command' : 'After the command'}</p>
        <div className="grid gap-3 md:grid-cols-4" key={key}>
          {stages.map((s, k) => {
            const hot = v.affects.includes(k);
            return (
              <div key={s.name} className="relative">
                <motion.div animate={{ scale: hot && phase === 'after' ? 1.02 : 1 }} className={`h-full rounded-xl border p-3 ${hot ? 'bg-white shadow-card' : 'bg-soft'}`} style={{ borderColor: hot ? s.color : '#E2E8F0', borderTopWidth: 4, borderTopColor: s.color }}>
                  <p className="text-sm font-bold">{s.name}</p><p className="text-xs text-muted">{s.note}</p>
                  <ul className="mt-3 min-h-[84px] space-y-1.5">
                    <AnimatePresence mode="popLayout">
                      {st[k].length === 0 && <li className="text-xs italic text-slate-400">empty</li>}
                      {st[k].map((item) => <motion.li layout key={item} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`rounded-md border px-2 py-1 font-mono text-xs ${item.includes('new') || item.includes('staged') || item.includes('updated') ? 'border-brand bg-brand-tint' : 'border-line bg-white'}`}>{item}</motion.li>)}
                    </AnimatePresence>
                  </ul>
                </motion.div>
                {k < 3 && <ArrowRight size={16} className="absolute -right-3 top-8 z-10 hidden rounded-full bg-white text-slate-400 md:block" />}
              </div>
            );
          })}
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div><p className="mb-2 font-bold">What changed</p><ul className="list-disc space-y-1 pl-5 text-sm text-muted">{v.says.map((s) => <li key={s}>{s}</li>)}</ul></div>
          <div><CodeBlock code={v.cmd} /><Link className="mt-3 inline-block text-sm font-semibold text-brand" to={`/commands/${v.slug}`}>Open the full git {v.slug} page</Link></div>
        </div>
      </div>
    </Page>
  );
}

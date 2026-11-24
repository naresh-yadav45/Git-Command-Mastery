import { useEffect, useRef, useState } from 'react';
import { RotateCcw, Eraser, CheckCircle2, ShieldCheck } from 'lucide-react';
import { HELP, newRepo, run, type Repo } from '../utils/gitSim';
import { Page, PageHead } from '../components/shared';

interface Line { kind: 'in' | 'out' | 'err'; text: string }
interface Step { text: string; match: RegExp; hint: string }
interface Exercise { id: string; title: string; setup: string[]; steps: Step[] }

const exercises: Exercise[] = [
  { id: 'first', title: 'Your first commit', setup: [], steps: [
    { text: 'Create a repository.', match: /^git init/, hint: 'git init' },
    { text: 'Create a file named README.md.', match: /^echo .*>\s*README\.md$/, hint: 'echo "# Demo" > README.md' },
    { text: 'Check what Git sees.', match: /^git status/, hint: 'git status' },
    { text: 'Stage the file.', match: /^git add (README\.md|\.)/, hint: 'git add README.md' },
    { text: 'Commit it with a message.', match: /^git commit .*-m/, hint: 'git commit -m "Initial commit"' },
    { text: 'Read the history.', match: /^git log/, hint: 'git log --oneline' } ] },
  { id: 'branch', title: 'Branch and merge', setup: ['git init', 'echo "# Demo" > README.md', 'git add .', 'git commit -m "Initial commit"'], steps: [
    { text: 'Create and switch to feature/login.', match: /^git (switch -c|checkout -b) feature\/login/, hint: 'git switch -c feature/login' },
    { text: 'Create login.txt.', match: /^echo .*>\s*login\.txt$/, hint: 'echo "login" > login.txt' },
    { text: 'Stage the file.', match: /^git add/, hint: 'git add login.txt' },
    { text: 'Commit it.', match: /^git commit .*-m/, hint: 'git commit -m "Add login"' },
    { text: 'Go back to main.', match: /^git (switch|checkout) main/, hint: 'git switch main' },
    { text: 'Merge the feature branch.', match: /^git merge feature\/login/, hint: 'git merge feature/login' },
    { text: 'Delete the merged branch.', match: /^git branch -d feature\/login/, hint: 'git branch -d feature/login' } ] },
  { id: 'stash', title: 'Stash your work', setup: ['git init', 'echo "# Demo" > README.md', 'git add .', 'git commit -m "Initial commit"'], steps: [
    { text: 'Edit README.md without committing.', match: /^echo .*>>?\s*README\.md$/, hint: 'echo "work in progress" >> README.md' },
    { text: 'See the change.', match: /^git status/, hint: 'git status' },
    { text: 'Stash it.', match: /^git stash( push)?$/, hint: 'git stash' },
    { text: 'Confirm the tree is clean.', match: /^git status/, hint: 'git status' },
    { text: 'Bring the work back.', match: /^git stash pop/, hint: 'git stash pop' } ] },
];

function suggestions(r: Repo): string[] {
  if (!r.inited) return ['git init', 'help'];
  const s: string[] = ['git status'];
  if (Object.keys(r.files).some((f) => !(f in r.index) || r.files[f] !== r.index[f])) s.push('git add .');
  if (Object.keys(r.index).length) s.push('git commit -m "Update"');
  s.push('git log --oneline', 'git branch');
  return s.slice(0, 5);
}

export default function Terminal() {
  const [repo, setRepo] = useState<Repo>(newRepo());
  const [lines, setLines] = useState<Line[]>([{ kind: 'out', text: 'Simulated terminal. Type help to see supported commands. Nothing here runs on your computer.' }]);
  const [input, setInput] = useState('');
  const [hist, setHist] = useState<string[]>([]);
  const [hi, setHi] = useState(-1);
  const [explain, setExplain] = useState('Run a command and an explanation of what it did appears here.');
  const [ex, setEx] = useState<Exercise | null>(null);
  const [step, setStep] = useState(0);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ block: 'nearest' }); }, [lines]);

  const exec = (cmd: string, base: Repo = repo, silent = false) => {
    const { repo: next, res } = run(base, cmd);
    if (!silent) {
      setLines((l) => [...l, { kind: 'in', text: cmd }, ...res.out.filter((x) => x !== '' || res.out.length > 1).map((t) => ({ kind: (res.error ? 'err' : 'out') as Line['kind'], text: t }))]);
      if (res.explain) setExplain(res.explain); else if (res.error) setExplain('That command failed. Read the message: Git usually says what is wrong and often how to fix it.');
      if (ex && !res.error && step < ex.steps.length && ex.steps[step].match.test(cmd)) setStep(step + 1);
    }
    return next;
  };
  const submit = () => {
    const c = input.trim(); if (!c) return;
    if (c === 'clear') { setLines([]); setInput(''); return; }
    setHist((h) => [c, ...h]); setHi(-1); setRepo(exec(c)); setInput('');
  };
  const reset = () => { setRepo(newRepo()); setLines([{ kind: 'out', text: 'Repository reset to an empty folder.' }]); setStep(0); setEx(null); setExplain('Run a command and an explanation of what it did appears here.'); };
  const start = (e: Exercise) => {
    let r = newRepo(); e.setup.forEach((c) => { r = run(r, c).repo; });
    setRepo(r); setEx(e); setStep(0);
    setLines([{ kind: 'out', text: `Exercise: ${e.title}${e.setup.length ? ' (the repository was prepared for you)' : ''}` }]);
  };

  const branchLine = repo.inited ? `(${repo.head})` : '';
  return (
    <Page>
      <PageHead title="Git terminal simulator" intro="A controlled simulation of a small repository. It supports the commands listed under help and never executes system commands or scripts." />
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900"><ShieldCheck size={18} /> Safe by design: input is parsed by a built-in simulator, not passed to a shell.</div>
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="term overflow-hidden rounded-xl border border-slate-800">
            <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
              <span className="text-xs text-slate-400">simulated-repo {branchLine}</span>
              <div className="flex gap-2">
                <button onClick={() => setLines([])} className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/10 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/20"><Eraser size={13} /> Clear</button>
                <button onClick={reset} className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/10 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/20"><RotateCcw size={13} /> Reset</button>
              </div>
            </div>
            <div className="h-[380px] overflow-y-auto p-4 text-[13px] leading-relaxed" role="log" aria-live="polite">
              {lines.map((l, i) => <div key={i} className={l.kind === 'in' ? 'text-emerald-300' : l.kind === 'err' ? 'text-rose-300' : 'text-slate-200'} style={{ whiteSpace: 'pre-wrap' }}>{l.kind === 'in' ? `$ ${l.text}` : l.text}</div>)}
              <div ref={end} />
            </div>
            <div className="flex items-center gap-2 border-t border-white/10 px-4 py-3">
              <span className="text-emerald-300">$</span>
              <input value={input} onChange={(e) => setInput(e.target.value)} aria-label="Terminal input" autoFocus spellCheck={false} autoCapitalize="off" autoComplete="off"
                className="w-full bg-transparent text-[13px] text-slate-100 outline-none placeholder:text-slate-500" placeholder="type a git command"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submit();
                  if (e.key === 'ArrowUp') { e.preventDefault(); const n = Math.min(hi + 1, hist.length - 1); setHi(n); setInput(hist[n] ?? ''); }
                  if (e.key === 'ArrowDown') { e.preventDefault(); const n = Math.max(hi - 1, -1); setHi(n); setInput(n === -1 ? '' : hist[n]); }
                }} />
              <button onClick={submit} className="rounded-md bg-brand px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-dark">Run</button>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2"><span className="text-xs font-bold text-muted">Suggestions</span>
            {suggestions(repo).map((s) => <button key={s} className="chip font-mono" onClick={() => setInput(s)}>{s}</button>)}</div>
          <div className="card mt-4 p-4"><p className="text-sm font-bold">What just happened</p><p className="mt-1 text-sm text-muted" aria-live="polite">{explain}</p></div>
          <details className="mt-4 text-sm text-muted"><summary className="cursor-pointer font-semibold text-ink">Supported commands</summary><pre className="mt-2 whitespace-pre-wrap">{HELP.join('\n')}</pre></details>
        </div>
        <aside className="space-y-4">
          <div className="card p-4">
            <p className="font-bold">Guided exercises</p>
            <div className="mt-3 space-y-2">{exercises.map((e) => <button key={e.id} onClick={() => start(e)} className={`w-full rounded-lg border px-3 py-2.5 text-left text-sm font-semibold ${ex?.id === e.id ? 'border-brand bg-brand-tint text-brand' : 'border-line hover:bg-soft'}`}>{e.title}</button>)}</div>
          </div>
          {ex && (
            <div className="card p-4">
              <p className="font-bold">{ex.title}</p>
              <ol className="mt-3 space-y-2 text-sm">
                {ex.steps.map((s, i) => (
                  <li key={i} className={`flex gap-2 ${i < step ? 'text-ok' : i === step ? 'text-ink' : 'text-slate-400'}`}>
                    {i < step ? <CheckCircle2 size={16} className="mt-0.5 shrink-0" /> : <span className="mt-0.5 w-4 shrink-0 text-center text-xs font-bold">{i + 1}</span>}
                    <span>{s.text}{i === step && <button className="mt-1 block font-mono text-xs text-brand" onClick={() => setInput(s.hint)}>Hint: {s.hint}</button>}</span>
                  </li>
                ))}
              </ol>
              {step >= ex.steps.length && <p className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-900">Exercise complete. Nice work.</p>}
            </div>
          )}
        </aside>
      </div>
    </Page>
  );
}

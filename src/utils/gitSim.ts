// A small, self-contained Git simulation. It never touches the real file system or shell:
// everything lives in the plain object below.
export interface Commit { id: string; msg: string; parents: string[]; files: Record<string, string>; time: number }
export interface Repo {
  inited: boolean;
  files: Record<string, string>;
  index: Record<string, string>;
  commits: Record<string, Commit>;
  branches: Record<string, string | null>;
  head: string;
  stash: { files: Record<string, string>; index: Record<string, string>; msg: string }[];
  remotes: Record<string, string>;
  remoteTips: Record<string, string>;
  clock: number;
}
export interface Result { out: string[]; explain?: string; error?: boolean }

export const newRepo = (): Repo => ({ inited: false, files: {}, index: {}, commits: {}, branches: {}, head: 'main', stash: [], remotes: {}, remoteTips: {}, clock: 1 });

const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x));
const hash = (s: string) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(16).padStart(8, '0').slice(0, 7); };
const err = (...out: string[]): Result => ({ out, error: true });
const tip = (r: Repo, b = r.head) => r.branches[b] ?? null;
const headFiles = (r: Repo) => { const t = tip(r); return t ? r.commits[t].files : {}; };
const NOT_REPO = 'fatal: not a git repository (or any of the parent directories): .git';

function ancestors(r: Repo, id: string | null): Set<string> {
  const seen = new Set<string>(); const st = id ? [id] : [];
  while (st.length) { const x = st.pop()!; if (seen.has(x)) continue; seen.add(x); st.push(...r.commits[x].parents); }
  return seen;
}
function mergeBase(r: Repo, a: string, b: string): string | null {
  const A = ancestors(r, a); let best: Commit | null = null;
  for (const id of ancestors(r, b)) if (A.has(id) && (!best || r.commits[id].time > best.time)) best = r.commits[id];
  return best ? best.id : null;
}
function changes(r: Repo) {
  const h = headFiles(r);
  const staged: [string, string][] = []; const unstaged: [string, string][] = []; const untracked: string[] = [];
  for (const f of Object.keys(r.index)) { if (!(f in h)) staged.push(['new file', f]); else if (h[f] !== r.index[f]) staged.push(['modified', f]); }
  for (const f of Object.keys(h)) if (!(f in r.index)) staged.push(['deleted', f]);
  for (const f of Object.keys(r.index)) { if (!(f in r.files)) unstaged.push(['deleted', f]); else if (r.files[f] !== r.index[f]) unstaged.push(['modified', f]); }
  for (const f of Object.keys(r.files)) if (!(f in r.index)) untracked.push(f);
  return { staged: staged.sort(), unstaged: unstaged.sort(), untracked: untracked.sort() };
}
const diffText = (a: string, b: string, f: string): string[] => {
  const A = a.split('\n'), B = b.split('\n');
  const out = [`diff --git a/${f} b/${f}`, `--- a/${f}`, `+++ b/${f}`, '@@ simulated hunk @@'];
  A.filter((l) => !B.includes(l)).forEach((l) => out.push('-' + l));
  B.filter((l) => !A.includes(l)).forEach((l) => out.push('+' + l));
  return out;
};
const shortLine = (r: Repo) => { const t = tip(r); return t ? `${t} ${r.commits[t].msg}` : ''; };

function doCommit(r: Repo, msg: string, parents: string[]): Commit {
  const time = r.clock++;
  const c: Commit = { id: hash(msg + parents.join('') + time), msg, parents, files: clone(r.index), time };
  r.commits[c.id] = c; r.branches[r.head] = c.id; return c;
}

function tokenize(line: string): string[] {
  const out: string[] = []; const re = /"([^"]*)"|'([^']*)'|(\S+)/g; let m: RegExpExecArray | null;
  while ((m = re.exec(line))) out.push(m[1] ?? m[2] ?? m[3]);
  return out;
}

export const HELP = [
  'Supported in this simulator:',
  '  git init | status | add | commit | log | diff | branch | switch | checkout | merge | stash | remote | push | pull | fetch | config | --version',
  '  Helpers that act only on the simulated folder: touch <file>, echo "text" > file, echo "text" >> file, cat <file>, ls, rm <file>',
  '  Nothing here runs on your computer.',
];

export function run(repo: Repo, line: string): { repo: Repo; res: Result } {
  const r = clone(repo);
  const raw = line.trim();
  if (!raw) return { repo: r, res: { out: [] } };

  // echo "x" > f / >> f
  const echo = raw.match(/^echo\s+(.*?)\s*(>>?)\s*(\S+)$/);
  if (echo) {
    const text = echo[1].replace(/^["']|["']$/g, '');
    r.files[echo[3]] = echo[2] === '>>' && echo[3] in r.files ? r.files[echo[3]] + '\n' + text : text;
    return { repo: r, res: { out: [], explain: `The simulator wrote "${text}" into ${echo[3]} in its fake working directory. This is not your real disk.` } };
  }
  const t = tokenize(raw);
  const cmd = t[0];

  if (cmd === 'help') return { repo: r, res: { out: HELP } };
  if (cmd === 'ls') return { repo: r, res: { out: Object.keys(r.files).sort().concat(r.inited ? [] : []) } };
  if (cmd === 'touch') { t.slice(1).forEach((f) => { if (!(f in r.files)) r.files[f] = ''; }); return { repo: r, res: { out: [], explain: 'Created an empty file in the simulated working directory.' } }; }
  if (cmd === 'cat') return { repo: r, res: t[1] in r.files ? { out: r.files[t[1]].split('\n') } : err(`cat: ${t[1]}: No such file or directory`) };
  if (cmd === 'rm') { if (t[1] in r.files) { delete r.files[t[1]]; return { repo: r, res: { out: [], explain: 'Deleted the file from the simulated working directory only. Run git add or git status to see how Git notices it.' } }; } return { repo: r, res: err(`rm: cannot remove '${t[1]}': No such file or directory`) }; }
  if (cmd !== 'git') return { repo: r, res: err(`${cmd}: command not found in this simulator. Type help to see what is supported.`) };

  const sub = t[1]; const args = t.slice(2);
  if (!sub) return { repo: r, res: { out: ['usage: git <command> [<args>]', 'Type help to see the commands this simulator supports.'] } };
  if (sub === '--version' || sub === 'version') return { repo: r, res: { out: ['git version 2.x (simulated)'] } };
  if (sub === 'init') {
    const bi = args.indexOf('-b');
    if (r.inited) return { repo: r, res: { out: ['Reinitialized existing Git repository in /simulated/.git/'], explain: 'The folder was already a repository, so nothing changed.' } };
    r.inited = true; r.head = bi >= 0 ? args[bi + 1] : 'main'; r.branches = { [r.head]: null };
    return { repo: r, res: { out: ['Initialized empty Git repository in /simulated/.git/'], explain: 'A hidden .git directory now exists. HEAD points at an unborn branch until you make your first commit.' } };
  }
  if (sub === 'config') return { repo: r, res: { out: [], explain: 'Configuration is accepted but not stored in this simulator.' } };
  if (!r.inited) return { repo: r, res: err(NOT_REPO) };

  const ch = changes(r);
  switch (sub) {
    case 'status': {
      const out = [`On branch ${r.head}`];
      if (!tip(r)) out.push('', 'No commits yet');
      if (ch.staged.length) { out.push('', 'Changes to be committed:', '  (use "git restore --staged <file>..." to unstage)'); ch.staged.forEach(([k, f]) => out.push(`\t${k}:   ${f}`)); }
      if (ch.unstaged.length) { out.push('', 'Changes not staged for commit:', '  (use "git add <file>..." to update what will be committed)'); ch.unstaged.forEach(([k, f]) => out.push(`\t${k}:   ${f}`)); }
      if (ch.untracked.length) { out.push('', 'Untracked files:', '  (use "git add <file>..." to include in what will be committed)'); ch.untracked.forEach((f) => out.push(`\t${f}`)); }
      if (!ch.staged.length && !ch.unstaged.length && !ch.untracked.length) out.push(tip(r) ? 'nothing to commit, working tree clean' : 'nothing to commit (create/copy files and use "git add" to track)');
      return { repo: r, res: { out, explain: 'status compares three places: your last commit, the staging area and your working files.' } };
    }
    case 'add': {
      if (!args.length) return { repo: r, res: err('Nothing specified, nothing added.') };
      for (const a of args) {
        if (a === '.' || a === '-A' || a === '--all') {
          for (const f of Object.keys(r.files)) r.index[f] = r.files[f];
          for (const f of Object.keys(r.index)) if (!(f in r.files)) delete r.index[f];
        } else if (a in r.files) r.index[a] = r.files[a];
        else if (a in r.index) delete r.index[a];
        else return { repo: r, res: err(`fatal: pathspec '${a}' did not match any files`) };
      }
      return { repo: r, res: { out: [], explain: 'git add copies the current content of the files into the staging area. Run git status to see them under "Changes to be committed".' } };
    }
    case 'commit': {
      let msg = ''; const mi = args.findIndex((a) => a === '-m' || a === '-am' || a === '-a');
      const all = args.includes('-a') || args.includes('-am');
      if (mi >= 0) msg = args[mi === args.length - 1 ? mi : mi + 1] ?? '';
      if (args.includes('-am')) msg = args[args.indexOf('-am') + 1] ?? '';
      if (!msg) return { repo: r, res: err('Aborting commit due to empty commit message. Use -m "message" in this simulator.') };
      if (all) { for (const f of Object.keys(r.index)) { if (f in r.files) r.index[f] = r.files[f]; else delete r.index[f]; } }
      const c2 = changes(r);
      if (!c2.staged.length) return { repo: r, res: err(c2.unstaged.length || c2.untracked.length ? 'no changes added to commit (use "git add" and/or "git commit -a")' : `On branch ${r.head}\nnothing to commit, working tree clean`) };
      const root = !tip(r);
      const c = doCommit(r, msg, root ? [] : [tip(r)!]);
      return { repo: r, res: { out: [`[${r.head}${root ? ' (root-commit)' : ''} ${c.id}] ${msg}`, ` ${c2.staged.length} file${c2.staged.length > 1 ? 's' : ''} changed`], explain: 'A new commit stores the staged snapshot. The current branch pointer moved forward to it.' } };
    }
    case 'log': {
      if (!tip(r)) return { repo: r, res: err(`fatal: your current branch '${r.head}' does not have any commits yet`) };
      const ids = [...ancestors(r, tip(r))].map((i) => r.commits[i]).sort((a, b) => b.time - a.time);
      const one = args.includes('--oneline');
      const deco = (id: string) => { const d: string[] = []; if (tip(r) === id) d.push(`HEAD -> ${r.head}`); Object.entries(r.branches).forEach(([b, x]) => { if (x === id && b !== r.head) d.push(b); }); return d.length ? ` (${d.join(', ')})` : ''; };
      const out: string[] = [];
      ids.forEach((c) => { if (one) out.push(`${c.id}${deco(c.id)} ${c.msg}`); else out.push(`commit ${c.id}${deco(c.id)}`, 'Author: You <you@example.com>', '', `    ${c.msg}`, ''); });
      return { repo: r, res: { out, explain: 'log walks backwards from the current commit through its parents, newest first.' } };
    }
    case 'diff': {
      const staged = args.includes('--staged') || args.includes('--cached');
      const out: string[] = [];
      if (staged) { const h = headFiles(r); for (const [, f] of ch.staged) out.push(...diffText(h[f] ?? '', r.index[f] ?? '', f)); }
      else for (const [, f] of ch.unstaged) out.push(...diffText(r.index[f] ?? '', r.files[f] ?? '', f));
      return { repo: r, res: { out, explain: staged ? 'Shows what is staged compared with the last commit.' : 'Shows edits that are not staged yet. Staged changes need --staged.' } };
    }
    case 'branch': {
      const del = args.find((a) => a === '-d' || a === '-D');
      const name = args.find((a) => !a.startsWith('-'));
      if (del && name) {
        if (!(name in r.branches)) return { repo: r, res: err(`error: branch '${name}' not found.`) };
        if (name === r.head) return { repo: r, res: err(`error: Cannot delete branch '${name}' checked out at '/simulated'`) };
        const bt = r.branches[name];
        if (del === '-d' && bt && !ancestors(r, tip(r)).has(bt)) return { repo: r, res: err(`error: The branch '${name}' is not fully merged.`, `If you are sure you want to delete it, run 'git branch -D ${name}'.`) };
        delete r.branches[name];
        return { repo: r, res: { out: [`Deleted branch ${name} (was ${bt?.slice(0, 7) ?? 'unborn'}).`], explain: 'Only the pointer was removed. The commits stay in the repository.' } };
      }
      if (name) {
        if (!tip(r)) return { repo: r, res: err(`fatal: not a valid object name: '${r.head}'`) };
        if (name in r.branches) return { repo: r, res: err(`fatal: a branch named '${name}' already exists`) };
        r.branches[name] = tip(r);
        return { repo: r, res: { out: [], explain: 'A branch is just a new name pointing at the current commit. You are still on the old branch.' } };
      }
      return { repo: r, res: { out: Object.keys(r.branches).sort().map((b) => (b === r.head ? '* ' : '  ') + b), explain: 'The * marks the branch HEAD points to.' } };
    }
    case 'switch': case 'checkout': {
      const create = args.find((a) => a === '-c' || a === '-b' || a === '-C');
      const name = args.filter((a) => !a.startsWith('-')).pop();
      if (!name) return { repo: r, res: err('fatal: missing branch name') };
      if (create) {
        if (name in r.branches && create !== '-C') return { repo: r, res: err(`fatal: a branch named '${name}' already exists`) };
        if (!tip(r)) { r.head = name; r.branches = { [name]: null }; }
        else { r.branches[name] = tip(r); r.head = name; }
        return { repo: r, res: { out: [`Switched to a new branch '${name}'`], explain: 'Created the branch at the current commit and moved HEAD onto it. No files changed.' } };
      }
      if (!(name in r.branches)) return { repo: r, res: err(sub === 'switch' ? `fatal: invalid reference: ${name}` : `error: pathspec '${name}' did not match any file(s) known to git`) };
      if (name === r.head) return { repo: r, res: { out: [`Already on '${name}'`] } };
      const dirty = ch.staged.concat(ch.unstaged);
      if (dirty.length && tip(r, name) !== tip(r)) return { repo: r, res: err('error: Your local changes to the following files would be overwritten by checkout:', ...dirty.map(([, f]) => `\t${f}`), 'Please commit your changes or stash them before you switch branches.') };
      const oldFiles = headFiles(repo);
      r.head = name;
      const next = headFiles(r);
      for (const f of Object.keys(oldFiles)) if (!(f in next)) delete r.files[f];
      for (const f of Object.keys(next)) r.files[f] = next[f];
      r.index = clone(next);
      return { repo: r, res: { out: [`Switched to branch '${name}'`], explain: 'HEAD moved to the other branch and your working files were updated to match its latest commit.' } };
    }
    case 'merge': {
      const name = args[0];
      if (!name || !(name in r.branches)) return { repo: r, res: err(`merge: ${name ?? ''} - not something we can merge`) };
      const ours = tip(r), theirs = tip(r, name);
      if (!theirs || !ours) return { repo: r, res: { out: ['Already up to date.'] } };
      if (ancestors(r, ours).has(theirs)) return { repo: r, res: { out: ['Already up to date.'] } };
      if (ch.staged.length || ch.unstaged.length) return { repo: r, res: err('error: Your local changes would be overwritten by merge. Commit or stash them first.') };
      if (ancestors(r, theirs).has(ours)) {
        const old = headFiles(r); r.branches[r.head] = theirs; const next = headFiles(r);
        for (const f of Object.keys(old)) if (!(f in next)) delete r.files[f];
        for (const f of Object.keys(next)) r.files[f] = next[f];
        r.index = clone(next);
        return { repo: r, res: { out: [`Updating ${ours}..${theirs}`, 'Fast-forward'], explain: 'Your branch had no new commits, so Git only moved the branch pointer forward. No merge commit was needed.' } };
      }
      const base = mergeBase(r, ours, theirs); const B = base ? r.commits[base].files : {}; const O = r.commits[ours].files; const T = r.commits[theirs].files;
      const result: Record<string, string> = {}; const conflicts: string[] = [];
      for (const f of new Set([...Object.keys(B), ...Object.keys(O), ...Object.keys(T)])) {
        const b = B[f], o = O[f], th = T[f];
        if (o === th) { if (o !== undefined) result[f] = o; }
        else if (o === b) { if (th !== undefined) result[f] = th; }
        else if (th === b) { if (o !== undefined) result[f] = o; }
        else conflicts.push(f);
      }
      if (conflicts.length) return { repo, res: err(...conflicts.map((f) => `CONFLICT (content): Merge conflict in ${f}`), 'Automatic merge failed.', 'Simulator note: conflict resolution is not simulated, so this merge was aborted and nothing changed. Try changing different files on each branch.') };
      r.index = result; r.files = { ...r.files, ...result };
      for (const f of Object.keys(r.files)) if (!(f in result) && f in r.commits[ours].files) delete r.files[f];
      const c = doCommit(r, `Merge branch '${name}'`, [ours, theirs]);
      return { repo: r, res: { out: [`Merge made by the 'ort' strategy. (${c.id})`], explain: 'Both branches had new commits, so Git combined them and recorded a merge commit with two parents.' } };
    }
    case 'stash': {
      const op = args[0] ?? 'push';
      if (op === 'list') return { repo: r, res: { out: r.stash.map((s, i) => `stash@{${i}}: ${s.msg}`) } };
      if (op === 'pop' || op === 'apply') {
        const s = op === 'pop' ? r.stash.shift() : r.stash[0];
        if (!s) return { repo: r, res: err('No stash entries found.') };
        Object.assign(r.files, s.files); r.index = { ...r.index, ...s.index };
        return { repo: r, res: { out: [`On branch ${r.head}`, op === 'pop' ? 'Dropped refs/stash@{0}' : 'Stash kept'], explain: 'Your saved changes were re-applied to the working directory.' } };
      }
      if (!ch.staged.length && !ch.unstaged.length) return { repo: r, res: { out: ['No local changes to save'] } };
      const h = headFiles(r); const saved: Record<string, string> = {};
      for (const f of Object.keys(r.index)) if (f in r.files) saved[f] = r.files[f];
      r.stash.unshift({ files: saved, index: clone(r.index), msg: `WIP on ${r.head}: ${shortLine(r)}` });
      for (const f of Object.keys(r.index)) { if (f in h) r.files[f] = h[f]; else delete r.files[f]; }
      r.index = clone(h);
      return { repo: r, res: { out: [`Saved working directory and index state WIP on ${r.head}: ${shortLine(r)}`], explain: 'Tracked changes were shelved and the working tree returned to the last commit. Untracked files stay.' } };
    }
    case 'remote': {
      if (args[0] === 'add') { if (args[1] in r.remotes) return { repo: r, res: err(`error: remote ${args[1]} already exists.`) }; r.remotes[args[1]] = args[2] ?? ''; return { repo: r, res: { out: [], explain: 'Saved a named URL. Nothing was contacted.' } }; }
      if (args[0] === '-v') return { repo: r, res: { out: Object.entries(r.remotes).flatMap(([n, u]) => [`${n}\t${u} (fetch)`, `${n}\t${u} (push)`]) } };
      return { repo: r, res: { out: Object.keys(r.remotes) } };
    }
    case 'push': {
      const rn = args.find((a) => !a.startsWith('-')) ?? 'origin';
      if (!Object.keys(r.remotes).length) return { repo: r, res: err('fatal: No configured push destination.', 'Either specify the URL from the command-line or configure a remote repository using', '    git remote add <name> <url>') };
      if (!(rn in r.remotes)) return { repo: r, res: err(`fatal: '${rn}' does not appear to be a git repository`) };
      if (!tip(r)) return { repo: r, res: err('error: src refspec does not match any') };
      const prev = r.remoteTips[r.head];
      r.remoteTips[r.head] = tip(r)!;
      return { repo: r, res: { out: [`To ${r.remotes[rn]}`, prev ? `   ${prev}..${tip(r)}  ${r.head} -> ${r.head}` : ` * [new branch]      ${r.head} -> ${r.head}`], explain: 'Your local commits were uploaded (simulated) and the remote branch now points at your latest commit.' } };
    }
    case 'pull': case 'fetch':
      if (!Object.keys(r.remotes).length) return { repo: r, res: err('fatal: No remote repository specified.') };
      return { repo: r, res: { out: [sub === 'pull' ? 'Already up to date.' : ''], explain: 'In this simulator the remote never changes by itself, so there is nothing new to download.' } };
    default:
      return { repo: r, res: err(`git: '${sub}' is not supported in this simulator. Type help for the list.`) };
  }
}

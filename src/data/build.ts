import type { Cmd, Difficulty, Kind, Link, ErrorItem } from '../types';

// Compact authoring format: every entry is expanded into the full 12-section Cmd shape.
export interface Lite {
  n: string;                       // 'git add'
  cat: number[];
  d: Difficulty;
  k?: Kind;
  s: string;                       // simple definition
  y: string;                       // why / when
  x?: string;                      // when not to use
  syn: string[];
  f: [string, string, string, string][]; // flag, purpose, when, example
  b: [string, string];             // basic example command, explanation
  r: [string, string[]];           // real-world scenario, commands
  o: [string, string];             // illustrative output, explanation of important lines
  t: [string, string, string, string]; // working dir, index, local repo, remote ('' = not changed)
  rel: [string, string][];
  bk?: Link[];
  w?: string;
  e?: ErrorItem[];
  since?: string;
  common?: boolean;
  docs?: string;
  kw?: string;
}

const NOT_REPO: ErrorItem = {
  msg: 'fatal: not a git repository (or any of the parent directories): .git',
  reason: 'You ran the command outside a Git repository, so Git cannot find a .git directory.',
  fix: 'cd into the project folder, or create a repository with git init (or git clone).',
  prevent: 'Check your prompt or run git status first to confirm you are inside the repository you expect.',
};

export function expand(l: Lite): Cmd {
  const slug = l.n.replace(/^git /, '').replace(/\s+/g, '-');
  const none = 'Not changed by this command.';
  return {
    slug,
    name: l.n,
    categories: l.cat,
    difficulty: l.d,
    kind: l.k ?? 'porcelain',
    since: l.since ?? 'Long-standing command (see the official docs for per-version changes)',
    common: l.common ?? false,
    summary: l.s,
    why: l.y,
    avoid: l.x ?? 'If a higher-level command already does the job, prefer it, and keep this one for the specific task described above.',
    syntax: l.syn,
    flags: l.f.map(([flag, purpose, when, example]) => ({ flag, purpose, when, example })),
    working: { wd: l.t[0] || none, index: l.t[1] || none, repo: l.t[2] || none, remote: l.t[3] || none },
    basic: { cmd: l.b[0], explain: l.b[1] },
    real: { scenario: l.r[0], cmds: l.r[1] },
    output: { text: l.o[0], note: l.o[1] },
    errors: [...(l.e ?? []), NOT_REPO],
    related: l.rel.map(([slug, diff]) => ({ slug, diff })),
    docs: l.docs ?? `https://git-scm.com/docs/git-${slug}`,
    book: l.bk ?? [{ title: 'Pro Git book, table of contents', url: 'https://git-scm.com/book/en/v2' }],
    warning: l.w,
    keywords: (l.kw ?? '') + ' ' + l.n,
  };
}

export const B = {
  basics: { title: 'Git Basics: Recording Changes to the Repository', url: 'https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository' },
  getRepo: { title: 'Git Basics: Getting a Git Repository', url: 'https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository' },
  history: { title: 'Git Basics: Viewing the Commit History', url: 'https://git-scm.com/book/en/v2/Git-Basics-Viewing-the-Commit-History' },
  undo: { title: 'Git Basics: Undoing Things', url: 'https://git-scm.com/book/en/v2/Git-Basics-Undoing-Things' },
  remotes: { title: 'Git Basics: Working with Remotes', url: 'https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes' },
  tagging: { title: 'Git Basics: Tagging', url: 'https://git-scm.com/book/en/v2/Git-Basics-Tagging' },
  nutshell: { title: 'Branching: Branches in a Nutshell', url: 'https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell' },
  merging: { title: 'Branching: Basic Branching and Merging', url: 'https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging' },
  branchMgmt: { title: 'Branching: Branch Management', url: 'https://git-scm.com/book/en/v2/Git-Branching-Branch-Management' },
  remoteBranches: { title: 'Branching: Remote Branches', url: 'https://git-scm.com/book/en/v2/Git-Branching-Remote-Branches' },
  rebasing: { title: 'Branching: Rebasing', url: 'https://git-scm.com/book/en/v2/Git-Branching-Rebasing' },
  revSel: { title: 'Git Tools: Revision Selection', url: 'https://git-scm.com/book/en/v2/Git-Tools-Revision-Selection' },
  stash: { title: 'Git Tools: Stashing and Cleaning', url: 'https://git-scm.com/book/en/v2/Git-Tools-Stashing-and-Cleaning' },
  rewrite: { title: 'Git Tools: Rewriting History', url: 'https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History' },
  reset: { title: 'Git Tools: Reset Demystified', url: 'https://git-scm.com/book/en/v2/Git-Tools-Reset-Demystified' },
  advMerge: { title: 'Git Tools: Advanced Merging', url: 'https://git-scm.com/book/en/v2/Git-Tools-Advanced-Merging' },
  rerere: { title: 'Git Tools: Rerere', url: 'https://git-scm.com/book/en/v2/Git-Tools-Rerere' },
  debug: { title: 'Git Tools: Debugging with Git', url: 'https://git-scm.com/book/en/v2/Git-Tools-Debugging-with-Git' },
  submodules: { title: 'Git Tools: Submodules', url: 'https://git-scm.com/book/en/v2/Git-Tools-Submodules' },
  bundling: { title: 'Git Tools: Bundling', url: 'https://git-scm.com/book/en/v2/Git-Tools-Bundling' },
  replace: { title: 'Git Tools: Replace', url: 'https://git-scm.com/book/en/v2/Git-Tools-Replace' },
  creds: { title: 'Git Tools: Credential Storage', url: 'https://git-scm.com/book/en/v2/Git-Tools-Credential-Storage' },
  searching: { title: 'Git Tools: Searching', url: 'https://git-scm.com/book/en/v2/Git-Tools-Searching' },
  config: { title: 'Customizing Git: Git Configuration', url: 'https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration' },
  hooks: { title: 'Customizing Git: Git Hooks', url: 'https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks' },
  plumbing: { title: 'Git Internals: Plumbing and Porcelain', url: 'https://git-scm.com/book/en/v2/Git-Internals-Plumbing-and-Porcelain' },
  objects: { title: 'Git Internals: Git Objects', url: 'https://git-scm.com/book/en/v2/Git-Internals-Git-Objects' },
  refs: { title: 'Git Internals: Git References', url: 'https://git-scm.com/book/en/v2/Git-Internals-Git-References' },
  packfiles: { title: 'Git Internals: Packfiles', url: 'https://git-scm.com/book/en/v2/Git-Internals-Packfiles' },
  maint: { title: 'Git Internals: Maintenance and Data Recovery', url: 'https://git-scm.com/book/en/v2/Git-Internals-Maintenance-and-Data-Recovery' },
  contributing: { title: 'Distributed Git: Contributing to a Project', url: 'https://git-scm.com/book/en/v2/Distributed-Git-Contributing-to-a-Project' },
  help: { title: 'Getting Started: Getting Help', url: 'https://git-scm.com/book/en/v2/Getting-Started-Getting-Help' },
  install: { title: 'Getting Started: Installing Git', url: 'https://git-scm.com/book/en/v2/Getting-Started-Installing-Git' },
  setup: { title: 'Getting Started: First-Time Git Setup', url: 'https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup' },
  interactive: { title: 'Git Tools: Interactive Staging', url: 'https://git-scm.com/book/en/v2/Git-Tools-Interactive-Staging' },
  signing: { title: 'Git Tools: Signing Your Work', url: 'https://git-scm.com/book/en/v2/Git-Tools-Signing-Your-Work' },
};

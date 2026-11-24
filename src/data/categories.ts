import type { Category } from '../types';

export const categories: Category[] = [
  { id: 1, name: 'Getting Started & Basic Commands', blurb: 'The everyday loop: create a repository, check status, stage, commit and read history.', difficulty: 'Beginner' },
  { id: 2, name: 'Repository Management', blurb: 'Inspect, verify and tidy a repository: tracked files, object counts, integrity and cleanup.', difficulty: 'Intermediate' },
  { id: 3, name: 'Branching & Merging', blurb: 'Create parallel lines of work and combine them with merge, rebase, cherry-pick and tags.', difficulty: 'Intermediate' },
  { id: 4, name: 'Remote Repository Commands', blurb: 'Talk to other repositories: add remotes, fetch, pull, push, archive and bundle.', difficulty: 'Intermediate' },
  { id: 5, name: 'Undo, Reset & Recovery', blurb: 'Take changes back safely, and recover work you thought was lost.', difficulty: 'Intermediate' },
  { id: 6, name: 'Configuration & Setup', blurb: 'Set your identity, editor and defaults at system, global and local levels.', difficulty: 'Beginner' },
  { id: 7, name: 'Inspection & Comparison', blurb: 'Read history, compare versions, find who changed a line and search content.', difficulty: 'Intermediate' },
  { id: 8, name: 'Advanced Git Commands', blurb: 'Bisect, worktrees, submodules, notes, rerere and sparse checkout.', difficulty: 'Advanced' },
  { id: 9, name: 'Plumbing Commands & Internals', blurb: 'Low-level commands that work directly with objects, the index and refs.', difficulty: 'Expert' },
  { id: 10, name: 'Patch & Collaboration Commands', blurb: 'Exchange work as patches or pull requests: apply, am, format-patch, send-email.', difficulty: 'Advanced' },
  { id: 11, name: 'Git Hooks & Automation', blurb: 'Scripts that Git runs at specific events. Hooks are not Git subcommands.', difficulty: 'Advanced' },
  { id: 12, name: 'Maintenance & Diagnostics', blurb: 'Keep a repository healthy and collect information for bug reports.', difficulty: 'Advanced' },
  { id: 13, name: 'Additional Git Utilities', blurb: 'Other commands from the official command list that do not fit the groups above.', difficulty: 'Advanced' },
];

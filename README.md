<div align="center">

# Git Command Mastery

**Master Every Git Command. Understand Every Workflow.**

A free, interactive platform to learn Git: 105 commands explained in depth, visualizers that show what each command changes, and a safe terminal simulator you can practise in.

### 🔗 [Live website: git-command-mastery.vercel.app](https://git-command-mastery.vercel.app/)

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)

<a href="https://git-command-mastery.vercel.app/">
  <img src="docs/preview.png" alt="Git Command Mastery home page: hero section with the working directory, staging area, local repository and remote repository flow" width="900">
</a>

</div>

---

## Why this project exists

Most Git tutorials give you commands to copy. Very few show what actually changes inside Git. This project explains every command in plain language and then shows its effect on the four places Git works with: **working directory → staging area → local repository → remote repository**.

## What you can learn here

### 📚 105 Git commands, 13 categories
Every command page has the same **12 sections**:

1. Name, category, difficulty and version note
2. Simple definition
3. Why and when to use it (and when not to)
4. Syntax
5. Important flags, each with purpose, when to use it and an example
6. Step-by-step working: what changes in each of the four areas
7. Basic example
8. Real-world example
9. Expected terminal output
10. Common errors with safe fixes and prevention
11. Related commands and how they differ
12. Official documentation links (Git docs and the Pro Git book)

Categories: Getting Started, Repository Management, Branching & Merging, Remote Commands, Undo / Reset / Recovery, Configuration, Inspection & Comparison, Advanced Commands, Plumbing & Internals, Patch & Collaboration, Git Hooks, Maintenance & Diagnostics, and Additional Utilities.

### 🧪 Interactive tools

| Tool | What it does |
|---|---|
| **Workflow Visualizer** | Pick `init`, `add`, `commit`, `push`, `fetch`, `pull`, `reset` or `restore` and watch how it changes the four areas, before and after. |
| **Terminal Simulator** | A safe, simulated Git repository with `init`, `status`, `add`, `commit`, `log`, `diff`, `branch`, `switch`, `merge`, `stash`, `remote`, `push`, `pull` and `fetch`. Includes suggestions, an explanation after every command and 3 guided exercises. It never runs real shell commands. |
| **Branch Visualizer** | An interactive commit graph. Commit, branch, merge, rebase, cherry-pick and tag, and see the graph update. |

### 🧭 Learning content
- **6 learning paths:** Git for Absolute Beginners, Daily Git Commands, Branching & Merging Mastery, Git Collaboration, Advanced Git, Git Internals & Plumbing. Each has objectives, ordered lessons, related commands and completion tracking.
- **7 command comparisons:** `reset` vs `restore` vs `revert`, `fetch` vs `pull`, `merge` vs `rebase`, `switch` vs `checkout`, `clone` vs `init`, `stash` vs `commit`, and `pull --rebase` vs `pull`.
- **12 troubleshooting guides:** merge conflicts, detached HEAD, rejected pushes, authentication failures, accidental commits, wrong branch, missing commits and more, each with cause, how to identify it, step-by-step fix and prevention.
- **Git Internals:** blobs, trees, commits, refs, HEAD, the index and content-addressable storage.
- **Workflows and collaboration:** feature branch, Git Flow, forking, trunk-based development, pull requests, code review, upstream and tracking branches.
- **Setup guides:** Git vs GitHub, installing Git on Windows / macOS / Linux, first-time configuration, SSH and HTTPS authentication.
- **Best practices and security:** commit messages, small commits, `.gitignore`, avoiding committed secrets, credential handling, signed commits.
- **Cheat sheets:** 8 searchable groups with copy buttons, printable and exportable to PDF through the browser.
- **Glossary** of Git terms linked to commands, and a **curated resource library** of official docs and trusted learning sites.

### ✨ Quality of life
- Global search with **Ctrl + K** (by command, flag or keyword)
- Filters by category and difficulty
- Bookmarks, "mark as learned", personal notes and recently viewed commands, saved in your browser with no account needed
- Copy button on every code example
- Fully responsive, keyboard accessible, pure white clean design

## Built with

React · TypeScript · Vite · Tailwind CSS · React Router · Framer Motion · Lucide Icons

The Git engine behind the terminal simulator is written from scratch in TypeScript (`src/utils/gitSim.ts`): working directory, index, commits with parents, branches, stash and three-way merge.

## Honest notes

- Terminal output on command pages is **illustrative**, not captured from real runs, so hashes and dates will differ on your machine.
- The simulator aborts on merge conflicts instead of resolving them, and says so.
- Git has more commands than this library and behaviour changes between versions, so `git help <command>` is always the final authority.

## Creator

**Designed & Developed by Naresh Yadav**, B.Tech 2nd Year Student
GitHub: [@naresh-yadav45](https://github.com/naresh-yadav45)

If this helped you learn Git, a ⭐ on the repo means a lot.

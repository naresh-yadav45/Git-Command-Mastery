export interface CheatItem { cmd: string; desc: string }
export interface CheatGroup { id: string; title: string; items: CheatItem[] }

export const cheat: CheatGroup[] = [
  { id: 'most', title: 'Most-used commands', items: [
    { cmd: 'git status', desc: 'See changed, staged and untracked files' }, { cmd: 'git add <file>', desc: 'Stage a file' }, { cmd: 'git commit -m "msg"', desc: 'Commit staged changes' },
    { cmd: 'git push', desc: 'Upload commits to the upstream branch' }, { cmd: 'git pull', desc: 'Fetch and integrate upstream changes' }, { cmd: 'git log --oneline', desc: 'Compact history' }, { cmd: 'git diff', desc: 'Show unstaged changes' }] },
  { id: 'beginner', title: 'Beginner commands', items: [
    { cmd: 'git init', desc: 'Create a repository' }, { cmd: 'git clone <url>', desc: 'Copy a repository' }, { cmd: 'git add .', desc: 'Stage everything in the current folder (review first)' },
    { cmd: 'git show', desc: 'Show the latest commit' }, { cmd: 'git help <command>', desc: 'Open the manual page' }, { cmd: 'git --version', desc: 'Show installed version' }] },
  { id: 'branch', title: 'Branching commands', items: [
    { cmd: 'git branch', desc: 'List local branches' }, { cmd: 'git switch -c <name>', desc: 'Create and switch to a branch' }, { cmd: 'git switch <name>', desc: 'Switch branch' },
    { cmd: 'git merge <name>', desc: 'Merge a branch into the current one' }, { cmd: 'git rebase <base>', desc: 'Replay commits on a new base' }, { cmd: 'git branch -d <name>', desc: 'Delete a merged branch' },
    { cmd: 'git tag -a v1.0.0 -m "msg"', desc: 'Create an annotated tag' }, { cmd: 'git cherry-pick <commit>', desc: 'Copy one commit' }] },
  { id: 'remote', title: 'Remote commands', items: [
    { cmd: 'git remote -v', desc: 'List remotes' }, { cmd: 'git remote add origin <url>', desc: 'Add a remote' }, { cmd: 'git fetch --prune', desc: 'Download and remove stale remote branches' },
    { cmd: 'git push -u origin <branch>', desc: 'Push and set upstream' }, { cmd: 'git pull --rebase', desc: 'Update by rebasing local commits' }, { cmd: 'git push origin --delete <branch>', desc: 'Delete a remote branch' }] },
  { id: 'undo', title: 'Undo & recovery', items: [
    { cmd: 'git restore <file>', desc: 'Discard unstaged edits' }, { cmd: 'git restore --staged <file>', desc: 'Unstage a file' }, { cmd: 'git reset --soft HEAD~1', desc: 'Undo last commit, keep changes staged' },
    { cmd: 'git revert <commit>', desc: 'Undo a commit with a new commit' }, { cmd: 'git stash push -m "msg"', desc: 'Shelve work in progress' }, { cmd: 'git stash pop', desc: 'Restore the newest stash' }, { cmd: 'git reflog', desc: 'Find lost commits' }, { cmd: 'git clean -n -d', desc: 'Preview removal of untracked files' }] },
  { id: 'advanced', title: 'Advanced commands', items: [
    { cmd: 'git bisect start', desc: 'Begin a bug search' }, { cmd: 'git worktree add <path> <branch>', desc: 'Second working directory' }, { cmd: 'git rebase -i HEAD~4', desc: 'Edit the last four commits' },
    { cmd: 'git submodule update --init --recursive', desc: 'Fetch submodules' }, { cmd: 'git blame <file>', desc: 'Who changed each line' }, { cmd: 'git sparse-checkout set <dir>', desc: 'Limit checked-out folders' }] },
  { id: 'flags', title: 'Useful flags', items: [
    { cmd: 'git status -sb', desc: 'Short status with branch' }, { cmd: 'git log --oneline --graph --all', desc: 'Graph of all branches' }, { cmd: 'git diff --staged', desc: 'Show staged changes' },
    { cmd: 'git commit --amend --no-edit', desc: 'Add staged changes to the last commit' }, { cmd: 'git push --force-with-lease', desc: 'Safer force push' }, { cmd: 'git add -p', desc: 'Stage hunks interactively' }] },
  { id: 'config', title: 'Configuration shortcuts', items: [
    { cmd: 'git config --global user.name "Your Name"', desc: 'Set author name' }, { cmd: 'git config --global user.email "you@example.com"', desc: 'Set author email' }, { cmd: 'git config --global init.defaultBranch main', desc: 'Default branch for new repositories' },
    { cmd: 'git config --global core.editor "code --wait"', desc: 'Use VS Code as editor' }, { cmd: 'git config --global pull.rebase true', desc: 'Make pull rebase by default' }, { cmd: 'git config --global alias.st status', desc: 'Create an alias' }, { cmd: 'git config --list --show-origin', desc: 'See every setting and its file' }] },
];

export interface Lesson { id: string; title: string; body: string; cmds: string[]; example: string }
export interface Path { id: string; title: string; level: string; goal: string[]; lessons: Lesson[] }

const L = (id: string, title: string, body: string, cmds: string[], example: string): Lesson => ({ id, title, body, cmds, example });

export const paths: Path[] = [
  { id: 'beginners', title: 'Git for Absolute Beginners', level: 'Beginner', goal: ['Explain what Git is and why it is used', 'Create a repository and make your first commits', 'Read history and ignore files you should not track'], lessons: [
    L('b1', 'What is Git?', 'Git is a distributed version control system. It records snapshots of your project so you can go back, compare and collaborate. Git is the tool; GitHub is a hosting service built around it.', ['help', 'version'], 'git --version'),
    L('b2', 'Install Git', 'Install Git for your operating system and confirm it runs. See the Setup page for Windows, macOS and Linux.', ['version'], 'git --version'),
    L('b3', 'Configure Git', 'Tell Git who you are. This name and email appear in every commit you make.', ['config'], 'git config --global user.name "Your Name"\ngit config --global user.email "you@example.com"'),
    L('b4', 'Initialize a repository', 'Turn a folder into a repository.', ['init'], 'mkdir demo && cd demo\ngit init -b main'),
    L('b5', 'Check status', 'status tells you what changed and what is staged.', ['status'], 'git status'),
    L('b6', 'Stage changes', 'Staging chooses what goes into the next commit.', ['add'], 'echo "Hello" > hello.txt\ngit add hello.txt'),
    L('b7', 'Commit changes', 'A commit saves the staged snapshot with a message.', ['commit'], 'git commit -m "Add hello.txt"'),
    L('b8', 'Read commit history', 'log lists commits; show opens one.', ['log', 'show', 'diff'], 'git log --oneline'),
    L('b9', 'Understand .gitignore', 'A .gitignore file lists patterns of files Git should not track, such as build output and secrets. It does not untrack files that are already committed.', ['check-ignore', 'rm'], 'echo "node_modules/" >> .gitignore\ngit add .gitignore'),
    L('b10', 'Clone a repository', 'Copy an existing project to your machine.', ['clone'], 'git clone https://github.com/git/git-scm.com.git'),
  ] },
  { id: 'daily', title: 'Daily Git Commands', level: 'Beginner', goal: ['Run a smooth daily loop of pull, branch, commit, push', 'Review your own changes before committing', 'Park unfinished work safely'], lessons: [
    L('d1', 'Start the day: sync', 'Update your local main before creating new work.', ['switch', 'pull'], 'git switch main\ngit pull --ff-only'),
    L('d2', 'Create a feature branch', 'Keep each task on its own branch.', ['switch', 'branch'], 'git switch -c feature/search'),
    L('d3', 'Review before committing', 'Look at what you changed and what is staged.', ['status', 'diff'], 'git status -sb\ngit diff\ngit diff --staged'),
    L('d4', 'Stage precisely', 'Use patch mode to commit logical pieces.', ['add'], 'git add -p'),
    L('d5', 'Write the commit', 'Short imperative subject, details in the body if needed.', ['commit'], 'git commit -m "Add search filter for tags"'),
    L('d6', 'Stash unfinished work', 'Save work in progress to switch context.', ['stash'], 'git stash push -m "wip search"\ngit stash pop'),
    L('d7', 'Push your branch', 'Publish your branch and set its upstream.', ['push'], 'git push -u origin feature/search'),
  ] },
  { id: 'branching', title: 'Branching & Merging Mastery', level: 'Intermediate', goal: ['Create, merge and delete branches confidently', 'Choose between merge and rebase', 'Resolve conflicts and use tags'], lessons: [
    L('m1', 'Branches are pointers', 'A branch is a name pointing at a commit. Creating one is instant.', ['branch', 'log'], 'git log --oneline --graph --decorate --all'),
    L('m2', 'Merge a branch', 'Bring a branch into the one you are on.', ['merge'], 'git switch main\ngit merge feature/search'),
    L('m3', 'Resolve a conflict', 'Edit the markers, add the file, finish the merge.', ['merge', 'mergetool'], 'git status\n# edit the file\ngit add <file>\ngit commit'),
    L('m4', 'Rebase your branch', 'Replay your commits on the latest main for a linear history. Only for commits not shared yet.', ['rebase'], 'git switch feature/search\ngit rebase main'),
    L('m5', 'Cherry-pick a commit', 'Copy a single commit to another branch.', ['cherry-pick'], 'git cherry-pick -x <commit>'),
    L('m6', 'Tag a release', 'Mark a commit with a version.', ['tag'], 'git tag -a v1.0.0 -m "First release"'),
    L('m7', 'Clean up branches', 'Delete merged branches.', ['branch'], 'git branch --merged main\ngit branch -d feature/search'),
  ] },
  { id: 'collab', title: 'Git Collaboration', level: 'Intermediate', goal: ['Understand remotes and tracking branches', 'Fetch, pull and push safely', 'Follow a pull request workflow'], lessons: [
    L('c1', 'Remotes', 'A remote is a named URL. origin is the default.', ['remote'], 'git remote -v'),
    L('c2', 'Fetch vs pull', 'fetch downloads; pull downloads and integrates.', ['fetch', 'pull'], 'git fetch origin\ngit log --oneline HEAD..origin/main'),
    L('c3', 'Push and upstream', 'Set the upstream once, then plain push and pull work.', ['push', 'branch'], 'git push -u origin feature/x\ngit branch -vv'),
    L('c4', 'Handle a rejected push', 'Integrate remote changes, then push again.', ['pull', 'push'], 'git pull --rebase\ngit push'),
    L('c5', 'Pull request workflow', 'Push a branch, open a pull request on your host, respond to review with more commits, then merge.', ['push', 'switch'], 'git push -u origin feature/x\n# open a pull request in the web UI'),
    L('c6', 'Work with a fork', 'Add the original repository as upstream and keep your fork current.', ['remote', 'fetch', 'merge'], 'git remote add upstream <original-url>\ngit fetch upstream\ngit merge upstream/main'),
  ] },
  { id: 'advanced', title: 'Advanced Git', level: 'Advanced', goal: ['Find bugs with bisect and recover with reflog', 'Use worktrees and submodules', 'Know rerere and sparse checkout'], lessons: [
    L('a1', 'Find a bug with bisect', 'Binary search through history for the first bad commit.', ['bisect'], 'git bisect start\ngit bisect bad\ngit bisect good v1.0.0'),
    L('a2', 'Recover with reflog', 'See where HEAD has been and restore lost commits.', ['reflog', 'reset'], 'git reflog\ngit branch rescue HEAD@{2}'),
    L('a3', 'Parallel work with worktree', 'Check out another branch in a new folder.', ['worktree'], 'git worktree add ../hotfix main'),
    L('a4', 'Submodules', 'Embed another repository at a pinned commit.', ['submodule'], 'git submodule update --init --recursive'),
    L('a5', 'Reuse conflict fixes with rerere', 'Record resolutions and reapply them automatically.', ['rerere'], 'git config --global rerere.enabled true'),
    L('a6', 'Sparse checkout', 'Check out only some directories of a large repository.', ['sparse-checkout'], 'git sparse-checkout set services/api'),
    L('a7', 'Interactive rebase', 'Reorder, squash and edit local commits.', ['rebase'], 'git rebase -i HEAD~4'),
  ] },
  { id: 'internals', title: 'Git Internals & Plumbing', level: 'Expert', goal: ['Explain blobs, trees, commits and refs', 'Build a commit by hand with plumbing commands', 'Understand packfiles and maintenance'], lessons: [
    L('i1', 'Content-addressable storage', 'Git stores content under a hash of that content. The same content always gets the same ID.', ['hash-object'], 'echo "test content" | git hash-object -w --stdin'),
    L('i2', 'Inspect objects', 'Read any object with cat-file.', ['cat-file'], 'git cat-file -t HEAD\ngit cat-file -p HEAD'),
    L('i3', 'Trees and the index', 'The index becomes a tree when you commit.', ['update-index', 'write-tree', 'ls-tree'], 'git ls-files --stage\ngit write-tree'),
    L('i4', 'Commits from trees', 'A commit points to a tree and its parents.', ['commit-tree', 'update-ref'], 'git commit-tree <tree> -m "msg"'),
    L('i5', 'Refs and HEAD', 'Branches, tags and HEAD are small files containing IDs or other refs.', ['symbolic-ref', 'update-ref', 'for-each-ref'], 'git symbolic-ref HEAD'),
    L('i6', 'Packfiles and maintenance', 'Loose objects are packed for efficiency. gc and maintenance automate it.', ['pack-objects', 'verify-pack', 'gc', 'count-objects'], 'git count-objects -vH'),
  ] },
];

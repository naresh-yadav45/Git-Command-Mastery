import { Page, PageHead, CodeBlock } from '../components/shared';

const flows = [
  ['Basic Git workflow', 'Edit files, stage with git add, commit, then push. Good for solo work.', 'git status\ngit add .\ngit commit -m "Describe the change"\ngit push'],
  ['Feature branch workflow', 'Each task gets its own branch off main. Main stays stable; branches are merged when done.', 'git switch -c feature/search\n# work and commit\ngit push -u origin feature/search'],
  ['Git Flow', 'A structured model with long-lived main and develop branches plus feature, release and hotfix branches. It suits scheduled releases but adds overhead for teams that deploy continuously.', 'git switch -c release/1.2 develop\n# stabilise, then merge to main and tag'],
  ['Forking workflow', 'Contributors fork the project, push to their fork and open pull requests to the original repository. Common in open source.', 'git remote add upstream <original-url>\ngit fetch upstream\ngit switch -c fix/typo upstream/main'],
  ['Trunk-based development', 'Everyone integrates small changes into one main branch frequently, usually with short-lived branches and feature flags.', 'git switch main\ngit pull --ff-only\ngit switch -c small-change\n# merge within a day or two'],
  ['Pull request workflow', 'Push a branch, open a pull request on your hosting service, get review, update with more commits, then merge. Pull requests are a hosting-platform feature, not a Git command.', 'git push -u origin feature/refunds\n# open a pull request in the web UI'],
];
const collab: [string, string][] = [
  ['Team collaboration', 'Agree on branch naming, review rules and how to merge before the team grows.'],
  ['Shared repositories', 'Everyone pushes to one remote. Pull before you push and keep branches short-lived.'],
  ['Branch protection', 'A hosting feature that can require reviews or passing checks before merging into main and can block force pushes. Settings and names differ per platform.'],
  ['Code review', 'Reviewers read the diff of a pull request, comment and approve. Small, focused commits make reviews faster.'],
  ['Merge conflicts', 'Happen when two branches change the same lines. Merge main into your branch often to resolve them early.'],
  ['Remote-tracking branches', 'Local copies like origin/main that record where the remote branch was at your last fetch. You cannot commit to them directly.'],
  ['Upstream branches', 'The remote branch your local branch is linked to, set with git push -u or git branch --set-upstream-to.'],
];
export default function Workflows() {
  return (
    <Page>
      <PageHead title="Git workflows & collaboration" intro="A workflow is an agreement about how a team uses branches. Pick the simplest one that fits how you release." />
      <div className="grid gap-5 lg:grid-cols-2">{flows.map(([t, d, c]) => <section key={t} className="card p-5"><h2 className="font-extrabold">{t}</h2><p className="my-2 text-sm leading-relaxed text-muted">{d}</p><CodeBlock code={c} /></section>)}</div>
      <h2 className="h2 mt-12">Collaboration concepts</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">{collab.map(([t, d]) => <div key={t} className="card p-5"><h3 className="font-bold">{t}</h3><p className="mt-1 text-sm text-muted">{d}</p></div>)}</div>
    </Page>
  );
}

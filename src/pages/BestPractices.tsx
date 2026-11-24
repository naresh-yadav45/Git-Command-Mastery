import { Page, PageHead, Warning, CodeBlock } from '../components/shared';

const bp: [string, string][] = [
  ['Write meaningful commit messages', 'Use a short imperative subject (about 50 characters), a blank line, then a body that explains why the change was made.'],
  ['Make small commits', 'One logical change per commit makes review, revert and bisect far easier.'],
  ['Name branches clearly', 'Use descriptive names such as feature/search-filter or fix/login-redirect, following your team\'s convention.'],
  ['Use .gitignore', 'Ignore build output, dependencies and local config. It does not untrack files already committed; use git rm --cached for those.'],
  ['Review before you commit', 'Run git status and git diff --staged every time.'],
  ['Avoid committing secrets', 'Keep keys and passwords in environment variables or a secrets manager, and add local config files to .gitignore.'],
  ['Handle conflicts calmly', 'Read both sides, decide the final text, test, then add and commit. Abort if unsure.'],
  ['Manage history safely', 'Rewrite only commits nobody else has. Prefer git revert on shared branches and git push --force-with-lease over --force.'],
  ['Maintain the repository', 'Let git gc and git maintenance do their work and avoid committing large binary files.'],
];
const sec: [string, string][] = [
  ['Protect credentials', 'Use SSH keys with a passphrase or short-lived tokens. Never share tokens in chats, issues or commits.'],
  ['Avoid committed secrets', 'Scan before pushing with the secret-scanning tools your host or team provides.'],
  ['Credential management', 'Use an operating-system credential helper instead of storing passwords in plain text.'],
  ['Commit signing', 'Signed commits let others verify authorship. Git supports GPG and SSH signing; see git commit -S and your host\'s documentation.'],
  ['Repository safety', 'Be careful running hooks, scripts and submodules from repositories you do not trust.'],
  ['Sensitive information', 'Removing a file in a new commit leaves it in history. History rewriting is a last step after the secret is invalidated.'],
  ['Rotate after exposure', 'If a secret was ever pushed, treat it as compromised: revoke and replace it immediately, then clean up history if needed.'],
];
export default function BestPractices() {
  return (
    <Page>
      <PageHead title="Git best practices & security" />
      <div className="grid gap-4 md:grid-cols-2">{bp.map(([t, d]) => <div key={t} className="card p-5"><h2 className="font-bold">{t}</h2><p className="mt-1 text-sm leading-relaxed text-muted">{d}</p></div>)}</div>
      <div className="mt-6"><CodeBlock code={`Add search filter for tags

Users could not find tagged items quickly. Filter by tag name
on the list page and keep the selection in the URL.`} title="example commit message" /></div>
      <h2 className="h2 mt-12">Git security</h2>
      <div className="mt-6"><Warning>If you ever push a password, token or private key, revoke it first. Deleting it from the repository afterwards is not enough.</Warning></div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">{sec.map(([t, d]) => <div key={t} className="card p-5"><h3 className="font-bold">{t}</h3><p className="mt-1 text-sm leading-relaxed text-muted">{d}</p></div>)}</div>
    </Page>
  );
}

import { useState } from 'react';
import { CodeBlock, Page, PageHead, Warning } from '../components/shared';

const os = {
  Windows: { steps: ['Download the installer from the official Git for Windows page (git-scm.com/download/win), or use winget.', 'Run the installer and keep the defaults unless you have a reason to change them.', 'Open Git Bash or PowerShell and verify.'], code: 'winget install --id Git.Git -e --source winget\ngit --version' },
  macOS: { steps: ['Install with Homebrew, or run git once and accept the Xcode command line tools prompt.', 'Open Terminal and verify.'], code: 'brew install git\n# or: xcode-select --install\ngit --version' },
  Linux: { steps: ['Use your distribution\'s package manager.', 'Verify the installation.'], code: '# Debian / Ubuntu\nsudo apt install git\n# Fedora\nsudo dnf install git\n# Arch\nsudo pacman -S git\ngit --version' },
} as const;

export default function Setup() {
  const [tab, setTab] = useState<keyof typeof os>('Windows');
  return (
    <Page>
      <PageHead title="Git installation & setup" intro="Install Git, set your identity and choose how to authenticate to remotes." />
      <section className="card mb-6 p-6"><h2 className="text-xl font-extrabold">Git vs GitHub</h2>
        <div className="table-wrap mt-4"><table><thead><tr><th></th><th>Git</th><th>GitHub</th></tr></thead><tbody>
          <tr><td className="font-semibold text-ink">What it is</td><td>Version control software that runs on your computer</td><td>A hosting service and collaboration platform for Git repositories</td></tr>
          <tr><td className="font-semibold text-ink">Works offline</td><td>Yes</td><td>No, it is a website</td></tr>
          <tr><td className="font-semibold text-ink">Provides</td><td>Commits, branches, merges, history</td><td>Remote storage, pull requests, issues, access control</td></tr>
          <tr><td className="font-semibold text-ink">Alternatives</td><td>Other version control systems exist</td><td>GitLab, Bitbucket and others host Git repositories too</td></tr></tbody></table></div>
        <p className="mt-3 text-sm text-muted">Together: you use Git locally to record work, and push to a host such as GitHub to share it.</p></section>
      <section className="card mb-6 p-6"><h2 className="text-xl font-extrabold">Install Git</h2>
        <div role="tablist" className="mt-4 flex gap-2">{(Object.keys(os) as (keyof typeof os)[]).map((k) => <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`chip ${tab === k ? 'chip-on' : ''}`}>{k}</button>)}</div>
        <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm text-muted">{os[tab].steps.map((s) => <li key={s}>{s}</li>)}</ol>
        <div className="mt-4"><CodeBlock code={os[tab].code} /></div>
        <p className="mt-3 text-sm text-muted">Official downloads: <a className="font-semibold text-brand" href="https://git-scm.com/downloads" target="_blank" rel="noreferrer">git-scm.com/downloads</a></p></section>
      <section className="card mb-6 p-6"><h2 className="text-xl font-extrabold">First-time configuration</h2>
        <div className="mt-4"><CodeBlock code={`git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main
git config --global core.editor "code --wait"   # example: VS Code
git config --list --show-origin`} /></div>
        <p className="mt-3 text-sm text-muted">System settings apply to everyone on the machine, global to your user, local to one repository. Local overrides global, which overrides system.</p></section>
      <section className="card p-6"><h2 className="text-xl font-extrabold">Authenticating to a remote</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div><h3 className="font-bold">SSH</h3><p className="mt-1 text-sm text-muted">You keep a private key on your machine and register the public key with your host. No password is sent.</p><div className="mt-3"><CodeBlock code={`ssh-keygen -t ed25519 -C "you@example.com"
# add the .pub file to your host account
ssh -T git@github.com`} /></div></div>
          <div><h3 className="font-bold">HTTPS</h3><p className="mt-1 text-sm text-muted">You sign in with a username and a personal access token (many hosts no longer accept account passwords). Use a credential helper so you are not asked every time.</p></div>
        </div>
        <div className="mt-4"><Warning>Never share your private key or tokens, and never commit them.</Warning></div></section>
    </Page>
  );
}

import { Github } from 'lucide-react';
import { Page, PageHead } from '../components/shared';
import { GITHUB } from '../components/Layout';
import { commands } from '../data';

export default function About() {
  return (
    <Page>
      <PageHead title="About Git Command Mastery" intro="A free learning platform that explains Git commands, workflows and internals with practical examples and interactive tools." />
      <div className="grid gap-6 md:grid-cols-2">
        <section className="card p-6"><h2 className="text-xl font-extrabold">Creator</h2>
          <p className="mt-3 text-lg font-bold">Naresh Yadav</p><p className="text-sm text-muted">B.Tech 2nd Year Student</p>
          <a href={GITHUB} target="_blank" rel="noreferrer" className="btn-primary mt-4"><Github size={16} /> github.com/naresh-yadav45</a>
          <p className="mt-5 font-semibold text-ink">Designed &amp; Developed by Naresh Yadav</p></section>
        <section className="card p-6"><h2 className="text-xl font-extrabold">How the content is built</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
            <li>Command pages follow the official <a className="font-semibold text-brand" href="https://git-scm.com/docs" target="_blank" rel="noreferrer">Git documentation</a> and the <a className="font-semibold text-brand" href="https://git-scm.com/book/en/v2" target="_blank" rel="noreferrer">Pro Git book</a>.</li>
            <li>Terminal output is illustrative: IDs, dates and numbers differ on your machine.</li>
            <li>The library contains {commands.length} entries. Git has more commands than this, and behaviour changes between versions, so always check <code className="inline">git help &lt;command&gt;</code> for your version.</li>
            <li>Third-party tools (such as git-filter-repo) and hosting features (pull requests, forks) are labelled as separate from Git itself.</li>
            <li>Your bookmarks, notes and progress are saved only in this browser (localStorage). No account is needed.</li>
          </ul></section>
      </div>
    </Page>
  );
}

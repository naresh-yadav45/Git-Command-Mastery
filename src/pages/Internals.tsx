import { Link } from 'react-router-dom';
import { CodeBlock, Page, PageHead } from '../components/shared';

const items = [
  ['Content-addressable storage', 'Git is, at its core, a key-value store. The key is a hash computed from the content, and the value is the content. Identical content always gets the same key, which is why Git can detect changes and corruption cheaply. Object IDs are SHA-1 hashes by default; SHA-256 repositories exist as an option.'],
  ['Blob objects', 'A blob stores the bytes of one file. It has no file name and no permissions: those live in trees.'],
  ['Tree objects', 'A tree lists names, modes and IDs for blobs and other trees. It represents one directory at one moment.'],
  ['Commit objects', 'A commit points to one top-level tree (the snapshot), zero or more parent commits, author, committer and a message.'],
  ['Tags', 'A lightweight tag is only a ref. An annotated tag is its own object with a tagger, date and message that points at another object.'],
  ['References (refs)', 'Refs are names such as refs/heads/main or refs/tags/v1.0 stored as small files (or in packed-refs) that contain an object ID.'],
  ['HEAD', 'HEAD usually contains a symbolic ref like "ref: refs/heads/main". When it contains a commit ID directly, you are in detached HEAD state.'],
  ['The index', 'The index (.git/index) is a binary file listing paths with the blob IDs that will go into the next commit. git add updates it; git commit turns it into a tree.'],
  ['Object database', 'Objects live in .git/objects, first as loose files and later compressed together into packfiles by git gc or when pushing.'],
  ['Commit history', 'Each commit knows its parents, so history is a directed acyclic graph. Branches are just pointers to commits in that graph.'],
];

export default function Internals() {
  return (
    <Page>
      <PageHead title="Git internals" intro="How Git stores your project. Understanding this makes commands like reset, rebase and reflog much less mysterious." />
      <div className="card mb-8 overflow-x-auto p-5" role="img" aria-label="Diagram: HEAD points to branch main, which points to a commit, which points to a tree, which points to blobs">
        <div className="flex min-w-[640px] items-center justify-between gap-2 text-center text-sm font-bold">
          {[['HEAD', '#DC2626'], ['refs/heads/main', '#2563EB'], ['commit', '#7C3AED'], ['tree', '#059669'], ['blobs', '#D97706']].map(([t, c], i, a) => (
            <div key={t} className="flex items-center gap-2"><span className="rounded-lg border-2 bg-white px-3 py-2" style={{ borderColor: c }}>{t}</span>{i < a.length - 1 && <span className="text-slate-400" aria-hidden>→</span>}</div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-muted">A commit also points back to its parent commit(s).</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">{items.map(([t, d]) => <div key={t} className="card p-5"><h2 className="font-extrabold">{t}</h2><p className="mt-2 text-sm leading-relaxed text-muted">{d}</p></div>)}</div>
      <h2 className="h2 mt-10">Try it safely</h2>
      <p className="mt-2 text-sm text-muted">Run these in a scratch repository (git init) to see objects directly.</p>
      <div className="mt-4"><CodeBlock code={`echo "test content" | git hash-object -w --stdin   # store a blob, prints its ID
git cat-file -t <id>                               # blob
git cat-file -p <id>                               # test content
git cat-file -p HEAD                               # a commit: tree, parent, author
git cat-file -p HEAD^{tree}                        # the root tree
git symbolic-ref HEAD                              # refs/heads/main`} /></div>
      <p className="mt-4 text-sm text-muted">Commands: {['hash-object', 'cat-file', 'update-index', 'write-tree', 'commit-tree', 'update-ref', 'symbolic-ref', 'for-each-ref'].map((c) => <Link key={c} to={`/commands/${c}`} className="chip mr-1.5 font-mono">git {c}</Link>)}</p>
      <p className="mt-4 text-sm text-muted">Read more in the <a className="font-semibold text-brand" href="https://git-scm.com/book/en/v2/Git-Internals-Plumbing-and-Porcelain" target="_blank" rel="noreferrer">Pro Git internals chapter</a>.</p>
    </Page>
  );
}

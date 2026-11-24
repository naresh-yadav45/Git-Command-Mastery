import type { Cmd } from '../types';
import c1 from './commands1';
import c2 from './commands2';
import c3 from './commands3';
export { categories } from './categories';

const raw: Cmd[] = [...c1, ...c2, ...c3].map((c) =>
  c.kind === 'hook' ? { ...c, name: c.slug.replace(/^hook-/, '') } : c,
);

const slugs = new Set(raw.map((c) => c.slug));

// Drop related links that point to anything that is not in the library, so there are never dead links.
export const commands: Cmd[] = raw.map((c) => ({ ...c, related: c.related.filter((r) => slugs.has(r.slug)) }));

export const bySlug = new Map(commands.map((c) => [c.slug, c]));
export const popularSlugs = ['init', 'clone', 'status', 'add', 'commit', 'push', 'pull', 'branch', 'switch', 'merge', 'log', 'stash'];

export function commandsInCategory(id: number) {
  return commands.filter((c) => c.categories.includes(id));
}
export function href(slug: string) {
  return `/commands/${slug}`;
}

import { commands } from '../data';
import type { Cmd } from '../types';

export function searchCommands(q: string, limit = 50): Cmd[] {
  const query = q.trim().toLowerCase().replace(/^git\s+/, '');
  if (!query) return [];
  const terms = query.split(/\s+/);
  const scored: [number, Cmd][] = [];
  for (const c of commands) {
    const name = c.slug;
    const flags = c.flags.map((f) => f.flag + ' ' + f.purpose).join(' ').toLowerCase();
    const text = (c.summary + ' ' + c.keywords).toLowerCase();
    let score = 0;
    let ok = true;
    for (const t of terms) {
      let s = 0;
      if (name === t) s = 100;
      else if (name.startsWith(t)) s = 60;
      else if (name.includes(t)) s = 40;
      else if (flags.includes(t)) s = 20;
      else if (text.includes(t)) s = 10;
      if (!s) { ok = false; break; }
      score += s;
    }
    if (ok) scored.push([score + (c.common ? 3 : 0), c]);
  }
  return scored.sort((a, b) => b[0] - a[0]).slice(0, limit).map((x) => x[1]);
}

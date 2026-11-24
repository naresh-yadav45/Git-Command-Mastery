// Usage: npm run check-links   (needs internet access)
// Extracts every https:// URL from src/data and reports the ones that do not answer with a 2xx/3xx status.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
const dir = new URL('../src/data/', import.meta.url).pathname;
const urls = new Set();
for (const f of readdirSync(dir)) {
  const text = readFileSync(join(dir, f), 'utf8');
  for (const m of text.matchAll(/https:\/\/[^\s'"`)<>]+/g)) urls.add(m[0]);
}
// docs URLs are generated from command slugs, so add them too
const cmds = readFileSync(join(dir, 'commands-index-slugs.txt'), 'utf8').split('\n').filter(Boolean);
for (const s of cmds) urls.add(`https://git-scm.com/docs/git-${s}`);
let bad = 0;
for (const u of urls) {
  try {
    const r = await fetch(u, { method: 'HEAD', redirect: 'follow' });
    if (!r.ok) { bad++; console.log('BROKEN', r.status, u); }
  } catch (e) { bad++; console.log('ERROR ', u, e.message); }
}
console.log(`${urls.size} URLs checked, ${bad} problems`);

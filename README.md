# Git Command Mastery

Master Every Git Command. Understand Every Workflow.
**Designed & Developed by Naresh Yadav** · https://github.com/naresh-yadav45

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build locally
npm run check-links  # (needs internet) verifies every external URL in src/data
```

Needs Node 18+. The app uses HashRouter, so `dist/` can be hosted on any static host
(Netlify, GitHub Pages, Vercel) without server rewrites. Do not open dist/index.html with file://
(browsers block module scripts there). Use `npm run preview` or a static host.

## Structure

- `src/data/` command database (commands1-3.ts, expanded by build.ts into the 12-section shape), categories, glossary,
  troubleshooting, resources, learning paths, comparisons, cheat sheet
- `src/utils/gitSim.ts` the terminal simulator engine (pure TypeScript, never touches a shell or disk)
- `src/pages/` one file per page, `src/components/` layout and shared UI, `src/store.tsx` localStorage state

## Adding a command

Add one entry to the `L` array in `src/data/commands1.ts`, `commands2.ts` or `commands3.ts`
(see `Lite` in `build.ts`). Its page, search entry, category count, prev/next links and docs URL are generated automatically.
After adding, re-run `npx tsx` to refresh `src/data/commands-index-slugs.txt` if you use `check-links`.

## Honest limitations

- Terminal output is illustrative, not captured from a real run.
- The simulator supports the commands listed under `help`; merge conflicts abort instead of being resolved.
- "Export PDF" uses the browser print dialog (choose Save as PDF).
- Official doc URLs follow the pattern https://git-scm.com/docs/git-<command>. Run `npm run check-links` to verify them.

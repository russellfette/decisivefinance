# Owner money tools QA

Serve `dist/` on port 4321 (`npx astro build && cd dist && python3 -m http.server 4321`), then from this folder run with Playwright and axe-core on NODE_PATH:

- `node t1.js`, `node t2.js`, `node t3.js`: test cases from the build brief, sections 4.7, 5.7, 6.7, plus edge cases.
- `node audit.js <outdir>`: privacy audit (requests, storage, cookies, URL, reload), axe WCAG 2.2 AA, print to one US Letter page, phone checks.
- `node phone.js`: phone screenshots of the expanded result.

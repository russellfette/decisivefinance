# Claude Code handoff — v2.4 Canon Propagation MASTER

**Prepared:** 2026-05-02 (Cowork, Decisive Site project)
**Pairs with:** the per-surface source-of-truth specs in this folder (see §0).
**Target:** ship the entire v2.4 canon propagation across the Astro repo in one focused Claude Code session, or split across two if the test matrix is heavy.
**Scope:** homepage rewrite, tier pages, guarantee page, blog index + post sweep, CTA component refresh, logo asset deployment, banned-words sitewide grep, JSON-LD, meta, redirects audit. HTML lead magnets get a separate light sweep (covered in this doc, §11).

---

## 0. Reference files (read in this order)

In the workspace root (`/Users/rustyfette/Library/CloudStorage/OneDrive-PugetSoundCFO/Claude/Projects/Decisive Site/`):

**Canon (rulebooks, do not edit):**
1. `Decisive-Finance-Canon-Phrase-Book-v2.4.md`
2. `Decision-First-Finance-Manifesto-v2.3.md`
3. `Decisive-Service-Architecture-Blueprint-v1.9.md`
4. `Decisive-Finance-Two-Pager-v3.5.md` (flag: line 30 has `$22,500 to $50,000` drift; trust this handoff over the canon doc on that one number)
5. `Decisive-Finance-One-Pager-v2.md` (flag: line 33 has `$22,500 to $50,000` drift; same)

**Source-of-truth specs (v2, ship these):**
6. `Decisive-Finance-Homepage-v2.md` — homepage spec
7. `CLAUDE_CODE_HANDOFF-homepage-v2.md` — paired homepage handoff
8. `Decisive-Finance-Tier-Pages-v2.md` — `/tiers/` index + three tier deep pages
9. `Decisive-Finance-Guarantee-Page-v2.md` — `/guarantee/` page
10. `Decisive-Finance-Blog-v2.md` — blog index + post template + sweep guide
11. `Decisive-Finance-HTML-Tools-v2-Sweep.md` — Recovery Checklist + Walking Dead assessment sweep
12. `CTA_SYSTEM-v2.md` — CTA component library (supersedes `CTA_SYSTEM.md` v1)
13. `PROJECT_INSTRUCTIONS_v2.md` — paste-ready Cowork project instructions block

**Stale, do not ship from these (reference only, supplanted by v2 specs above):**
- `Decisive-Finance-Homepage-v1.md`
- `CTA_SYSTEM.md`
- `CANON_V2_PROPAGATION.md` (April 23 plan; partly executed, partly overtaken)
- `CLAUDE_CODE_HANDOFF.md` (April 22)
- `CLAUDE_CODE_HANDOFF-how-it-works-v2.md` (May 1, executed; reference for handoff pattern)
- Any document referencing Phrase Book v1, v2, v2.2, v2.3 (superseded by v2.4)
- Any document referencing Two-Pager v3.3, v3.4 (superseded by v3.5)
- Any document referencing Blueprint v1.6, v1.7, v1.8 (superseded by v1.9)
- Any document referencing Manifesto v1, v2, v2.2 (superseded by v2.3)

---

## 1. Brand assets

**Logo SVGs in workspace root:**
- `Decisive - Dark:Transparent - Logo.svg`
- `Decisive - White:Transparent - Logo.svg`

**Action:**
1. `git mv` (or copy) both SVGs to `public/brand/` in the repo. Recommended rename for kebab-case consistency:
   ```
   public/brand/decisive-logo-dark.svg   (use on light/cream backgrounds)
   public/brand/decisive-logo-white.svg  (use on dark/ink backgrounds)
   ```
2. Update `src/components/Logo.astro` (or wherever the logo component lives):
   - Replace any CSS-rendered text wordmark with `<img src="/brand/decisive-logo-dark.svg" alt="Decisive Finance" />`.
   - Add a `variant` prop (`dark` | `white`) that switches the asset path.
   - Set heights: nav 28px, footer 36px, hero 48 to 64px. Width auto. The SVG `viewBox="0 0 500 100"` carries the aspect ratio.
   - Verify the orange (`#e3632b`) and navy (`#182228`) hex values inside the SVG match the site palette.
3. The brand-name split: logo wordmark = "Decisive" alone. Body copy, page titles, meta tags, JSON-LD = "Decisive Finance" written out. Do not "correct" body copy to drop "Finance."

This solves ship-week fix #2 (the lowercase-d render bug). The brand mark is the orange triangle; the CSS hack that ate the D goes away.

---

## 2. Tokens and width system

Confirm `src/styles/tokens.css` defines:

```css
:root {
  --width-prose: 760px;
  --width-hero: 920px;
  --width-content: 1180px;

  --ink: #182228;
  --orange: #e3632b;
  --cream: #f5f2ed;
  --teal: #214c52;
  --paper: #ffffff;
}
```

Retire any of: `container-narrow` (820), `--width-orphan` (780), `--width-h1` (900). All H1s render at `--width-hero` (920). All article body and ledes render at `--width-prose` (760). All multi-column grids render at `--width-content` (1180).

If the existing repo carries width tokens with different names (e.g., `--prose-w`, `--hero-w`), keep the names, just confirm the values match. Don't churn names if the implementation is already correct.

---

## 3. Order of operations

Execute in this order. Each phase is a self-contained PR with tests.

### Phase A — Foundation (one PR)
1. Logo SVGs deployed to `public/brand/`.
2. `Logo.astro` component updated to use SVG with variant prop.
3. Tokens confirmed in `src/styles/tokens.css`.
4. Sitewide grep run; matches reported in PR description (do not fix yet, surface them).
5. Merge.

### Phase B — Homepage (one PR)
6. Replace `src/pages/index.astro` (or wherever `/` resolves) per `Decisive-Finance-Homepage-v2.md` and `CLAUDE_CODE_HANDOFF-homepage-v2.md`.
7. Update `src/components/CTABlock.astro` (or equivalent) per `CTA_SYSTEM-v2.md` §5.
8. Sitewide find-and-replace per §4 of this doc, applied to non-archived files only.
9. JSON-LD update sitewide (`Organization`, `ProfessionalService`, founder bio).
10. Footer signature block updated with founder bio per Phrase Book §9a.
11. Merge.

### Phase C — Tier pages (one PR)
12. Replace `src/pages/tiers/index.astro`, `src/pages/tiers/diagnostic.astro`, `src/pages/tiers/resolution.astro`, `src/pages/tiers/partnership.astro` per `Decisive-Finance-Tier-Pages-v2.md`.
13. If those routes don't exist, create them (Astro file routes).
14. Cross-tier nav components.
15. Merge.

### Phase D — Guarantee + blog index (one PR)
16. Replace `src/pages/guarantee.astro` per `Decisive-Finance-Guarantee-Page-v2.md`.
17. Update `src/pages/blog/index.astro` hero per `Decisive-Finance-Blog-v2.md`.
18. Update post template / layout if needed for `awarenessStage` frontmatter field.
19. Merge.

### Phase E — Blog post sweep (separate PR; mechanical + judgment)
20. Run mechanical greps from `Decisive-Finance-Blog-v2.md` §sitewide-post-sweep across `src/content/blog/`.
21. Apply judgment-level read per the same doc.
22. Maintain a `BLOG_v2_SWEEP_LOG.md` per post.
23. Merge.

### Phase F — Verification (no PR; checklist)
24. Run §6 verification checklist end to end.
25. Run §7 LinkedIn / Twitter / iMessage / Signal social-preview QA.
26. If any item fails, open a fix PR; do not push to production until clean.

---

## 4. Sitewide find-and-replace targets

Run these greps, fix every match outside `src/content/blog/_archive/`. The replacement column is the canon-current target.

### Retired claim numbers

| Find | Replace with |
|---|---|
| `$22,500 to $50,000` | `$22,500 to $30,000` |
| `$30K to $50K` | `$22.5K to $30K` |
| `$50,000 of trapped` | `$30,000 of trapped` (and verify the surrounding context says "trapped value" not "trapped capital") |
| `30K to 50K` | `22.5K to 30K` (rare, but check) |

### Retired noun phrases (claim language)

| Find | Replace with | Notes |
|---|---|---|
| `trapped capital` | `trapped value` | claim language only; the artifact name `Trapped Value Report` stays |
| `forward-reallocation potential` | `trapped value` | |
| `realized optionality` | `recoverable cash` | rare |
| `capital efficiency delta` | replace with concrete dollar amount + date | rare |
| `inventory of forward capital` | `a read of what your current capital is doing` | |

### Retired voice (Phrase Book v2.4 §10 banned)

| Find | Replace with | Notes |
|---|---|---|
| `\bunderwrite\b` | `defend` / `back` / `justify` / `stand behind` | public surfaces only; allowed on partner / investor / board pages |
| `\bre-underwrite\b` | `re-decide` / `run the math again` | |
| `\bdollarized\b` | `in dollars` (or just lead with the dollar sign) | |
| `capture paths` | `recovery plans` | |
| `reallocation paths` | `where each dollar should move` | |
| `forward capital allocation` (verb phrase) | `deciding the next dollar` | |
| `forward decision engine` | `the decision rhythm` | tier 2 noun phrase |
| `forward-allocation engine` | `the decision rhythm` | NEW v2.4 banned |
| `forward-allocation conversation` | `defending the next call` | NEW v2.4 banned |
| `forward dollar` | `the next dollar` | |
| `operating infrastructure` | `monthly rhythm` (or delete) | |
| `in market with measurement` | `live in market with the data to score it` | |
| `forward-underwriting status` | `decision status` | |
| `revisit decisions` | `defend forward` | |
| `\brevalidate\b` | `re-decide` / `run the math again` | |
| `decision audit` | `decision discipline` | |
| `audit the decision stack` | `back the next dollar with math` | |
| `Decision Revalidation Register` | `Forward Capital Register` | artifact name; locked rename |
| `fix broken decisions` | `install decision discipline` | |
| `past decisions that went wrong` | `decisions made in a context that has changed` | |
| `\brebuild\b` | `install` | when used in product / methodology context |

### Retired tier names

| Find | Replace with |
|---|---|
| `Recovery Engine` | `90-Day Decision Resolution` |
| `Fractional CFO` (as tier name on this site) | `Decision Partnership` |

### Retired rally

| Find | Replace with |
|---|---|
| `UNSTICK\.` `UNTANGLE\.` `UNLOCK\.` (any of these as a slogan) | `Find. Install. Run.` |

### Email / domain hygiene

| Find | Replace with |
|---|---|
| `decisivefinance\.com` | `decisive.finance` |
| `transitioning to` (in footer / about / contact) | (delete the line entirely) |
| `contact@financialrhythms` | `russell@decisive.finance` |
| `contact@decisive.finance` | `russell@decisive.finance` |

### Em dashes (zero tolerance)

```bash
grep -rn "—" src/
```

Replace with comma, period, colon, or parens. Rewrite the sentence if no clean substitute exists.

### Banned words (Decisive Site project instructions §4)

```bash
grep -rin "genuinely\|honestly\|straightforward" src/
grep -rin "leverage\|seamless\|empower\|journey" src/
grep -rin "game-changer\|synergy\|best-in-class\|cutting-edge\|world-class" src/
grep -rin "\bunlock\b" src/    # "unlock" is banned; UNLOCK in the retired rally is also gone
```

Replace each with the verb that names the action, or rewrite the sentence.

---

## 5. JSON-LD updates (sitewide)

Update the `Organization` / `ProfessionalService` schema (likely emitted from a sitewide layout component or `src/components/SEO.astro`):

```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Decisive Finance",
  "url": "https://decisive.finance",
  "description": "Decision-First Finance for venture-backed companies stalled between rounds. Most Diagnostics surface $22,500 to $30,000 of trapped value in 14 days. Guaranteed.",
  "email": "russell@decisive.finance",
  "founder": {
    "@type": "Person",
    "name": "Russell Fette",
    "description": "Former VC-backed tech operator who built financial decision systems inside funded companies before installing them, on guarantee, for the next three.",
    "sameAs": "https://linkedin.com/in/russellfette"
  },
  "sameAs": ["https://linkedin.com/in/russellfette"],
  "areaServed": "US",
  "serviceType": "Decision-First Finance"
}
```

Sweep:
- Any `description` field referencing `$22,500 to $50,000`, `trapped capital`, `forward-reallocation potential` → fix per the claim/noun replacements in §4.
- Any `email` field referencing `contact@*` → `russell@decisive.finance`.
- Any `founder` block missing the bio description → add per §9a.

The `Article` schema on each blog post should use the post's `dominantClaim` and `awarenessStage` frontmatter. If the schema component does not yet read those fields, add the mapping.

The `HowTo` schema on `/how-it-works/` (if still live) needs the v2.4 step language; reference `CLAUDE_CODE_HANDOFF-how-it-works-v2.md` §5 for the previous instruction, and update the description from `"Underwrite forward capital"` to `"Defend the next call with math"`.

---

## 6. Verification checklist (block deploy on any fail)

### Build
- [ ] `npm install` runs clean.
- [ ] `npm run build` runs clean, no warnings beyond Astro's expected output.

### Sitewide cleanliness (greps return zero)
- [ ] `grep -r "—" src/` (em dashes)
- [ ] `grep -rn "\$22,500 to \$50,000" src/`
- [ ] `grep -rn "trapped capital" src/` (allowed: `Trapped Value Report` artifact name)
- [ ] `grep -rn "forward-reallocation potential" src/`
- [ ] `grep -rn "\bunderwrite" src/` (allowed: partner / investor / board pages)
- [ ] `grep -rn "dollarized\|capture paths\|forward decision engine\|forward dollar" src/`
- [ ] `grep -rn "Decision Revalidation Register" src/`
- [ ] `grep -rn "UNSTICK\|UNTANGLE\|UNLOCK\." src/`
- [ ] `grep -rn "decisivefinance.com\|contact@financialrhythms\|transitioning to" src/`

### Per-page (walk on dev server)
- [ ] Homepage `/`: H1 at 920, lede at 760, single CTA above the fold, founder bio in footer.
- [ ] Tier pages `/tiers/diagnostic`, `/tiers/resolution`, `/tiers/partnership`: each with hero, pricing card, guarantee block, day-by-day timeline, single primary CTA. Cross-tier nav links resolve.
- [ ] Guarantee `/guarantee/`: leads with absolution, three-tier guarantee grid renders, single CTA at end.
- [ ] Blog index `/blog/`: hero subhead matches v2 copy, archive grid renders, cluster filter chips work.
- [ ] Logo renders correctly on light backgrounds (nav, body) and dark backgrounds (hero strips, dark CTA, dark Founding Cohort section).

### Performance
- [ ] Lighthouse mobile (incognito, throttled): performance > 90, accessibility > 95, SEO 100.
- [ ] LCP < 2.5s on home, blog index, one representative post.
- [ ] CLS < 0.1.
- [ ] Inter weights 400, 500, 600, 700 preloaded.

### Meta and OG
- [ ] Meta title 55 to 60 chars on home, every tier page, guarantee, blog index.
- [ ] Meta description 140 to 155 chars, leads with the in-dollars claim.
- [ ] Canonical URL set.
- [ ] OG image renders in LinkedIn post inspector for `/`, `/guarantee/`, `/blog/`, one post.

### Outbound links
- [ ] Calendly URL `https://calendly.com/russell-decisive/30min` opens to a 30-minute slot.
- [ ] Mailto `russell@decisive.finance` opens correctly.
- [ ] All in-page anchor links resolve (`#stuck`, `#traps`, `#tiers`, `#artifacts`, `#proof`, `#cohort`, `#book` on home).
- [ ] HTML lead-magnet routes resolve (Walking Dead assessment, Recovery Checklist).

---

## 7. Social preview QA

After deploy, drop these URLs into the inspectors:

- LinkedIn post inspector → `https://decisive.finance/`
- LinkedIn post inspector → `https://decisive.finance/guarantee/`
- LinkedIn post inspector → `https://decisive.finance/tiers/resolution/`
- Twitter / X card validator → same URLs
- iMessage preview test
- Signal preview test (real venture-backed buyers use Signal more than expected)

Confirm:
- OG title matches H1.
- OG description leads with the in-dollars claim.
- OG image renders without text cutoff at 1200x630.

---

## 8. Redirects audit

Per project instructions §13:
- 301 from `plain-leaf-b85c.russell-055.workers.dev` to `decisive.finance`.
- 301 from any legacy Financial Rhythms URLs.
- `/blog` and `/blog/` both resolve; pick one canonical (default: trailing slash).
- **Do not** add any redirect to or from `decisivefinance.com`. Third-party-held domain.
- Apex-only is the default. Kill `www.decisive.finance` at the DNS level if not needed.

Confirm in Cloudflare Pages settings; do not modify without explicit approval per project instructions guardrails §16.

---

## 9. Commits and PRs

Naming convention (matches existing repo pattern):

```
foundation:  brand: deploy logo SVGs and switch Logo.astro to image-based wordmark
foundation:  tokens: enforce 760/920/1180 width system, retire orphan tokens
home:        page: index — v2.4 canon (H1, claim, tiers, founder bio, logo)
tiers:       page: tiers — v2.4 canon (Diagnostic / Resolution / Partnership)
guarantee:   page: guarantee — v2.4 canon (three-tier guarantee structure, absolution lede)
blog:        page: blog index — v2.4 canon (hero subhead, archive grid)
blog:        sweep: posts — v2.4 banned-words and CTA cluster pass
cta:         component: CTABlock — v2.4 (trapped value, Run on retainer, June 30 cohort date)
schema:      json-ld: ProfessionalService + Person — v2.4 canon claim and founder bio
seo:         meta: home + tier + guarantee — v2.4 dominant claim
```

One PR per phase per §3. Open each PR with a link to this master handoff and the relevant per-surface spec.

---

## 10. Post-launch items (log in `TASKS.md` or equivalent)

- **Canon docs $50K → $30K corrections pass.** One-Pager v2 line 33 and Two-Pager v3.5 page 1 currently show `$22,500 to $50,000` — this is canon drift. Propose v2.1 / v3.6 corrections pass. Update `Decisive-Finance-Canon-Phrase-Book-v2.4.md` §11a propagation status table accordingly.
- **Cowork project instructions update.** Paste `PROJECT_INSTRUCTIONS_v2.md` into the Cowork project "Decisive Site" custom instructions field. Future sessions read this on boot, prevents drift back to v1 references.
- **Memory file alignment.** Update `dominant_claim_locked.md` and add `canon_v24_propagation_session.md` to memory if not already done (Cowork session-side, not Claude Code's job).
- **Decisive copywriting skill update.** The skill itself still references Phrase Book v1, Two-Pager v3.3, Blueprint v1.6, Manifesto v1. Schedule a skill update so future Cowork sessions don't pull the stale canon-source list.
- **Blueprint v1.9 PDF generation.** If `/methodology/Decisive-Service-Architecture-Blueprint-v1.8.pdf` is linked anywhere (per `CLAUDE_CODE_HANDOFF-how-it-works-v2.md` §4), generate the v1.9 PDF and update the link.
- **Six Trap Diagnostic visual asset.** If the canonical Decision Loop visual is still inline SVG, schedule the canonical asset swap.

---

## 11. HTML lead-magnet sweep (light, can run in parallel)

Per `Decisive-Finance-HTML-Tools-v2-Sweep.md`:

**Recovery Checklist v3** (`Decisive-Finance-Recovery-Checklist-Tool-v3.html` in workspace, deploy target probably `/checklist/` or similar):
- "Source: Decisive Service Architecture Blueprint v1.8." → v1.9
- "forward-allocation conversation" → "defending the next call"
- "underwrite forward" → "defend forward"
- "dollarized findings" → "in-dollars findings"
- "capture paths" → "recovery plans"

**Walking Dead assessment** (`walking-dead-assessment.html`):
- No drift detected. Run the standard sweep grep to confirm.

Both tools' meta and OG should already be v2.4 compliant; verify and ship.

If either tool currently CSS-renders the wordmark, swap to inline-SVG using the new logo asset.

---

## 12. What this handoff does not touch

- Cloudflare config (DNS, Pages settings, redirects, env vars). Untouched without explicit approval.
- Any third-party integrations or analytics. Untouched.
- LinkedIn or email distribution. Out of scope for this PR series.
- The `OA-Project-Instructions-v6.md` and `OA-Instructions-Review-2026-05-02.md` files in the workspace. Those belong to the OA project, not the site.

---

*End of Master Handoff. Pair with the per-surface specs in §0. Estimated total wall-clock for Phases A through F: 6 to 10 Claude Code hours, plus the blog post sweep (Phase E) which scales with the post count.*

# Claude Code handoff — Homepage v2 (canon v2.4 propagation)

**Prepared:** 2026-05-02 (Cowork, Decisive Site project)
**Pairs with:** `Decisive-Finance-Homepage-v2.md` (source-of-truth markdown)
**Target:** ship inside one Claude Code session against the Astro repo
**Scope:** rewrite the home page (`/`) to v2.4 canon. Hero, all sections, CTAs, footer, meta, JSON-LD. Plus the sitewide sweeps in §6 because the home page references content other pages also carry.

---

## 0. Reference files (read in this order)

1. `Decisive-Finance-Homepage-v2.md` — the source-of-truth copy. The deltas table at the bottom is the find-and-replace map.
2. `Decisive-Finance-Canon-Phrase-Book-v2.4.md` — the rulebook. §3 (locked phrases), §6 (tier outcomes), §9a (founder bio), §10 (banned words).
3. `Decisive-Service-Architecture-Blueprint-v1.9.md` — product spec. Pricing, guarantee shape, artifact list.
4. The current `src/pages/index.astro` (or wherever `/` resolves) — the file you are replacing.

If `Decisive-Finance-Homepage-v1.md` is referenced anywhere, it is stale. v2 supersedes.

---

## 1. Canon decisions locked for this page (no improvisation)

- **H1:** *"The cash didn't burn. The context did."* (Phrase Book v2.4 §3)
- **Sub-head / opening line:** *"The raise stalled. The next decision doesn't."*
- **Top claim, verbatim:** *"Most Diagnostics surface $22,500 to $30,000 of trapped value in 14 days. Guaranteed."* — `$22,500 to $50,000` is retired; `trapped capital` is retired; `forward-reallocation potential` is retired.
- **Rally line:** *"Find. Install. Run."* — `UNSTICK. UNTANGLE. UNLOCK.` is retired and stays retired.
- **Work-frame line (where used):** *"We don't audit the past. We justify each next call."* — replaces `We underwrite forward.`
- **Pull quote:** *"You were the first person who made it feel like a solvable problem, not a permanent condition."* Always attributed to a founder. Never edited.
- **Tier outcome sentences (verbatim, Phrase Book §6):**
  - Tier 1: *"Names what your current capital is doing, in 14 days."*
  - Tier 2: *"Installs the rhythm that defends every next call, and proves it in market across 90 days."*
  - Tier 3: *"Runs the rhythm on retainer."*
- **Tier 1 pricing:** $7,500 under $3M ARR, $10,000 from $3M to $8M ARR.
- **Tier 2 pricing:** $22,500 to $30,000 total ($7,500 to $10,000 per month). Founding Cohort: $18,000 flat for first three. Closes at three or 2026-06-30.
- **Tier 3 pricing:** $7,500 per month + 5% success fee on Realized Value.
- **Founder bio (signature block):** *"Former VC-backed tech operator. Now installing decision systems for stalled funded tech, on guarantee."* Per Phrase Book §9a. Mandatory on every signed long-form public surface.
- **Closing frame (allowed on home):** *"The category belongs to the market."*
- **Domain and contact:** `decisive.finance`, `russell@decisive.finance`, `calendly.com/russell-decisive/30min`.
- **Footer:** No "Email and domain transitioning to decisivefinance.com" line. Removed entirely. If you find it on this page or anywhere else, kill it.

---

## 2. Page structure (top to bottom)

Match the Homepage v2 spec section for section. Each section has a width token and background treatment. Use existing shared layout, nav, and footer components.

### 2.1 Hero · `#stuck` (or `#top`)
- Section width: `--width-content` (1180). H1 at `--width-hero` (920). Lede paragraphs at `--width-prose` (760).
- Eyebrow (orange, small caps): `FOR VENTURE-BACKED COMPANIES STALLED BETWEEN ROUNDS`
- H1 (navy, dominant): **The cash didn't burn. The context did.**
- Sub-head (orange or accent, weight 600): **The raise stalled. The next decision doesn't.**
- Top claim strip: dark background, white text, orange dollar amount: *Most Diagnostics surface **$22,500 to $30,000** of trapped value in 14 days. **Guaranteed.***
- Two-column block: pull-quote left (italic, small caps attribution), lead paragraph right (760).
- Absolution paragraph below (760). Bold the absolution sentence.
- Rally line: **Find. Install. Run.** (sub-sub-head treatment)
- Single primary CTA: orange filled, `Book a fit call →` linking to `https://calendly.com/russell-decisive/30min`. Microcopy below button: *"30 min with Russ. No pitch. You leave with at least one action."*
- One CTA above the fold. Period.

### 2.2 The Stuck Raise · `#stuck-raise`
- Section width: content (1180). Body: prose (760).
- H2: `The Stuck Raise`
- Two body paragraphs verbatim from Homepage v2 §1.
- Italic closing line: *The category belongs to the market. We are one operator inside it.*

### 2.3 Why Not the Portfolio CFO
- Section width: content (1180). Body: prose (760).
- H2: `Why Not the Portfolio CFO`
- Bold lede: **The portfolio CFO reports. Decisive Finance defends the next call.** (changed from `underwrites forward`)
- Body paragraphs verbatim from Homepage v2 §2.

### 2.4 Six Trap Diagnostic · `#traps`
- Section background: `var(--ink)` (dark).
- Section width: content (1180).
- H2 (white): **Six structural patterns. Not founder failures.** (changed from `The Six Trap Diagnostic™` to lead with structural framing)
- Lede paragraph below H2.
- Six trap cards in 2-column grid (1-column on mobile). Each card: bold trap name + one-line definition.
- Closing paragraph: structural framing language verbatim from spec.

### 2.5 Three Tiers · `#tiers`
- Section width: content (1180). 3-column tier card grid (1-column on mobile).
- H2: **Three tiers. Three promises. Find. Install. Run.**
- Lede paragraph (760) below H2.
- Three tier cards: Find (orange top accent), Install (teal top accent), Run (ink top accent). Each card carries: tier stamp, tier name, promise sentence as H3, four-row meta block (Price, Duration, Guarantee, CTA).
- Tier card CTAs: Tier 1 → `/tiers/diagnostic`, Tier 2 → `/tiers/resolution`, Tier 3 → `/tiers/partnership`.
- Caption below triad: verbatim from spec ("Tier 1 stops on its own merits...").
- Tier 3 worked-magnitude box below caption. Highlighted treatment.

### 2.6 What Rhythm Installed Means
- Section width: content (1180). Body: prose (760).
- H2: **What "Rhythm Installed" Means at Day 90** (changed from `Engine Installed`)
- Lede + numbered list (3 items) verbatim from spec.

### 2.7 Artifact Catalog · `#artifacts`
- Section background: alt (cream / light variation).
- Section width: content (1180).
- H2: **What Tier 2 produces. Ten new artifacts. Fifteen cumulative.**
- Lede + numbered artifact list (10 items) verbatim from spec.
- "What's out of scope" highlighted box below the list, body in prose 760.

### 2.8 What That Does for the Raise
- Section width: content (1180). Body: prose (760).
- H2: **What that does for the raise**
- Single paragraph verbatim from spec.

### 2.9 Pattern Proof · `#proof`
- Section width: content (1180). 3-column case-card grid (1-column on mobile).
- H2: **Pattern Proof · Three Mechanisms**
- Lede paragraph (760).
- Three case cards: Pathwright, SmartTab, Orchestraight. Each card carries: title with industry tag, Outcome / Trap stack / Forward move / What this means lines verbatim from spec.

### 2.10 Founding Cohort · `#cohort`
- Section background: navy with orange accent (dark variant).
- Section width: content (1180).
- H2 (white): **Founding Cohort · First Three Resolutions**
- Body verbatim from spec (Founding pricing, Published mechanism, Eligibility filter, Sunset).
- CTA: `Claim a Founding Cohort spot` → `/tiers/resolution#cohort`. Microcopy: *"Three spots. Closes at three signed or June 30, 2026."*

### 2.11 Who This Fits / Not a Fit
- Section width: content (1180). Two-column block (1-column on mobile).
- Body verbatim from spec, including the new "Bootstrapped, no board, no external capital" not-a-fit bullet.

### 2.12 Final CTA · `#book`
- Section background: `var(--ink)` (dark).
- Section width: hero (920).
- H2 (white): **Start here.**
- Body verbatim from spec (FOR FOUNDERS / FOR INVESTORS blocks).
- Two buttons: primary `Book a fit call →` (orange filled) → Calendly URL. Secondary `See the three tiers` (outlined white) → `/tiers/`.
- Microcopy under primary: *"30 min. We diagnose, you decide. Two questions and a number."*
- Closing italic line below CTA block (small, on cream): *The category belongs to the market.*

### 2.13 Footer / Signature block
- Sitewide footer component, but ensure homepage-specific signature block renders above:
  - **Russell Fette · Decisive Finance**
  - *Former VC-backed tech operator. Now installing decision systems for stalled funded tech, on guarantee.* (founder bio per §9a, NEW)
  - russell@decisive.finance · decisive.finance · linkedin.com/in/russellfette
  - Book: calendly.com/russell-decisive/30min
- No "Email and domain transitioning" line. If found, remove.

---

## 3. Logo asset

The brand mark is now an actual image, not a CSS-rendered wordmark. This solves ship-week fix #2 (the lowercase-d render bug).

Two SVG files in workspace root:
- `Decisive - Dark:Transparent - Logo.svg` (use on light/cream backgrounds — nav, footer light variant, page body)
- `Decisive - White:Transparent - Logo.svg` (use on dark/ink backgrounds — dark hero strips, dark CTA section, dark nav variants)

**Action:**
1. Move both SVGs to `public/brand/` (or wherever the existing logo asset lives). Keep the original filenames or rename to `decisive-logo-dark.svg` / `decisive-logo-white.svg` for kebab-case consistency.
2. Update `src/components/Logo.astro` (or whatever the logo component is named) to render the appropriate variant via prop or CSS selector. Replace any current `text-transform`, `letter-spacing`, or font-based wordmark rendering with the SVG.
3. Set `width: auto`, `height: 28px` on the nav variant; `height: 36px` on the footer variant; `height: 48px+` on hero variants if used. Confirm SVG `viewBox="0 0 500 100"` so the aspect ratio holds.
4. Provide `alt="Decisive Finance"` on the `<img>` tag.
5. Confirm the SVG embedded `style` block defines the orange (`#e3632b`) and navy (`#182228`) fill colors. If those conflict with site brand tokens, leave SVG colors intact (the logo is the canonical source).

**Wordmark / brand-name split:** the logo wordmark reads "Decisive" alone. Body copy, page titles, meta tags, and JSON-LD all use "Decisive Finance" written out. This is intentional. Do not "correct" body copy to drop the "Finance" word.

---

## 4. JSON-LD update (sitewide, not just homepage)

The current home page emits an `Organization` / `ProfessionalService` schema. Sweep:

- `description` field: replace any `"$22,500 to $50,000"` with `"$22,500 to $30,000"`.
- Replace any `"trapped capital"` or `"forward-reallocation potential"` with `"trapped value"`.
- `email` field: ensure `russell@decisive.finance`. Remove any `contact@financialrhythms.com` or `contact@decisive.finance` variants.
- `founder` block: ensure `name: "Russell Fette"` and add `description: "Former VC-backed tech operator who built financial decision systems inside funded companies before installing them, on guarantee, for the next three."` (founder bio per §9a).

---

## 5. CTA component updates

Refer to `CTA_SYSTEM.md` for the v1 inventory. The v2 propagation requires the following block-level updates:

**Block A (fit-call, default):** unchanged copy.

**Block B (Diagnostic, tier/guarantee pages):**
- v1 headline: `$22,500 to $30,000 of trapped capital in 14 days. Guaranteed.`
- v2 headline: **`$22,500 to $30,000 of trapped value in 14 days. Guaranteed.`** ("trapped capital" → "trapped value")

**Block C (Founding Cohort):** unchanged copy. Update [DATE] placeholder to `June 30, 2026`.

**Block D (lead-magnet):** unchanged.

**Cluster CTAs from `CTA_SYSTEM.md` §4:**
- `cash-recovery` cluster headline currently reads: `14 days. $22,500 to $30,000 in trapped capital.` → change to **`14 days. $22,500 to $30,000 in trapped value.`**

**404 page microcopy:** v1 reads `"This page is not where the trapped capital is. Try the writing."` → change to **`"This page is not where the trapped value is. Try the writing."`**

A separate companion doc `CTA_SYSTEM-v2.md` will be produced in this session if not already present; treat it as canonical when it exists.

---

## 6. Sitewide sweeps triggered by this page

Run these greps after the page is replaced. Each match needs adjudication.

```bash
# Retired claim numbers
grep -r "\$22,500 to \$50,000" src/
grep -r "\$30K to \$50K" src/
grep -r "\$50,000 of trapped" src/

# Retired noun phrases (claim language)
grep -r "trapped capital" src/        # check each: artifact name "Trapped Value Report" stays per Blueprint v1.9
grep -r "forward-reallocation potential" src/
grep -r "realized optionality" src/

# Retired voice (banned per Phrase Book v2.4 §10)
grep -r "underwrite" src/             # public surfaces; "underwrite" allowed in /partner /investor /board copy only
grep -r "re-underwrite" src/
grep -r "dollarized" src/
grep -r "capture paths" src/
grep -r "reallocation paths" src/
grep -r "forward decision engine" src/
grep -r "forward dollar" src/
grep -r "forward capital allocation" src/
grep -r "operating infrastructure" src/
grep -r "in market with measurement" src/
grep -r "forward-underwriting status" src/
grep -r "Decision Revalidation Register" src/   # artifact renamed to Forward Capital Register
grep -r "decision audit" src/
grep -r "audit the decision" src/

# Retired rally
grep -r "UNSTICK" src/
grep -r "UNTANGLE" src/
grep -r "UNLOCK" src/                 # exception: "trapped capital" → "trapped value" sweep above; UNLOCK as rally is retired

# Email and domain hygiene
grep -r "decisivefinance.com" src/
grep -r "transitioning to" src/
grep -r "contact@financialrhythms" src/
grep -r "contact@decisive.finance" src/    # canonical is russell@decisive.finance per v2.2

# Em dashes (zero tolerance)
grep -r "—" src/
```

Any match outside `src/content/blog/_archive/` needs fixing in the same PR. Do not split.

For ambiguous cases (e.g., "underwrite" in a partner-facing PDF that's allowed): leave a TODO with the canon citation and route to Cowork for adjudication.

---

## 7. Width and component checks

- Hero H1 renders at `--width-hero` (920), no overflow.
- Hero lede caps at `--width-prose` (760).
- Tier triad: 3 columns at desktop, 1 column at <980px. Three-color top accents render.
- Six-Trap section is dark (`--ink` background), six trap cards in 2-column grid at desktop.
- Pattern Proof: 3 case cards at desktop, 1-column on mobile.
- Founding Cohort section: navy + orange accent treatment.
- Final CTA section is `--ink` dark, primary button is orange-filled, secondary is outlined white.
- Footer signature block carries founder bio in italic, full contact line, no transition copy.

---

## 8. Verification checklist (block commit on any fail)

- `npm run build` clean, no warnings beyond Astro's expected output.
- `npm run dev` and walk the page on desktop:
  - Every section renders, no layout overflow, all width tokens hit.
  - Logo renders correctly on both light and dark backgrounds (nav and footer).
  - Single primary CTA above the fold, microcopy visible.
  - No em dashes anywhere on the page (`grep "—" src/pages/index.astro` returns zero).
  - No banned words from §6 grep list (zero matches outside archive).
- Lighthouse mobile (incognito, throttled): performance > 90, accessibility > 95, SEO 100.
- LCP < 2.5s, CLS < 0.1.
- Meta title (55 to 60 chars), meta description (140 to 155 chars), canonical, OG image, OG title, OG description, Twitter card all present and accurate.
- All in-page anchor links resolve. `#traps`, `#tiers`, `#artifacts`, `#proof`, `#cohort`, `#book` all jump correctly.
- Calendly URL opens to a 30-minute slot. Mailto link opens with `russell@decisive.finance`.
- LinkedIn post inspector renders the OG correctly.

---

## 9. Commit and deploy

```bash
git checkout -b homepage-v2-canon-2-4
git add src/pages/index.astro src/components/Logo.astro src/components/CTABlock.astro public/brand/decisive-logo-*.svg
git add -p src/   # pick up the sitewide sweeps from §6
git commit -m "page: index — v2.4 canon propagation (H1, claim, tiers, founder bio, logo asset)"
git push origin homepage-v2-canon-2-4
```

Open PR with link to `Decisive-Finance-Homepage-v2.md`, this handoff doc, and the canon propagation tracker. Merge to `main` after Lighthouse and copy review pass. Cloudflare Pages auto-deploys from `main` to `decisive.finance`.

After deploy, walk the live page in incognito:
- Reload twice, confirm no caching of the old page.
- Submit `/` to Google Search Console for re-indexing.
- Drop the URL into LinkedIn post inspector and confirm OG renders.

---

## 10. Post-launch items (log in TASKS.md or equivalent)

- Tier pages (`/tiers/diagnostic`, `/tiers/resolution`, `/tiers/partnership`) need the same canon propagation. Spec coming in this session.
- Guarantee page (`/guarantee/`) needs the same. Spec coming in this session.
- Blog index and post template need the same. Spec coming in this session.
- Recovery Checklist HTML tool (`Decisive-Finance-Recovery-Checklist-Tool-v3.html`) needs the canon sweep.
- One-Pager v2 and Two-Pager v3.5 markdown sources show `$22,500 to $50,000` (drift). Need v2.1 / v3.6 corrections pass to align to the locked $30K ceiling.
- Cowork project custom instructions reference v3.3 / v1.6 / v1 canon. Update to v3.5 / v1.9 / v2.4 / v2.3 / v2.

---

## 11. What this handoff does not touch

- Cloudflare config (DNS, Pages settings, redirects, env vars). Untouched.
- The blog post bodies. The blog index gets a sub-paragraph rewrite from a separate handoff. Post bodies handled in a sweep handoff.
- Any third-party integrations or analytics. Untouched.
- LinkedIn or email distribution. Out of scope; handle in Cowork after the page is live.

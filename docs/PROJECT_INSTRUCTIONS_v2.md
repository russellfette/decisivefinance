# Decisive Site — Project Instructions v2

**Updated 2026-05-02. Aligned to Canon Phrase Book v2.4, Manifesto v2.3, Service Architecture Blueprint v1.9, Two-Pager v3.5, One-Pager v2. Supersedes the v1 instructions block dated April 2026.**

> Paste this entire block into the "Custom instructions" field of the Cowork project "Decisive Site." It is the single source of truth for how Claude behaves on this project. Anything not covered here defers to the canon documents listed in §3.

---

## 1. Purpose and scope

This project is the operating home for the Decisive Finance website: build, launch, maintenance, content, SEO/AIO, and the weekly distribution loop.

**In scope here**
- Astro codebase edits, CSS fixes, routing, components
- Blog posts, case studies, tier pages, landing copy
- SEO/AIO: schema, meta, sitemap, performance, internal links
- LinkedIn repurposing and the weekly cadence
- Go-live checklist: DNS, Cloudflare config, redirects, analytics
- Quality-bar audits (widths, typography, claims, CTAs)
- HTML lead magnets (Recovery Checklist, Walking Dead self-assessment, calculators)

**Out of scope (route to "OA — Decisive Finance")**
- Offer Architect Modules 1 to 6, programme worksheets
- Positioning, pricing, Signature Triangle decisions
- Canon document revisions (Phrase Book, Two-Pager, Blueprint, Manifesto, One-Pager)

If a request drifts into positioning theory or canon revision, say so and point the user back to OA instead of improvising.

## 2. Stack and repo

- Framework: Astro 5.1 (content collections, MDX where needed)
- Hosting: Cloudflare Pages, project name `decisivefinance` (Pages, not Workers). Production domain: `decisive.finance`. The `.com` variant is third-party-held and will not be purchased. All copy, email, and outbound references use `decisive.finance`.
- Typography: Inter (self-hosted, preloaded)
- Node: latest LTS
- Build: `npm run build` (output: `./dist`)
- Dev: `npm run dev`
- Deploy: Cloudflare Pages auto-deploy from `main`

**Key paths**
- `src/content/blog/` — blog posts (markdown + frontmatter)
- `src/content/case-studies/` — case studies (create if missing)
- `src/content/linkedin/` — LinkedIn repurpose drafts (create if missing)
- `src/pages/` — routes
- `src/components/` — reusable components
- `src/layouts/` — page shells
- `src/styles/` — global CSS, width tokens live here
- `public/` — static assets, favicons, OG images
- `public/brand/` — logo SVGs (dark + white variants)

**Production URL:** https://decisive.finance
**Architecture:** one-page site at `/` with anchor-link nav (Overview `#stuck`, Six Traps `#traps`, Tiers `#tiers`, Artifacts `#artifacts`, Proof `#proof`, Cohort `#cohort`, Book `#book`) plus `/blog`, `/tiers/`, `/guarantee/`, and `/about/` routes. Any new top-level section is either a new anchor on the home page or a new route; decide explicitly, do not default.

**Cowork vs Claude Code routing.** Cowork is for strategy, content, copy review, audits, and planning. Claude Code (local, in terminal) is for mechanical repo iteration: CSS fixes, component edits, running builds, opening PRs. When a task is pure code plumbing, recommend handing it to Claude Code rather than round-tripping through Cowork. The standing pattern: Cowork drafts source-of-truth markdown spec + paired CLAUDE_CODE_HANDOFF doc; Claude Code executes against the repo.

## 3. Canon: sources of truth

These documents are authoritative. Never invent numbers. Never drift from locked phrases. Never introduce new canonical language without explicit approval.

- **Phrase Book v2.4** — locked phrases, taglines, commercial claims, banned-words list, founder bio rule
- **Manifesto v2.3** — brand POV, positioning narrative, north-star voice
- **Service Architecture Blueprint v1.9** — methodology, tier definitions, artifact catalog, Six Trap Diagnostic, capacity model, Realized Value certification
- **Two-Pager v3.5** — partner-facing commercial derivative
- **One-Pager v2** — cold-traffic commercial derivative

**Side flag:** One-Pager v2 line 33 and Two-Pager v3.5 page 1 currently show "$22,500 to $50,000" — this is canon drift. The locked dominant claim is "$22,500 to $30,000." Both docs need a v2.1 / v3.6 corrections pass; until then, trust this instructions block over the canon docs on that one number.

Check order for any copy task: Phrase Book → Manifesto → Blueprint → Two-Pager → One-Pager → invent (only if no canon match, and flag for approval).

## 4. Hard style rules (non-negotiable)

1. **No em dashes. Ever.** Not in copy, meta, commits, or prompts. Use commas, parentheses, semicolons, or periods. If a sentence reaches for an em dash, rewrite it.
2. **Voice.** First-person plural (we, our) for the firm. First-person singular (I) for founder-voice pieces, LinkedIn posts, signed letters. Never mix inside a single piece.
3. **Tone.** Concrete, in dollars, ordered lists of decisions. Minimum hedge.
4. **Banned words.** "genuinely", "honestly", "straightforward", "unlock", "leverage", "seamless", "empower", "journey", "game-changer", "synergy", "best-in-class", "cutting-edge", "world-class".
5. **Banned canon-drift phrases (Phrase Book v2.4 §10).** Find-and-replace on sight: "trapped capital" → "trapped value"; "forward-reallocation potential" → "trapped value"; "underwrite" (public surfaces) → "defend / back / justify"; "re-underwrite" → "re-decide / run the math again"; "dollarized" → "in dollars"; "capture paths" → "recovery plans"; "reallocation paths" → "where each dollar should move"; "forward decision engine" → "the decision rhythm / the system that defends each call"; "forward dollar" → "the next dollar"; "operating infrastructure" → "monthly rhythm" or delete; "in market with measurement" → "live in market with the data to score it"; "decision audit" → "decision discipline"; "Decision Revalidation Register" → "Forward Capital Register"; "UNSTICK. UNTANGLE. UNLOCK." → "Find. Install. Run." (rally retired). Full list in Phrase Book §10.
6. **Numbers.** Always use the dollar sign ($30K, not 30k). Ranges use "to" ($22,500 to $30,000, never with a hyphen or en dash).
7. **Case.** Sentence case headlines. Proper nouns only.
8. **Emoji.** None on the site. Max one per LinkedIn post, only if it earns its place. Never in headlines.
9. **Cliché filter.** No "at the end of the day," "move the needle," "low-hanging fruit," or similar.

## 5. Brand system

### Logo
"Decisive" wordmark with the orange triangle replacing the upper bar of the lowercase `e` in the second `e`. Two variants in `public/brand/`:
- `decisive-logo-dark.svg` (use on light/cream backgrounds)
- `decisive-logo-white.svg` (use on dark/ink backgrounds)

The brand-name split: logo wordmark = "Decisive" alone. Body copy, page titles, meta tags, JSON-LD = "Decisive Finance" written out. This is intentional. Do not "correct" body copy to drop "Finance."

### Palette
5 colors, locked. Stored as CSS custom properties in `src/styles/tokens.css`. Never add a sixth. Never change a hex without explicit approval.
- Navy / ink: `#182228`
- Orange: `#e3632b`
- Cream / canvas: `#f5f2ed`
- Teal accent: `#214c52`
- White / paper: `#ffffff`

### Typography
Inter. Weights: 400, 500, 600, 700. Body line-height 1.5. Display line-height 1.1. Preload the weights used above the fold.

### Width system

Three widths, named, enforced as tokens:

```css
:root {
  --width-prose: 760px;    /* article body, ledes, hero sub-copy, any prose block */
  --width-hero: 920px;     /* every H1, every page type */
  --width-content: 1180px; /* card grids, multi-column, archive, tier cards */
}
```

Every text block must declare which of the three widths it uses. Any new component proposing a fourth width requires written justification and a named token.

## 6. Locked phrases (Phrase Book v2.4 §3)

Use verbatim, never paraphrase.

- **Hero H1:** *"The cash didn't burn. The context did."*
- **Sub-head / opening line:** *"The raise stalled. The next decision doesn't."*
- **Category-defining sentence:** *"capital locked inside decisions whose context has died."*
- **Absolution line:** *"The decisions weren't wrong. They were right for a context that no longer exists."*
- **Work-frame line:** *"We don't audit the past. We justify each next call."*
- **Pull quote:** *"You were the first person who made it feel like a solvable problem, not a permanent condition."* (always founder-attributed, never edited)
- **Rally line:** *"Find. Install. Run."*
- **Closing frame:** *"The category belongs to the market."* (only on surfaces where the category argument has been established)

## 7. Tier outcome sentences (Phrase Book v2.4 §6)

- Tier 1 (Decision Diagnostic): *"Names what your current capital is doing, in 14 days."*
- Tier 2 (90-Day Decision Resolution): *"Installs the rhythm that defends every next call, and proves it in market across 90 days."*
- Tier 3 (Decision Partnership): *"Runs the rhythm on retainer."*

## 8. Founder bio rule (Phrase Book v2.4 §9a)

On every signed long-form public surface, the signature block carries some version of the canonical line:

*"Russell Fette is a former VC-backed tech operator who built financial decision systems inside funded companies before installing them, on guarantee, for the next three."*

Variants:
- Manifesto byline: "By Russell Fette. Former VC-backed tech operator. Now installing decision systems for stalled funded tech, on guarantee."
- Two-Pager / homepage signature: "Russell Fette · Decisive Finance · Former VC-backed tech operator · Now installing forward decision systems for stalled funded tech, on guarantee."
- LinkedIn headline: "Decision-First Finance for stalled funded tech. Former VC-backed tech operator. Decisive Finance."
- Cold outreach signature: "Russell Fette, Decisive Finance | Former operator inside funded tech, now installing the discipline to defend every next call | russell@decisive.finance"

If a derivative is signed by Russell and does not carry the bio claim in some version of the canonical line, the derivative is out of compliance.

## 9. Pillar architecture (memory-locked)

Three blog pillars. Walking Dead is the hero (homepage featured post).

1. **The walking dead portco** (HERO) — slug `walking-dead-portco`, cluster `ratio-mirage`, CTA `self-assessment`. Owns the pattern/problem.
2. **Decision-first finance** — slug `decision-first-finance`, cluster `decision-first`, CTA `slide-template`. Owns the method/category.
3. **A field guide for investors and boards** — slug `stalled-portco-field-guide-for-investors`, cluster `stalled-raise`, CTA `scorecard`. Audience pillar for GPs and directors.

**Cash-recovery is NOT a pillar hub.** Lives on `/guarantee/` (commercial) and the Recovery Checklist lead magnet (TOFU/MOFU). Any cash-recovery blog content is a Pillar 2 spoke, not a hub.

## 10. Content model

### Blog post frontmatter

```yaml
---
title: "Sentence case title, no em dashes"
slug: kebab-case-slug
description: "Meta description, 140 to 155 chars. Lead with the claim."
publishDate: 2026-05-02
updatedDate: 2026-05-02
author: "Russell Fette"
postType: "field-note"        # field-note | case-study | framework | teardown
topicCluster: "burn-multiple"  # see cluster list below
ctaVariant: "burn-multiple"    # maps to CTA component
dominantClaim: "22-30k-trapped-value"
ogImage: "/og/slug.png"
featured: false
readingTime: 7
awarenessStage: "problem-aware"  # unaware | problem-aware | solution-aware | product-aware | most-aware
---
```

### Topic clusters
- `walking-dead-portco` (hero)
- `decision-first` (method)
- `stalled-raise` (investor / board)
- `burn-multiple`
- `board-reporting`
- `unit-economics`
- `cash-recovery` (Pillar 2 spoke only, not a hub)
- `founder-board-disconnect`
- `ratio-mirage`

### CTA policy
Every blog post closes with a topic-specific CTA, not the generic diagnostic pitch. Maintain a CTA component library with one variant per cluster. Only the `cash-recovery` cluster ends with the generic Diagnostic CTA. CTA system source of truth: `CTA_SYSTEM-v2.md` (paste-canonical, supersedes `CTA_SYSTEM.md` v1).

## 11. Recurring workflows

### Workflow 1: Add a new blog post
1. Confirm: title, cluster, CTA variant, target publish date.
2. Check Phrase Book for any locked language relevant to the topic.
3. Draft in `src/content/blog/[slug].md` using the frontmatter template.
4. Structure: lead sentence is the claim, in dollars. H2s phrased as questions where natural. One numbered list in body (AIO-extractable). 2 to 4 internal links to sibling posts.
5. Pull all numbers from canon. Never invent.
6. Apply hard style rules (§4). Scrub for em dashes and banned words.
7. Add "At a glance" box at top: 3 bullets summarizing the argument.
8. Generate OG image prompt if one is not supplied.
9. Topic-specific CTA at close.
10. Run `npm run build` locally; check for errors.
11. Verify widths on dev server: prose 760, no overflow, H1 at 920.
12. Run Workflow 6 (LinkedIn repurpose).
13. Commit: `post: [slug]: [one-line summary]` (use a colon, not an em dash).

### Workflow 2: Update a tier or tier-adjacent page
1. Confirm canon source (Phrase Book §6 + Blueprint v1.9 for pricing and guarantee, §6 for outcome sentences).
2. Never change pricing without confirming canon has been updated first.
3. Edit page; apply the three-width system.
4. Re-run build; check adjacent pages for regressions.
5. Commit: `tier: [tier-name]: [change summary]`.

### Workflow 3: Add a case study
1. Confirm client approval and confidentiality level.
2. Use case study frontmatter.
3. Structure: situation → diagnosis → intervention → outcome → trapped value surfaced → time to recovery.
4. If confidential: stage + ARR bracket only; no company name.
5. Every outcome claim in dollars.

### Workflow 4: Refresh the content plan
1. Inventory `src/content/blog/` by cluster and funnel stage.
2. Map gaps against cluster coverage and the canon's flagship arguments.
3. Propose next 4 to 6 posts: slug, cluster, CTA variant, target date, draft hook.
4. Output as a markdown table for approval.

### Workflow 5: Run a build and deploy
1. `npm install` if dependencies changed.
2. `npm run build`. Review output size and any warnings.
3. Push to `main`. Cloudflare auto-deploys.
4. Verify preview URL, spot-check home + blog index + latest post.
5. If this is a go-live push, walk the §13 checklist end to end.

### Workflow 6: LinkedIn repurpose from a blog post
1. Extract the 3 strongest in-dollars claims.
2. Draft a LinkedIn-native post (not a link drop): 1200 to 1500 characters. Hook on line 1. Body in short ordered beats. Soft CTA at close pointing to the post.
3. First-person singular (Russ voice).
4. No hashtags unless specifically testing a topic tag.
5. Save to `src/content/linkedin/[slug].md`.

### Workflow 7: Width audit
1. Walk: home, blog index, one blog post, each tier page, guarantee, case studies.
2. Report any element not conforming to 760/920/1180.
3. Generate a CSS diff before touching code.

### Workflow 8: Canon-compliance audit
Run before any major outbound push. Greps:
- `$22,500 to $50,000` should return zero matches.
- `trapped capital` should return zero matches outside `Trapped Value Report` artifact name.
- `forward-reallocation potential` should return zero matches.
- `underwrite` should appear only on partner / investor / board pages.
- `UNSTICK | UNTANGLE | UNLOCK` should return zero matches.
- `Decision Revalidation Register` should return zero matches.
- Em dash should return zero matches anywhere.

## 12. Commercial claim registry (locked)

One dominant claim, one supporting claim. Everything else is derivative.

| Claim | Status | Use |
|---|---|---|
| **"$22,500 to $30,000 of trapped value in 14 days. Guaranteed."** | **Dominant** | Homepage hero, blog index subhead, post CTAs, email signatures, LinkedIn bio. |
| "3x diagnostic fee guarantee" | Supporting | Guarantee page, FAQ, objection handling. Requires context to land, so never leads. |
| "$30K to $50K recovered" / "$50K recovery" | **Retired** | Do not use. Inflated relative to engagement-history. Any legacy instance on the site or in collateral is a bug. |
| "Forward-reallocation potential" | **Retired** | Banned in v2.4. Replaced by "trapped value." |
| "Trapped capital" | **Retired** | Banned in v2.4. Replaced by "trapped value." |

**Rule.** No page carries more than one dominant claim. The $22,500 to $30,000 range is the only in-dollars claim above the fold on any page. Supporting claims appear only in body copy where they reinforce, not compete with, the dominant claim. Audit every page at go-live and at every monthly review; flag any drift back toward the $50K number.

## 13. Go-live playbook

Production domain `decisive.finance` is already live on Cloudflare Pages project `decisivefinance`. This checklist applies on every subsequent change push and before any significant outbound push.

**Domain and DNS**
- Worker route / Pages config on `decisive.finance` confirmed healthy
- SSL active and auto-renewing
- Both `www.decisive.finance` and the apex resolve; pick one canonical and 301 the other
- Apex-only is the default. Kill the `www` variant at the DNS level if it is not needed.

**Redirects**
- 301 from `plain-leaf-b85c.russell-055.workers.dev` to `decisive.finance` (preserve any early link equity)
- 301 from any legacy Financial Rhythms URLs
- `/blog` and `/blog/` both resolve; pick one canonical form (default: trailing slash)
- **Do not** add any redirect to or from `decisivefinance.com`. That domain is held by a third party.

**SEO baseline**
- `robots.txt` at root
- `sitemap.xml` generated via Astro integration, submitted to Google Search Console and Bing Webmaster
- Canonical tag on every page
- OG image on every page and post
- Meta description hand-written on every page (never auto-generated from body)

**Analytics**
- Cloudflare Web Analytics enabled (privacy-first, no cookie banner needed)
- Default: do not install GA4 unless explicitly requested.

**Performance targets**
- Lighthouse mobile > 90 on home, blog index, one representative post
- LCP < 2.5s
- CLS < 0.1
- Inter weights preloaded

**Footer**
- No "Email and domain transitioning" copy.
- Email addresses read `russell@decisive.finance`. Do not list `@decisivefinance.com` anywhere.
- Founder bio renders in italic above the contact line on every signed surface (homepage, manifesto, two-pager, about).

**404 and 500**
- Custom 404 with voice-on copy and a route back to blog or home. Microcopy uses "trapped value" not "trapped capital."
- Custom 500.

**Forms**
- Contact / booking form wired to a real inbox
- End-to-end test before go-live

**Legal**
- Privacy policy, Terms (if collecting email), Cookie policy only if using cookies

**Social preview QA**
- LinkedIn post inspector: paste every key URL, confirm OG renders
- Twitter / X card validator
- iMessage preview
- Signal preview (real buyers use it more than expected)

## 14. SEO and AIO optimization

### Structured data
- `Article` schema on every post (author, publishDate, image, publisher, wordCount)
- `BreadcrumbList` on interior pages
- `Organization` / `ProfessionalService` schema sitewide (Decisive Finance, founder Russell Fette with bio per §8, sameAs: LinkedIn, location)
- `FAQPage` on tier pages when FAQs are present
- `Person` on the about page for Russ

### AIO (AI overview optimization)
Write for AI retrieval without gaming.
- First sentence of every post is a direct, in-dollars answer to the title question.
- H2s phrased as questions where natural ("How do you know burn multiple is off?").
- One numbered list per post (extractable as an AIO snippet).
- Cite specific numbers the reader can verify.
- "At a glance" box at top: 3 bullets summarizing the argument.

### Meta
- Titles: 55 to 60 characters.
- Descriptions: 140 to 155 characters, lead with the claim.
- Slugs: 3 to 5 words, kebab-case, no stopwords unless critical.

### Internal linking
- Every post links to 2 to 4 sibling posts in the same cluster.
- Every tier page links to the diagnostic page and 1 to 2 supporting posts.
- Homepage links to 3 featured posts with real anchor text (never "read more").

## 15. Distribution cadence

- **Tuesday:** new blog post publishes; LinkedIn repurpose goes live same day.
- **Thursday:** standalone LinkedIn field note or reaction (not a repurpose).
- **Friday:** email to list. Links the new post plus one "overheard this week" item.

## 16. Guardrails

Claude does **not**, without explicit approval:
- Change the 5-color palette
- Change pricing on any tier page
- Introduce new canonical phrases
- Modify the three-width system
- Change the dominant commercial claim
- Touch production Cloudflare config (DNS, workers, redirects, environment variables)
- Publish to LinkedIn or the email list
- Delete content (archive to `src/content/blog/_archive/` with a redirect)

Claude **may**, without asking:
- Fix style-rule violations (em dashes, width inconsistencies, banned words, voice drift)
- Add internal links between existing posts
- Generate OG image prompts
- Draft posts from a brief for review
- Run local builds and report errors
- Open PRs with small mechanical fixes (Claude Code context)

## 17. Quality bars

**A page is ship-ready when:**
- All widths conform to 760 / 920 / 1180
- Zero em dashes
- One dominant commercial claim, consistent across the site
- Every CTA is topic-specific (not boilerplate)
- Meta title + description present and correctly sized
- OG image renders in LinkedIn inspector
- Lighthouse mobile > 90
- No orphan pages (every page linked from at least one other)
- No "coming soon" or "transitioning" copy visible
- Founder bio renders on every signed surface

**A blog post is ship-ready when:**
- Frontmatter complete (cluster, CTA variant, dominantClaim, awarenessStage)
- "At a glance" box at top
- One numbered list in body
- 2 to 4 internal links
- Topic-specific CTA at close
- Reading time matches actual word count / 200 wpm
- LinkedIn repurpose draft saved to `src/content/linkedin/`

## 18. Working mode

When given a task, always:
1. Restate the task in one line. Flag any canon conflict.
2. Identify which workflow applies (§11). Run it, not a generic version.
3. Execute. Report files touched and any guardrail flags raised.
4. Close with the next logical move (e.g., "ready to run Workflow 6 on this").

If a task is pure code plumbing (CSS, component edits, routing, dependency bumps): recommend it be handled in Claude Code locally. This project is for strategy, content, copy, audits, and review.

---

## Quick-start checklist (first session in a new chat)

When a new chat opens in this project, Claude should:
1. Read `src/styles/tokens.css` to confirm current palette + width values.
2. Read `src/content/blog/` index to see posts currently live.
3. Read the latest commit messages in git log to understand recent state.
4. Ask the user: "Is this a content task, a code task, or a strategy/audit task?" and route accordingly.
5. If the task is code-heavy, recommend Claude Code.

Follow these instructions when working in this project.

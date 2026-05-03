# Decisive Finance — Blog v2

**v2 · May 2026 · aligned to Phrase Book v2.4. Source-of-truth for `/blog/` index, the blog post template, the post-frontmatter schema, the topic-cluster CTA map, and the sitewide sweep that brings every existing post into v2.4 compliance.**

*Awareness stage: blog index = problem-aware (cold). Posts vary by cluster.*
*Width tokens: hero (920) for H1 of index; prose (760) for ledes and post body; content (1180) for the archive grid and featured-post cards.*

---

## [BLOG INDEX] · `/blog/`

### Hero · width: content (1180); H1: hero (920); subhead: prose (760)

**Eyebrow (orange):** FIELD NOTES
**H1 (navy):** Field notes from inside stalled funded-tech engagements.
**Subhead (760):** Specific decisions, in dollars. Not generic CFO advice.
**Hero CTA (small, secondary):** `Book a fit call` → Calendly. Microcopy: "30 min with Russ. No pitch."

*v2 update: replaces v1 meta line "7 pieces · Updated weekly · Free to read, always" per ship-week fix #8.*

### Featured post block · width: content (1180); single card

The Walking Dead Portco (hero pillar). Card carries: post title (real anchor text, never "Read more"), one-sentence in-dollars hook, reading time, "Read the field note →" link.

### Archive grid · width: content (1180); 3-column at desktop, 1-column on mobile

Each card carries: post title (H2 at width 920 inside card), one-line in-dollars hook (prose 760 inside card), publish date, reading time, cluster tag.

Sort: most-recent first. Filterable by cluster (chips above grid: All / Walking Dead / Decision-First / Stalled Raise / Burn Multiple / Board Reporting / Unit Economics / Cash Recovery).

### Final CTA · width: hero (920); section background: ink (dark)

Reuse Block A from CTA System v2: "Book a fit call." Microcopy: *"30 min with Russ. No pitch. Two questions and a number."*

### Meta
- Title: Field Notes · Decisive Finance
- Description: Field notes from inside stalled funded-tech engagements. Specific decisions, in dollars. Decision-First Finance for venture-backed companies stalled between rounds.

---

## [POST FRONTMATTER SCHEMA]

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
ctaVariant: "burn-multiple"    # maps to CTA System v2 §4
dominantClaim: "22-30k-trapped-value"
ogImage: "/og/slug.png"
featured: false
readingTime: 7
awarenessStage: "problem-aware"  # unaware | problem-aware | solution-aware | product-aware | most-aware
---
```

### Allowed cluster values
- `walking-dead-portco` (hero pillar)
- `decision-first` (method pillar)
- `stalled-raise` (investor / board pillar)
- `burn-multiple`
- `board-reporting`
- `unit-economics`
- `cash-recovery` (Pillar 2 spoke only, not a hub)
- `founder-board-disconnect`
- `ratio-mirage`

### Allowed `ctaVariant` values
Match cluster. CTA System v2 §4 carries the full map.

### Allowed `awarenessStage` values
Per `decisive-copywriting` skill principle 1: `unaware`, `problem-aware`, `solution-aware`, `product-aware`, `most-aware`.

---

## [POST TEMPLATE]

```markdown
---
title: "..."
slug: "..."
description: "..."
publishDate: ...
author: "Russell Fette"
postType: "field-note"
topicCluster: "..."
ctaVariant: "..."
dominantClaim: "..."
awarenessStage: "..."
readingTime: ...
---

## At a glance

- [In-dollars claim 1]
- [In-dollars claim 2]
- [In-dollars claim 3]

[Lead sentence: the in-dollars answer to the title question. One sentence.]

[Body paragraph 1: the situation, in concrete terms. 760-prose width.]

## [H2 phrased as a question where natural]

[Body paragraph.]

[Body paragraph.]

## [H2]

[Body paragraph leading into the numbered list.]

1. [Numbered list item one. AIO-extractable shape.]
2. [Numbered list item two.]
3. [Numbered list item three.]
4. [...]

## [H2]

[Continue.]

## [H2]

[Closing context. 2 to 4 internal links to sibling posts in the same cluster.]

---

[Topic-specific CTA block, mapped from `ctaVariant` to CTA System v2 §4.]
```

### Body rules
- Lead sentence is the in-dollars answer to the title question.
- H2s phrased as questions where natural.
- One numbered list per post (AIO-extractable).
- 2 to 4 internal links to sibling posts.
- "At a glance" box at top: 3 bullets.
- Topic-specific CTA at close (not the generic Diagnostic pitch unless `cluster: cash-recovery`).
- Reading time matches actual word count / 200 wpm.

---

## [SITEWIDE POST SWEEP] · for Claude Code

Every post in `src/content/blog/` (not in `_archive/`) needs a v2.4 voice pass. Mechanical greps + judgment-level read.

### Mechanical (find-and-replace)

```bash
# Retired claim numbers and noun phrases
grep -rn "\$22,500 to \$50,000" src/content/blog/
grep -rn "\$30K to \$50K" src/content/blog/
grep -rn "\$50,000 of trapped" src/content/blog/
grep -rn "trapped capital" src/content/blog/      # check each: claim language → "trapped value"; "Trapped Value Report" stays
grep -rn "forward-reallocation potential" src/content/blog/
grep -rn "realized optionality" src/content/blog/

# Retired voice (per Phrase Book v2.4 §10)
grep -rn "\bunderwrite" src/content/blog/         # public surfaces; replace with defend / back / justify
grep -rn "re-underwrite" src/content/blog/        # → re-decide / run the math again
grep -rn "dollarized" src/content/blog/           # → in dollars
grep -rn "capture paths" src/content/blog/        # → recovery plans
grep -rn "reallocation paths" src/content/blog/   # → where each dollar should move
grep -rn "forward decision engine" src/content/blog/   # → the decision rhythm
grep -rn "forward dollar" src/content/blog/       # → the next dollar
grep -rn "operating infrastructure" src/content/blog/  # → monthly rhythm or delete
grep -rn "in market with measurement" src/content/blog/   # → live in market with the data to score it
grep -rn "Decision Revalidation Register" src/content/blog/   # → Forward Capital Register
grep -rn "decision audit" src/content/blog/       # → decision discipline
grep -rn "audit the decision" src/content/blog/   # → back the next dollar with math
grep -rn "Recovery Engine" src/content/blog/      # tier name retired → 90-Day Decision Resolution
grep -rn "Fractional CFO" src/content/blog/       # tier name retired → Decision Partnership

# Retired rally
grep -rn "UNSTICK\|UNTANGLE\|UNLOCK\." src/content/blog/    # → Find. Install. Run.

# Em dashes (zero tolerance)
grep -rn "—" src/content/blog/

# Banned words (per Phrase Book §10 + Decisive Site project instructions §4)
grep -rin "genuinely\|honestly\|straightforward" src/content/blog/
grep -rin "leverage\|seamless\|empower\|journey" src/content/blog/
grep -rin "game-changer\|synergy\|best-in-class\|cutting-edge\|world-class" src/content/blog/

# Email and domain
grep -rn "decisivefinance.com" src/content/blog/
grep -rn "transitioning to" src/content/blog/
grep -rn "contact@financialrhythms" src/content/blog/
grep -rn "contact@decisive.finance" src/content/blog/    # canonical is russell@decisive.finance
```

### Judgment-level read

Each post also gets a one-pass read with these questions:
1. Does the lede pass the "audit vs defend" test? If the post reads as audit framing, rewrite to forward-leading.
2. Does the post mention the Six Traps? If yes, ensure the structural framing appears at least once ("not failures of the founder").
3. Does the post have an "At a glance" box? If not, add one (3 in-dollars bullets).
4. Does the post end with a topic-specific CTA matching its `ctaVariant`? If it ends with the generic Diagnostic CTA and isn't in `cluster: cash-recovery`, rewrite the close to use the cluster-specific block from CTA System v2 §4.
5. Does the post have 2 to 4 internal links to sibling posts in the same cluster? If not, add them.
6. Does the meta description start with the in-dollars claim and run 140 to 155 chars? If not, rewrite.
7. Does the post body use first-person plural ("we") or first-person singular ("I")? Most should be "we" (firm voice). Founder-voice exceptions (signed, byline) use "I" — never mixed.

### Per-post change log
For each post, log changes in a `BLOG_v2_SWEEP_LOG.md` workspace file: post slug, total mechanical replacements, judgment-level changes summary. Useful for accountability and for future canon updates.

---

## [DELTAS FROM EXISTING BLOG SETUP]

**Blog index hero:**
- v1: "7 pieces · Updated weekly · Free to read, always" (per ship-week fix #8)
- v2: "Specific decisions, in dollars. Not generic CFO advice." (or alternate: "Field notes from inside stalled funded-tech engagements." moved to subhead position)

**Frontmatter schema:**
- v1: lacked `awarenessStage` field, lacked formal `dominantClaim` constraint
- v2: `awarenessStage` required, `dominantClaim` constrained to canon-current value (`22-30k-trapped-value`)

**CTA library:**
- v1: per `CTA_SYSTEM.md` (cluster headlines used "trapped capital")
- v2: per `CTA_SYSTEM-v2.md` (clusters use "trapped value", Tier 3 CTA renamed to "Run on retainer")

**Posts in `src/content/blog/`:**
- Sweep per the mechanical greps above.
- Spot-check for the "At a glance" box; add if missing.
- Verify cluster-specific CTAs replace the generic close on every non-cash-recovery post.

---

*End of Blog v2 source. Pair with `CLAUDE_CODE_HANDOFF-blog-v2.md` for the mechanical pass, or fold into the master handoff at session close.*

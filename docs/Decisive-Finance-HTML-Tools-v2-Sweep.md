# Decisive Finance — HTML Tools v2.4 Sweep

**v2 · May 2026 · aligned to Phrase Book v2.4. Source-of-truth sweep guide for the lead-magnet HTML tools.**

The HTML tools were rebuilt May 1 against Phrase Book v2.3 / Blueprint v1.8 and are largely v2.4-compliant already. This doc lists the residual drift points and the canonical replacement copy.

---

## Tools in scope

1. `Decisive-Finance-Recovery-Checklist-Tool-v3.html` (70KB) — Trapped Value Report Preview, three-question lead magnet, mirrors Diagnostic Artifact 2.
2. `walking-dead-assessment.html` (77KB) — Walking Dead self-assessment, 6 of 6 question tool, MOFU lead magnet.
3. `walking-dead-assessment.DEPLOY.md` (14KB) — deploy guide for the assessment tool.

Older versions (v1, v2 of Recovery Checklist) are stale; do not deploy.

---

## Recovery Checklist v3 — drift sweep

Verified clean already:
- "Trapped Value Report" wording (v2.4 compliant) ✓
- "$22,500 to $30,000" (v2.4 compliant) ✓
- "Most Diagnostics surface $22,500 to $30,000 of trapped value in 14 days. Guaranteed." (canon-locked) ✓

**Drift to fix:**

| Line / context | Current | Replace with | Reason |
|---|---|---|---|
| Footer / source citation | "Source: Decisive Service Architecture Blueprint v1.8." | "Source: Decisive Service Architecture Blueprint v1.9." | Blueprint version bump |
| ~Line 1291, methodology block | "forward-allocation conversation happens on math" | "defending the next call happens on math" | "forward-allocation conversation" banned per v2.4 §10 |
| ~Line 1335, "What the actual Trapped Value Report adds" | "the CEO has agreed to underwrite forward" | "the CEO has agreed to defend forward" | "underwrite" banned on public surfaces per v2.4 §9 |
| ~Line 1337, "Strategic-finding equivalents" | "If the dollarized findings don't clear the 3x threshold" | "If the in-dollars findings don't clear the 3x threshold" | "dollarized" banned per v2.4 §10 |
| ~Line 1335 / 1373, "CEO-accepted capture paths" / "with CEO-accepted capture paths" | "CEO-accepted capture paths" | "CEO-accepted recovery plans" | "capture paths" banned per v2.4 §10 |
| ~Line 1373, "If the dollar findings don't clear..." | "with CEO-accepted capture paths, the work is free" | "with CEO-accepted recovery plans, the work is free" | same |

**Double-check sweep (run after edits):**

```bash
grep -n "v1\.8\|underwrite\|dollarized\|capture path\|forward-allocation conversation" Decisive-Finance-Recovery-Checklist-Tool-v3.html
```

Returns zero matches when clean.

---

## Walking Dead Assessment — drift sweep

Verified clean already:
- "Trapped value" (v2.4 compliant) ✓
- "$22,500 to $30,000" (v2.4 compliant) ✓
- "Most Diagnostics surface $22,500 to $30,000 of trapped value in 14 days. Guaranteed." ✓
- "Decision rhythm" (v2.4 compliant) ✓

**No drift detected on canon-relevant strings.** Run the standard sweep to confirm:

```bash
grep -n "trapped capital\|forward-reallocation\|underwrite\|dollarized\|capture path\|reallocation path\|UNSTICK\|UNTANGLE\|UNLOCK\|\$22,500 to \$50,000\|\$50,000 of trapped\|Decision Revalidation Register\|forward decision engine\|forward dollar\|operating infrastructure\|in market with measurement" walking-dead-assessment.html
```

Returns zero matches when clean.

---

## Tool meta / OG / canonical

Verify on both tools:

- Meta description starts with the dominant claim (`$22,500 to $30,000 of trapped value`).
- OG image renders correctly in LinkedIn post inspector.
- Canonical URL set (assessment lives at `/walking-dead/`; checklist lives at `/checklist/` or wherever deploy targets).
- "Decisive Service Architecture Blueprint" version reference is **v1.9** (not v1.8 or earlier).
- Footer carries `russell@decisive.finance` (not `contact@*`).
- No `decisivefinance.com` references anywhere in the tool.
- No "Email and domain transitioning" copy.

---

## Deploy and link from main site

Both tools are linked from the site:

- Walking Dead assessment → linked from `/blog/walking-dead-portco/` post (cluster CTA `walking-dead-portco`), and from the homepage featured-post block.
- Recovery Checklist → linked from `/guarantee/` page CTA, and from any blog post in cluster `cash-recovery`.

Confirm those links resolve after the canon propagation lands on the main site:

```bash
# In the Astro repo:
grep -rn "walking-dead-assessment\|/walking-dead/" src/
grep -rn "Recovery-Checklist-Tool\|/checklist/\|trapped-value-preview" src/
```

If the homepage v2 introduced a new featured-post link target, update both tools' footer "back to the site" link to match.

---

## Logo asset in tools

If either HTML tool currently CSS-renders the wordmark "Decisive" or "Decisive Finance," update to use the new SVG logo asset:
- `Decisive - Dark:Transparent - Logo.svg` for tool light backgrounds
- `Decisive - White:Transparent - Logo.svg` for tool dark backgrounds

Inline base64 the SVG into the tool's `<head>` style block, or reference `/brand/decisive-logo-dark.svg` if the tool is hosted from the same origin as `decisive.finance`. Single self-contained HTML file is the standing pattern; inline-SVG is preferred to keep the tool portable.

---

## What this sweep does not touch

- The actual question logic, scoring formulas, or output ranges. Those are calibrated against engagement data and are out of canon scope.
- The Decisive Service Architecture Blueprint PDF download link (if present). Update separately when v1.9 PDF is produced.
- Any analytics or event-tracking (Cloudflare Web Analytics or similar). Untouched.

---

*End of HTML Tools v2.4 sweep guide.*

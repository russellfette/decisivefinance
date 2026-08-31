# Weekly blog automation: grounding contract

Read by the scheduled task `decisive-weekly-blog-linkedin-prep`, Mondays 07:00 PT.
Lives in the repo so it versions with the corpus it describes.

## Slot and pillar

Run this, from the repo root, and take the answer:

```
node scripts/next-slot.mjs
```

It prints the slot, the pillar, and where the pick came from. It reads
`src/content/blog/` frontmatter plus `content-queue.md`. Nothing else.

Do not source the slot, the pillar, or the angle from the editorial calendar,
the content schedule, the content plan, or `CONTENT-PILLAR-STRATEGY-v1.md`.
Those documents are not listed CURRENT in CANON-INDEX v2.2, which carries them
under the open item "the content engine is built on the retired ICP." Reading
them puts retired funded-tech pillars back into live copy. `content-queue.md`
in this repo carries the full list and the reasoning.

## Then

1. Draft `src/content/blog/<slug>.md` on the pillar the script named,
   trigger-first, canon-gated. Load `decisive-copywriting` for the craft layer
   and `russ-voice` before any first-person line.
2. `node scripts/og-generate.mjs <slug>` for the card.
3. Draft `src/content/linkedin/<slug>.md`, first person, exit-forward.
4. Build-check via the /tmp trick, since rollup fails on mounted node_modules.
5. Email Russ at russell@decisive.finance through Superhuman on the work
   account: the summary, the LinkedIn draft, and a copy-paste git block.

Never push, never post. Russ ships, and he voices every external word.

## Gates that bind on every draft

- Darwin's stays anonymized as "a $25M consumer products manufacturer." No name,
  no attributed owner quotes, until Gary's written consent.
- Exit fee mechanics stay off public copy until Raymond's securities-counsel
  review. Positional lines only.
- Never guarantee a sale price or a multiple. State the guarantee in dollars,
  never in Sellable-Numbers Score points.
- No dashes of any kind. Ranges use "to". Dollar sign always.
- The methodology is the Financial Rhythm System (FRS), decided 2026-08-12.
  "Financial Rhythms" standing alone is the retired pre-Decisive DBA and never
  appears on a live surface. Every post closes with the signature block exactly
  as written here, pulled from this line and never from memory:

  `*Russell Fette · Decisive Finance · Creator of the Financial Rhythm System™*`

  If a sibling post shows any other form, that post is stale, not the pattern.

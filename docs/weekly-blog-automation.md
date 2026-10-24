# Weekly blog automation: grounding contract

Read by the scheduled task `W-1 weekly blog and LinkedIn prep`, Mondays 07:00 PT.
Lives in the repo so it versions with the corpus it describes.

Since 2026-10-23 (W-1 v2) the run lives in the cloud: it clones
`russellfette/decisivefinance` from GitHub and never reads Russ's Mac. If the
clone fails, the run emails the failure in one line and stops.

## Step 0: Buffer runway, first step of every run

Before `next-slot.mjs`, count the LinkedIn channel's Buffer posts (drafts plus
scheduled) with a due date in the future.

| Ahead | Do | Email subject |
|---|---|---|
| 10 or more (over 3 weeks at Monday, Wednesday, Friday) | Carry on with the modes below | `W-1: <mode>, Buffer runway N posts` |
| 1 to 9 | Draft the missing weeks first, to the step 3a pattern, then the modes below | `W-1: Buffer runway N posts, M drafted` |
| 0 | Same as above | `W-1 ALERT: Buffer empty` |

A missing week is any Monday, Wednesday or Friday from the coming Monday to
three weeks out with no draft or scheduled post. Never fill a day that already
has one.

## What the run does is decided, not assumed

Run this, from the repo root, and take the answer:

```
node scripts/next-slot.mjs
```

It prints a **mode** first, then the assignment for that mode. It reads
`src/content/blog/` frontmatter, `src/content/linkedin/`, and
`content-queue.md`. Nothing else.

| Mode | When | Do |
|---|---|---|
| `draft` | Fewer than 6 consecutive Tuesdays ahead are already filled | Draft the blog post for the slot and pillar it names, then its OG card, then its LinkedIn repurpose |
| `repurpose` | 6 or more Tuesdays are banked and publishing posts lack a LinkedIn draft | Draft the LinkedIn repurpose for the 2 posts it names, soonest publishing first. Draft no blog post |
| `idle` | Queue banked past the cap and the LinkedIn backlog is clear | Write nothing. Email the one-line status and stop |

Why the cap exists: without it the run drafts for the first open Tuesday
forever, so every week it writes one week further out. On 2026-09-08 the queue
stood 14 weeks deep through 2026-12-15 while 15 publishing posts had no
LinkedIn repurpose. The run was manufacturing supply where there was a
quarter of surplus and none where there was a weekly deficit.

A hand-written row in `content-queue.md` naming the open slot beats the cap,
the same way it beats the computed pillar. `--force-draft` overrides the cap
for a manual run. `--max-ahead N` changes the cap for one run.

## Where the slot never comes from

Do not source the slot, the pillar, or the angle from the editorial calendar,
the content schedule, the content plan, the Exit-Readiness LinkedIn campaign
calendar, the Exit Content Matrix, or `CONTENT-PILLAR-STRATEGY-v1.md`. Those
documents are not listed CURRENT in CANON-INDEX v2.2, which carries them under
the open item "the content engine is built on the retired ICP." Reading them
puts retired funded-tech pillars back into live copy. `content-queue.md` in
this repo carries the full list and the reasoning.

This is the design, not a limitation. A run that could not reach those files
lost nothing, so it does not report their absence as a caveat, a fallback, or
a degraded source. State the slot source as the script states it: `computed
from repo state` or `content-queue.md`.

## Then

1. In `draft` mode, write `src/content/blog/<slug>.md` on the pillar the script
   named, trigger-first, canon-gated. Load `decisive-copywriting` for the craft
   layer and `russ-voice` before any first-person line.
2. `node scripts/og-generate.mjs <slug>` for the card, `draft` mode only.
3. Draft `src/content/linkedin/<slug>.md`, first person, on the post's own prong
   (pillar 6 running it; pillars 1 to 4 selling it), the new post in `draft`
   mode, the named backlog posts in `repurpose` mode. Load `russ-voice`.
3a. LinkedIn week (added 2026-10-11, pattern revised 2026-10-23). Three
   posts a week at 08:00 PT. Monday: running the company (pillar 6, the
   operating prong). Wednesday: the repurpose of that week's Tuesday blog post;
   its first comment links the article at decisive.finance/perspectives/<slug>.
   Friday: a referrer post, rotating chairs and implementers, then bankers,
   then deal professionals. Referrer posts lead with the problem, name or
   contrast no other profession, carry no guarantee sentence, and carry the fee
   line in first person: "I take no piece of any transaction, so your mandate
   and your relationship stay yours." The stance line and the independence line
   are retired (2026-10-17) and never appear. Proof only from the three lines in
   Phrase Book v3.8 section 8a, verbatim; every other number is labeled as an
   illustration. No client story is invented.
3b. Card per post: the live OG image of the article the post draws on,
   https://decisive.finance/og/<slug>.png, checked for HTTP 200 before the
   Buffer draft is created. Only when no article fits, render a 1200 by 1200
   card (ink ground, hero words white then orange, Inter, wordmark top left,
   "Russell Fette" and "decisive.finance" in the footer) into
   `public/social/YYYY-MM/li-YYYY-MM-DD-<slug>.png`.
3c. Commit and push only `public/social/` and `src/content/linkedin/`. Those
   paths publish nothing a reader sees on the site. Blog posts stay for Russ
   to ship.
3d. Once the card URL returns 200 on decisive.finance, create each Buffer
   post as a draft (saveToDraft true) on the LinkedIn channel with its due
   time, the card attached by URL, and the first comment. Never schedule,
   never publish. Russ approves in Buffer.
4. Build-check via the /tmp trick, since rollup fails on mounted node_modules.
   Skip the build in `repurpose` mode when only files under
   `src/content/linkedin/` changed, and say so in the email.
5. Email Russ at russell@decisive.finance through Superhuman on the work
   account: the mode and why, the summary, the LinkedIn draft or drafts in
   full, and a copy-paste git block.

Never push blog posts, never post. Step 3c is the only push. Russ ships the blog and voices every external word.

## Balance and open slots (2026-10-23)

The blog queue has no running-the-company posts (pillar 6) between 2026-10-27
and 2026-12-15. In `draft` mode, weight pillar 6 until the two prongs even out.
Open Tuesdays: 2026-11-10 (the walkthrough post is archived pending consent),
2026-12-22 and 2026-12-29.

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

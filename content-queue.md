# Content queue

The source of truth for what publishes when. Committed to this repo on purpose:
the weekly automation reads it from a git checkout, so it never depends on
OneDrive being synced or on a folder staying connected.

Read this with `node scripts/next-slot.mjs`. That script picks the slot and the
pillar; the rows below override it when you want a specific piece on a specific
date.

## How selection works

1. **Slot.** The first Tuesday after today with no post already dated to it.
   Slots come from `pubDate` frontmatter in `src/content/blog/`, so the corpus
   is the calendar. There is no second list to keep in sync.
2. **Override.** If a row below names that slot, its pillar and working title
   win. Hand-written rows always beat the computed pick.
3. **Pillar, when no row exists.** The pillar with the fewest posts still ahead
   of today. Ties break to whichever of those was covered longest ago.

Balancing on forward count rather than on recency alone is deliberate. Recency
alone kept selecting pillar 1, which was already the deepest pillar in the
queue: 17 posts against 8 for pillar 4 as of 2026-08-24. Stalest is not the
same question as thinnest.

## Pillars

| # | Name | Scope |
|---|---|---|
| 1 | Sellable numbers | The numbers a buyer can believe, built before the buyer shows up. |
| 2 | Worth more | Pricing, mix, and margin truth: grow the earnings a buyer pays a multiple on. |
| 3 | Surviving diligence | Deals die in diligence, and it is almost never the business. It is believability. |
| 4 | The exit clock | Timing, the trailing twelve, and the sequence a transition actually runs on. |

Pillar 5 is the Industry band. It sits outside the Tuesday rotation and is
scheduled by hand.

## Queued rows

One row per assigned slot. Delete a row once the post is committed; the post's
own `pubDate` holds the slot from then on. Leave the table empty to let the
script balance every week on its own.

| Slot | Pillar | Working title or angle |
|---|---|---|
| | | |

## Do not plan from these

The content-planning documents in the canon repo are **not** listed CURRENT in
CANON-INDEX v2.2, which carries them under the open item "the content engine is
built on the retired ICP." Their pillar architecture is Walking Dead Portco,
burn multiple, stalled raise, and cap-table readers, all retired on 2026-06-16.
Do not source slots, pillars, or angles from:

- `Decisive-Editorial-Calendar-v1.md`
- `Decisive-Finance-Content-Schedule-v1.md`
- `Decisive-Finance-Content-Plan-v1.md`
- `CONTENT-PILLAR-STRATEGY-v1.md`
- `Decisive-Finance-Blog-v2.md`
- `Decisive-LinkedIn-Carousel-and-Series-Plan-v1.md`

They live at `OneDrive-PugetSoundCFO/Claude/Projects/OA - Decisive Finance/decisive-operating-system/10-canon/`.
Rebuilding them on the wound and exit clusters is an OA item, not a site item.

`Exit-Content-Matrix-v1.md`, in the same folder, is exit-based and closer to
current, but it is internal only: its situation bank S1 to S12 is
un-anonymized Darwin's material under the Gary gate. Anonymize to "a $25M
consumer products manufacturer" and never quote an owner verbatim from it.

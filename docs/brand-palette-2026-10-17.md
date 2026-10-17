# Brand palette, 2026-10-17

Decisive Finance. Internal. The orange values in use on decisive.finance, as set in `src/styles/global.css` (commit 964aca8, live 2026-10-16). Approved by Russell Fette 2026-10-17. This file records what the site already does; the CSS is the source of truth if the two ever disagree.

## The four oranges

| Use | Hex | Token in global.css | Contrast (WCAG 2.2) |
|---|---|---|---|
| Orange text on light grounds | #a8431a | `--orange` | 6.03:1 on #ffffff, 5.71:1 on paper #f7f9fa |
| Orange text on dark grounds | #f08a5d | `--orange-on-dark` (`--orange` switches to it inside dark sections) | 6.55:1 on ink #182228 |
| Filled buttons | #bf4d1a | `--orange-ink` | 4.89:1 with white button text |
| Brand mark | #e3632b | `--orange-brand` | Decoration only: borders, glows, strokes, the mark. Never text. |

## Why

WCAG 2.2 AA contrast: 4.5:1 for normal text. #e3632b, the original brand orange, reaches only 3.45:1 on white, so it fails as text. It stays as the mark color and for decoration, where no contrast minimum applies to the brand mark.

## Rules for new pages

- Orange text uses `var(--orange)`, never a hard-coded hex, so it switches correctly in dark sections.
- Filled buttons use `var(--orange-ink)`.
- #e3632b never carries text.
- Re-run the axe scan (WCAG 2.2 AA, all built pages) before each push.

Contrast ratios computed 2026-10-17 with the WCAG relative-luminance formula.

Built by Decisive Finance, 2026-10-17. Reviewed by Russell Fette. Signed by Russell Fette, 2026-10-17.

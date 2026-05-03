# Decisive Finance — Tier Pages v2

**v2 · May 2026 · aligned to Phrase Book v2.4, Manifesto v2.3, Blueprint v1.9, Two-Pager v3.5. Source-of-truth markdown for `/tiers/diagnostic`, `/tiers/resolution`, `/tiers/partnership`. Plus the index page at `/tiers/`.**

*Awareness stage: solution-aware (visitor knows fractional CFOs exist, comparing options) → product-aware (visitor knows Decisive specifically, evaluating fit).*
*Width tokens: hero (920) for H1; prose (760) for ledes and body; content (1180) for artifact grids and timeline.*
*One dominant CTA per page. Tier-specific microcopy.*

---

## ROUTING ARCHITECTURE

```
/tiers/                       → index, three-card overview, links into the three tier pages
/tiers/diagnostic/            → Tier 1 deep page
/tiers/resolution/            → Tier 2 deep page (Founding Cohort sub-anchor #cohort)
/tiers/partnership/           → Tier 3 deep page
```

Homepage `#tiers` anchor links each card to the full page. Cross-tier nav at the bottom of each tier page (e.g., Diagnostic page closes with "Next: 90-Day Decision Resolution →").

---

## /tiers/ — INDEX PAGE

### Hero · width: hero (920)
**Eyebrow:** SERVICES
**H1:** Three tiers. Three promises. Find. Install. Run.
**Sub (760):** Tier 1 names what your current capital is doing, in 14 days. Tier 2 installs the rhythm that defends every next call, and proves it in market across 90 days. Tier 3 runs the rhythm on retainer. Most founders start with Tier 1 and move into Tier 2. Tier 3 is optional and runs only once Tier 2 has installed what it is paid to operate.

### Tier triad · width: content (1180); 3-column grid
Reuse the same tier card component as the homepage `#tiers` section. Each card links to the corresponding deep page. Founding Cohort callout sits below the triad with link to `/tiers/resolution#cohort`.

### CTA · width: hero (920); section background: ink (dark)
**H2:** Not sure which tier yet?
**Body:** Most engagements start with Tier 1. We diagnose, you decide whether to keep going.
**Primary:** `Book a fit call` → calendly.com/russell-decisive/30min
**Microcopy:** 30 min with Russ. No pitch. You leave with at least one action.

### Meta
- Title: Decisive Finance Tiers · Find. Install. Run.
- Description: Three tiers for stalled venture-backed tech. 14-day Diagnostic, 90-day Resolution, ongoing Partnership. Pricing visible. Guarantee on every tier.

---

## /tiers/diagnostic/ — TIER 1 PAGE

### Hero · width: hero (920); H1 hero; lede 760
**Eyebrow:** TIER 1 · FIND
**H1 (navy):** Decision Diagnostic
**Sub (orange or accent):** Names what your current capital is doing, in 14 days.
**Lede paragraph (760):** A 14-day read of every material capital commitment running in the business today, in dollars, with the context that justified each one, the context that exists now, and a CEO-accepted plan for every dollar that has to move.
**Top claim strip (dark, white, orange dollar):** Most Diagnostics surface **$22,500 to $30,000** of trapped value in 14 days. **Guaranteed.**
**Hero CTA:** `Start the Diagnostic` (orange filled) → `/tiers/diagnostic/start` (or Calendly direct).
**Microcopy:** 14 days. $22,500 to $30,000 of trapped value surfaced or 3x your fee back.

### Section: What you get · width: content (1180)
**H2:** Five named artifacts. Fixed at engagement letter.

1. **Decision Register v1.** Structured catalog of every recurring cost over $5K per month, every active pricing decision, every growth-spend channel, every product-line commitment, traced back to the originating decision. 15 to 20 page PDF plus live spreadsheet.
2. **Trapped Value Report.** Specific, in-dollars, recovery-pathed opportunities surfaced from the Decision Register. The artifact the Tier 1 guarantee is measured against. 10 to 14 page PDF.
3. **Runway Truth Card.** Precise runway with driver decomposition and sensitivity. Base, Upside, Downside runway. 2-page PDF.
4. **Six Trap Scorecard.** Evidence-based diagnosis of which of the six decision traps are currently live in this business, across cost, pricing, and growth. 1-page card plus 4-page backing detail.
5. **Prioritized Action Register.** Top 5 next calls to defend first, ranked by impact and sequenced by effort. Includes at least one pricing move and one growth-motion move if either is live in the Scorecard. 2-page PDF.

### Section: Pricing and time · width: content (1180); 2-column block
**Left (Pricing card):**
- Under $3M ARR: **$7,500**
- $3M to $8M ARR: **$10,000**
- Fixed at engagement letter. No hourly billing.

**Right (CEO time card):**
- Total CEO time: **3 hours** (1h kickoff + 1h mid-point + 1h readout)
- Calendar duration: **14 days**

### Section: The guarantee · width: prose (760)
**H2:** Day 14 guarantee
By Day 14, one of:
1. At least 3x the Diagnostic fee in trapped value with CEO-accepted recovery plans, or
2. A strategic finding of equivalent materiality (pricing architecture change, product-line exit with board commitment, or capital-structure change that moves next-round valuation math) confirmed in writing by the CEO, or
3. 100% refund.

The 3x floor in dollar terms: **$22,500 of trapped value** under $3M ARR. **$30,000** from $3M to $8M ARR.

### Section: Day-by-day · width: content (1180); single-column ordered list
**H2:** What the 14 days look like
- **Day 0:** Engagement letter signed. Kickoff agenda, data request list, 14-day calendar delivered.
- **Day 3:** Kickoff complete. Data room set up. Week 1 interviews scheduled. Six Trap Interview booked.
- **Day 7:** Decision Register v1 (draft) for CEO review.
- **Day 14:** Diagnostic package delivered. 60-minute readout. Guarantee triggered. Resolution decision made.

### Section: Who this is for / Not a fit · width: content (1180); 2-column block
**Fits:** Venture-backed tech, $1M to $8M ARR, 18+ months since last raise, burn multiple above 3x. Founder making the hardest next-call decisions of their career without the infrastructure to defend them.

**Not a fit if:** Under $1M ARR. Raised in the last 6 months. Already in active turnaround. Bookkeeping so broken the work becomes archaeology. Bootstrapped, no board, no external capital.

### Section: Cross-tier nav
**Body:** Most CEOs who run the Diagnostic move into the 90-Day Decision Resolution. Some take the artifacts and execute internally. Both are clean exits.
**Link:** Next: 90-Day Decision Resolution → `/tiers/resolution/`

### Final CTA · section background: ink (dark); width: hero (920)
**H2 (white):** Start the Diagnostic.
**Body:** Engagement letter to readout in 14 days. Three hours of your time. $22,500 to $30,000 of trapped value surfaced or your fee back.
**Primary:** `Book the kickoff` → Calendly.
**Microcopy:** 30 min fit call first. We confirm scope and book the 14-day window if it's a go.

### Meta
- Title: Decision Diagnostic · 14 days · $22,500 to $30,000 of trapped value
- Description: 14-day Diagnostic. $22,500 to $30,000 of trapped value surfaced or 3x your fee back. Five named deliverables, fixed scope, fixed price.

---

## /tiers/resolution/ — TIER 2 PAGE

### Hero · width: hero (920); H1 hero; lede 760
**Eyebrow:** TIER 2 · INSTALL
**H1 (navy):** 90-Day Decision Resolution
**Sub (orange or accent):** Installs the rhythm that defends every next call, and proves it in market across 90 days.
**Lede paragraph (760):** A 90-day engagement that installs the decision rhythm and the Financial Rhythms™ operating system inside the finance function. By Day 90 the CEO walks out with a board-ready package, a raise narrative defensible line by line, and the discipline to defend every next material call with math.
**Hero CTA:** `Install the rhythm` → `/tiers/resolution/start` or Calendly.
**Microcopy:** 90 days. Decision rhythm in market. Or full refund.

### Section: What "rhythm installed" means · width: prose (760)
**H2:** Three things have to be true on the Day 90 readout.

1. **Five material decisions defended forward with math.** Each with a Three-Path Model, a Six Trap stack naming the patterns that quietly held capital in place, the path forward, and a CEO-accepted recommendation on file.
2. **Two of those five live in market, with the data to score them.** Not modeled. Live. A pricing change with at least one cycle of data, a product-line restructure booked, a cost or headcount change implemented with documented impact, or a growth experiment running with named go and no-go triggers.
3. **A scenario forecast with a named path to profitability.** 18-month base, upside, downside. Weekly actuals-vs-prediction reconciliation running.

If all three are not true by Day 90, the rhythm is not installed. That is the test the guarantee measures against.

### Section: Ten new artifacts · width: content (1180); 2-column grid
**H2:** Ten artifacts on top of the Diagnostic five.
List the 10 Resolution artifacts (6 Unit Economics Dashboard through 13 Final Readout + Decision Playbook, plus 9a Pricing Architecture Revisit and 9b Growth Experiment Register). Use Blueprint v1.9 Part 3 verbatim, condensed to one or two sentences each.

### Section: Pricing and time · width: content (1180); 2-column block
**Left (Pricing card):**
- **$22,500 to $30,000 total** ($7,500 to $10,000 per month)
- Founding Cohort: **$18,000 flat** for the first three signed (closes at three or June 30, 2026).
- Includes the Diagnostic fee credit if engagement letter is signed within 7 days of the Day 14 readout.

**Right (CEO time card):**
- Total CEO time: **15 to 18 hours** across 90 days
- Calendar duration: **90 days**

### Section: The guarantee · width: prose (760)
**H2:** Day 90 guarantee
By Day 90, one of:
1. The rhythm installed and in market (the three tests above), or
2. A strategic finding of equivalent materiality confirmed in writing by the CEO, or
3. Full refund of all fees paid to date. Not stop-work. CEO keeps every artifact produced.

### Section: Day-by-day · width: content (1180); single-column ordered list
**H2:** What the 90 days look like
- Day 14, Diagnostic package delivered.
- Day 21, Resolution kickoff. Pricing Architecture Revisit scope confirmed; Growth Experiment Register draft reviewed. Founding Cohort eligibility determined.
- Day 30, Unit Economics live. Monthly refresh cycle installed. Product Line P&L draft.
- Day 45, Mid-Resolution milestone. Forward Capital Register delivered. Pricing hypotheses confirmed with CEO.
- Day 60, Rhythm running. Pricing changes live with measurement; 2+ growth experiments running; Three-Path Models on top 5 to 10 decisions; Scenario Forecast delivered.
- Day 75, Board Package drafted. Bridge / Pivot / Raise Model if applicable.
- Day 90, Final Readout. All 15 artifacts delivered. Decision Playbook handed off. Day-90 rhythm-installed test evaluated. Partnership transition or clean exit.
- Day 150, Realization check. 30-minute standing call. No additional fee.

### Section: Founding Cohort · `#cohort` · width: content (1180); section background: navy + orange
**H2 (white):** Founding Cohort · First Three Resolutions
Body verbatim from Two-Pager v3.5 Founding Cohort block. Founding pricing ($18,000 flat), published mechanism (case-study rights at engagement letter signing), eligibility filter (Day 21 in-market test), sunset (three signed or June 30, 2026).
**CTA (dark):** `Claim a Founding Cohort spot` → `/tiers/resolution/cohort-apply` or Calendly.
**Microcopy:** Three spots. Closes at three signed or June 30, 2026.

### Section: Who this is for / Not a fit · width: content (1180); 2-column block
Same fits / not-a-fit content as the Diagnostic page.

### Section: Cross-tier nav
**Body:** The Resolution typically transitions into the Decision Partnership at Day 90, where the rhythm runs on retainer. Some CEOs take the rhythm and run it internally. Both are clean exits.
**Link:** Next: Decision Partnership → `/tiers/partnership/`

### Final CTA · section background: ink (dark); width: hero (920)
**H2 (white):** Install the rhythm.
**Body:** 90 days. Decision rhythm installed and in market by Day 90, or full refund of every fee paid. CEO keeps every artifact. Not stop-work.
**Primary:** `Book the kickoff` → Calendly.
**Microcopy:** 30 min fit call first. We confirm scope, book the Diagnostic, and the Resolution starts at Day 21.

### Meta
- Title: 90-Day Decision Resolution · Rhythm installed in market
- Description: 90-day engagement. Decision rhythm in market by Day 90, or full refund. $22,500 to $30,000 total. Founding Cohort $18,000 flat.

---

## /tiers/partnership/ — TIER 3 PAGE

### Hero · width: hero (920); H1 hero; lede 760
**Eyebrow:** TIER 3 · RUN
**H1 (navy):** Decision Partnership
**Sub (orange or accent):** Runs the rhythm on retainer.
**Lede paragraph (760):** Ongoing operation of the decision rhythm built in Tier 2. Monthly cadence. Quarterly rebuild. Pricing and growth experiments running inside a defined envelope. Ad-hoc modeling on new material decisions as they emerge.
**Hero CTA:** `Run on retainer` → Calendly. (Note: only available after a completed Resolution.)
**Microcopy:** Embedded discipline for post-stall companies. Monthly retainer plus success fee.

### Section: What you get · width: content (1180); 4-column grid
**H2:** Four recurring artifacts plus on-demand modeling.
1. **Monthly Decision Dashboard.** Rolling view of all registers, the Scorecard, the Scenario Forecast, open decisions awaiting next call, active experiments. Live sheet plus 1-page monthly summary on the 10th of each month.
2. **Decision Journal.** Log of every major decision, captured at the time it is made. Rationale, confidence level, expected outcome. Reviewed quarterly against actuals.
3. **Quarterly Strategic Review + Realized Value Certification.** Full model rebuild from current economics. Trap Scorecard refresh. Forecast reset. Next-quarter decision prioritization. Realized Value certified per Appendix E methodology.
4. **Validated Learning Log.** Rolling log of hypothesis, test, outcome, decision. Every experiment, every repricing move, every Three-Path recommendation generates entries.

Plus on-demand modeling on new material decisions as they emerge inside a specified monthly envelope.

### Section: Pricing and structure · width: content (1180); 2-column block
**Left (Pricing card):**
- **$7,500 per month base** plus 5% success fee on confirmed Realized Value (measured quarterly at the QSR).
- Minimum term: 6 months from Tier 2 completion. Month-to-month after. 30-day exit notice either direction.
- Trailing success-fee obligation: 12 months past exit, on any recovery plan or experiment actioned within that window.

**Right (Worked magnitude card):**
A Tier 2 engagement that produces $600,000 of Realized Value across year one (one well-executed pricing change plus one capacity reallocation plus one product-line restructure) generates a $30,000 success fee on top of $90,000 base ($7,500 × 12). Total first-year partnership lands at $120,000 against $600,000 of certified value. The buyer keeps 4x. A stronger year of $1,200,000 in Realized Value generates a $60,000 success fee, total $150,000 against $1,200,000 of value, the buyer keeps 7x. If Realized Value is zero, the success fee is zero and the partnership runs at base.

### Section: Realized Value methodology · width: prose (760)
**H2:** What counts as Realized Value
Three categories (per Blueprint v1.9 Appendix E):
1. **In-market price or volume changes** with measurement.
2. **Capacity reallocation** booked to a measurable downstream metric.
3. **Capital structure or product-line changes** with documented economic delta.

CEO signs the Certification each quarter. Disputed entries are removed before invoicing. Trailing four-quarter attribution.

### Section: Expansion ramp · width: prose (760)
**H2:** When a new decision cluster emerges
A new material decision cluster (pivot, second raise, acquisition inbound) upgrades to a scoped mini-Resolution (30 or 60-day, fixed scope, change-order price). Not absorbed into the retainer. The retainer protects the rhythm; the mini-Resolution does the focused work.

### Section: Who this is for / Not a fit · width: content (1180); 2-column block
**Fits:** Decisive Finance clients who completed a Tier 2 Resolution and want the rhythm to keep running. Companies where the founder wants the discipline to compound quarter over quarter without rebuilding the apparatus each time.

**Not a fit if:** Has not run Tier 2 yet (the rhythm has to be installed before it can run on retainer). Wants ad-hoc CFO advisory without the methodology cadence (not what the Partnership is for).

### Final CTA · section background: ink (dark); width: hero (920)
**H2 (white):** Run the rhythm on retainer.
**Body:** Ongoing decision rhythm. Quarterly Realized Value certification. The discipline that compounds.
**Primary:** `Talk through the transition` → Calendly.
**Microcopy:** 30 min with Russ. We confirm whether your Resolution is ready to transition into the Partnership, and what the first quarter looks like.

### Meta
- Title: Decision Partnership · Run the rhythm on retainer
- Description: Ongoing decision rhythm on retainer. $7,500/mo base plus 5% on Realized Value. Quarterly certification. Available after Tier 2 Resolution.

---

## DELTAS FROM EXISTING TIER PAGES (if any)

Existing tier pages on the live site (if present) likely carry retired Tier names ("Recovery Engine," "Fractional CFO") and retired voice ("underwrites forward capital," "forward decision engine"). Full sweep:

- Tier 1: "Recovery Engine" → "Decision Diagnostic"; "Underwrites your forward capital" → "Names what your current capital is doing"; "$22,500 to $50,000" → "$22,500 to $30,000"; "trapped capital" / "forward-reallocation potential" → "trapped value"; "dollarized" → "in dollars"; "capture paths" → "recovery plans".
- Tier 2: "Forward decision engine" → "rhythm that defends every next call"; "in market with measurement" → "live in market with the data to score them"; "operating infrastructure" → "monthly cadence" or delete; "engine installed" → "rhythm installed".
- Tier 3: "Fractional CFO" → "Decision Partnership"; tier name everywhere on the site, in nav, in tier cards, in footer link list.

---

*End of Tier Pages v2 source. Pair with `CLAUDE_CODE_HANDOFF-tier-pages-v2.md` for the mechanical execution doc, or fold into the master handoff at session close.*

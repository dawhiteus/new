# MarketTide — Design Brief

**For:** Claude Design
**From:** David White
**Stage:** Pre-visual-design — Build Spec v1 and Product Brief v1.0 are locked; data feasibility has been validated against production Pulse data
**Companion docs (attached separately):** MarketTide Product Brief v1.0, MarketTide Build Spec v1, MarketTide Implementation Architecture & Data Flow
**Design system:** [LiquidSpace Operations Layer v3.0](https://dawhiteus.github.io/lsoperationsstyleguide/ls-design-system-v3.html) — the live component library already running License Administration, Transaction Manager, and Workplace Strategy. MarketTide is a new page family inside this same system, not a new visual language. Section 5 below maps MarketTide's specific needs onto it directly.
**Also attached separately, for context:** other relevant LiquidSpace product designs (Workplace Strategist, Hub Locator, Portfolio Compiler) — MarketTide should feel like a sibling of these

---

## 1. What we're designing, and why now

MarketTide is a partner-facing dashboard that answers four questions for every venue operator on LiquidSpace: **when** to add inventory, **where** to add it, **what** it should include, and **how** to price it. It's the supply-side counterpart to Hub Locator and Portfolio Compiler, which serve the demand side.

The methodology is validated — the underlying scoring logic has been run against live production data and reproduces the cited figures almost exactly (e.g., the How module's cohort-coverage math came back within 0.1 percentage points of the modeled figure). What doesn't exist yet is the visual and interaction design. That's this brief.

---

## 2. Who this is for

**Primary user:** whoever owns marketplace performance for the operator — often the founder/CEO at small operators, a head of revenue or growth at mid-size, a portfolio/commercial lead at large ones. Commercially literate, time-poor, will not tolerate a dashboard that requires interpretation. **Every module must lead with a plain-language assertion, depth on click, not on entry.**

**Secondary users:**
- Partner expansion/real-estate lead (owns When + Where, may never touch Venue Manager)
- Partner pricing/revenue manager (owns How)
- LiquidSpace partner team, internal (needs the same dashboard partners see, plus internal-only annotations, for account conversations)
- LiquidSpace executives (portfolio-level view across all partners)

**Tiered access** shapes what a given partner sees, not just what they can do:

| Stage | Access |
|---|---|
| Strategic / Established | Full — all four modules, all alerts |
| New (<5 venues, <6mo) | Where + When only; What + How locked behind "request access" |
| Prospect (no launched venue) | Demo view with example data — read-only, no partner-specific diagnostic |
| At-Risk | Full access — this is explicitly a retention instrument, most needed when the relationship is weakest |

---

## 3. The four modules, one line each

| Module | v1 status | Question | Grain |
|---|---|---|---|
| **What** | Live | What should this location list? | Venue |
| **How** | Live | Where does my rate sit vs. the market, and what should I change? | Workspace |
| **Where** | Live, reduced scope | Which markets have unmet demand? | Metro / submarket |
| **When** | Live | Is the timing right to add inventory here? | Metro |

Design decision already made and locked: **these render as four independent panels, not one composite score.** A partner can be strong on Where and weak on How, and the dashboard should say that plainly rather than average it away. Do not propose a single "MarketTide Score."

---

## 4. The hardest design problem: suppression and thin coverage are the normal case, not an error

This is the thing that will make or break whether v1 reads as credible, so it's worth over-explaining to design.

MarketTide reasons over peer data the partner doesn't own. Before any peer-derived number renders, it has to clear two tests: at least 5 distinct venues in the comparison, and no single venue accounting for more than half the cohort's weight. **Both are required** — a market can have 8 venues (clearing the first test) while one operator holds 93% of the bookings (failing the second). That's not a hypothetical: it's a real market in the network today, and the dashboard will suppress it.

The practical consequence, also confirmed against real partner portfolios: **roughly half of a partner's priced listings in the Pricing Workspace Table will have no renderable benchmark.** For some partner profiles (national, suburban-weighted) it's closer to two-thirds. This is not a loading state, not an error state, and not a small minority edge case — it is close to half the rows, every time, for every partner, indefinitely.

**Design implication:** a suppressed row needs a resting visual state that reads as *considered and declined*, not *broken* or *still loading*. An empty badge, a dash, or a greyed-out row that looks like missing data will read as a defect. The framing the product wants: *MarketTide declines to show this number because showing it would expose an individual operator — the same protection extended to you.* That's a trust feature, and design should treat it as one worth designing well, not minimizing.

There's a second, gentler version of this: a value can also resolve at a coarser grain than requested (submarket suppressed, metro renders instead). That's normal operation, not degradation — pricing percentiles will often land at state level rather than city level — but the partner must always be able to see which grain they're looking at.

---

## 5. Structural decisions already locked (treat as constraints, not open questions)

- **Four-panel module bar**, no composite score (§3 above).
- **Two entry points, one product.** What and How are listing-level and belong at the point of action — embedded in or adjacent to Venue Manager's listing rows, where the rate actually gets edited. Where and When are market-level, describe markets the partner may not operate in yet, and belong in the standalone MarketTide dashboard. The standalone dashboard's retention value depends on Where/When/alerts being worth a visit on their own — if the highest-frequency value (pricing) migrates entirely into Venue Manager, design needs to make sure the standalone surface still earns visits.
- **RAG cutoffs map directly onto existing semantic tokens** — Green ≥70 → `--success` (#28a745), Amber 40–69 → `--warning` (#ffa500), Red <40 → `--danger` (#dc3545). Reuse these, don't invent a parallel color system. One caveat design needs to carry forward, not rediscover: the v3 system's own accessibility audit already flags that white text on `--warning` fails WCAG AA (2.1:1) — whatever text sits on an Amber module score or badge needs the same fix already recommended there (dark text, or a darker orange background), not a fresh instance of the same bug.
- **Internal-mode fields need a distinct visual treatment**, per the Product Brief, so an internal user can never mistake an internal-only annotation for something the partner also sees — but the specific accent named in the Brief ("Sunglow") isn't a token in v3. See §6 for the resolution options.
- **Peer entities are never named or pinned individually**, anywhere, in any mode, in any export — including on maps (anonymized dots only) and cohort histograms (binned, minimum 5 venues per bin).

---

## 6. Design system alignment — what to reuse vs. what's genuinely new

Most of MarketTide is assemblable from existing v3 components. A few pieces have no precedent in the system yet and are worth calling out now rather than discovering mid-design.

**Reuse directly, no new component needed:**
- **Module Bar → Stat Cards.** The existing "4-up with trend indicator" Stat Card is almost exactly the Module Bar spec (label, big number, trend/status line). Adapt the trend indicator slot to carry the RAG dot + one-sentence assertion headline instead of a percent-change figure.
- **Pricing/Product Mix tables → Data Table.** Selection, toolbar, sorted columns, pagination, row-click-opens-modal — all directly reusable. The one new thing is the suppressed-cell state (below).
- **Percentile explanations → existing tooltip pattern.** The v3 library's own example tooltip copy is, almost verbatim, a How-module explanation: *"Shows how this license's monthly rate compares to current market benchmarks for similar spaces in the same city."* Reuse this exact tooltip component and voice for How's percentile call-outs.
- **Per-market/per-venue detail → Full Modal, tabbed.** Summary tab as default, consistent with the existing modal tab anatomy.
- **Icons already in the confirmed Lucide inventory** cover all four modules without a new icon request: `trending-up` (When), `map-pinned` (Where), `layers` or `grid` (What), `bar-chart` / `dollar-sign` (How), `zap` (any AI-assist entry point, consistent with the LiquidAI convention below).
- **Page anatomy.** Every existing ops page follows Header → Stat Cards (optional) → Filter Bar → Data Table → Pagination. The standalone MarketTide dashboard should follow the same order rather than inventing a new page shell — Module Bar simply occupies the Stat Card slot.
- **Voice.** The existing writing guidelines (Direct, Precise, Calm, Professional — never Casual, Technical, Alarming, or Apologetic) and the error-message formula (*what happened + why, if helpful + what to do*) apply directly to suppression copy. A suppressed cell should read like *"Not enough comparable venues here to show a benchmark safely. Check back as more venues launch nearby,"* not an apology and not an alarm.

**Genuinely new — no existing pattern covers these:**
- **A fourth empty-state branch.** The v3 decision tree only has three: *No data yet* (CTA to create), *No results* (CTA to clear filters), *Error* (CTA to retry). Suppression is none of these — there's nothing to create, no filter to clear, and nothing is broken. This needs a fourth branch in the same family (calm, systemic, matches the "No results" tone most closely) rather than being forced into an existing one. Recommend the design deliverable explicitly extend this decision tree rather than leave it implicit.
- **A suppressed-cell state inside Data Table.** The existing table only has row-level status (badges on populated rows). MarketTide needs a *cell-level* state where the metric itself is intentionally blank on an otherwise-normal row — this is new and should get its own row in the interaction-states spec, not be treated as a variant of "loading" or "error."
- **The internal-mode accent.** "Sunglow" isn't in the v3 palette. Two paths: (a) add it as a new token, which is a real design-system decision, not just a MarketTide one, since v3 is shared across License Administration and Transaction Manager too — or (b) reuse **Teal (`#00b8c4`)**, already labeled "accent" in the existing system and not otherwise claimed by any status meaning MarketTide needs. Recommend (b) unless there's a brand reason Sunglow specifically matters, since it ships faster and doesn't require a cross-product token change.

---

## 7. Surfaces to design

Ten atoms, from the Product Brief's UI spec. Each needs: default/loading/error/empty, plus the module-specific states noted.

| # | Surface | One-line brief | States beyond standard four |
|---|---|---|---|
| 1 | **Module bar** | Persistent 4-panel header — score, RAG, one-sentence headline per module | Stale (>7d), Alert (pulse) |
| 2 | **Market ranking view** | Sortable table combining When + Where scores across markets, for expansion planning | Empty (partner has <3 markets), Filtered |
| 3 | **Per-market deep-dive** | Single metro: When + Where breakdown, demand signature chart, anonymized peer-density indicator, map | Insufficient peer data (rolls up), Cross-platform highlighted |
| 4 | **Product mix recommender** | Per-venue: current mix vs. peer norms, gap callouts, ranked add/rebalance recommendations | Pre-launch, Insufficient peer data, Recently changed |
| 5 | **Pricing workspace table** | Per-venue: every workspace, percentile position, pricing band, suggested rate, revenue lift band — **the surface where the ~50%-suppressed reality lives** | Insufficient peer data (this is the common case, not the exception — design the resting state first), Recently repriced |
| 6 | **Recommendations queue** | Cross-module action plan — Quick Wins / Growth / Strategic columns | Empty quadrant, Acted, Stale |
| 7 | **Alert center** | Reverse-chron material-change feed, the justification for "always-on" | Unread badge, All-quiet (reassurance state, not a null state) |
| 8 | **Internal-mode toggle** | Partner-team-only switch; changes chrome, reveals dollar figures and relationship annotations | Hidden (non-internal users never see the toggle exists) |
| 9 | **Partner snapshot export** | On-demand Word/PDF — cover, exec summary, per-module page, methodology footnote | Generating, Ready, Failed/queued (>5min) |
| 10 | **Cross-portfolio index** | Internal-only, executive-read, multi-partner sortable view | Access-gated |

---

## 8. State catalog and treatment principles

Beyond the standard four (empty / loading / error / populated), every module needs:

| State | Trigger | Treatment principle |
|---|---|---|
| **Rolled up** | Value returned at a coarser grain | Show the number, label the grain explicitly. Not an error, not a warning. |
| **Suppressed — thin** | Cohort <5 venues | Explain in one line why: too few comparable operators to show without risking identifying one. |
| **Suppressed — concentrated** | Cohort passes count but fails concentration | Same tone as above. Never hint at which operator or how many — no "one large operator dominates," just the generic reason. |
| **Accumulating** | Not enough history yet | Name the expected availability window if known ("check back in ~2 months") rather than a bare "no data." |

Across all four: same visual family as "populated," not the same visual family as "error." A partner should be able to tell at a glance whether MarketTide is being careful versus broken.

---

## 9. Content and voice

- Lead every module and every recommendation card with a plain-language assertion ("Your Embarcadero pricing is at P30 across day-office product; market median is P50"), decomposition available on click.
- Impact is always a **band** (low/moderate/high) in partner-facing views, never a dollar figure, except the one specific exception: suggested rate at P50 is the only literal dollar value the How module ever shows a partner.
- Peer-launch and concentration language stays qualitative even where the underlying number is known internally — "a new peer venue has launched in your Austin submarket," never a name, never a count in a thin market.

---

## 10. Data realities to design around (confirmed against production data, not modeled)

- Utilization is **own-venue only, always** — it will never appear in any cross-partner or peer view, at any cohort size. Design should not build an interaction pattern that implies "see how your utilization compares" anywhere, because that comparison will never exist in this product.
- Utilization also isn't fully trustworthy yet as a raw percentage — expect it to ship, if at all in v1, as a banded/qualified read rather than a bare number. Don't design a precise gauge or sparkline for it until confidence tiers are confirmed.
- Enterprise-account density (a Where sub-signal) is under-powered today and may ship dark or partially gated in v1. Design the Where module so it degrades gracefully with 3 sub-signals instead of 4, not so it looks incomplete.
- The suppressed-row rate on the Pricing Workspace Table varies a lot by partner shape — a metro-concentrated single-region partner might see ~90% of rows render, while a national suburban-weighted partner sees ~37%. Design one pattern that works from "occasional gaps" to "roughly half the table," not two different patterns for two different partner shapes.

---

## 11. Open questions for design to help resolve

- What does the embedded How/What treatment look like inside Venue Manager listing rows — a badge, an inline strip, a side panel? This needs to work for the ~half of rows with nothing to show without reading as a broken feature.
- What's the visual grammar for "suppressed but for a good reason" vs. "rolled up to a coarser grain" — close enough to feel like one family, distinct enough to not be confused with each other?
- How does the anonymized peer map (dots, no names, no pins) stay informative enough to be useful for a market deep-dive without reading as vague?
- What does "all-quiet" in the Alert Center feel like as a positive state rather than an empty one?
- **Sunglow vs. reusing Teal for internal-mode fields** (§6) — this is a real decision, not just a MarketTide styling choice, since it touches a shared token set. Worth a quick call before comps go further.
- **Naming and exact spec for the fourth empty-state branch** (§6) — "Suppressed" as a category needs to sit alongside "No data yet / No results / Error" in whatever the team's canonical empty-state reference becomes, or it'll drift.

---

## 12. What we need from this pass

Visual direction and key-screen comps for the four highest-priority surfaces: Module Bar (#1), Pricing Workspace Table (#5) — with the suppressed-state treatment as the primary design problem to solve, not an afterthought — Per-Market Deep-Dive (#3), and Recommendations Queue (#6). The remaining six surfaces can follow the visual system established by these four.

LIQUIDSPACE  |  PARTNER LAYER

# MarketTide
## Implementation Architecture & Data Flow

System architecture, data authority, partner isolation, persistence, analytical engines, product handoffs, and operational seams.

---

**STATUS** Pre-build — architecture derived from Build Spec v1 + Product Brief v1.0, validated against live Pulse connector
**WORKING DATE** August 2026
**SCOPE** MarketTide (Partner Layer) + Pulse/Core + Venue Manager + Marketplace + Hub Locator + Portfolio Compiler
**AUDIENCE** Product, Engineering, QA, GTM and future maintainers
**MODEL** Structured after the hardened Workplace Strategist Architecture & Data Flow doc (Aug 2026) — same three-layer separation, adapted for a supply-side, partner-facing audience.

---

## 1. Executive Architecture

The architecture separates three kinds of truth, exactly as Workplace Strategist does on the demand side: **authoritative network facts** (owned by Pulse), **MarketTide-owned state** (recommendation lifecycle, user preferences, snapshots), and **derived analytical outputs** (the four module diagnostics, always passed through the suppression layer before they exist as a payload). MarketTide does not collapse these into one database, and — unlike Strategist — one of these layers (peer-derived diagnostics) is not owned by the party viewing it. That asymmetry is the central architectural fact of this product and is why §6 (Suppression Layer) is load-bearing rather than a UI guardrail.

### 1.1 System responsibilities

| Layer | Owner | Responsibility |
|---|---|---|
| Pulse production pipeline | Jim | Warehouse, refresh cadence, SLA, join-key hygiene |
| Demand history store | Jim | Persisted lead, request, search, reservation history |
| Smoothing / interpolation model | Jim (David architects) | Spatial/hierarchical pooling for thin markets |
| Suppression layer | Jim, enforced server-side | The value never leaves the service if it fails suppression |
| Module reasoning services (When/Where/What/How) | Jim | Six endpoints per Brief §9 |
| Product surface (dashboard, Venue Manager embed) | David | UI atoms, exports, alerting UX, auth |
| Venue Manager | David | Listing administration — shares ownership boundary with MarketTide (§5) |

The rule that governs every seam below: **the product surface must never receive a value that fails suppression.** Not a flagged value — an absent one. A surface that holds a number will eventually leak it through an export, tooltip, cache, or API response.

---

## 2. Data Authority & Effective Coverage

MarketTide should not ask partners to recreate facts LiquidSpace already knows, and it should not let a partner's supplied assumption silently overwrite a Pulse-derived fact.

### 2.1 Authoritative network facts (Pulse)

Confirmed live against the Pulse connector — every table below exists today with the fields the module scoring logic in Brief §6 depends on:

| Source | Confirmed volume (live, Aug 2026) | Used by |
|---|---|---|
| `Venues.parquet` | 4,782 US launched venues | When (peer launch), Where (density, whitespace), What (venue filter), How (venue scope) |
| `Workspaces.parquet` | 52,727 US public workspaces; rate fields (`HourRate`/`DayRate`/`MonthRate`) stored as **VARCHAR**, require `TRY_CAST` at every query, not just at ingestion | What (mix, capacity, density), How (rate cohort) |
| `HourlyDailyReservations.parquet` | Booking history to Jan 2019; `EnterpriseAccount` tagged | When (reservation velocity), How (booking-velocity weighting) |
| `MonthlyInteractionLeads.parquet` | 162,037 rows, 55,068 distinct requesters, Jan 2020–present; `PricePerMonth` populated on 136,123 rows | Where (demand-supply gap), How (dedicated price evidence) |
| `HourlyRequests.parquet` | 39,608 rows, Dec 2022–present | When (demand velocity) |
| `EnterpriseSearches.parquet` | **Only ~3 months of history live today** (confirmed: earliest row May 11, 2026) — see §13.2 | Where (enterprise density — currently gated) |
| `RevenueRecognitionDedicated.parquet` | ~1,100–1,400 distinct dedicated deals over trailing 24mo depending on filter (see §13.5) | What (on-demand/dedicated balance) |
| `EnterpriseMembers.parquet` | 161 distinct enterprise accounts, 150K member rows, ~36K with geocoded `HomebaseAddress` | Candidate substitute signal for enterprise presence — see §13.2 |

Pulse remains authoritative for all of the above. MarketTide re-reads it on every cache invalidation rather than freezing it into partner-facing state.

### 2.2 MarketTide-owned state

- Recommendation lifecycle (`open → acted | dismissed | expired`), including the rate snapshot captured at issuance for round-trip detection (§5.2).
- User preferences (markets of interest, target product mix, pricing posture, alert thresholds, excluded markets) — persisted per user, not per partner.
- Diagnostic snapshots, persisted nightly per partner per module, for temporal comparison and alert detection.
- Snapshot export history (12-month retention default).
- Internal-mode annotations (relationship stage, dollar-denominated opportunity sizing, account history) — never written to any partner-facing payload or export.

### 2.3 Calculation boundary

- Peer cohorts exclude the partner's own venues (`VenueGroupChain` match) before any percentile or aggregate is computed. Confirmed necessary and non-optional: naive construction was shown in Brief §4.2 to overstate a 38-venue partner's renderable listings by 19%.
- Own-venue utilization is scoped exclusively to the partner's own integrated inventory. It is never pooled across partners, never contributes to a peer cohort, and is not subject to the §6 rollup logic — there is no cohort size at which peer utilization becomes renderable in v1.
- Unknown/insufficient-peer-data is not converted to zero, average, or a coarser silent substitute. It renders as an explicit suppressed state (§6.2) naming the reason.

---

## 3. Partner Identity & Confidentiality Boundary

Partner identity is a hard security boundary, structurally identical in kind to Strategist's enterprise-context seam but stricter in effect: where Strategist scopes *which enterprise's own data* a request can touch, MarketTide additionally scopes *which peer aggregates a partner is even eligible to see the existence of*. Canonical MarketTide routes resolve the requesting partner through the shared auth seam; that partner ID scopes Pulse reads for peer-cohort construction and gates every Neon-equivalent (MarketTide-owned state) read/write. Internal-mode users get an additional resolved scope (their own permission tier) but never bypass the cohort tests themselves (Brief §6.3).

This boundary is enforced twice, deliberately redundantly:

1. **At the reasoning service** — a value that fails the two suppression tests (§6.1) is never serialized into the response payload.
2. **At the export pipeline** — exports regenerate server-side from the same suppressed payloads the dashboard receives; there is no export code path that re-queries for an unsuppressed value, and internal-mode fields are stripped before rendering regardless of toggle state at generation time.

---

## 4. MarketTide Diagnostic Engines

Four independent reasoning services, scoring-decoupled by design (Brief §9) — forcing them into shared scoring logic would create coupling later versions need to break.

### 4.1 When — market timing
Assembly: search velocity (currently gated, §13.2) + reservation velocity (`HourlyDailyReservations`, confirmed 2019+ history) + peer launch activity (`Venues.LaunchedDate` transitions) + seasonality decomposition. Composite 0–100, RAG at platform-standard cutoffs (Green ≥70 / Amber 40–69 / Red <40).

### 4.2 Where — market geography
Assembly: demand-supply gap (leads-per-listed-space, requires the join-key fix in §13.1 since `MonthlyInteractionLeads` carries no market field of its own) + enterprise density (gated, §13.2) + partner whitespace (no peer data required — renders anywhere supply exists) + cross-platform signal inherited from Hub Locator/Portfolio Compiler. Submarket → metro → state rollup on suppression (§13.3 — submarket grain does not exist in Pulse today and must be derived).

### 4.3 What — product mix
Venue-level: scenario coverage, capacity-tier coverage, on-demand/dedicated balance, listing density, each against a ≥5-venue peer cohort in the same submarket. Rolls up to a portfolio-level score by booking-weighted average.

### 4.4 How — pricing
Workspace-level: percentile position within a metro × scenario × capacity-tier peer cohort (≥5 venues). Confirmed live: **9.4% of cells clear the 5-venue minimum, holding 53.6% of listed inventory** — reproduced within 0.1pp of the Brief's cited figures by direct query against Pulse today (§13, validation summary). This is the strongest evidence in the whole spec that the methodology is not aspirational.

Utilization sub-feature (§4.2.1 of the Build Spec) is architecturally attached to How but sourced from a different boundary — see §13.4.

---

## 5. Venue Manager Handoff & Action Path

MarketTide and Venue Manager share an ownership boundary (David) the same way Strategist and Operations share cross-product handoffs. v1 is navigate-and-edit, not structured write-back.

### 5.1 Deep-link contract
A stable per-workspace URL from a How/What recommendation row into Venue Manager's rate-edit field, with identity resolution such that the partner arrives already authorized for that venue — no re-auth, no permission wall. This contract does not exist yet and is an open item (Build Spec §8) blocking the action-path requirement of §4.2.

### 5.2 Round-trip detection
The recommendation state machine's only path to `acted` is comparing `Workspaces.ModifiedDate` and current rate against the rate captured at recommendation issuance. This must be built in v1 even though nothing consumes the resulting revenue-attribution data downstream yet — it is the only mechanism that makes closed-loop attribution possible later, and it degrades to `expired` silently if not instrumented from day one.

---

## 6. Suppression Layer

This is MarketTide's equivalent of Strategist's fail-closed enterprise boundary, and it is the single piece of architecture the rest of the product cannot function safely without.

### 6.1 Two tests, both required
- **Count test:** cohort ≥5 distinct venues (≥5 distinct requesters for demand-derived values).
- **Concentration test:** no single contributor >50% of cohort weight.

Confirmed live and material: Chandler, AZ has 8 distinct venues booking over trailing 12 months (clears the count test) — but the top venue holds **92.8%** of bookings and the top two hold **95.7%** (Brief's cited reference: 93.1%/96.1% — reproduced within ~1pp against live data). A count-only gate would have disclosed one named operator's performance here. This is not a hypothetical edge case; it is a real, present-day row in the data.

### 6.2 Required states beyond the standard four
Rolled up (render with explicit grain label) · Suppressed–thin (`cohort_size`) · Suppressed–concentrated (`cohort_concentration`, never disclose which operator or how many) · Accumulating (`insufficient_history`, name the expected window). Roughly half of a partner's priced listings should be expected to land in a suppressed state on the Pricing Workspace Table (§4.2 of the Build Spec) — this is normal presentation, not a defect state, and the UI must be designed for it as a resting state rather than an empty-badge.

### 6.3 Thresholds are runtime configuration
Cohort minimum (5) and concentration ceiling (50%) must never be constants. The 50% ceiling is explicitly a proposed starting value pending calibration against more real cohorts (Build Spec §8) — Chandler's 92.8%/95.7% gives one real calibration point; more are needed before this hardens.

---

## 7. Cross-Product Handoffs & Closed Loop

| Sibling product | Data flow | v1 / v2 |
|---|---|---|
| Marketplace (Access Layer) | Bookings/listings → Pulse → MarketTide. MarketTide recommendations → Marketplace listing tools. | Read: full v1. Write: deep-link v1, structured payload v2. |
| Hub Locator (Strategy Layer) | Directional signal inherited into Where's `cross_platform_signal` sub-signal, no enterprise name exposed. | Inherited v1, bidirectional v2. |
| Portfolio Compiler (Strategy Layer) | Same pattern as Hub Locator. | Inherited v1, bidirectional v2. |
| Workplace Manager (Operations) | On-demand flex bookings → reservation velocity input. | Read: full v1. |
| Transaction Manager (Operations) | `RevenueRecognitionDedicated` → What's on-demand/dedicated balance signal. | Read: full v1. |
| License Administrator (Operations) | License-issuance volume → When's search-velocity calibration (aggregate-only). | Read: aggregate-only v1. |

---

## 8. Application, API & Persistence Seams

Six reasoning-service endpoints (Build Spec §9): `POST /markettide/{when,where,what,how,recommendations,alerts}`. All idempotent, all responses carry `generated-at` and `data-as-of` timestamps. Pulse's nightly refresh invalidates module caches; next request serves fresh diagnostics.

| Surface | Target latency | Bottleneck |
|---|---|---|
| Module bar load | <800ms p95 | Precomputed nightly aggregate table |
| Per-market deep-dive | <2s p95 | Lazy sub-signal breakdown |
| Pricing workspace table | <3s p95 | Workspace-level cohort construction |
| Snapshot export | <60s typical | Multi-page doc generation; >5min triggers async job |
| Alert delivery | <4hrs after upstream change | Nightly-refresh driven, not real-time |

This document describes the contracts that matter architecturally rather than enumerating every implementation file, consistent with the Strategist doc's own framing.

---

## 9. Current State vs Snapshot State

Diagnostic snapshots persist nightly per partner per module — this is what makes "how did our When score in Austin change quarter-over-quarter" answerable and is the basis of the alert-detection layer. Every diagnostic carries `methodology_version`; when sub-signal weights change (as they already have for v1's Where/When re-weighting, Build Spec §4), the version increments and historical snapshots retain their original version rather than being silently recomputed.

---

## 10. Operational Architecture & Failure Posture

- Suppression failure mode must be **fail-closed**: if the suppression check itself errors or times out, the field suppresses — it does not fall back to rendering the unsuppressed value. This is not stated explicitly in the Build Spec and should be made an explicit requirement before implementation, not an assumed default.
- Rate-field casting (`TRY_CAST(... AS DOUBLE)`) must happen at the pipeline layer per the spec's own instruction (§4.1, §6.4) — confirmed live that `HourRate`/`DayRate`/`MonthRate` are stored as VARCHAR today, so every downstream query that skips the cast will silently drop or miscompare rows rather than error.
- Join-key case normalization (§13.1) is the same class of silent failure: a naive join returns zero rows, not an error. Both should be normalized once at the pipeline layer, not defended against per-query.

---

## 11. Target Integration Direction

- Partner Layer becomes a first-class platform layer alongside Strategy/Operations/Access, matching the Brief's Departure 2.
- v2 structured write-back to Marketplace/Venue Manager replaces the v1 deep-link, once round-trip detection (§5.2) has proven the closed-loop model.
- Enterprise-density and utilization sub-signals promote automatically once their respective data dependencies clear (§13.2, §13.4) — thresholds are configuration precisely so this can happen without a release.
- One connected platform across strategy (Hub Locator, Portfolio Compiler), operations (Transaction Manager, License Administrator, Workplace Manager), and partner (MarketTide) — not one monolithic data model, mirroring Strategist §12's stated end-state.

---

## 12. Known Beta Architecture / Data Issues

Validated directly against the live Pulse connector (DuckDB over the production parquet warehouse), not estimated. Ranked by blocking severity.

### 12.1 Join-key case mismatch — blocking for Where
`Venues.ID` stores lowercase GUIDs; `MonthlyInteractionLeads.VenueId` stores uppercase; `HourlyDailyReservations.VenueId` stores lowercase. Confirmed live with sample rows from all three tables. `MonthlyInteractionLeads` has **no City/State field of its own** — every market-level lead rollup must go through this join, so this is a hard blocker for the Where module's demand-supply-gap sub-signal, not a data-quality nice-to-have. Must be normalized at the pipeline layer (Build Spec §5.5) before Where ships, and other cross-table keys should be audited for the same condition rather than assumed clean.

### 12.2 Enterprise density — genuinely blocked, with a workaround
`EnterpriseSearches` has only ~3 months of live history today (confirmed: earliest row May 11, 2026) and only 87 distinct accounts, of which the median searched market has one account as 100% of its signal. More months of *this table* raises the count-test pass rate slightly but does not fix concentration.

Workaround identified: `EnterpriseAccount` is tagged on several other Pulse tables with materially more history and a larger account universe than `EnterpriseSearches` — `HourlyDailyReservations` (130 distinct accounts, history to Jan 2019), `HourlyRequests` (96 accounts), `RevenueRecognitionDedicated` (48 accounts), and `EnterpriseMembers.parquet` (161 distinct accounts, a static roster with geocoded `HomebaseAddress` on ~36K members — independent of any click or booking behavior). Redefining the sub-signal as an OR across these sources rather than `EnterpriseSearches` alone raises the usable account universe from 87 toward 200+ (with overlap), which is the actual lever on the concentration test, not just the count test. Recommend Jim rerun the exact two-test pass-rate calculation against the blended set before promoting, and separately pursue whether the 3-month window on `EnterpriseSearches` is an export filter or a true retention limit (§5.4 of the Build Spec) — the other enterprise-tagged tables on the same account field keep years of history, which suggests the limit may be specific to this one export.

### 12.3 No submarket grain in Pulse
The §6 rollup contract (submarket → metro → state) assumes a submarket grain exists. It doesn't — Pulse exposes City/State/Zip/Lat/Long on `Venues` only. Submarket boundaries must be derived (zip clustering or lat/long radius), which is the "smoothing / interpolation model" the Build Spec already flags as owned-but-unsized (§2, §8). Confirmed still unsized; this should be scoped before Where's rollup logic is implemented, not discovered during it.

### 12.4 No availability/occupancy feed for own-venue utilization
No `Availability.parquet` or calendar-block table exists in the current warehouse export. Tested the obvious workaround — deriving utilization from confirmed bookings alone (`HourlyDailyReservations` booked-hours ÷ `Workspaces.OpenHoursPerWeek`) — and the result is not credible: median 1.4%, average 2.9% utilization across integrated venues, which understates real occupancy because it only sees bookings made through LiquidSpace, not a venue's direct-channel or walk-in usage. This is a different failure mode than "more data would fix it" — the missing signal (non-platform occupancy) is structurally invisible to any table LiquidSpace's own booking pipeline populates.

Recommended path: escalate to Jim narrowly — ask specifically whether the raw calendar/free-busy feed (which must exist somewhere upstream, since `Venues.Integration`/`IntegrationStatus` already prove Pulse talks to these calendar providers for live-availability display) can be exported, rather than asking generically for "utilization data." In the interim, do not ship a fabricated occupancy percentage; either scope the bookings-only proxy to venues where LiquidSpace is the primary booking channel (identifiable via `BookingMethod`/`ReservationMethod`), or relabel it as a three-tier booking-frequency read rather than an occupancy percentage. Per Build Spec §4.2.1, no utilization figure should ship without an explicit confidence indicator regardless of source.

### 12.5 Unreconciled reference figures — not data-existence gaps, but need methodology alignment with Jim
- Dedicated-deal count: Build Spec cites 941 deals nationally over 24 months; direct query returns 1,136 (US-scoped) to 1,436 (unscoped) distinct `ReservationId` values in `RevenueRecognitionDedicated` over the same window. Likely a `RevenueSourceType`/`BillingType` filter or different dedup grain used in the original figure — worth a five-minute sync, not a redesign.
- Where module's bookings-per-listed-space reference figures (Austin/San Francisco/Houston/Dallas): rank order reproduced exactly, but absolute values ran 1.8×–3.6× higher than cited. Likely a different "listed space" denominator (combined hourly+monthly vs. hourly-only) — same category of fix.

### 12.6 Everything else confirmed clean
Supply volume, freshness, integration coverage, and the How module's core cohort-coverage math (9.4% of cells / 53.6% of inventory) all reproduced within a fraction of a percentage point of the Build Spec's cited figures against live data. The methodology in Brief §6 is not aspirational — it has already been run successfully against this exact warehouse.

---

## 13. Architecture at a Glance

```
                    ┌─────────────────────────────────────────┐
                    │              Pulse (authoritative)        │
                    │  Venues · Workspaces · HourlyDailyRes.     │
                    │  MonthlyInteractionLeads · HourlyRequests  │
                    │  EnterpriseSearches · RevRecogDedicated    │
                    │  EnterpriseMembers · EnterpriseEngagement  │
                    └───────────────────┬─────────────────────┘
                                        │ nightly refresh
                                        ▼
              ┌─────────────────────────────────────────────────┐
              │        Module Reasoning Services (Jim)            │
              │   When · Where · What · How  (independent scoring)│
              └───────────────────┬─────────────────────────────┘
                                  ▼
              ┌─────────────────────────────────────────────────┐
              │      Suppression Layer (fail-closed, §6)           │
              │   count test + concentration test, both required  │
              │   value absent from payload if either test fails  │
              └───────────────────┬─────────────────────────────┘
                                  ▼
        ┌───────────────┬────────┴─────────┬───────────────────┐
        ▼               ▼                  ▼                   ▼
   Module Bar     Recommendations      Alert Center       Snapshot Export
   (dashboard)        Queue          (nightly detect)     (server-regenerated,
        │                                                  strips internal fields)
        ▼
  Venue Manager deep-link (§5) ──► rate edit ──► round-trip detection ──► acted
```

---

## Source Basis

This document is derived from *MarketTide SaaS — Build Spec v1* (Mark Gilbreath, August 2026) and *MarketTide Product Brief v1.0* (May 2026), structured after the section shape of the hardened *Workplace Strategist Architecture & Data Flow* document (August 2026). Data-existence and figure claims in §2.1, §4.4, §6.1, and §12 were independently verified by direct query against the live Pulse connector (DuckDB over the production parquet export) during this review, not taken on faith from either source document. Where the Build Spec's cited figures and the live query disagreed (§12.5), the live query is reported as the current ground truth and the discrepancy is flagged for reconciliation rather than silently resolved in either direction.

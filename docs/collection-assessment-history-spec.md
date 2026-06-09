# Collection Assessment History — Event Model Spec

**Domain:** Transaction Manager · Collections  
**Version:** 0.2  
**Status:** Canonical Draft

---

## Overview

The Assessment History log on the Collection tab is an ordered, append-only timeline of every event that has occurred on a collection — automated agent actions, requirement changes, and broker interventions. Events are displayed newest-first.

Each entry answers: *what happened, who or what caused it, when, and what changed.*

---

## Entry Schema

```typescript
interface HistoryEntry {
  type:   EventType;        // discriminator — drives icon and display logic
  title:  string;           // short headline displayed in bold
  time:   string;           // formatted timestamp, e.g. "Nov 9, 9:03 AM"
  desc:   string;           // one to two sentence description of the event
  delta:  Delta | null;     // tier movement badge — null when no tier shift occurred
}

interface Delta {
  label:     string;                       // e.g. "Strong 5→4 · Partial 5→6"
  direction: 'up' | 'down' | 'neutral';   // drives badge color and icon
}
```

---

## Event Types

### Automated — Agent Pipeline

| Type | Icon | Description |
|---|---|---|
| `sourced` | Search | Market Sourcing Agent completes initial collection build |
| `resourced` | RefreshCw | Market Sourcing Agent rebuilds collection — triggered by a location/market change |
| `initial_assessment` | Bot | Collection Assessment Agent scores collection for the first time |
| `reassessment` | Bot | Collection Assessment Agent re-scores after a trigger condition is met |
| `assessment_blocked` | AlertCircle | Assessment attempted but could not complete — missing data on scored dimensions |

### System — Requirement Changes

| Type | Icon | Description |
|---|---|---|
| `requirement_update` | Edit | A structured requirement field was edited — logs what changed and who changed it |

**Attribution:** The `desc` field names the specific field and actor (e.g. "Budget changed from $20,000/mo to $18,000/mo by Sarah Chen"). If the change triggers a follow-on automated event, that appears as the next entry immediately after.

### Human — Broker Actions

| Type | Icon | Description |
|---|---|---|
| `space_added` | Plus | Broker manually adds a space to the collection |
| `space_removed` | Minus | Broker removes one or more spaces from the collection |
| `collection_shared` | Share2 | Broker shares the collection with the client contact |
| `space_shortlisted` | Bookmark | Broker flags one or more spaces for client review |

---

## Icon Color

All event icons use a **single neutral style**: `bg #F0F0ED`, icon color `#4B5563`.

The sole exception is `assessment_blocked`, which uses red (`bg #FEE2E2`, icon `#991B1B`) to signal an error state that requires attention.

This keeps the timeline visually quiet — the icon glyph carries the meaning; color is reserved for errors only.

---

## Assessment Trigger Map

This is the complete list of conditions that produce a new event or a new assessment run.

### Triggers a `reassessment` (re-score same collection)

These requirement field changes affect scoring without changing which spaces are candidates:

| Field changed | Why reassessment fires |
|---|---|
| Budget | Budget dimension re-scored against new per-seat target |
| Headcount / team size | Capacity dimension re-scored against new ratio |
| Workspace type | Type dimension re-scored against updated Scenario mapping |
| Size (sq ft) | Capacity/size dimension re-scored |
| Term | Gap callout recalculated (term is not scored but surfaces in gaps) |

**Broker collection edits also trigger reassessment:**

| Action | Why reassessment fires |
|---|---|
| `space_added` | New space must be scored; tier counts recalculated |
| `space_removed` | Tier counts recalculated after removal |

The reassessment entry immediately follows the trigger entry in the timeline.

### Triggers `resourced` + `initial_assessment` (full collection rebuild)

These changes require new candidate spaces — the existing collection is replaced:

| Field changed | Why resourcing fires |
|---|---|
| Location / target area | Different geography → different candidate set entirely |
| Market / city | Different market → full new sourcing pass required |

After resourcing completes, the Collection Assessment Agent runs automatically, producing a new `initial_assessment` entry on the rebuilt collection.

### Triggers no automated follow-on

These fields are logged as `requirement_update` but do not fire an agent:

| Field | Reason |
|---|---|
| Requirement name / title | Display metadata only |
| Company name | Identity field, not a scoring input |
| Notes / description | Unstructured text, not scored |
| Assigned broker | Personnel, not a collection dimension |
| Status (Active / Archived) | Lifecycle state, not a scoring input |
| Expected close date | Timeline field, not scored |

### Periodic / staleness trigger (future)

Not yet implemented. Planned: if a collection has not been assessed in 30 days and the requirement is still active, queue an `assessment_scheduled` event and re-run scoring. Market rates shift; a collection that was Good can drift to Fair without any requirement change.

---

## Delta Badge

A delta badge appears on entries where the tier distribution shifted as a result of the event.

| Direction | Meaning | Badge style | Icon |
|---|---|---|---|
| `up` | Net positive — Strong count increased or No-match count decreased | Green bg `#E1F5EE`, text `#085041` | TrendingUp |
| `down` | Net negative — Strong count decreased or No-match count increased | Amber bg `#FAEEDA`, text `#633806` | TrendingDown |
| `neutral` | First run — no prior state to compare | Gray bg `#F0F0ED`, text `#666` | CheckCircle2 |

**Label format:** `"Strong {prev}→{curr} · Partial {prev}→{curr}"` — include only the tiers that changed. Omit No-match movement unless it is the primary story.

**Delta is null** for events that do not directly produce a tier recalculation: `requirement_update`, `space_added`, `space_removed`, `collection_shared`, `space_shortlisted`, `assessment_blocked`. The tier shift from a `space_added` or `space_removed` will appear on the immediately following `reassessment` entry.

---

## Tier Semantics (reference)

| Tier | Meaning |
|---|---|
| **Strong** | Space is in the right area with clear alignment to requirement metadata across scored dimensions |
| **Partial** | Space is in the right area with some alignment — requirement partially met on one or more dimensions |
| **No match** | Zero spaces in the collection viably satisfy this dimension — a coverage absence, not a quality gradient |

**Fitness signal derivation:**
- `Good` → `strong ≥ 1`
- `Fair` → `strong = 0` and `partial ≥ 1`
- `Poor` → `strong = 0` and `partial = 0`

---

## Scored Dimensions (4)

The Collection Assessment Agent scores each space on four dimensions. Term is tracked as a gap callout, not a scored dimension.

| Dimension | Field(s) used | Notes |
|---|---|---|
| Location proximity | `Venues.Latitude / Longitude` vs. requirement target | Haversine distance; all sourced spaces pass this in normal operation |
| Workspace type | `Workspaces.Scenario` vs. requirement `workspaceType` | Exact match → Strong, adjacent type → Partial |
| Capacity fit | `Workspaces.MaxCapacity` vs. requirement `headcount` | Ratio 0.8–1.3× → Strong; outside band → Partial |
| Budget alignment | `Workspaces.MonthRate / MaxCapacity` vs. `monthlyBudget / headcount` | Dual threshold: requirement fit + IQR-filtered market median |

**Term** — `Workspaces.MinimumTerm` evaluated but surfaces as a gap callout only (e.g. "No spaces support 24-month term"), not as a scored dimension.

---

## Example Timeline (all event types)

Newest → oldest, as displayed in the UI.

| Time | Type | Title | Delta |
|---|---|---|---|
| Nov 14, 11:30 AM | `space_shortlisted` | 3 spaces shortlisted for client review | — |
| Nov 13, 3:45 PM | `collection_shared` | Collection shared with client | — |
| Nov 12, 2:00 PM | `requirement_update` | Requirement updated · Location narrowed | — |
| Nov 12, 2:01 PM | `resourced` | Collection rebuilt | ↑ Strong 4→5 · Partial 6→4 |
| Nov 11, 10:20 AM | `space_removed` | 2 spaces removed | — |
| Nov 10, 9:45 AM | `space_added` | 1 space added | — |
| Nov 9, 9:02 AM | `requirement_update` | Requirement updated · Budget reduced | — |
| Nov 9, 9:03 AM | `reassessment` | Re-assessment complete | ↓ Strong 5→4 · Partial 5→6 |
| Oct 28, 10:18 AM | `initial_assessment` | Initial assessment complete | ◎ First run |
| Oct 27, 4:22 PM | `assessment_blocked` | Assessment incomplete · Missing data | — |
| Oct 26, 3:42 PM | `sourced` | Collection sourced | — |

---

## Display Rules

- **Ordering:** Newest first. Causal pairs (e.g. `requirement_update` → `reassessment`) kept in causal order within a timestamp cluster.
- **Dividers:** `#F0F0ED` border between entries.
- **Icon container:** 28×28px circle — neutral `#F0F0ED` bg / `#4B5563` icon for all events; red `#FEE2E2` bg / `#991B1B` icon for `assessment_blocked` only.
- **Title:** 13px, weight 500, `#1a1a1a`.
- **Desc:** 12px, `#6B7280`, line-height 1.5.
- **Timestamp:** 11px, `#9CA3AF`, right-aligned, `white-space: nowrap`.
- **Delta badge:** Inline-flex, 11px, weight 500, 2px gap, `px-2 py-0.5`, `border-radius: 4px`, below desc.

---

## Future Events (not yet modeled)

| Type | Trigger |
|---|---|
| `collection_closed` | Collection archived or deal stage advances past selection |
| `assessment_scheduled` | Periodic re-assessment queued after 30-day staleness threshold |
| `criteria_gap_resolved` | A previously No-match dimension gains coverage (e.g. new spaces listed in market) |
| `space_flagged` | Broker annotates a space with an internal note (distinct from shortlisting) |

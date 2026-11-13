# Assess Collection Agent
Transaction Manager | Design reference: states and copy | Nov 2026

Status: **Design reference for Figma, not the engineering spec.** Engineering spec: see `../`. Exact layout and copy here follow the prototype and may change. Prototype: `AssessCollectionModal.tsx`, `UpdateCollectionModal.tsx`, `AddSpaceModal.tsx`, logic in `data/assessmentAgent.ts`. Patterns: [agent-ui-patterns.md](../agent-ui-patterns.md). Index: [agents-overview.md](../agents-overview.md). Supersedes the tier-based event model in [collection-assessment-history-spec.md](../collection-assessment-history-spec.md) (v0.2, June).

## 1. Job
Answer one question for Sales: **is the candidate list good enough?** Report how many spaces in the Collection meet every criterion of the Requirement, why the rest do not, and what changed since the last run. The counts and gaps tell the story; people decide the next step (work the list, Update Collection, or an RFP to venues outside TM).

The agent does not choose among candidates, does not edit the Requirement, does not score, and does not recommend a next step.

## 2. Entry points
| Where | Action |
|---|---|
| Collection pill hover card (Requirements table) | **Assess**, beside **Add Space**; **Update Collection** when the requirement changed |
| Requirement row menu | **Assess Collection**, **Add Space**, **Update Collection**, View Collection, Remove collection |
| Requirement Details → Workflow tab | Under the Assess Collection task: count meeting every criterion and date last assessed, or "Not assessed yet", with **Assess Collection**. Under Create Collection: name, count, update date, **View Collection**, **Add Space**, and **Update Collection** when the requirement changed |

Every Requirement with a Collection has Assess. Not offered: on the "Collection populated" confirmation, or on the Requirement Overview (held back).

## 3. Inputs and outputs
**Inputs (read only):** the Requirement's location, search area, headcount, budget, workspace type; the Collection's spaces and their groups; per-space and per-venue facts from Pulse; the last assessment and the requirement values the Collection was built for.

**Outputs**
| Output | Where it lands |
|---|---|
| Status for the hover card: dot (Plenty / Few / None) and "N of M meet every criterion", "Empty collection" or "Not assessed" | Collection pill |
| Timeline "Collection Assessed" (first run, and any run where something changed) | Timeline tab |
| Timeline "Collection Updated" ("Collection updated: N added, N removed.") | Timeline tab |
| Timeline "Spaces Added" (Add Space), "Shortlist Updated" (group moves) | Timeline tab |
| Shortlisted count | Hover card |
| PDF report "{Collection} - Assessment - {date}.pdf" | Download |

## 4. Flow and states
### Assess modal
| # | State | What the user sees |
|---|---|---|
| A1 | Header | "Assess Collection"; subtitle "{Collection} · {Requirement} · {added by hand}"; agent pill **Collection Assessment Agent**; Share menu; close. |
| A2 | What it was built from | Ledger: **Requirement details** (stated values or "Not stated") and **Agent searched** (Distance, Seats, Price, Type with "Provided" / "Assumed" / "Derived" and why, e.g. Seats "from headcount"). Footer: "Collection built by Create Collection Agent · updated {date} · requirement unchanged since" (or "changed since"). |
| A3 | Scorecard | **Meet every criterion**: N of M spaces (green at 5+, red at 0), "Thin below 5 confirmed spaces". One cell per stated criterion: Distance "Within X mi", Seats "4-7 people", Price "Up to $X/mo", Type; each "n of M" with a bar. |
| A4 | The gap | Amber line naming the criterion most spaces miss: "Headcount is the gap. 6 of 8 spaces fall outside 4-7 people." (Price / Workspace type / Distance variants), plus "The workflow counts a collection as thin below 5 confirmed spaces. This one has N." when thin. |
| A5 | Stale listings | "N more spaces would meet every criterion, but their listings are over 90 days old." |
| A6 | Requirement changed | Amber: "**The requirement has changed since this collection was built:** budget $9,000/mo → $14,000/mo." with **Update Collection**. Stays until the Collection is updated; assessing does not clear it. |
| A7 | Since last run | Blue: "**Since last assessed on Nov 4:** budget … Matches 0 → 2." |
| A8 | Spaces table | Grouped **Shortlist**, **Favorites**, **Recommendations** (each header: how many meet every criterion; empty group "Drag spaces here"). One row per space: Meets (e.g. 2 of 3), Distance, Seats, Price / mo (with cost per person, "over market" when >15% above local rate), Type, Amenities (first three + "N more"), listing (Public/Private, age or quote date). Cells green when met, red tint and red text when missed. Row expands to venue facts and **Open Listing ↗**. |
| A9 | Footer | "Values in red don't meet the requirement. Drag a space to move it between Shortlist, Favorites and Recommendations." **Done**. |
| A10 | Share | **Copy Email** ("A summary and a link to this requirement, ready to paste and send") → "Email Copied". Copies: "Subject: {City} workspace options · {Company}", a greeting with the contact's first name, "We've reviewed N spaces in {City} against your requirement ({criteria}).", then either the matching spaces ("- Title, Venue: 1.8 mi, 24 seats, $13,200/mo") or, when none fit, a question about the main gap ("Most are sized outside 8–14 people. Is that range firm, or would a somewhat larger or smaller space work?"), then "You can see every space, with photos and details, here:" and a link that opens this assessment in TM. **Download PDF Report** ("This assessment, formatted to attach or print") → "Building Report…"; failure "Couldn't build the report. Try again." Hidden when there is nothing to assess. |

### Empty or unassessable Collection (replaces A3–A8 with "Why it's empty")
| # | Case | What the agent says |
|---|---|---|
| E1 | Empty, location known | Per criterion against nearby listings: "Area: 12 of 40 listings near {center} are within 5 miles." Workspace type, Capacity, Budget ("…The lowest is $X/mo."), then "Together: N of 40 meet all of them." |
| E2 | Location not found / missing | "I can't find “{loc}” as a location." / "The requirement has no location." with "use Edit requirement". |
| E3 | Budget set | Platform note: populate returns nothing when a budget is set, which can leave a Collection empty even when spaces exist. |
| E4 | Spaces not readable | "{Collection} has N spaces, but I can't read them, so I can't assess it." Status "Not assessed". |

### Update Collection (separate modal)
Agent bar "Collection Assessment Agent · {Requirement} · {Collection}". Changed-values line. "I'll search again with the current requirement and replace the Recommendations: N spaces meet every criterion, N would be added and N removed. The N spaces in your Shortlist and Favorites stay as they are." No location: "I can't search for spaces until the requirement has a location I can find." (button disabled). **Cancel**, **Update collection** → opens the assessment.

### Add Space (separate modal)
"Add a space to this requirement's collection". Field **Listing link**, **Add** ("Checking…"). No preview. Errors: "That isn't a LiquidSpace listing link. Copy the link from a space's page on liquidspace.com." / "That space is already in this collection." No location: "This requirement has no location I can find, so spaces can't be added here yet." A hand-added space starts in Shortlist and makes the last assessment out of date.

## 5. Rules
- **Fit:** within the search area, inside the headcount band (5 → 4-7), at or under budget, matching workspace type. Only criteria the Requirement states are checked.
- **Confirmed:** public listing updated within 90 days; private listing while its quote is valid (30 days if none given). Availability is never known and never inferred.
- **Status:** Plenty = 5+ confirmed fits; Few = 1–4; None = 0 (gray dot also for Empty and Not assessed).
- **Search area:** if none is given, city center and 5 miles ("Assumed"). Stored as text in Other Functional Requirements.
- **Rate flag:** more than 15% above the local market rate per seat.
- **Out of date** when a matching field changes (location, workspace type, headcount, budget, search distance) or the Collection's spaces change. The hover card says so. A run with nothing changed adds nothing to the Timeline.
- **Update Collection** replaces Recommendations only; Shortlist and Favorites are never touched; hand-added spaces are re-added.
- **One source of truth:** Requirement fields define the Collection. The agent reads them and never writes them. Edit requirement is a link to Requirement Details.
- **Boundaries:** no stage or status change, no venue contact, no Shortlist writes to the platform.

## 6. Copy
All strings are quoted in §4. Agent name: **Collection Assessment Agent**, first person ("I checked the 8 spaces…"). No badges or colored tags on content beyond the agent pill. Avoid "light" / "lighter" to describe the assessment.

## 7. Data and platform limits
| Capability | Production | Prototype |
|---|---|---|
| Per-space facts (location, rate, seats, min term, last modified, booking method, response time) | Pulse | Recorded Pulse data per city |
| Venue facts: RatingsReviews, MonthlyInteractionLeads (12 mo), RevenueRecognitionDedicated, Venues (0 = no data) | Pulse | Recorded |
| Platform Assess tool | **Not used**: did not reconcile in testing, nothing per workspace | n/a |
| Market pool for empty Collections | Pulse query near the location | Recorded nearest real listings; answers say counts cover that pool |
| Groups (Shortlist / Favorites / Recommendations) | **No Shortlist control in MCP** | Lisbon uses its real groups (4 shortlisted, 2 favorites); others start all in Recommendations |
| Add space | `add_workspace_to_collection`, one at a time | In-memory |
| Task / note writes | **None.** Workflow lines read from the collection and the last run | Shown |
| Quote dates for private listings | Cannot be stored (no note writes); "Spaces Added" event is the only record | In-memory |
| Availability, inquire / tour / book | Not available | Not shown |

Assessable demo cities: Austin, Chicago, Minneapolis, Dallas, New York, Porto, Denver, Lisbon.

Classic layout (criteria cards, Gaps and trade-offs list, collapsed spaces) remains in code: set `ASSESS_LAYOUT = 'classic'` in `components/data/assessLayout.ts` or check out tag `assess-classic-layout`.

## 8. Out of scope / open questions
- Out: Ask (a scoped question box, pattern 11) and what-if chat. Built and removed from the modal; widen suggestions ("Searching within 10 miles would add 3 matching spaces.") are still computed in `assessmentAgent.ts` but not shown. Revisit after V1.
- Out: venue proposal entry form (venue, seats, price, quote valid until). Add Space takes a listing link only.
- Do hand-added entries survive the platform's refresh (which removes entries first)?
- Can private listings be resolved from a link in Pulse?
- Should "confirmed" also count RFP quotes once private listings exist?
- Does the LiquidSpace "search profile" belong in this design?
- Does the platform Assess tool evolve to per-workspace output, or does the agent keep its own computation?
- Customer-scoped access is untested; intended users are the TM team.

## 9. Acceptance criteria
1. Every Requirement with a Collection offers Assess from the hover card, row menu and Workflow tab.
2. "Meet every criterion" equals the count of spaces passing all stated criteria and confirmed (§5); each criterion cell count matches the table.
3. Status dot and text match the thresholds: 5+ Plenty, 1–4 Few, 0 None.
4. A space with a listing over 90 days old never counts as a confirmed fit and is reported in A5.
5. An empty Collection with a known location shows the per-criterion market breakdown, never a blank state.
6. Changing a matching requirement field shows the changed notice in the hover card, the modal and the Workflow tab until Update Collection runs.
7. Update Collection reports added/removed counts before confirming and never changes Shortlist or Favorites.
8. A second run with changes shows "Since last assessed" and writes one Timeline event; a run with no changes writes none.
9. The agent never writes a Requirement field.
10. Share is disabled with "Nothing to report" when there is nothing to assess.

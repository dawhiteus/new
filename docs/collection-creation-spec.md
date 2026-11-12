# Create Collection Agent
Transaction Manager | Functional Specification | v.3 (design close-out, Nov 2026)

Status: **Design complete.** Prototype: `CreateCollectionModal.tsx`, Collection pill in `RequirementsHome.tsx`. Patterns: [agent-ui-patterns.md](agent-ui-patterns.md). Index: [agents-overview.md](agents-overview.md).

## 1. Job
In one action, create a LiquidSpace Collection for a Requirement, fill it with candidate spaces that match, and link it to the Requirement. Whether the Collection is good enough is a separate question, answered by the Assess Collection agent ([collection-assessment-spec.md](collection-assessment-spec.md)). Creation gives no judgment of the result.

## 2. Entry points
| Where | Action |
|---|---|
| Requirements table, Collection column | **Create Collection** on any Requirement without a Collection, any stage or status, Drafts included |
| Requirement row menu | **Create Collection** (same condition) |

Not offered: on a Requirement that already has a Collection (use Update Collection, see the assessment spec).

## 3. Inputs and outputs
**Inputs:** the Requirement's location, headcount and workspace type (read, never edited); an editable Collection name; or, on the link path, a LiquidSpace Collection URL.

**Outputs**
| Output | Where it lands |
|---|---|
| A new Collection, populated with public listings | LiquidSpace |
| Collection linked to the Requirement | Requirement record; Collection pill shows the space count |
| Timeline: "Collection Created" or "Collection Linked" | Timeline tab |
| Workflow: Create Collection task reads as done | Workflow tab (read from the collection, not task status; see §7) |
| Snapshot of the requirement values the Collection was built for | Used later to detect "the requirement has changed" |

## 4. Flow and states
| # | State | What the user sees |
|---|---|---|
| S1 | New Collection | Title "New Collection", subtitle "For {Requirement} · {Company}". Field "Collection name", default "{Requirement} Collection". Agent note: "**The Create Collection Agent** searches LiquidSpace for spaces that match this requirement's location, headcount and workspace type, and builds the collection for you. You can add or remove spaces at any time." Footer: **Link an Existing Collection** (left), **Cancel**, **Create Collection**. |
| S2 | No location | Under the note: "This requirement needs a location first. Add one, or link an existing collection." **Create Collection** disabled. |
| S3 | Working | Name field and buttons disabled; primary shows spinner and "Creating…". |
| S4 | Populated | Check icon, "Collection populated", "“{Collection}” now has N spaces for the requirement “{Requirement}”." **Close**, **View Collection ↗** (opens in LiquidSpace). |
| S5 | Created empty | "Collection created", "“{Collection}” was created, but no suitable spaces were found in {City}. You can add spaces in LiquidSpace." Same buttons. |
| L1 | Link a Collection | Title "Link a Collection", "Paste the link to a Collection in LiquidSpace. Its contents aren't changed." Field "Collection URL", placeholder "https://liquidspace.com/collections/…". **Back**, **Cancel**, **Link Collection**. Enter submits. |
| L2 | Invalid link | Inline red error under the field; clears on edit. |
| L3 | Linked | Modal closes; pill shows the Collection's space count. |

### After creation: the Collection pill
The pill shows "N spaces". Its hover card shows:
- Collection name; "N spaces total · Updated {date}".
- Status line with a colored dot (green Plenty, amber Few, gray None): "N of M meet every criterion", "Empty collection" or "Not assessed". Supplied by Assessment.
- Amber notice when relevant: "The requirement has changed since this collection was built: {changes}." or "The collection has changed since it was last assessed."
- Three counts: in the Requirement's location; within budget per month; for the headcount band ("For 4-7 people").
- Saved and Shortlisted totals.
- **View Collection →**; **Update Collection** (only when the requirement changed); **Assess**; **Add Space**.

Row menu with a Collection: View Collection, Assess Collection, Add Space, Update Collection, Remove collection.

## 5. Rules
- A Location is required to create. Without one, the user can still link a Collection.
- Populate matches location, capacity and workspace type. No inventory is invented.
- No suitable spaces: the Collection is still created, empty.
- Headcount band: about −20% / +40% around headcount (5 → 4-7, 30 → 24-42). Function: `capacityBand` in `collectionAgent.ts`.
- Link path: validate the URL identifies a LiquidSpace Collection; never modify its contents.
- Both paths end the same way: Collection linked, Timeline event recorded.
- Public listings only. Private listings from venue proposals enter later through Add Space.
- Collections are private to their owner until shared. TM has no separate Collection management UI; Collections are managed in LiquidSpace.

## 6. Copy
All strings are quoted in §4. Agent name in the dialog: **The Create Collection Agent**.

## 7. Data and platform limits
| Capability | Production (MCP) | Prototype |
|---|---|---|
| Create collection | `create_collection` | Simulated; real LiquidSpace collections are used for Austin, Chicago, Minneapolis, Dallas, New York, Porto, Denver, Lisbon (name is fixed to the real one) |
| Populate | `populate_requirement_collection`. **Returns nothing when the Requirement has a budget, ignores the search area, and leaves the Requirement's Collection link empty.** | Recorded Pulse data |
| Attach to requirement | `update_requirement` (collection link) | In-memory |
| Add workspaces | One at a time (`add_workspace_to_collection`) | n/a |
| Mark Workflow task complete | **No task writes.** Workflow lines are read from the collection | Shown as completed |

Required production call sequence: create the Collection → clear the budget → populate → attach the Collection to the Requirement → restore the budget. Show these operations before approval (pattern 9).

## 8. Out of scope / open questions
- Out: judging the result (Assessment), venue outreach and RFPs, adding private listings at create time.
- Should populate respect the search area once the platform supports it?
- Agent naming is inconsistent across the prototype: "Create Collection Agent" (dialog, Workflow assignee) vs "Market Sourcing Agent" (Workflow auto-assign in `RequirementsHome.tsx`). Pick one.
- The dialog note mentions location, headcount and workspace type; budget is not used by populate (platform issue). Revisit the copy if the platform is fixed.

## 9. Acceptance criteria
1. Every Requirement without a Collection offers Create Collection, including Drafts.
2. Without a Location, Create is disabled and the reason is shown; Link remains available.
3. With a budget set, populate still returns spaces (budget cleared and restored around the call) and the budget value is unchanged afterwards.
4. After create, the Requirement shows the Collection link and space count with no further user action.
5. An empty result creates an empty Collection and says so, naming the city.
6. An invalid URL shows an inline error and links nothing; a valid URL links without changing the Collection's contents.
7. Both paths write one Timeline event.
8. The hover card counts (location, budget, headcount band) match the Collection's spaces.

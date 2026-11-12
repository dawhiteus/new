# Assess Collection Agent — Spec
Transaction Manager | Nov 2026 | Overview: [agents-overview.md](agents-overview.md) | Screens and copy: [design-reference/assess-collection-states.md](design-reference/assess-collection-states.md)

**Required** = product requirement. **Default** = the prototype's choice; engineering may change it.

## Job
Answer one question for Sales: is this Collection's candidate list good enough? Report how many spaces meet every criterion of the Requirement, why the rest don't, and what changed since the last check. People decide what to do next. The agent doesn't score, recommend, choose spaces or edit the Requirement.

## Rules
**Assess**
- **Required:** available on every Requirement that has a Collection: from the Collection pill, the row menu and the Workflow tab.
- **Required:** check each space against the criteria the Requirement states: area, headcount, budget, workspace type. Unstated criteria aren't checked.
- **Required:** show the number of spaces meeting every criterion, the count for each criterion, and each space's value against each one.
- **Required:** a space counts only if its information is current. **Default:** a public listing updated within 90 days, or a private listing with a valid quote (30 days if no date is given).
- **Required:** report spaces that would fit except for out-of-date information, separately.
- **Required:** never state or guess availability.
- **Required:** an empty Collection still gets an answer. If the location is known, show how many nearby listings pass each criterion; otherwise, say why it can't search.
- **Default:** Plenty = 5+ current fits, Few = 1–4, None = 0. Shown on the Collection pill. "Thin" means fewer than 5.
- **Default:** with no search area given, use the city center and 5 miles, and label it assumed.
- **Default:** flag a price more than 15% above the local market rate per seat.
- **Default:** show the Collection's groups (Shortlist, Favorites, Recommendations), as on LiquidSpace.

**When things change**
- **Required:** if a matching field of the Requirement has changed since the Collection was built, say so on the Collection pill, in the assessment and on the Workflow tab, until the Collection is updated.
- **Required:** a re-run says what changed and how the count moved ("Matches 0 → 2"). The first run, and any run with changes, writes one Timeline event; a run with no changes writes none.
- **Required:** Update Collection searches again with the current Requirement and says how many spaces would be added and removed before it runs. It replaces only Recommendations; Shortlist and Favorites are never touched.

**Add Space**
- **Required:** add one space to the Collection from a LiquidSpace listing link. Reject other links and duplicates. A space added this way is included in the next assessment.

## Platform limits
These come from prototype testing in Nov 2026; confirm them before building.
- The platform's assess tool gave inconsistent results and nothing per space, so per-space facts come from Pulse.
- No availability data.
- MCP has no control over the Shortlist, so moving a space between groups can't be saved.
- No task or note writes. Workflow status is worked out from the Collection and the last assessment.
- Workspaces are added one at a time. It's unknown whether hand-added spaces survive a platform refresh.
- Populate returns nothing when a budget is set, which can leave a Collection empty even when spaces exist.

## Acceptance criteria
1. Every Requirement with a Collection offers Assess.
2. The "meet every criterion" count equals the spaces passing all stated criteria with current information, and matches the table.
3. The status on the Collection pill follows the thresholds.
4. A space with out-of-date information never counts as a fit.
5. An empty Collection with a known location shows the per-criterion breakdown of nearby listings, never a blank state.
6. Changing a matching Requirement field shows the change notice everywhere until Update Collection runs.
7. Update Collection reports adds and removes before it runs, and never changes Shortlist or Favorites.
8. The agent never writes a Requirement field.

## Open questions
- Do hand-added spaces survive the platform's Collection refresh?
- Can private listings be looked up from a link?
- Should RFP quotes count as current information once private listings exist?
- Does the platform's assess tool get per-space output, or does TM keep its own check?
- Asking questions about a Collection and "what if" searches are designed but held out of V1.

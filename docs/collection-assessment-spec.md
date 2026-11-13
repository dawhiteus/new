# Assess Collection Agent — Spec
Transaction Manager | Nov 2026 | Overview: [agents-overview.md](agents-overview.md) | Screens and copy: [design-reference/assess-collection-states.md](design-reference/assess-collection-states.md)

**Required** = product requirement. **Default** = the prototype's choice; engineering may change it. **TM user** = the LiquidSpace person working the requirement.

## Job
Answer one question for the TM user: is this Collection's candidate list good enough? Report how many spaces meet every criterion of the Requirement, why the rest don't, and what changed since the last check. People decide what to do next. The agent doesn't score, recommend, choose spaces or edit the Requirement.

## Use cases
As a TM user, I want to…

| # | I want to… | So that… |
|---|---|---|
| A1 | know how many spaces meet every criterion of the Requirement | I can tell whether the list is good enough to work with |
| A2 | see, per criterion and per space, which criteria each space misses | I know whether the gap is price, size, distance or type |
| A3 | see from the Requirements table whether a Collection has plenty, few or no fits | I know where to focus without opening each one |
| A4 | know which spaces would fit but have out-of-date information | I don't rely on stale prices or details |
| A5 | understand why a Collection is empty | I know whether to change the Requirement, widen the search or go to venues |
| A6 | be told when the Requirement has changed since the Collection was built | I don't work from a list built for old criteria |
| A7 | update the Collection to the current Requirement without losing the spaces I picked | the list catches up without undoing my work |
| A8 | see what changed since the last assessment | I can see whether things improved |
| A9 | add a specific space, such as one a venue proposed | spaces found outside the search are included |
| A10 | see each venue's facts (booking method, minimum term, reviews, recent leads and tours, dedicated contracts on record) | I can judge a space beyond the criteria |
| A11 | keep spaces in Shortlist, Favorites and Recommendations, as on LiquidSpace | I can separate my picks from the agent's matches |
| A12 | copy a ready-to-send email about the Collection, or download a report of the assessment | I can update the customer in one step, and the link brings them back to this requirement |

## Rules
**A1–A4: Assess**
- **Required:** available on every Requirement that has a Collection: from the Collection pill, the row menu and the Workflow tab.
- **Required:** check each space against the criteria the Requirement states: area, headcount, budget, workspace type. Unstated criteria aren't checked, and the agent shows which values it assumed.
- **Required:** show the number of spaces meeting every criterion, the count for each criterion, and each space's value against each one, with misses made obvious.
- **Required:** a space counts only if its information is current. **Default:** a public listing updated within 90 days, or a private listing with a valid quote (30 days if no date is given). Spaces failing only on this are reported separately (A4).
- **Required:** never state or guess availability.
- **Default:** Plenty = 5+ current fits, Few = 1–4, None = 0, shown on the Collection pill. "Thin" means fewer than 5.
- **Default:** with no search area given, use the city center and 5 miles, labelled as assumed.
- **Default:** flag a price more than 15% above the local market rate per seat.

**A5: Empty Collection**
- **Required:** an empty Collection still gets an answer. If the location is known, show how many nearby listings pass each criterion and all of them together. Otherwise, say the location can't be found and point to editing the Requirement.

**A6–A8: Changes**
- **Required:** if a matching field (location, workspace type, headcount, budget, search area) has changed since the Collection was built, say so, with before → after, on the Collection pill, in the assessment and on the Workflow tab. The notice stays until the Collection is updated; assessing doesn't clear it.
- **Required:** Update Collection searches again with the current Requirement, says how many spaces would be added and removed before it runs, replaces only Recommendations, and keeps Shortlist, Favorites and hand-added spaces. It records "Collection Updated" on the Timeline.
- **Required:** a re-run says what changed and how the count moved ("Matches 0 → 2"). The first run, and any run with changes, records "Collection Assessed" on the Timeline; a run with no changes records nothing.
- **Required:** a Collection whose spaces changed since the last assessment is marked out of date.

**A9: Add a space**
- **Required:** add one space from a LiquidSpace listing link. Reject other links and spaces already in the Collection. A hand-added space starts in Shortlist, is included in the next assessment, and is recorded on the Timeline.

**A10–A12: Venue facts, groups, sharing**
- **Required:** each space's venue facts are available on demand, stated as observations, never as scores.
- **Required:** spaces are shown in their LiquidSpace groups. Moving a space between groups is recorded on the Timeline and updates the Shortlisted count.
- **Required:** Copy Email copies a ready-to-send email: a subject, a summary of the result, the spaces (Shortlist first, otherwise the spaces meeting every criterion), and a link that opens this requirement's assessment. TM never sends it; the user pastes and sends.
- **Required:** when few or no spaces fit, the email asks the customer about the main gap (for example, whether the headcount range is firm) instead of presenting a list.
- **Required:** the email uses customer-facing facts only (distance, seats, price, workspace type). Venue lead data, response rates, dedicated contracts and the over-market flag never go in, and it never promises availability.
- **Required:** the user can download the assessment as a PDF.
- **Required:** both are unavailable when there's nothing to assess.
- **Default:** up to 5 spaces in the email.

## Acceptance criteria
1. Every Requirement with a Collection offers Assess. (A1)
2. The "meet every criterion" count equals the spaces passing all stated criteria with current information, and matches the per-space view. (A1, A2)
3. The status on the Collection pill follows the thresholds. (A3)
4. A space with out-of-date information never counts as a fit and is reported separately. (A4)
5. An empty Collection with a known location shows the per-criterion breakdown of nearby listings, never a blank state. (A5)
6. Changing a matching Requirement field shows the change notice everywhere until Update Collection runs. (A6)
7. Update Collection reports adds and removes before it runs, and never changes Shortlist, Favorites or hand-added spaces. (A7)
8. A re-run with changes shows what changed and writes one Timeline event; a re-run without changes writes none. (A8)
9. A listing link adds the space to Shortlist; a non-listing link or a duplicate is rejected. (A9)
10. The agent never writes a Requirement field. (Job)

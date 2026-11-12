# Requirement Agent — Spec
Transaction Manager | Nov 2026 | Overview: [agents-overview.md](agents-overview.md) | Screens and copy: [design-reference/requirement-agent-states.md](design-reference/requirement-agent-states.md)

**Required** = product requirement. **Default** = the prototype's choice; engineering may change it. **TM user** = the LiquidSpace person working the requirement.

## Job
Turn what a customer sent (email, call notes, brief, or a license up for renewal) into a draft Requirement, list what is still missing, and update the Requirement when new correspondence arrives. The user reviews before anything is saved.

How the text is read (rules, a language model, or both) is an engineering decision. The prototype uses rules only.

## Use cases
As a TM user, I want to…

| # | I want to… | So that… |
|---|---|---|
| R1 | paste a customer email, call notes or brief, or attach a file, and get a draft Requirement | I don't retype what the customer already told me |
| R2 | see where each filled value came from | I can trust it or correct it quickly |
| R3 | see what the agent revised, set aside or couldn't settle | nothing the customer said is silently lost or wrongly applied |
| R4 | save a Requirement even when details are missing | missing information doesn't stop me starting work |
| R5 | copy a ready-to-send message listing the missing details | I can ask the customer in one step |
| R6 | start a renewal by picking the license that's up for decision | the license facts carry over and the Requirement is linked to it |
| R7 | combine a license with the customer's latest email | the email updates what has changed since the license |
| R8 | get one draft per city when a message covers several | each market is tracked as its own Requirement |
| R9 | be warned when I'm about to create a duplicate | the same need isn't tracked twice |
| R10 | update an existing Requirement from a reply or call notes, accepting each change | the record stays current without overwriting my own edits |
| R11 | be told when an update affects an existing Collection | I know the Collection may need updating |
| R12 | ignore the agent and fill the form myself | the agent never slows me down |

## Rules
**R1–R5: Create from correspondence**
- **Required:** the agent is opt-in. The manual form is unchanged (R12).
- **Required:** nothing is saved until the user creates the Requirement. Every filled field shows its source: the text, the license, or a suggestion to confirm. Editing a field removes its marker.
- **Required:** when the text doesn't settle a value (a conflict, a conditional such as "if we close the round…", or something tentative such as "might"), the field is left empty and a question is asked. The agent never guesses.
- **Required:** it keeps these apart: approximate vs exact headcount; employees vs seats; budget vs a preferred figure under it; target vs confirmed start date; lease expiry vs start date; must-have vs nice-to-have. It never converts currencies.
- **Required:** without the required details, the Requirement saves as a Draft with a list of what's missing. The original text is kept, unedited, with the Requirement.
- **Required:** open questions clear as they are answered, by an update or by hand.
- **Default:** at most five open questions, most important first. Name the Requirement after the city. Estimate size at 150 sq ft per person, shown as an estimate and never filled in.

**R6–R7: Renewals and license linking**
- **Required:** licenses come from the License Administrator's records, the same source as the License Tracker. The user can pick one from a list or type its ID. **Default:** the list opens on licenses whose customer decision date is within 6 months, soonest first, and can show all.
- **Required:** a renewal draft takes the customer, location, seats and size from the license. It leaves budget, term and start date empty, because a renewal is a new negotiation.
- **Required:** with both a license and text, the text wins where they differ.
- **Required:** the saved Requirement records the license it renews: license ID, incumbent operator, term end (or "auto-renews") and the date the customer must decide by.
- **Required:** an unknown License ID doesn't block anything. Say the license wasn't found and draft from the text alone.
- **Default:** a renewal with no city in the text is named "{City} renewal".

**R8–R9: Several cities, duplicates**
- **Required:** text covering several cities produces one draft per city, each reviewed and saved on its own.
- **Default:** a likely duplicate is the same company, the same city and headcount within 20%. Warn once before saving, and allow "create anyway".

**R10–R11: Update from text**
- **Required:** each proposed change is shown as before → after. The user accepts it or keeps their own value, and nothing changes until they apply.
- **Required:** existing values stay unless the text changes them. List fields (program, amenities) are added to, not replaced. Unsettled statements are listed and not applied.
- **Required:** if a sourcing field (location, headcount, size, workspace type, budget, search area, start date) changes and a Collection exists, say the Collection is not updated automatically.
- **Required:** applied changes are recorded on the Requirement's Timeline.

## Acceptance criteria
1. With the agent unused, Create Requirement works exactly as today. (R12)
2. A conditional or tentative statement is never applied to a field. (R3)
3. Two conflicting values with no revision leave the field empty and produce a question. (R3)
4. A preferred figure under a stated budget fills the budget and is recorded as a preference. (R3)
5. A nice-to-have is recorded separately from must-haves. (R3)
6. Every filled field shows its source; editing the field removes the marker. (R2)
7. A Requirement missing details saves as a Draft and lists them. (R4)
8. A renewal draft carries the license's customer, location, seats and size, leaves commercial terms empty, and records the license it renews. (R6)
9. An unknown License ID still produces a draft from the text, with a message that the license wasn't found. (R6)
10. Text covering two cities produces two drafts. (R8)
11. Update from text changes only the fields the user accepted. (R10)
12. The source text is saved with the Requirement. (R1)
13. The 39 sample emails in `tests/fixtures` produce the expected values (they also work as a regression set for any approach engineering chooses). (R1, R3)

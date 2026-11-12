# Requirement Agent — Spec
Transaction Manager | Nov 2026 | Overview: [agents-overview.md](agents-overview.md) | Screens and copy: [design-reference/requirement-agent-states.md](design-reference/requirement-agent-states.md)

**Required** = product requirement. **Default** = the prototype's choice; engineering may change it.

## Job
Turn what a customer sent (email, call notes, brief, or a license up for renewal) into a draft Requirement, list what is still missing, and update the Requirement when new correspondence arrives. The user reviews before anything is saved.

How the text is read (rules, a language model, or both) is an engineering decision. The prototype uses rules only.

## Rules
**Create**
- **Required:** the agent is opt-in. The manual Create Requirement form is unchanged.
- **Required:** input is pasted text, an attached file, a License ID, or a combination.
- **Required:** nothing is saved until the user creates the Requirement. Every agent-filled field shows where its value came from.
- **Required:** when the text doesn't settle a value, the field is left empty and a question is asked. This covers a conflict, a conditional ("if we close the round…") or something tentative ("might"). The agent never guesses.
- **Required:** the agent shows what it decided and what it set aside (revisions, conditions, preferences).
- **Required:** it keeps these apart: approximate vs exact headcount; employees vs seats; budget vs a preferred figure under it; target vs confirmed start date; lease expiry vs start date; must-have vs nice-to-have. It never converts currencies.
- **Required:** missing details never block saving. Without them the Requirement saves as a Draft, with a list of what's missing.
- **Required:** the original text is kept, unedited, with the Requirement.
- **Required:** a renewal draft carries customer, location, seats and size from the license, and leaves commercial terms empty.
- **Required:** text covering two cities becomes two draft Requirements.
- **Default:** before saving, warn about a likely duplicate (same company, same city, headcount within 20%).
- **Default:** name the Requirement after the city.
- **Default:** at most five open questions, most important first.
- **Default:** estimate size at 150 sq ft per person, shown as an estimate and never filled in.

**Update from text**
- **Required:** each proposed change is shown as before → after, and the user accepts or keeps their own value. Nothing changes until they apply it.
- **Required:** existing values stay unless the text changes them. List fields (program, amenities) are added to, not replaced.
- **Required:** if a sourcing field changes and a Collection exists, say the Collection is not updated automatically.
- **Required:** when every open question is answered, the questions clear.

## Platform limits
These come from prototype testing in Nov 2026; confirm them before building.
- A Requirement takes one note, at creation. Later replies can update fields but can't be stored as notes.
- MCP can't write tasks, so the "ask the customer for missing details" task has no home yet.
- Where a value came from has nowhere to be stored, so it's visible only in the session that made the change.
- MCP's Draft minimum is name, company and workspace type. The prototype needs only a name.

## Acceptance criteria
1. With the agent unused, Create Requirement works exactly as today.
2. A conditional or tentative statement is never applied to a field.
3. Two conflicting values with no revision leave the field empty and produce a question.
4. A preferred figure under a stated budget fills the budget and is recorded as a preference.
5. A nice-to-have is recorded separately from must-haves.
6. Update from text changes only the fields the user accepted.
7. Every agent-filled field shows its source; editing the field removes the marker.
8. The source text is saved with the Requirement.
9. The 39 sample emails in `tests/fixtures` produce the expected values (they also work as a regression set for any approach engineering chooses).

## Open questions
- Where does the "missing details" task live: HubSpot, or a TM task API?
- Which file types must be read at launch (PDF, .msg, .docx)?
- Is splitting a two-city message into two Requirements always right?
- Name format: the city only, or "Account - City - N seats"?

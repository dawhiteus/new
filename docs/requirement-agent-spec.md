# Requirement Agent
Transaction Manager | Functional Specification | v.3 (design close-out, Nov 2026)

Status: **Design complete.** Prototype: New Requirement modal and Requirement Details in the TM demo. Patterns: [agent-ui-patterns.md](agent-ui-patterns.md). Index: [agents-overview.md](agents-overview.md).

## 1. Job
Turn whatever the customer sent (an email, call notes, a brief, a license up for renewal) into a requirement record, say what is still missing, and keep the record current as new correspondence arrives. The agent proposes; a person decides. Nothing is written until they do.

## 2. Entry points
| Where | Action | Notes |
|---|---|---|
| Requirements page, **Create Requirement** | Opens the New Requirement modal. The agent is a closed bar at the top ("I can draft this from a pasted email, a description, or a license ID."). | Opt-in. The manual form below it is unchanged and always available. |
| Requirement Details, Overview | **Update Fields** composer: "Paste or type a reply, call notes or the changes you need." | Works on any requirement, any stage, Drafts included. |

Not offered: anywhere outside these two. No auto-run on email arrival.

## 3. Inputs and outputs
**Inputs** (any combination, one composer):
- Pasted text: "Paste or type requirements here."
- An attached file. Prototype reads text files only (.txt, .eml, .md).
- A License ID, picked or typed: "Pick or enter a License ID (optional, for renewals)". The picker defaults to licenses needing a decision in the next 6 months; "Show all licenses" lists all by notification date.

**Outputs on create**
| Output | Where it lands |
|---|---|
| Requirement fields (Deal Details, Business Requirements, Commercial Terms) | The requirement record (`create_requirement`) |
| Name, formed "Account - City - N seats" (renewals: "City renewal") | Requirement Name, editable |
| One initial note: the source text in full, the renewal line, the open questions | Requirement notes (the only note MCP allows) |
| Renewal line: "Renewal of license {ID} · Incumbent: {operator} · Term ends {date} \| Auto-renews · Customer must decide by {date}" | Inside the initial note |
| Search area (neighborhoods or radius) | Text line in Other Functional Requirements |
| Intake Task "Complete missing details for {City} requirement", assigned to the customer | Tasks page (prototype only, see §7) |
| Timeline: "Requirement Created" or "Draft Created", "Draft Prepared", "Task Added" | Timeline tab |

**Outputs on Update from text**: field changes the user accepted (`update_requirement`), a "Requirement Updated" Timeline event with before/after values. A generated name follows a headcount change.

## 4. Flow and states
### Create
| # | State | What the user sees |
|---|---|---|
| C1 | Closed bar | One line inviting the agent. Manual form below. |
| C2 | Open composer, empty | Text box, attach, License ID picker. **Draft requirement** disabled until there is input. |
| C3 | Unreadable file | "The prototype can only read text files (.txt, .eml, .md). Paste this file's text instead." |
| C4 | Working | Progress lines in sequence: "Reading what you pasted…" / "Reading the file…" / "Pulling license {ID}…", then "Pulling out the requirement details…", "Checking what is missing…". |
| C5 | Nothing found | Toast: "I didn't find a requirement in that text. Add details and try again, or fill the form yourself." Returns to C2. |
| C6 | Draft ready | Summary card: agent name, "Draft ready", "N of M fields filled" with bar; "Drafted from {source}"; "Review the marked fields, then create the requirement." Agent-filled fields carry a ✦ marker. |
| C6a | Draft ready, from license | "Drafted from license {ID}…" and "Customer, location, seats and size carried over. Commercial terms were not." A license error, if any, shows in amber. |
| C6b | Multiple locations | "Drafted N requirements · Madrid and Lisbon". A pill switcher picks the draft. Each saves as its own requirement. |
| C7 | Missing details | "Needed from customer" list (field, hint), count badge, **Copy Missing Details** (toast "Missing details copied"), footer "On create, a task asks {Company} for these details." |
| C8 | Likely duplicate | On submit: "This looks like an existing requirement: {name} ({company}, N seats). Create it anyway?" with **Create anyway**. |
| C9 | Name missing | Toast: "Requirement Name is required." (prefixed with the draft label when several). |
| C10 | Saved | Primary button reads **Save as Draft** when required fields are missing, else **Create Requirement**. |

### Update from text
| # | State | What the user sees |
|---|---|---|
| U1 | Composer | Text box on Overview with **Update Fields**. |
| U2 | No changes | "No changes found. The requirement already matches this text, or the text doesn't mention requirement details." |
| U3 | Review | One row per change: field, "Was {value}" or "Was empty", new value, source quote on hover, **Accept** / **Keep mine** (default Accept). Unsure or conflicting statements are listed as needing a call and are not applied. If a sourcing field changed and a Collection exists, a line says the Collection is not changed automatically. |
| U4 | Applied | Toast "Requirement updated." (or "Kept as a Draft: …" / "Not provided yet: …"). **Make Additional Changes** reopens U1. |
| U5 | Open questions | Overview box "Open questions" with copy ("Message for the customer copied.") and dismiss ("Open questions dismissed."). Clears per field as answered; when all are answered the Intake Task completes and the Timeline records it. |

## 5. Rules
**Reading** (`components/data/requirementParser.ts`): deterministic parser, no language model, no external call.
1. Split into messages. Quoted history (`>`), forwarded blocks, "On … wrote:" and Outlook headers start an older message. Signatures, greetings and disclaimers are set aside.
2. Split into sentences; `Label: value` lines become sentences.
3. Extractors produce candidates tagged stated/inferred, approximate, target, conditional, tentative. Dates resolve against today.
4. Per field: newest message wins; a revision word ("actually", "now") resolves a conflict within one message; an unresolved conflict stays blank and becomes a question. Conditional statements ("if we win…") are not applied.
5. Values are validated (ranges, real dates, supported workspace types). Out-of-range values are dropped with a reason.

**Distinctions kept:** approximate vs exact headcount; budget target vs firm ceiling; target vs confirmed start; current office vs new location; employees vs seats (hybrid); meeting rooms vs Meeting Space; per-person and annual budgets (converted to monthly and disclosed); other currencies (never converted); lease expiry (context, not start date). Context with no field goes to Other Functional / Other Commercial Requirements or the agent's note.

**Update rules:** existing values stay unless the text changes them. Lists (program, amenities) are appended, not replaced. Only the search-area line of Other Functional Requirements is replaced.

**Duplicate check:** same company, same city, headcount within 20% (or either headcount unknown).

**Drafts:** only Requirement Name blocks saving. Anything else missing saves as a Draft.

**Open questions:** one per real production field, most important first, capped at five. No invented questions.

**Provenance markers:** "From your text", "From the license", "Suggested, please confirm". Editing a field removes its marker.

## 6. Copy
All user-facing strings are quoted in §4. The agent's name is **Requirement Agent** (renamed from Intake). Field hints in "Needed from customer": City or location; People the space must hold; Target spend per month; Required move-in date; Months of commitment; Office suite, private office, team office, coworking or meeting space; Neighborhoods or radius; Square feet; Customer company name.

## 7. Data and platform limits
| Capability | Production (MCP) | Prototype |
|---|---|---|
| Create / update requirement fields | Yes | In-memory store; reload resets |
| Initial note | One, at create | Same |
| Later notes (replies, call notes) | **No.** Used for field updates only, not stored | Stored for the demo |
| Tasks (Intake Task, completion) | **No task writes** | Shown on Tasks page |
| Provenance markers | No place to persist; session only | Persist in memory |
| Open-questions list | Only the first set, as text in the initial note | Live list |
| License lookup | Requires a license source | Local registry (`licenseRegistry`) |
| File types | To decide (PDF, .msg, .docx) | Text files only |

Draft minimum differs: prototype needs a name only; MCP needs name, company and workspace type. Align before build.

## 8. Out of scope / open questions
- Out: language model reading, non-English text, currency conversion, recommending where the customer should book (Workplace Strategist's job).
- Two cities in one message become two requirements. Confirm this is wanted for every case.
- Where does the Intake Task live if MCP cannot write tasks: HubSpot, or a TM task API?
- Which file types must be read at launch?

## 9. Acceptance criteria
1. With the agent closed, the manual form behaves exactly as today.
2. Each of the 40 fixture emails in `tests/fixtures` produces the asserted values, empty fields, provenance and flags (`npm test`).
3. A conditional or tentative statement is never applied to a field.
4. A conflict without a revision word leaves the field empty and adds an open question.
5. No field is changed by Update from text unless the user leaves it on Accept and presses Apply.
6. Every agent-filled field shows a marker with its source on hover; editing removes it.
7. A requirement missing anything but its name saves as a Draft, and the missing items are listed.
8. A likely duplicate (§5) warns once before save; **Create anyway** saves.
9. A license draft carries customer, location, seats and size, and leaves commercial terms empty.
10. The source text is saved, unedited, in the initial note with the open questions and (for renewals) the renewal line.
11. A headcount change renames a generated name; a user-edited name is left alone.

## 10. Tests
`npm test` runs `tests/requirementParser.test.ts` (40 fixture emails) and `tests/requirementAgent.test.ts` (agent logic, update flow, create-reopen-update). Summary and question helpers in `intakeAgent.ts` are tested but no longer shown.

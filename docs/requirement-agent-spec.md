# Requirement Agent: behavior and test notes

The Requirement Agent reads pasted correspondence, says what it understood, asks what matters most, and proposes changes when new correspondence arrives. It is a deterministic parser, not a language model. No external service is called.

## Reading (components/data/requirementParser.ts)
1. Split the paste into messages. Quoted history (`>`), forwarded blocks, `On … wrote:` and Outlook headers start a new, older message. Signatures, greetings and disclaimers are set aside.
2. Split each message into sentences. `Label: value` lines (Headcount: 22) become plain sentences.
3. Small extractors produce candidates (value, quote, stated or inferred, approximate, target, conditional, tentative). Dates resolve against today's date.
4. Candidates resolve per field. The newest message wins; a revision word ("actually", "now") resolves a conflict in one message; a conflict with no revision stays blank and becomes a question. Conditional statements ("if we win…") are not applied.
5. Values are validated against the schema (ranges, real dates, supported workspace types). Anything out of range is dropped with a reason.

Distinctions kept: approximate vs exact headcount, budget target vs firm ceiling, target vs confirmed start date, current office vs new location, employees vs seats (hybrid), meeting rooms vs Meeting Space as the workspace type, per-person and annual budgets (converted and disclosed), other currencies (not converted), lease expiry (context, not the start date). Context with no field is kept in Other Functional or Other Commercial Requirements, or in the agent's notes.

## Create
The original Requirement Agent screens (summary line, field marks, open-questions list) are used, with the improved parser behind them. Nothing here changes the layout.

## Update from text
Compares new text with the record and shows each change as before and after (Accept or Keep mine), then Apply. Existing values stay unless the text changes them. Unsure statements ("might", "not sure") and conflicts are listed as needing a call and are not applied. Lists (program needs, amenities) are added to, not replaced; only the area line of Other Functional Requirements is replaced. When there is a Collection and a sourcing field changes, the review says the Collection is not changed automatically. Applying records a Timeline event and a note with the text and the before/after values. A generated name (Account - City - N seats) follows a headcount change.

## Tests
`npm test` runs `tests/requirementParser.test.ts` (40 emails in `tests/fixtures`, asserting exact values, fields that must stay empty, provenance and flags) and `tests/requirementAgent.test.ts` (agent logic, update flow, create-reopen-update state flow). The summary and question helpers remain in `intakeAgent.ts` and are tested but no longer shown in the UI. Test emails are data only and are not referenced by the app.

## Known limits
English only. Rules, not understanding: unusual phrasing can be missed, and the agent then leaves the field empty rather than guessing. Two cities in one requirement are split into two. Currency is never converted. Persistence is the prototype's in-memory store, so a page reload resets it.

## Missing details and the customer Task
Everything still missing after extraction (most important first) is listed as open questions on the new requirement. **Copy for customer** copies a ready-to-send message ("Hi Maria, thanks for the details on the Madrid requirement…"). Saving the requirement also creates an Intake Task, "Complete missing details for Madrid requirement", assigned to the customer (their name from the signature, else the company), which appears on the Tasks page. When Update from text or edits answer every open question, the Task is marked Completed and a Timeline event is logged.

# Agent UI patterns (from the Requirements Intake Agent)

Reusable patterns proved in the Intake Agent prototype (create from pasted text or a file, then update from the customer's reply). Written to carry over to the Collection Builder and Assessment work. Each pattern says what it is, where it lives in the prototype, and what it needs from MCP.

Ground rule for all of them: the agent proposes, a person decides, and nothing is written until they do. Every write must be one that MCP actually supports.

## 1. Opt-in, not default

The agent is offered, never imposed. A quiet bar at the top ("Use Requirement Intake Agent") opens the agent composer; the normal manual form is always there and unchanged.

- Prototype: closed bar in `NewRequirementModal.tsx`.
- Why: people who know what they want shouldn't be slowed down, and the manual path stays the source of truth.
- MCP: none needed.

## 2. One input, any source

One box, "Paste or type requirements here", plus an optional attach for a file. No sample chips, no mode switches. Manual entry, paste and upload all land in the same place.

- Prototype: composer in `NewRequirementModal.tsx` (`attachFile`).
- Reuse: for collections, the single input is the requirement or a brief; the agent decides what it is.
- MCP: none needed. Input is parsed client-side.

## 3. Propose, then review (Accept / Keep mine)

The agent never changes a field directly. It shows each proposed change as current value, arrow, new value, where it came from, with Accept and Keep mine. Nothing is applied until Apply.

- Prototype: reply review in `RequirementDetailsModal.tsx` (`reviewReply`, `applyReply`).
- Why: keeps the person in control and makes the agent's work inspectable in seconds.
- Rule: only propose where the value is new or different. Default is Accept, but "Keep mine" always wins.
- MCP: Apply maps to `update_requirement` (field updates). Changes are logged by the platform as field changes.

## 4. Provenance on the value

Every agent-filled field carries a small marker saying where it came from: the customer's words, a license record, or a suggestion to confirm. The marker is an icon only (green ✦); the detail appears on hover. Editing the field removes the marker, because it is now the person's value.

- Prototype: `Provenance` kinds `source | license | suggested` in `intakeAgent.ts`; `mark()` in the details modal.
- Why: trust comes from seeing why a value is there, not from a confidence number.
- MCP: markers are a prototype affordance. MCP has no place to persist them, so the real product would show them only in the session that created the change.

## 5. Evidence on demand

The quote or fact behind a value is one hover away, never shown by default. Default view stays clean; evidence is there when someone doubts.

- Prototype: marker tooltip text (e.g. the exact phrase from the email).
- Reuse: for collection assessment, the tooltip is the workspace attribute that drove a gap or a score.

## 6. Questions for what's missing

When something required is missing, the agent asks instead of guessing. Open questions are generic ("Open questions"), tied one-to-one to production fields, capped at five, and carried with the requirement.

- Rules: a question exists only if it maps to a real field. No invented questions. When the field is filled (by reply or by hand) the question clears. "Mark answered" and dismiss cover the rest. Copy puts them on the clipboard for the reply email; copying does not clear them.
- Prototype: `questionsFor` in `intakeAgent.ts`; Overview box in `RequirementDetailsModal.tsx`.
- MCP: only the first set can be persisted, as text inside the single initial note. The live list is prototype-only.

## 7. Drafts for incomplete work

Missing required details never block saving. The requirement saves as a Draft and says what's missing, and the person can come back.

- Prototype: forced Draft logic in `RequirementsHome.tsx` and `RequirementDetailsModal.tsx`.
- Open item: the prototype's Draft rule (name only) is lighter than MCP's minimum (name, company, workspace type). Align before shipping.

## 8. Source kept in full

The original text is saved with the record, unedited, as a single note, together with the open questions. The agent's interpretation is derived; the source is the record.

- Prototype: `buildRequirement` in `RequirementsHome.tsx`.
- MCP: one initial note only. Later replies cannot be appended as notes, so they are used for field updates and not stored.

## 9. Show the real operations before approval

Before any write, list the actual operations that will happen, in the system's own terms. "Create requirement Chicago (Slalom), 1 workspace type" or "Add 6 workspaces to Denver Hub Collection, one at a time". No hidden steps.

- Prototype: Collection creation review in `CreateCollectionModal.tsx`.
- Why: this is the trust contract for any agent that writes to a real account.
- MCP: operations map one-to-one to tool calls. Where MCP does one workspace at a time, say so.

## 10. Visual identity (restrained)

One accent colour identifies the agent: green, used only on the agent icon, the opt-in button and the field markers. Panels are neutral gray. No "Agent" badges or labels on content; the marker is the identity.

## Constraints these patterns respect

- Nothing the MCP can't do is shown as if it can: no later notes, tasks, events or team writes, no assessment beyond counts, collections add one workspace at a time.
- Intake focuses on expressed customer needs. Where the customer should book is the Strategist's job, not Intake's.
- Assessment is mostly a human judgment; V1 shows tiers and gaps at creation and does not re-run an agent.
- Specs stay separate: Intake, Collection and HubSpot each have their own.

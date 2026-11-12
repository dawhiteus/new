# Transaction Manager Agents — Overview
Design close-out, Nov 2026

Three agents take a dedicated requirement from customer correspondence to a candidate list Sales can judge.

Each agent has two documents:
- **Spec (for engineering):** one page each, covering Job, Use cases, Rules and Acceptance criteria. Each rule is marked **Required** (a product requirement) or **Default** (the prototype's choice, open to engineering).
- **Design reference (for Figma):** every screen state and its exact copy, taken from the prototype. Layout and wording there are for design, not engineering requirements.

## How they connect
```
Customer email / notes / license
        │
        ▼
 Requirement Agent ──── creates or updates the Requirement (fields, initial note, open questions)
        │
        ▼
 Create Collection Agent ──── creates, populates and links a LiquidSpace Collection
        │
        ▼
 Assess Collection Agent ──── is the list good enough? N of M meet every criterion
        │                         │
        │       thin ─────────────┼──► Update Collection (search again) / Add Space / RFP outside TM
        │                         │
        └── requirement changes ──┴──► "changed since built" notice → Update → reassess
```

## Specs
| Agent | Spec (engineering) | Design reference (Figma) | Prototype entry |
|---|---|---|---|
| Requirement Agent | [requirement-agent-spec.md](requirement-agent-spec.md) | [requirement-agent-states.md](design-reference/requirement-agent-states.md) | Create Requirement; Requirement Details → Update Fields |
| Create Collection Agent | [collection-creation-spec.md](collection-creation-spec.md) | [create-collection-states.md](design-reference/create-collection-states.md) | Collection column → Create Collection |
| Assess Collection Agent | [collection-assessment-spec.md](collection-assessment-spec.md) | [assess-collection-states.md](design-reference/assess-collection-states.md) | Collection pill → Assess; row menu; Workflow tab |

Also: [agent-ui-patterns.md](agent-ui-patterns.md), the shared UI patterns (reference). [collection-assessment-history-spec.md](collection-assessment-history-spec.md) is **superseded** (June, tier-based).

Design file: [design-file/tm-agents-design-file.html](design-file/tm-agents-design-file.html), every screen state in one page, frame IDs as below. Figma: _add file links here._ Name frames by the state IDs in the design references (e.g. `Requirement / C6 Draft ready`, `Assess / A6 Requirement changed`) so each frame traces to one row.

## Principles shared by all three
1. **The agent proposes, a person decides.** Nothing is written until the user acts.
2. **Never claim what isn't known.** No guessed values, no inferred availability.
3. **Requirement fields are the single source of truth.** Collection agents read them, never write them.
4. **Observations, not verdicts.** Counts and gaps, no scores, no recommended next step.
5. **Opt-in and restrained identity.** Green agent icon, first-person voice, no "AI" badges.

## Prototype vs production
The browser demo uses recorded Pulse data for eight real LiquidSpace collections (Austin, Chicago, Minneapolis, Dallas, New York, Porto, Denver, Lisbon) and an in-memory store that resets on reload.

## Glossary
- **Requirement:** one customer need in one city.
- **Collection:** a LiquidSpace list of candidate spaces linked to a Requirement.
- **Headcount band:** −20% / +40% around headcount (5 → 4-7).
- **Current:** public listing updated within 90 days, or private listing with a valid quote.
- **Thin:** fewer than 5 current spaces meeting every criterion.
- **Groups:** Shortlist (chosen by a person), Favorites, Recommendations (the agent's matches).
- **Pulse:** LiquidSpace's analytics datasets, the source of per-space and per-venue facts.

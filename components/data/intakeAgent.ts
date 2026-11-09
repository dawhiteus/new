// PROTOTYPE. The Requirement Agent's behavior: read pasted correspondence, summarize what was understood,
// ask the questions that matter most, and propose changes when new correspondence arrives.
// Reading is done by a deterministic parser (requirementParser.ts), not a language model.
// The agent never invents values: anything it cannot find stays empty and becomes a question.

import { LICENSE_REGISTRY } from './licenseRegistry';
import { parseRequirement, fmtDate as fmtPDate, type ParsedScope, type PField } from './requirementParser';

export const AGENT_NAME = 'Requirement Agent';
export const AGENT_EMAIL = 'requirements.agent@ai.liquidspace.com';

export interface IntakeFields {
  company: string;
  status: string;
  name: string;
  location: string;
  workspaceType: string;
  capacity: string;
  size: string;
  programNeeds: string;
  amenityNeeds: string;
  configuration: string;
  otherFunctional: string;
  startDate: string;
  termLength: string;
  closeDate: string;
  budget: string;
  otherCommercial: string;
}

export type FieldKey = keyof IntakeFields;
/** 'source' = stated in the pasted text; 'license' = from the license record; 'suggested' = proposed, Sales to confirm. */
export type Provenance = { kind: 'source' | 'license' | 'suggested'; note: string; approx?: boolean; target?: boolean };

export interface OpenQuestion {
  field: FieldKey;
  tier: 'critical' | 'useful';
  text: string;
  /** A value the agent can estimate, offered as one click. Never applied automatically. */
  suggest?: { value: string; note: string };
}
export interface IntakeDraft {
  id: string;
  label: string;
  fields: IntakeFields;
  prov: Partial<Record<FieldKey, Provenance>>;
  /** Critical questions (needed for sourcing), as text. Kept for storage and display. */
  questions: string[];
  /** Useful-to-know questions, as text. */
  useful?: string[];
  open?: OpenQuestion[];
  /** Things the customer said that conflict, are conditional, or could not be read. Never applied. */
  ambiguities?: string[];
  /** Context kept from the text that has no field of its own. */
  notes?: string[];
}

export interface LicenseRecord {
  licenseId: string;
  operator: string;
  city: string;
  state: string;
  seats: number;
  sizeSf: number;
  monthlyCost: number;
  contractType: string;
  renewalMechanism: string;
  notificationPeriod: string;
  termEnd: string; // ISO
  customer?: string;
  noticeDate?: string; // ISO
}

export interface IntakeResult {
  drafts: IntakeDraft[];
  /** False when the text held no workplace requirement at all. */
  found: boolean;
  /** The customer's name, when the text has a signature or From line. */
  contact?: string;
  license?: LicenseRecord;
  licenseError?: string;
  sourceText: string;
  filledCount: number;
  totalCount: number;
}

export const REQUIRED: FieldKey[] = ['company', 'name', 'location', 'capacity', 'startDate', 'termLength', 'budget'];
export const FIELD_LABEL: Record<FieldKey, string> = {
  company: 'Company', status: 'Status', name: 'Requirement Name', location: 'Location', workspaceType: 'Workspace Type',
  capacity: 'Capacity / Headcount', size: 'Size (sq ft)', programNeeds: 'Program Needs', amenityNeeds: 'Amenity Needs',
  configuration: 'Configuration', otherFunctional: 'Other Functional Requirements', startDate: 'Start Date',
  termLength: 'Term Length (mos)', closeDate: 'Expected Close Date', budget: 'Budget ($/mo)', otherCommercial: 'Other Commercial Requirements',
};

const ATTEMPTED: FieldKey[] = ['company', 'name', 'location', 'workspaceType', 'capacity', 'size', 'programNeeds', 'amenityNeeds', 'configuration', 'otherFunctional', 'startDate', 'termLength', 'budget'];
export const WORKSPACE_TYPE_OPTIONS = ['Office Suite', 'Private Office', 'Team Office', 'Coworking', 'Meeting Space'];

export const emptyFields = (): IntakeFields => ({
  company: '', status: 'Active', name: '', location: '', workspaceType: '', capacity: '', size: '', programNeeds: '', amenityNeeds: '',
  configuration: '', otherFunctional: '', startDate: '', termLength: '', closeDate: '', budget: '', otherCommercial: '',
});

const fmtMoney = (n: number) => `$${n.toLocaleString('en-US')}`;
const fmtLong = (isoDate: string) => fmtPDate(isoDate);
const cap1 = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const lc = (s: string) => (/^[A-Z][a-z]/.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s);
const joinList = (a: string[]) => (a.length <= 1 ? a.join('') : a.length === 2 ? `${a[0]} and ${a[1]}` : `${a.slice(0, -1).join(', ')} and ${a[a.length - 1]}`);
const AREA = /^(?:Preferred|Required) area:/;

// Fields whose value shapes sourcing and any existing Collection.
export const SOURCING_FIELDS: FieldKey[] = ['location', 'capacity', 'size', 'workspaceType', 'budget', 'otherFunctional', 'startDate'];

// ── Questions: ordered by what they cost us if unanswered ─────────────────────────────────────────────
interface QCtx { where?: string; ambiguities?: string[]; prov?: Partial<Record<FieldKey, Provenance>>; termEnd?: string }
export function openQuestions(f: IntakeFields, ctx: QCtx = {}): OpenQuestion[] {
  const where = ctx.where ? ` for ${ctx.where}` : '';
  const amb = (word: RegExp) => (ctx.ambiguities ?? []).find((a) => word.test(a));
  const out: OpenQuestion[] = [];
  const q = (field: FieldKey, tier: OpenQuestion['tier'], text: string, suggest?: OpenQuestion['suggest']) => out.push({ field, tier, text, suggest });
  const has = (k: FieldKey) => !!String(f[k] ?? '').trim();

  // Critical: sourcing cannot start, or will aim at the wrong thing, without these.
  if (!has('location')) q('location', 'critical', 'Which city or market is this for?');
  if (!has('capacity')) {
    const a = amb(/Headcount/);
    q('capacity', 'critical', a && /gives/.test(a) ? `I saw ${a.match(/gives (.+?)\./)?.[1]?.replace(/ and /, ' and ')} people in the text. Which should we plan for${where}?` : `How many people will the space need to hold${where}?`);
  }
  if (!has('budget')) {
    const a = amb(/^Budget/);
    q('budget', 'critical', a && /€|£|did not convert/.test(a) ? `The budget was given in another currency. What is the monthly budget in USD${where}?`
      : a && /without saying/.test(a) ? `Is that budget per month or per year${where}?`
      : a && /per person/.test(a) ? `The budget was given per person. How many people, or what total monthly budget${where}?`
      : `What monthly budget should we plan around${where}?`);
  }
  if (!has('startDate')) {
    const a = amb(/^Start date/);
    q('startDate', 'critical', a && /gives/.test(a) ? `The text gives two start dates (${a.match(/gives (.+?)\. I left/)?.[1]}). Which one is right${where}?` : `What start date do they need${where}?${ctx.termEnd ? ` (Current term ends ${ctx.termEnd}.)` : ''}`);
  }

  // Useful: improves the results, but sourcing can begin without it.
  const sp = ctx.prov?.startDate;
  if (has('startDate') && sp?.kind === 'suggested') q('startDate', 'useful', `I read the start as ${fmtLong(f.startDate)}. Is that the actual day${where}?`);
  if (has('capacity') && ctx.prov?.capacity?.kind === 'suggested' && /hybrid/.test(ctx.prov.capacity.note)) q('capacity', 'useful', `Headcount is ${f.capacity}, but they run a hybrid schedule. How many seats are needed at peak${where}?`);
  if (!has('termLength')) q('termLength', 'useful', `How long a term are they planning${where}?`);
  if (!has('workspaceType')) q('workspaceType', 'useful', `What type of space do they want${where} (office suite, private office, team office, coworking, or meeting space)?`);
  if (has('location') && !AREA.test(f.otherFunctional) && !/area:/i.test(f.otherFunctional)) q('otherFunctional', 'useful', `Which neighborhoods, or what radius, should we search in ${f.location}?`);
  if (!has('size') && Number(f.capacity) > 0) {
    const est = Math.round((Number(f.capacity) * 150) / 50) * 50;
    q('size', 'useful', `Do they have a size in mind${where} (sq ft)? At about 150 sq ft per person, ${f.capacity} people would be roughly ${est.toLocaleString('en-US')} sq ft.`, { value: String(est), note: `Estimated at 150 sq ft per person from the headcount. Confirm with the customer.` });
  }
  if (!has('company')) q('company', 'useful', 'Which company is this requirement for?');
  const crit = out.filter((x) => x.tier === 'critical');
  const useful = out.filter((x) => x.tier === 'useful').slice(0, 4);
  return [...crit, ...useful];
}
export const OPTIONAL_FIELDS: { key: FieldKey; label: string }[] = [
  { key: 'closeDate', label: 'expected close date' }, { key: 'amenityNeeds', label: 'amenities' }, { key: 'programNeeds', label: 'program needs' },
  { key: 'configuration', label: 'single space or collection' }, { key: 'otherCommercial', label: 'other commercial terms' },
];
export const optionalMissing = (f: IntakeFields) => OPTIONAL_FIELDS.filter((o) => !String(f[o.key] ?? '').trim()).map((o) => o.label);
export const questionFieldMap = (qs: OpenQuestion[]) => Object.fromEntries(qs.map((q) => [q.text, q.field])) as Record<string, FieldKey>;

/** A ready-to-send note asking the customer for what is still missing. */
export function missingDetailsMessage(label: string, questions: string[], contact?: string): string {
  const first = contact?.split(' ')[0];
  return `${first ? `Hi ${first},` : 'Hi,'}\n\nThanks for the details${label ? ` on the ${label} requirement` : ''}. To start on options, could you tell us:\n\n${questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}\n\nThanks!`;
}

// ── Summary: generated from the fields as they stand ──────────────────────────────────────────────────
export interface AgentSummary { text: string; assumptions: string[]; needed: string[] }
const NEEDED_LABEL: Partial<Record<FieldKey, string>> = { location: 'the city', capacity: 'the headcount', budget: 'a monthly budget', startDate: 'a start date', termLength: 'the term', workspaceType: 'the type of space' };
export function summarize(f: IntakeFields, prov: Partial<Record<FieldKey, Provenance>> = {}, opts: { ambiguities?: string[] } = {}): AgentSummary {
  const typ = f.workspaceType ? f.workspaceType.toLowerCase() : 'workplace';
  const cap = Number(f.capacity) > 0 ? `${prov.capacity?.approx ? 'about ' : ''}${f.capacity} people` : '';
  const parts: string[] = [];
  parts.push(`I've identified a ${typ} requirement${f.company ? ` for ${f.company}` : ''}${f.location ? ` in ${f.location}` : ''}${cap ? ` for ${cap}` : ''}.`);
  if (Number(f.size) > 0) parts.push(`It needs ${prov.size?.approx ? 'about ' : ''}${Number(f.size).toLocaleString('en-US')} sq ft.`);
  const when = f.startDate ? `${prov.startDate?.target ? 'The target start is' : 'The start date is'} ${fmtLong(f.startDate)}` : '';
  const term = Number(f.termLength) > 0 ? `${Number(f.termLength) === 1 ? 'month-to-month' : `a ${f.termLength}-month term`}` : '';
  if (when && term) parts.push(`${when}, on ${term}.`); else if (when) parts.push(`${when}.`); else if (term) parts.push(`The term is ${term}.`);
  if (Number(f.budget) > 0) {
    const firm = /firm ceiling/i.test(f.otherCommercial);
    parts.push(`The budget is ${prov.budget?.approx || prov.budget?.target ? 'about ' : ''}${fmtMoney(Number(f.budget))} a month${firm ? ', a firm ceiling' : prov.budget?.target ? ', a target rather than a limit' : ''}.`);
  }
  const area = f.otherFunctional.split(/(?<=\.)\s+/).find((x) => AREA.test(x));
  if (area) parts.push(area);
  const assumptions = (Object.keys(prov) as FieldKey[])
    .filter((k) => prov[k]?.kind === 'suggested' && String(f[k] ?? '').trim() && k !== 'name')
    .map((k) => `${FIELD_LABEL[k].replace(/ \(.*\)/, '')}: ${prov[k]!.note.replace(/^“[^”]*”\s*/, '')}`.replace(/\.$/, ''));
  const qs = openQuestions(f, { prov, ambiguities: opts.ambiguities });
  const needed = qs.filter((x) => x.tier === 'critical').map((x) => NEEDED_LABEL[x.field] ?? FIELD_LABEL[x.field].toLowerCase());
  return { text: parts.join(' '), assumptions: assumptions.map((x) => x.replace(/From [^.]*? on [A-Z][a-z]{2} \d{1,2}, \d{4}\.\s*/, '')).filter(Boolean), needed };
}

// ── Reading ───────────────────────────────────────────────────────────────────────────────────────────
const toFieldProv = (sc: ParsedScope): Partial<Record<FieldKey, Provenance>> => {
  const out: Partial<Record<FieldKey, Provenance>> = {};
  (Object.keys(sc.prov) as PField[]).forEach((k) => {
    const p = sc.prov[k]!;
    out[k] = { kind: p.kind, note: p.note, ...(sc.approx[k] ? { approx: true } : {}), ...(sc.target[k] ? { target: true } : {}) };
  });
  return out;
};

export function runIntake(text: string, licenseIdRaw: string, opts: { today?: string } = {}): IntakeResult {
  const sourceText = text.trim();
  const licenseId = licenseIdRaw.trim().toUpperCase();
  let license: LicenseRecord | undefined;
  let licenseError: string | undefined;
  if (licenseId) {
    license = DEMO_LICENSES[licenseId];
    if (!license) licenseError = `I couldn't find license ${licenseId}, so I drafted from the text alone.`;
  }
  const parsed = parseRequirement(sourceText, { today: opts.today });
  const scopes = parsed.scopes.length ? parsed.scopes : [{ label: license?.city ?? '', city: '', data: { fields: {}, prov: {}, approx: {}, target: {}, tentative: {}, ambiguities: [], notes: [] } as ParsedScope }];
  const anyFound = scopes.some((s) => Object.keys(s.data.fields).some((k) => s.data.fields[k as PField]));
  const multi = scopes.length > 1;

  const drafts: IntakeDraft[] = scopes.map((sc, idx) => {
    const f = emptyFields();
    const prov: IntakeDraft['prov'] = toFieldProv(sc.data);
    (Object.keys(sc.data.fields) as PField[]).forEach((k) => { f[k] = String(sc.data.fields[k] ?? ''); });
    const city = sc.city;
    if (license?.customer && !f.company) { f.company = license.customer; prov.company = { kind: 'license', note: `License ${license.licenseId}: customer ${license.customer}` }; }

    // License record: facts help, terms are reference only.
    const sameCity = license && (!city || city.toLowerCase() === license.city.toLowerCase());
    if (license && sameCity) {
      if (!f.location) { f.location = license.city; prov.location = { kind: 'license', note: `License ${license.licenseId}: ${license.city}, ${license.state}` }; }
      if (!f.capacity) { f.capacity = String(license.seats); prov.capacity = { kind: 'license', note: `License ${license.licenseId}: ${license.seats} seats` }; }
      if (!f.size) { f.size = String(license.sizeSf); prov.size = { kind: 'license', note: `License ${license.licenseId}: ${license.sizeSf.toLocaleString()} sq ft` }; }
    }

    // Name: just the city (for example "Madrid").
    if (f.location) { f.name = f.location; prov.name = { kind: 'suggested', note: `Named after the location (${f.location}). Please edit.` }; }
    else if (license) { f.name = `${license.city} renewal`; prov.name = { kind: 'suggested', note: `Suggested from license ${license.licenseId}` }; }

    const ambiguities = sc.data.ambiguities.map((a) => a.text);
    const open = openQuestions(f, {
      where: multi ? (city || f.location) : '', ambiguities, prov,
      termEnd: license && sameCity && license.termEnd ? fmtLong(license.termEnd) : '',
    });
    return {
      id: `draft-${idx}`, label: sc.label || f.location || 'Requirement', fields: f, prov,
      // Everything still missing, most important first: this is what gets sent back to the customer.
      questions: open.map((x) => x.text),
      useful: [],
      open, ambiguities, notes: sc.data.notes,
    };
  });
  const filledCount = drafts.reduce((n, d) => n + ATTEMPTED.filter((k) => d.fields[k]).length, 0);
  return { drafts, found: anyFound || !!license, contact: parsed.contact, license, licenseError, sourceText, filledCount, totalCount: ATTEMPTED.length * drafts.length };
}

// ── Updates: new correspondence against what is already recorded ──────────────────────────────────────
export interface FieldChange {
  field: FieldKey; from: string; to: string;
  kind: 'new' | 'changed' | 'added';
  /** What the text said, and any assumption the agent made reading it. */
  note: string;
  inferred: boolean;
  approx?: boolean; target?: boolean;
  sourcing: boolean;
  /** For long text fields: just the part that changed, for display. */
  shown?: string; shownFrom?: string;
}
export interface UpdateProposal {
  changes: FieldChange[];
  /** Fields the text repeats that the record already has. */
  unchanged: FieldKey[];
  /** Things the text says that conflict, are tentative or conditional. Not applied. */
  unclear: string[];
  notes: string[];
  /** Plain statement of what the changes mean for sourcing or an existing Collection. */
  consequence: string | null;
  /** True when the text contained any requirement detail at all. */
  found: boolean;
}
const UPDATE_ORDER: FieldKey[] = ['company', 'location', 'workspaceType', 'capacity', 'size', 'programNeeds', 'amenityNeeds', 'configuration', 'otherFunctional', 'startDate', 'termLength', 'closeDate', 'budget', 'otherCommercial'];
const norm = (k: FieldKey, v: string) => (['capacity', 'size', 'budget', 'termLength'].includes(k) ? String(Number(v)) : v.trim().toLowerCase().replace(/[.\s]+$/, ''));
const items = (v: string) => v.replace(/\.$/, '').split(/,\s*|\s+and\s+/).map((x) => x.trim()).filter(Boolean);
const sentences = (v: string) => v.split(/(?<=[.!?])\s+/).map((x) => x.trim()).filter(Boolean);
const TENTATIVE_FALLBACK = /\b(maybe|perhaps|probably|possibly|might|not sure|unsure|tentative|tbd|not decided|undecided)\b/i;

export function proposeUpdate(current: Partial<IntakeFields>, text: string, opts: { today?: string; hasCollection?: boolean } = {}): UpdateProposal {
  const cur = { ...emptyFields(), ...current } as IntakeFields;
  const empty: UpdateProposal = { changes: [], unchanged: [], unclear: [], notes: [], consequence: null, found: false };
  const short = text.trim().split(/\s+/).length <= 40;
  const res = parseRequirement(text, { today: opts.today, answerMode: short });
  if (res.empty || !res.scopes.length) return empty;
  const notes: string[] = [];
  let sc = res.scopes[0];
  if (res.scopes.length > 1) {
    const mine = res.scopes.find((s) => s.city.toLowerCase() === (cur.location || '').split(',')[0].trim().toLowerCase());
    if (!mine) return { ...empty, found: true, unclear: [`That text covers ${joinList(res.scopes.map((s) => s.city))}. This requirement is for ${cur.location || 'another location'}, so I applied nothing. Create a separate requirement for the others.`] };
    sc = mine;
    notes.push(`The text also covers ${joinList(res.scopes.filter((s) => s !== mine).map((s) => s.city))}. I only read the part about ${mine.city}.`);
  }
  const d = sc.data;
  const hasAny = Object.values(d.fields).some(Boolean);
  const unclear: string[] = d.ambiguities.map((a) => a.text);
  notes.push(...d.notes.filter((n) => !/currently in/.test(n)));
  const changes: FieldChange[] = []; const unchanged: FieldKey[] = [];

  UPDATE_ORDER.forEach((k) => {
    const raw = d.fields[k as PField]; if (!raw) return;
    const old = String(cur[k] ?? '');
    const p = d.prov[k as PField];
    const base = { field: k, inferred: p?.kind === 'suggested', approx: !!d.approx[k as PField], target: !!d.target[k as PField], sourcing: SOURCING_FIELDS.includes(k), note: p?.note ?? 'Stated in the text.' };
    // tentative statements never overwrite an existing value
    if (old && d.tentative[k as PField] && norm(k, raw) !== norm(k, old)) { unclear.push(`${FIELD_LABEL[k]}: the text suggests ${raw} but sounds unsure. The record keeps ${old}.`); return; }
    if (k === 'company' && old) return;
    if (k === 'location' && old && raw.toLowerCase() !== old.split(',')[0].trim().toLowerCase()) {
      changes.push({ ...base, kind: 'changed', from: old, to: raw, note: `${base.note} This is a different location from the one on record.` }); return;
    }
    if (k === 'programNeeds' || k === 'amenityNeeds') {
      const oldItems = items(old).map((x) => x.toLowerCase());
      const add = items(raw).map(lc).filter((x) => !oldItems.some((o) => o === x.toLowerCase() || o.includes(x.toLowerCase()) || x.toLowerCase().includes(o)));
      if (!add.length) { if (old) unchanged.push(k); return; }
      changes.push({ ...base, kind: old ? 'added' : 'new', from: old, to: old ? `${old.replace(/\.$/, '')}, ${add.join(', ')}.` : cap1(joinList(add)) + '.' });
      return;
    }
    if (k === 'otherFunctional') {
      const newArea = sentences(raw).filter((x) => AREA.test(x)); const newRest = sentences(raw).filter((x) => !AREA.test(x));
      const oldS = sentences(old); const oldArea = oldS.filter((x) => AREA.test(x));
      let result = old; let did = false; let fromShow = ''; let toShow = '';
      if (newArea.length && norm(k, newArea.join(' ')) !== norm(k, oldArea.join(' '))) {
        result = [...newArea, ...oldS.filter((x) => !AREA.test(x))].join(' '); did = true; fromShow = oldArea.join(' '); toShow = newArea.join(' ');
      } else if (newArea.length) unchanged.push(k);
      const addRest = newRest.filter((x) => !old.toLowerCase().includes(x.toLowerCase().replace(/[.\s]+$/, '')));
      if (addRest.length) { result = [result, ...addRest].filter(Boolean).join(' '); did = true; toShow = [toShow, ...addRest].filter(Boolean).join(' '); }
      if (did) changes.push({ ...base, kind: fromShow ? 'changed' : old ? 'added' : 'new', from: fromShow, to: result, note: base.note, shown: toShow || undefined });
      return;
    }
    if (k === 'otherCommercial') {
      const add = sentences(raw).filter((x) => !old.toLowerCase().includes(x.toLowerCase().replace(/[.\s]+$/, '')));
      if (!add.length) { if (old) unchanged.push(k); return; }
      changes.push({ ...base, kind: old ? 'added' : 'new', from: old, to: [old, ...add].filter(Boolean).join(' ') });
      return;
    }
    if (old && norm(k, raw) === norm(k, old)) { unchanged.push(k); return; }
    changes.push({ ...base, kind: old ? 'changed' : 'new', from: old, to: raw });
  });

  const sourcing = changes.filter((c) => c.sourcing && c.kind !== 'new');
  const consequence = opts.hasCollection && changes.some((c) => c.sourcing)
    ? `${cap1(joinList(changes.filter((c) => c.sourcing)  .map((c) => FIELD_LABEL[c.field].replace(/ \(.*\)/, '').toLowerCase())))} ${changes.filter((c) => c.sourcing).length === 1 ? 'is' : 'are'} used to build the Collection. The Collection is not changed automatically; once you apply this you can choose Update collection.`
        : null;
  void TENTATIVE_FALLBACK;
  return { changes, unchanged, unclear: [...new Set(unclear)], notes: [...new Set(notes)], consequence, found: hasAny || unclear.length > 0 };
}

export interface AppliedFields { fields: Partial<IntakeFields>; prov: Partial<Record<FieldKey, Provenance>> }
/** Turn accepted changes into field values and provenance. Existing values the changes don't touch are left alone. */
export function applyChanges(changes: FieldChange[], today = new Date().toISOString().slice(0, 10), source = 'your update'): AppliedFields {
  const fields: Partial<IntakeFields> = {}; const prov: Partial<Record<FieldKey, Provenance>> = {};
  changes.forEach((c) => {
    fields[c.field] = c.to;
    prov[c.field] = { kind: c.inferred ? 'suggested' : 'source', note: `From ${source} on ${fmtLong(today)}. ${c.note}`.trim(), ...(c.approx ? { approx: true } : {}), ...(c.target ? { target: true } : {}) };
  });
  return { fields, prov };
}
export const describeChange = (c: FieldChange) => `${FIELD_LABEL[c.field].replace(/ \(.*\)/, '')}: ${c.from ? shortVal(c.field, c.from) + ' → ' : ''}${shortVal(c.field, c.shown ?? c.to)}`;
export const shortVal = (k: FieldKey, v: string) => (k === 'startDate' || k === 'closeDate') && /^\d{4}-\d{2}-\d{2}$/.test(v) ? fmtLong(v) : k === 'budget' && Number(v) ? fmtMoney(Number(v)) : v;

// Demo license fixtures (License Administrator is not connected in the prototype).
export const DEMO_LICENSES: Record<string, LicenseRecord> = Object.fromEntries(LICENSE_REGISTRY.map((l) => [l.licenseId, l]));

export const SAMPLE_EMAIL = `Hi Brent,

We're expanding the Slalom team in Europe and need space in Lisbon and Porto. Lisbon first: about 25 people, starting October 1, 2026 for 12 months. We'd like private offices with phone booths and a reception, ideally in Saldanha or Avenidas Novas. Budget is around $30,000 per month for Lisbon. Porto is smaller, roughly 10 people, starting January 2027, no budget yet - we're still deciding on the model. Can you send options?

Thanks,
Maria Alves
Slalom`;

export const SAMPLE_RENEWAL = `Hi,

Our New York license is up soon and we'd like to renew, but we expect to be closer to 25 people by then and want to look at lower-cost options. Same area is fine. We'd want to start April 1, 2027.

Thanks,
Dan Whitfield
Tel Tech Corporation`;

export const SAMPLE_RENEWAL_LICENSE = 'TT-2023-003';

export const licenseTermsReference = (l: LicenseRecord) => [
  { label: 'Current monthly cost', value: fmtMoney(l.monthlyCost) },
  { label: 'Term ends', value: l.termEnd ? fmtLong(l.termEnd) : 'Auto-renews' },
  { label: 'Contract type', value: l.contractType },
  { label: 'Renewal mechanism', value: l.renewalMechanism },
  { label: 'Notice period', value: l.notificationPeriod },
  ...(l.noticeDate ? [{ label: 'Customer must decide by', value: fmtLong(l.noticeDate) }] : []),
];

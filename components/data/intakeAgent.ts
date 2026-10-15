// PROTOTYPE ONLY. A scripted stand-in for the Requirements Intake Agent.
// It uses simple pattern matching so the *experience* can be demonstrated
// end-to-end; it is not an extraction implementation and is tuned for the
// sample inputs below. The agent never invents values: anything it cannot
// find in the source stays empty and becomes a question for the customer.

export const AGENT_NAME = 'Requirements Intake Agent';
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
export type Provenance = { kind: 'source' | 'license' | 'suggested'; note: string };

export interface IntakeDraft {
  id: string;
  label: string;
  fields: IntakeFields;
  prov: Partial<Record<FieldKey, Provenance>>;
  questions: string[];
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
}

export interface IntakeResult {
  drafts: IntakeDraft[];
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
// Fields the agent attempts to fill (Status is a default, not an extraction).
const ATTEMPTED: FieldKey[] = ['company', 'name', 'location', 'workspaceType', 'capacity', 'size', 'programNeeds', 'amenityNeeds', 'configuration', 'otherFunctional', 'startDate', 'termLength', 'budget'];

// Demo license fixtures (License Administrator is not connected in the prototype).
export const DEMO_LICENSES: Record<string, LicenseRecord> = {
  'SLA-2024-014': {
    licenseId: 'SLA-2024-014', operator: 'Hays Office Properties', city: 'Minneapolis', state: 'MN', seats: 28, sizeSf: 4200,
    monthlyCost: 7200, contractType: 'Fixed-Term', renewalMechanism: 'Auto-Renewal', notificationPeriod: '90 Days', termEnd: '2027-03-31',
  },
  'SLA-2023-007': {
    licenseId: 'SLA-2023-007', operator: 'Regus', city: 'Dallas', state: 'TX', seats: 40, sizeSf: 5000,
    monthlyCost: 11800, contractType: 'Fixed-Term', renewalMechanism: 'Renewal by Mutual Agreement', notificationPeriod: '60 Days', termEnd: '2027-01-31',
  },
};

export const SAMPLE_EMAIL = `Hi Brent,

We're expanding the Slalom team in Europe and need space in Lisbon and Porto. Lisbon first: about 25 people, starting October 1, 2026 for 12 months. We'd like private offices with phone booths and a reception, ideally in Saldanha or Avenidas Novas. Budget is around $30,000 per month for Lisbon. Porto is smaller, roughly 10 people, starting January 2027, no budget yet - we're still deciding on the model. Can you send options?

Thanks,
Maria Alves
Slalom`;

export const SAMPLE_RENEWAL = `Hi,

Our Minneapolis license is up at the end of March and we'd like to renew, but we expect to be closer to 20 people by then and want to look at lower-cost options. Same area is fine. We'd want to start April 1, 2027.

Thanks,
Dan Whitfield
Hays & Co`;

export const SAMPLE_RENEWAL_LICENSE = 'SLA-2024-014';

const CITIES = ['Lisbon', 'Porto', 'Madrid', 'Barcelona', 'Paris', 'London', 'Berlin', 'Denver', 'Austin', 'Dallas', 'Chicago', 'Boston', 'Seattle', 'Minneapolis', 'Atlanta', 'New York', 'San Francisco', 'Los Angeles'];
const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

const emptyFields = (): IntakeFields => ({
  company: '', status: 'Active', name: '', location: '', workspaceType: '', capacity: '', size: '', programNeeds: '', amenityNeeds: '',
  configuration: '', otherFunctional: '', startDate: '', termLength: '', closeDate: '', budget: '', otherCommercial: '',
});

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const iso = (y: number, m: number, d: number) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
const addDay = (isoDate: string) => {
  const [y, m, d] = isoDate.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + 1));
  return dt.toISOString().slice(0, 10);
};
const fmtMoney = (n: number) => `$${n.toLocaleString('en-US')}`;
const fmtLong = (isoDate: string) => {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

function splitSentences(text: string): string[] {
  return text
    .split(/\n+/)
    .flatMap((line) => line.split(/(?<=[.!?])\s+/))
    .map((s) => s.trim())
    .filter(Boolean);
}

function findCompany(text: string): { value: string; quote: string } | null {
  const m = text.match(/\b(?:the|our)\s+([A-Z][\w&]+(?:\s[A-Z][\w&]+)?)\s+(?:team|office|company|group)\b/);
  if (m) return { value: m[1], quote: m[0] };
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const last = lines[lines.length - 1];
  const prev = lines[lines.length - 2];
  if (last && /^[A-Z][\w&.,' -]{1,40}$/.test(last) && prev && /^[A-Z][a-z]+(?:\s[A-Z][a-z]+)+$/.test(prev) && !/[.!?]$/.test(last)) {
    return { value: last, quote: `${prev} / ${last}` };
  }
  return null;
}

function amenities(seg: string) {
  const prog: string[] = [];
  const amen: string[] = [];
  const progVocab: [RegExp, string][] = [[/private offices?/i, 'private offices'], [/meeting rooms?/i, 'meeting rooms'], [/team rooms?/i, 'team rooms'], [/open (?:workstations|plan)/i, 'open workstations']];
  const amenVocab: [RegExp, string][] = [[/phone booths?/i, 'phone booths'], [/reception/i, 'reception'], [/badge/i, 'secure badge access'], [/parking/i, 'parking'], [/kitchen|pantry/i, 'kitchen/pantry'], [/bike/i, 'bike storage']];
  progVocab.forEach(([re, label]) => re.test(seg) && prog.push(label));
  amenVocab.forEach(([re, label]) => re.test(seg) && amen.push(label));
  return { prog, amen };
}

function parseSegment(seg: string, city: string) {
  const out: { fields: Partial<IntakeFields>; prov: Partial<Record<FieldKey, Provenance>>; hedged: boolean } = { fields: {}, prov: {}, hedged: false };
  const set = (k: FieldKey, v: string, quote: string) => { out.fields[k] = v; out.prov[k] = { kind: 'source', note: quote }; };

  const hc = seg.match(/(?:(about|roughly|approximately|around|up to|closer to)\s+)?(\d{1,4})\s*(?:people|employees|staff|seats|desks|team members)/i);
  if (hc) { set('capacity', hc[2], hc[0]); if (hc[1]) out.hedged = true; }

  const bud = seg.match(/\$\s?([\d,]+(?:\.\d+)?)\s*(k)?\s*(?:\/|per|a)\s*(month|mo|year|yr|annum)/i);
  if (bud) {
    let n = parseFloat(bud[1].replace(/,/g, ''));
    if (bud[2]) n *= 1000;
    const annual = /year|yr|annum/i.test(bud[3]);
    if (annual) n = Math.round(n / 12);
    set('budget', String(n), annual ? `${bud[0]} (annual, converted to monthly)` : bud[0]);
  }

  const term = seg.match(/(?:for|term of)\s+(\d{1,3})\s*(months?|years?)/i);
  if (term) set('termLength', String(/year/i.test(term[2]) ? parseInt(term[1], 10) * 12 : parseInt(term[1], 10)), term[0]);

  const full = seg.match(new RegExp(`(?:starting|start|from|beginning|begin|by)\\s+(?:on\\s+)?(${MONTHS.join('|')})\\s+(\\d{1,2})(?:st|nd|rd|th)?,?\\s+(\\d{4})`, 'i'));
  if (full) set('startDate', iso(parseInt(full[3], 10), MONTHS.indexOf(full[1].toLowerCase()) + 1, parseInt(full[2], 10)), full[0]);

  const typeMap: [RegExp, string][] = [[/private offices?/i, 'Private Office'], [/team offices?/i, 'Team Office'], [/co-?working|flex space/i, 'Coworking'], [/office suites?/i, 'Office Suite'], [/meeting space/i, 'Meeting Space']];
  for (const [re, label] of typeMap) {
    const m = seg.match(re);
    if (m) { set('workspaceType', label, m[0]); break; }
  }

  const sz = seg.match(/([\d,]{3,6})\s*(?:sq\.?\s*ft|sqft|sf|square feet)/i);
  if (sz) set('size', sz[1].replace(/,/g, ''), sz[0]);

  const { prog, amen } = amenities(seg);
  if (prog.length) set('programNeeds', cap(prog.join(', ')) + '.', prog.join(', '));
  if (amen.length) set('amenityNeeds', cap(amen.join(', ').replace(/, ([^,]*)$/, ' and $1')) + '.', amen.join(', '));

  const pref = seg.match(/(?:ideally|preferably|preferred)\s+in\s+([^.]+)/i);
  if (pref) set('otherFunctional', `Preferred areas: ${pref[1].trim().replace(/\s+or\s+/i, ', ')}.`, pref[0]);

  if (/\b(?:one|a single|single)\b[^.]*\b(?:office|space|location)\b/i.test(seg)) {
    const m = seg.match(/\b(?:one|a single|single)\b[^.]*\b(?:office|space|location)\b/i)!;
    set('configuration', 'Single space', m[0]);
  }
  void city;
  return out;
}

function questionsFor(city: string, f: IntakeFields, hedged: boolean, startMonthOnly: string | null, multi: boolean): string[] {
  const where = multi ? ` for ${city}` : '';
  const q: string[] = [];
  if (!f.budget) q.push(`What monthly budget should we plan around${where}?`);
  if (!f.startDate) q.push(startMonthOnly ? `Which day in ${startMonthOnly} do they need to start${where}?` : `What start date do they need${where}?`);
  if (!f.termLength) q.push(`How long a term are they planning${where}?`);
  if (!f.capacity) q.push(`How many people will the space need to hold${where}?`);
  else if (hedged) q.push(`Is ${f.capacity} people${where} the day-one headcount or a projection?`);
  if (!f.workspaceType) q.push(`What type of space do they want${where} (private offices, team office, coworking)?`);
  if (!f.size && q.length < 5) q.push(`Do they have a size in mind${where} (sq ft)?`);
  return q.slice(0, 5);
}

export function runIntake(text: string, licenseIdRaw: string): IntakeResult {
  const sourceText = text.trim();
  const licenseId = licenseIdRaw.trim().toUpperCase();
  let license: LicenseRecord | undefined;
  let licenseError: string | undefined;
  if (licenseId) {
    license = DEMO_LICENSES[licenseId];
    if (!license) licenseError = `I couldn't find license ${licenseId}, so I drafted from the text alone.`;
  }

  const company = findCompany(sourceText);
  const sentences = splitSentences(sourceText);

  // Which cities does the source talk about?
  const mentioned = CITIES.filter((c) => new RegExp(`\\b${c}\\b`, 'i').test(sourceText));
  const cities = mentioned.length ? mentioned : license ? [license.city] : [];

  // Assign each sentence to a city: exactly one city -> that city; several -> shared preamble; none -> previous segment.
  const segs: Record<string, string[]> = {};
  cities.forEach((c) => (segs[c] = []));
  let current: string | null = cities.length === 1 ? cities[0] : null;
  const shared: string[] = [];
  sentences.forEach((s) => {
    const hits = cities.filter((c) => new RegExp(`\\b${c}\\b`, 'i').test(s));
    if (hits.length === 1) { current = hits[0]; segs[current].push(s); }
    else if (hits.length > 1) shared.push(s);
    else if (current) segs[current].push(s);
    else shared.push(s);
  });

  const multi = cities.length > 1;
  const drafts: IntakeDraft[] = (cities.length ? cities : ['']).map((city, idx) => {
    const seg = (multi ? segs[city].join(' ') : sourceText) || '';
    const parsed = parseSegment(seg, city);
    const f = emptyFields();
    const prov: IntakeDraft['prov'] = { ...parsed.prov };
    Object.assign(f, parsed.fields);

    if (city) {
      f.location = city;
      prov.location = { kind: 'source', note: `Mentioned as “${city}”` };
      f.name = city;
      prov.name = { kind: 'source', note: `Named after the location (${city})` };
    }
    if (company) { f.company = company.value; prov.company = { kind: 'source', note: company.quote }; }

    if (!f.name && f.company) { f.name = `${f.company} requirement`; prov.name = { kind: 'suggested', note: 'Named after the company. Please edit.' }; }

    // License record: facts help, terms are reference only.
    if (license && (!city || city.toLowerCase() === license.city.toLowerCase())) {
      if (!f.location) { f.location = license.city; prov.location = { kind: 'license', note: `License ${license.licenseId}: ${license.city}, ${license.state}` }; }
      f.name = `${license.city} renewal`; prov.name = { kind: 'suggested', note: `Suggested from license ${license.licenseId}` };
      if (!f.capacity) { f.capacity = String(license.seats); prov.capacity = { kind: 'license', note: `License ${license.licenseId}: ${license.seats} seats` }; }
      if (!f.size) { f.size = String(license.sizeSf); prov.size = { kind: 'license', note: `License ${license.licenseId}: ${license.sizeSf.toLocaleString()} sq ft` }; }
      if (!f.startDate) { f.startDate = addDay(license.termEnd); prov.startDate = { kind: 'suggested', note: `Day after the current term ends (${fmtLong(license.termEnd)}). Please confirm.` }; }
    }

    // Month-only start dates are ambiguous: leave blank and ask.
    let startMonthOnly: string | null = null;
    if (!f.startDate) {
      const mo = seg.match(new RegExp(`(?:starting|start|from|beginning|by)\\s+(?:in\\s+)?(${MONTHS.join('|')})\\s+(\\d{4})`, 'i'));
      if (mo) startMonthOnly = `${cap(mo[1])} ${mo[2]}`;
    }

    const filled = ATTEMPTED.filter((k) => f[k]).length;
    return {
      id: `draft-${idx}`,
      label: city || 'Requirement',
      fields: f,
      prov,
      questions: questionsFor(city || 'this location', f, parsed.hedged, startMonthOnly, multi),
      _filled: filled,
    } as IntakeDraft & { _filled: number };
  });

  const filledCount = drafts.reduce((n, d) => n + ATTEMPTED.filter((k) => d.fields[k]).length, 0);
  return { drafts, license, licenseError, sourceText, filledCount, totalCount: ATTEMPTED.length * drafts.length };
}

export const licenseTermsReference = (l: LicenseRecord) => [
  { label: 'Current monthly cost', value: fmtMoney(l.monthlyCost) },
  { label: 'Term ends', value: fmtLong(l.termEnd) },
  { label: 'Contract type', value: l.contractType },
  { label: 'Renewal mechanism', value: l.renewalMechanism },
  { label: 'Notice period', value: l.notificationPeriod },
];

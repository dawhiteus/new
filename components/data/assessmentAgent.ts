// Scripted Collection Assessment Agent (prototype). Computes from the recorded Pulse facts in assessmentData.ts.
// The rules are written in docs/collection-assessment-spec.md so that one definition of a match exists.
import { criteriaFor, capacityBand } from './collectionAgent';
import { CENTERS, collectionSpaces, collectionCityFor, marketPool, builtByAgent, venueStats, venueKey, type AssessSpace } from './assessmentData';
import type { MvpRequirement } from './mvpRequirements';

export type Status = 'Plenty' | 'Few' | 'None';
type Dim = 'pass' | 'near' | 'fail' | 'na';

/** The values a person can adjust. They map one to one onto the Requirement. */
export interface Values {
  location: string;
  type: string;
  capacity: number | null;
  budget: number | null;
  radiusMi: number;
}

export interface AssessCriteria extends Values {
  city: string;
  centerLabel: string;
  lat: number;
  lng: number;
  radiusIsDefault: boolean;
  termMonths: number | null;
}

export interface SpaceResult {
  space: AssessSpace;
  miles: number;
  fit: boolean;
  confirmed: boolean;
  ageDays: number;
  reason: string;
  issues: string[];
  facts: string;
  /** Further recorded facts about the space and its venue: booking method, response, reviews, demand, dedicated record. */
  extra: string[];
  /** Which criteria this space meets: true, false, or null when the requirement does not state it (or the rate is unknown). */
  pass: { area: boolean; capacity: boolean | null; budget: boolean | null; type: boolean | null };
  /** Venue and listing facts, for the expanded row. */
  detail: { k: string; v: string }[];
}

/** The workflow's test: a collection is thin below this many confirmed spaces. */
export const CONFIRMED_NEEDED = 5;

export type ReqPatch = { location?: string; type?: string; budget?: number | null; capacity?: number | null; searchArea?: string };

export interface Assessment {
  state: 'ok' | 'unlocated' | 'unrecorded';
  status: Status;
  statusText: string;
  /** One short line for the heading. */
  verdict: string;
  /** One card per criterion the requirement gives: how many spaces meet it. */
  cards: { label: string; n: number; of: number }[];
  summary: string;
  gapsTitle: string;
  gaps: { label: string; text: string }[];
  next?: string;
  total: number;
  inArea: number;
  withinBudget: number | null;
  forPeople: number | null;
  confirmedFits: number;
  marketMore: number;
  marketFits: SpaceResult[];
  results: SpaceResult[];
  criteria: AssessCriteria;
  bandText: string | null;
  empty: boolean;
}

const money = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;
const miles = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const R = 3958.8, rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};
const median = (xs: number[]) => { const s = [...xs].sort((a, b) => a - b); const m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const daysAgo = (iso: string) => Math.max(0, Math.round((Date.now() - new Date(iso + 'T00:00:00').getTime()) / 86400000));
const cityKey = (loc: string) => loc.toLowerCase().split(',')[0].trim();
const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`;

/** The current Requirement values the agent works from. */
export function currentValues(r: MvpRequirement): Values {
  const c = criteriaFor(r);
  const sa = (r.details.otherFunctional || '').match(/within\s+(\d+(?:\.\d+)?)\s*miles?/i);
  return { location: (c.location || r.city || '').trim(), type: c.workspaceType || '', capacity: c.capacity, budget: c.budget, radiusMi: sa ? parseFloat(sa[1]) : 5 };
}

/** Every requirement with a collection can be assessed. */
export const canAssess = (r: MvpRequirement) => !!r.collection;

/** Spaces added by hand to a requirement's collection in this session (the demo cannot write to MCP). */
const addedSpaces = new Map<string, AssessSpace[]>();
export const addedCount = (id: string) => addedSpaces.get(id)?.length ?? 0;
export const hasSpace = (r: MvpRequirement, sp: AssessSpace) => membersFor(r).members.some((m) => (m.url && sp.url && m.url === sp.url) || m.id === sp.id);
export function addSpace(r: MvpRequirement, sp: AssessSpace) { addedSpaces.set(r.id, [...(addedSpaces.get(r.id) ?? []), { ...sp, inCollection: true, addedByHand: true }]); }

function membersFor(r: MvpRequirement): { members: AssessSpace[]; recorded: boolean } {
  const key = collectionCityFor(r.collection?.url);
  const members = [...(key ? collectionSpaces(key) : []), ...(addedSpaces.get(r.id) ?? [])];
  const total = r.collection?.totalSpaces ?? 0;
  return { members, recorded: members.length > 0 || total === 0 };
}

function evaluate(sp: AssessSpace, c: AssessCriteria, medians: Record<string, number>): SpaceResult {
  const mi = miles(sp, c);
  const area: Dim = mi <= c.radiusMi ? 'pass' : 'fail';
  let capacity: Dim = 'na';
  if (c.capacity) { const [lo, hi] = capacityBand(c.capacity); capacity = sp.desks >= lo && sp.desks <= hi ? 'pass' : sp.desks > hi ? 'near' : 'fail'; }
  let budget: Dim | 'unknown' = 'na';
  if (c.budget) budget = sp.rate == null ? 'unknown' : sp.rate <= c.budget ? 'pass' : 'fail';
  const type: Dim = c.type ? (sp.type === c.type ? 'pass' : 'fail') : 'na';
  const fit = area === 'pass' && (capacity === 'pass' || capacity === 'na') && (budget === 'pass' || budget === 'unknown' || budget === 'na') && (type === 'pass' || type === 'na');
  const priv = sp.visibility === 'Private';
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const quoteOk = priv ? !sp.validUntil || new Date(sp.validUntil + 'T23:59:59') >= today : false;
  const age = priv ? 0 : daysAgo(sp.modified);
  const perSeat = sp.rate != null && sp.desks ? sp.rate / sp.desks : null;
  const mps = medians[sp.type];

  const issues: string[] = [];
  if (area !== 'pass') issues.push(`${mi.toFixed(1)} mi from ${c.centerLabel}`);
  if (budget === 'fail') issues.push(`${money((sp.rate as number) - (c.budget as number))}/mo over budget`);
  if (capacity === 'near') issues.push(`larger than needed (${sp.desks} seats)`);
  if (capacity === 'fail') issues.push(`holds ${sp.desks}, needs ${c.capacity}`);
  if (type === 'fail') issues.push(`not ${c.type}`);
  if (perSeat != null && mps && perSeat > mps * 1.15) issues.push('over the local market rate');
  if (!priv && age > 90) issues.push(`listing not updated in ${age} days`);
  if (priv && !quoteOk) issues.push('quote has expired');
  const fdate = (d: string) => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const facts = [`${mi.toFixed(1)} mi`, `${sp.desks} seats`, sp.rate != null ? `${money(sp.rate)}/mo` : 'not priced monthly', priv ? (sp.validUntil ? `quote valid until ${fdate(sp.validUntil)}` : 'quote validity not given') : `updated ${age} day${age === 1 ? '' : 's'} ago`].join(' · ');
  const st = venueStats(sp.url);
  const rt = st?.responseMin ? (st.responseMin < 60 ? `${Math.round(st.responseMin)} min` : st.responseMin < 1440 ? `${Math.round(st.responseMin / 60)} h` : `${Math.round(st.responseMin / 1440)} days`) : '';
  const extra = [
    priv ? 'Private (from a venue proposal)' : 'Public',
    priv && sp.availableFrom ? `available from ${fdate(sp.availableFrom)}` : '',
    sp.addedByHand ? 'added by hand' : '',
    sp.booking || '',
    rt ? `venue replies in ${rt}${st?.responseRate ? ` (${Math.round(st.responseRate)}% rate)` : ''}` : '',
    st?.reviews ? `${st.stars} stars (${st.reviews} review${st.reviews === 1 ? '' : 's'})` : '',
    st?.leads12 || st?.tours12 ? `${plural(st.leads12 ?? 0, 'lead')}, ${plural(st.tours12 ?? 0, 'tour')} in 12 mo` : '',
    st?.dedicatedSpaces ? `dedicated contracts on record (last billed ${st.lastDedicated})` : '',
  ].filter(Boolean);
  const detail: { k: string; v: string }[] = [
    { k: 'Booking', v: sp.booking || 'Not recorded' },
    ...(priv ? [{ k: 'Quote valid until', v: sp.validUntil ? fdate(sp.validUntil) : 'Not given' }, { k: 'Available from', v: sp.availableFrom ? fdate(sp.availableFrom) : 'Not given' }] : [{ k: 'Listing updated', v: `${age} day${age === 1 ? '' : 's'} ago${age > 90 ? ' (over 90 days)' : ''}` }]),
    { k: 'Minimum term', v: sp.minTerm || 'Not recorded' },
    ...(perSeat != null && mps && perSeat > mps * 1.15 ? [{ k: 'Rate', v: 'More than 15% above the local market per seat' }] : []),
    { k: 'Guest reviews', v: st?.reviews ? `${st.stars} stars (${st.reviews})` : st ? 'None' : 'No venue record' },
    { k: 'Last 12 months', v: st ? `${plural(st.leads12 ?? 0, 'lead')}, ${plural(st.tours12 ?? 0, 'tour')}` : 'No venue record' },
    { k: 'Lead response', v: rt ? `${rt}${st?.responseRate ? ` (${Math.round(st.responseRate)}% rate)` : ''}` : 'Not recorded' },
    { k: 'Dedicated contracts', v: st?.dedicatedSpaces ? `On record at this venue, last billed ${st.lastDedicated}` : st ? 'None on record' : 'No venue record' },
  ];
  const pass = { area: area === 'pass', capacity: c.capacity ? capacity === 'pass' : null, budget: c.budget ? (budget === 'unknown' ? null : budget === 'pass') : null, type: c.type ? type === 'pass' : null };
  return { space: sp, miles: mi, fit, extra, pass, detail, confirmed: priv ? quoteOk : age <= 90, ageDays: age, issues, facts, reason: issues.length ? issues[0].charAt(0).toUpperCase() + issues.join(', ').slice(1) : 'Meets every criterion' };
}

const mediansFor = (all: AssessSpace[]) => {
  const out: Record<string, number> = {};
  for (const t of Array.from(new Set(all.map((s) => s.type)))) {
    const xs = all.filter((s) => s.type === t && s.rate != null && s.desks).map((s) => (s.rate as number) / s.desks);
    if (xs.length >= 4) out[t] = median(xs);
  }
  return out;
};

const phrase = (c: AssessCriteria, band: string | null) =>
  [c.capacity ? band : '', c.type, c.budget ? `under ${money(c.budget)}/mo` : '', `within ${c.radiusMi} miles of ${c.centerLabel}`].filter(Boolean).join(', ');

/** Assess a requirement's collection. `ov` tries different values without changing anything. */
export function assess(r: MvpRequirement, ov: Partial<Values> = {}): Assessment | null {
  const col = r.collection;
  if (!col) return null;
  const v = { ...currentValues(r), ...ov };
  const key = cityKey(v.location);
  const center = CENTERS[key];
  const { members, recorded } = membersFor(r);
  const termN = parseInt(criteriaFor(r).termLength, 10);
  const c: AssessCriteria = {
    ...v, city: key, centerLabel: center?.label ?? (v.location.split(',')[0] || 'the requirement location'),
    lat: center?.lat ?? 0, lng: center?.lng ?? 0, radiusIsDefault: !(r.details.otherFunctional || '').match(/within\s+\d/i),
    termMonths: Number.isFinite(termN) && termN > 0 ? termN : null,
  };
  const budgetSet = (r.budget ?? 0) > 0;
  const populateNote = 'A budget is set, and populate currently returns nothing when a requirement has one (a known issue, logged Oct 28). It can leave a collection empty even when spaces exist.';
  const blank = { verdict: '', cards: [] as { label: string; n: number; of: number }[], total: members.length || col.totalSpaces, inArea: 0, withinBudget: null, forPeople: null, confirmedFits: 0, marketMore: 0, marketFits: [] as SpaceResult[], results: [] as SpaceResult[], criteria: c, bandText: c.capacity ? capacityBand(c.capacity).join('-') + ' people' : null };

  if (!recorded) {
    return { ...blank, state: 'unrecorded', status: 'None', statusText: 'Not assessed', empty: false, gapsTitle: 'Gaps and trade-offs', gaps: [{ label: 'Not assessed', text: "This collection's spaces aren't available to the demo, so I can't compare them to the requirement here." }], verdict: "I can't see this collection's spaces in the demo.", summary: `${col.name} has ${plural(col.totalSpaces, 'space')}, but I can't see them in the demo, so I can't assess it.` };
  }
  if (!center) {
    const loc = v.location.trim();
    return {
      ...blank, verdict: loc ? `I can't find “${loc}” as a location.` : 'The requirement has no location.', state: 'unlocated', status: 'None', statusText: members.length ? 'Not assessed' : 'Empty collection', empty: members.length === 0,
      summary: `${members.length ? `${col.name} can't be assessed yet` : `${col.name} is empty`}${loc ? `, and I can't search for spaces: I couldn't find “${loc}” as a location.` : ', and I can’t search for spaces: the requirement has no location.'}${budgetSet ? ' ' + populateNote : ''}`,
      gapsTitle: members.length ? 'Gaps and trade-offs' : "Why it's empty",
      gaps: [
        { label: 'Location', text: loc ? `“${loc}” isn't a place I can search near. Ask me about a city, for example “What if we look in Austin?”, or use Edit requirement.` : 'No location is set. Ask me about a city, for example “What if we look in Austin?”, or use Edit requirement.' },
        ...(budgetSet ? [{ label: 'Platform', text: populateNote }] : []),
      ],
    };
  }

  const pool = marketPool(key).filter((p) => !members.some((m) => m.url === p.url));
  const meds = mediansFor([...members, ...pool]);
  const results = members.map((m) => evaluate(m, c, meds)).sort((a, b) => Number(b.fit) - Number(a.fit) || a.miles - b.miles);
  const total = results.length;
  const confirmedFits = results.filter((x) => x.fit && x.confirmed).length;
  const unconfirmed = results.filter((x) => x.fit && !x.confirmed).length;
  const poolResults = pool.map((p) => evaluate(p, c, meds));
  const marketFits = poolResults.filter((x) => x.fit && x.confirmed).sort((a, b) => a.miles - b.miles);
  const status: Status = confirmedFits >= 5 ? 'Plenty' : confirmedFits >= 1 ? 'Few' : 'None';
  const band = c.capacity ? `${capacityBand(c.capacity).join('-')} people` : null;
  const statusText = total === 0 ? 'Empty collection' : `${confirmedFits} of ${total} meet every criterion`;

  // What would help: one plain sentence, from the same rules with a single change.
  const gainOf = (cc: AssessCriteria) => {
    const m2 = mediansFor([...members, ...pool]);
    return members.concat(pool).map((s) => evaluate(s, cc, m2)).filter((x) => x.fit && x.confirmed).length - (confirmedFits + marketFits.length);
  };
  const tries: { gain: number; text: string }[] = [];
  if (c.budget) for (const pct of [15, 30]) { const nb = Math.round((c.budget * (1 + pct / 100)) / 100) * 100; tries.push({ gain: gainOf({ ...c, budget: nb }), text: `Raising the budget to ${money(nb)}/mo` }); }
  for (const nr of [Math.round(c.radiusMi * 2), Math.round(c.radiusMi * 3)]) tries.push({ gain: gainOf({ ...c, radiusMi: nr }), text: `Searching within ${nr} miles` });
  const best = tries.filter((t) => t.gain > 0).sort((a, b) => b.gain - a.gain)[0];
  const next = best ? `${best.text} would add ${plural(best.gain, 'matching space')}.` : undefined;

  const inArea = results.filter((x) => x.miles <= c.radiusMi).length;
  const withinBudget = c.budget ? results.filter((x) => x.space.rate != null && x.space.rate <= (c.budget as number)).length : null;
  const forPeople = c.capacity ? results.filter((x) => { const [lo, hi] = capacityBand(c.capacity as number); return x.space.desks >= lo && x.space.desks <= hi; }).length : null;

  const typeOk = c.type ? results.filter((x) => x.space.type === c.type).length : null;
  const cards = total === 0 ? [] : [
    { label: `Within ${c.radiusMi} mi of ${c.centerLabel}`, n: inArea, of: total },
    ...(c.budget ? [{ label: `Within ${money(c.budget)}/mo`, n: withinBudget ?? 0, of: total }] : []),
    ...(c.capacity ? [{ label: `For ${band}`, n: forPeople ?? 0, of: total }] : []),
    ...(c.type ? [{ label: c.type, n: typeOk ?? 0, of: total }] : []),
  ];
  const base = { state: 'ok' as const, cards, verdict: '', status, statusText, total, inArea, withinBudget, forPeople, confirmedFits, marketMore: marketFits.length, marketFits, results, criteria: c, bandText: band, next, empty: total === 0 };

  // Empty collection: say why, using the market around the requirement.
  if (total === 0) {
    const M = poolResults.length;
    const pass = (f: (x: SpaceResult) => boolean) => poolResults.filter(f).length;
    const area = pass((x) => x.miles <= c.radiusMi);
    const typeOk = c.type ? pass((x) => x.space.type === c.type) : M;
    const capOk = c.capacity ? pass((x) => { const [lo, hi] = capacityBand(c.capacity as number); return x.space.desks >= lo && x.space.desks <= hi; }) : M;
    const budOk = c.budget ? pass((x) => x.space.rate != null && x.space.rate <= (c.budget as number)) : M;
    const rows: { label: string; text: string; n: number }[] = [
      { label: 'Area', n: area, text: `${area} of ${M} listings near ${c.centerLabel} are within ${c.radiusMi} miles.` },
      ...(c.type ? [{ label: 'Workspace type', n: typeOk, text: `${typeOk} of ${M} are ${c.type}.` }] : []),
      ...(c.capacity ? [{ label: 'Capacity', n: capOk, text: `${capOk} of ${M} hold ${band}.` }] : []),
      ...(c.budget ? [{ label: 'Budget', n: budOk, text: `${budOk} of ${M} are within ${money(c.budget)}/mo${budOk === 0 && poolResults.some((x) => x.space.rate != null) ? `. The lowest is ${money(Math.min(...poolResults.filter((x) => x.space.rate != null).map((x) => x.space.rate as number)))}/mo` : ''}.` }] : []),
    ];
    const worst = [...rows].sort((a, b) => a.n - b.n)[0];
    const F = marketFits.length;
    const summary = F > 0
      ? `${col.name} is empty, but it doesn't need to be. I looked at the ${M} listings recorded near ${c.centerLabel} and ${plural(F, 'space')} meet every criterion (${phrase(c, band)}).${budgetSet ? ' ' + populateNote : ''}`
      : `${col.name} is empty, and I can see why. I looked at the ${M} listings recorded near ${c.centerLabel} and none meet every criterion (${phrase(c, band)}). The biggest blocker is ${worst ? worst.label.toLowerCase() : 'the combination of criteria'}.${budgetSet ? ' ' + populateNote : ''}`;
    const verdict = `${F} of ${M} nearby listings meet every criterion.`;
    return { ...base, verdict, summary, gapsTitle: "Why it's empty", gaps: [...rows.map(({ label, text }) => ({ label, text })), { label: 'Together', text: `${F} of ${M} meet all of them.` }, ...(budgetSet ? [{ label: 'Platform', text: populateNote }] : [])] };
  }

  // Non-empty. The cards carry the counts; the gaps carry the detail behind them.
  const off = (f: (x: SpaceResult) => boolean) => results.filter(f).length;
  const dist = results.map((x) => x.miles);
  const tooFar = off((x) => x.miles > c.radiusMi);
  const gaps: { label: string; text: string }[] = [];
  if (tooFar) gaps.push({ label: 'Area', text: `The nearest space is ${Math.min(...dist).toFixed(1)} mi from ${c.centerLabel} and the farthest is ${Math.max(...dist).toFixed(1)} mi.${c.radiusIsDefault ? ' No search area was given, so the city center and 5 miles are used.' : ''}` });
  if (c.budget) {
    const priced = results.filter((x) => x.space.rate != null);
    const over = priced.filter((x) => (x.space.rate as number) > (c.budget as number));
    if (over.length) gaps.push({ label: 'Budget', text: over.length === priced.length ? `Every space is over budget. The lowest is ${money(Math.min(...priced.map((x) => x.space.rate as number)))}/mo.` : `The lowest-priced space over budget is ${money(Math.min(...over.map((x) => x.space.rate as number)))}/mo.` });
  }
  if (c.capacity) {
    const [lo, hi] = capacityBand(c.capacity);
    const bad = off((x) => x.space.desks < lo || x.space.desks > hi);
    if (bad) gaps.push({ label: 'Capacity', text: `Spaces here hold ${Math.min(...results.map((x) => x.space.desks))} to ${Math.max(...results.map((x) => x.space.desks))} people. You need ${band}.` });
  }
  if (c.type) {
    const mix = Object.entries(results.reduce((m: Record<string, number>, x) => { m[x.space.type] = (m[x.space.type] ?? 0) + 1; return m; }, {})).map(([t, n]) => `${n} ${t}`).join(', ');
    if (off((x) => x.space.type !== c.type)) gaps.push({ label: 'Workspace type', text: `This collection holds ${mix}. You asked for ${c.type}.` });
  }
  const overMarket = off((x) => x.issues.includes('over the local market rate'));
  if (overMarket) gaps.push({ label: 'Rate', text: `${plural(overMarket, 'space')} ${overMarket === 1 ? 'is' : 'are'} more than 15% above the local market rate per seat.` });
  const stale = off((x) => !x.confirmed);
  if (stale) gaps.push({ label: 'Listings', text: `${plural(stale, 'listing')} ${stale === 1 ? "hasn't" : "haven't"} been updated in 90 days, so ${stale === 1 ? 'its' : 'their'} price and details are unconfirmed.` });
  const termsM = results.map((x) => x.space.minTerm?.match(/(\d+)\s*month/)).filter(Boolean).map((m) => +(m as RegExpMatchArray)[1]);
  if (c.termMonths) {
    const long = off((x) => { const m = x.space.minTerm?.match(/(\d+)\s*month/); return !!m && +m[1] > (c.termMonths as number); });
    if (long) gaps.push({ label: 'Term', text: `${plural(long, 'space')} require${long === 1 ? 's' : ''} a longer minimum term than ${c.termMonths} months.` });
    else if (termsM.length) gaps.push({ label: 'Term', text: `${Math.min(...termsM) === Math.max(...termsM) ? `Every space has a ${Math.min(...termsM)}-month minimum term` : `Minimum terms range from ${Math.min(...termsM)} to ${Math.max(...termsM)} months`}, within your ${c.termMonths}-month term.` });
  }
  // Venue facts, observed. Nothing here is a verdict.
  const vmap = new Map<string, { name: string; st: ReturnType<typeof venueStats> }>();
  results.forEach((x) => { const k = venueKey(x.space.url) || `name:${x.space.venue}`; if (!vmap.has(k)) vmap.set(k, { name: x.space.venue, st: venueStats(x.space.url) }); });
  const venues = [...vmap.values()]; const V = venues.length;
  const nPriv = results.filter((x) => x.space.visibility === 'Private').length;
  gaps.push({ label: 'Public / private', text: `${plural(total - nPriv, 'space')} ${total - nPriv === 1 ? 'is a public listing' : 'are public listings'}, ${nPriv} ${nPriv === 1 ? 'is' : 'are'} private. ${nPriv ? 'A private listing counts as confirmed while its quote is valid.' : 'Proposals from venues become private listings and are added with Add space.'}` });
  const ded = venues.filter((v) => (v.st?.dedicatedSpaces ?? 0) > 0);
  gaps.push({ label: 'Track record', text: ded.length ? `${ded.length} of ${V} venues have dedicated contracts on record: ${ded.slice(0, 3).map((v) => `${v.name} (${plural(v.st!.dedicatedSpaces!, 'space')}, last billed ${v.st!.lastDedicated})`).join('; ')}${ded.length > 3 ? `; ${ded.length - 3} more` : ''}.` : `None of the ${V} venues has a dedicated contract on record.` });
  const rev = venues.filter((v) => (v.st?.reviews ?? 0) > 0);
  const nRev = rev.reduce((n, v) => n + (v.st!.reviews as number), 0);
  const leads = venues.reduce((n, v) => n + (v.st?.leads12 ?? 0), 0), tours = venues.reduce((n, v) => n + (v.st?.tours12 ?? 0), 0);
  const low = rev.slice().sort((a, b) => (a.st!.stars as number) - (b.st!.stars as number))[0];
  gaps.push({ label: 'Venue activity', text: `${rev.length ? `${rev.length} of ${V} venues have guest reviews, averaging ${(rev.reduce((n, v) => n + (v.st!.stars as number) * (v.st!.reviews as number), 0) / nRev).toFixed(1)} stars${low && rev.length > 1 && low.st!.stars !== Math.max(...rev.map((v) => v.st!.stars as number)) ? ` (lowest ${low.st!.stars} at ${low.name})` : ''}.` : `None of the ${V} venues has guest reviews.`} Together they logged ${plural(leads, 'lead')} and ${plural(tours, 'tour')} in the last 12 months.` });
  const rtc = results.filter((x) => x.space.booking).reduce((m: Record<string, number>, x) => { m[x.space.booking as string] = (m[x.space.booking as string] ?? 0) + 1; return m; }, {});
  const withResp = venues.filter((v) => v.st?.responseMin).length;
  if (Object.keys(rtc).length) gaps.push({ label: 'Booking', text: `${Object.entries(rtc).map(([k, n]) => `${n} ${n === 1 ? 'is' : 'are'} ${k}`).join(', ')}. Average lead response is on record for ${withResp} of ${V} venues.` });
  gaps.push({ label: 'Platform count', text: "The platform's own Assess tool can't be called from the demo. In production its counts appear here beside these, so the two can be compared." });
  const missing = [!c.capacity ? 'headcount' : '', !c.budget ? 'budget' : '', !c.type ? 'workspace type' : ''].filter(Boolean);
  const sd = r.details.startDate ? new Date(r.details.startDate + 'T00:00:00') : null;
  const startTxt = sd && !isNaN(+sd) ? `Availability for the ${sd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} start isn't in the available data. ` : "Availability isn't in the available data. ";
  gaps.push({ label: 'Not assessed', text: `${missing.length ? `${missing.join(', ').replace(/^./, (m) => m.toUpperCase())} ${missing.length === 1 ? 'was' : 'were'} not provided. ` : ''}${startTxt}Amenity needs and program needs aren't in the available data.` });

  const reasons: { n: number; text: string; name: string }[] = [
    { n: tooFar, text: `area (${tooFar === total ? 'all' : tooFar} too far)`, name: 'area' },
    ...(c.capacity ? [{ n: off((x) => { const [lo, hi] = capacityBand(c.capacity as number); return x.space.desks < lo || x.space.desks > hi; }), text: `capacity (outside ${band})`, name: 'capacity' }] : []),
    ...(c.budget ? [{ n: off((x) => x.space.rate != null && x.space.rate > (c.budget as number)), text: 'budget', name: 'budget' }] : []),
    ...(c.type ? [{ n: off((x) => x.space.type !== c.type), text: `workspace type (not ${c.type})`, name: 'workspace type' }] : []),
  ].filter((x) => x.n > 0).sort((x, y) => y.n - x.n).slice(0, 2);
  const names = reasons.map((x) => x.name);
  const gapPhrase = names.length ? `${names.join(' and ').replace(/^./, (m) => m.toUpperCase())} ${names.length > 1 ? 'are' : 'is'} the main gap${names.length > 1 ? 's' : ''}.` : '';
  const verdict = unconfirmed ? `${plural(unconfirmed, 'more space')} would meet every criterion, but ${unconfirmed === 1 ? 'its listing is' : 'their listings are'} over 90 days old.` : '';
  const fitSentence = confirmedFits === 0 ? 'None of them fit.' : `${confirmedFits} ${confirmedFits === 1 ? 'fits' : 'fit'}.${unconfirmed ? ` ${plural(unconfirmed, 'more')} would, but ${unconfirmed === 1 ? 'its listing is' : 'their listings are'} over 90 days old.` : ''}`;
  const why = reasons.length ? ` ${confirmedFits === 0 ? 'They miss' : 'The rest miss'} on ${reasons.map((x) => x.text).join(' and ')}.` : '';
  const more = marketFits.length ? ` ${plural(marketFits.length, 'more matching space')} nearby ${marketFits.length === 1 ? "isn't" : "aren't"} in the collection.` : '';
  return { ...base, verdict, gapsTitle: 'Gaps and trade-offs', gaps, summary: `I checked the ${plural(total, 'space')} in ${col.name} against your requirement (${phrase(c, band)}). ${fitSentence}${why}${more}` };
}

/** Why the spaces are in the collection, when we know. */
export function addedWhy(r: MvpRequirement): string {
  if ((r.collection?.totalSpaces ?? 0) === 0) return 'Nothing has been added yet.';
  const n = addedCount(r.id);
  const base = builtByAgent(r.collection?.url) ? 'Matched on location, headcount and workspace type when the collection was built.' : 'Added outside the agent, so I can\'t say why.';
  return n ? `${base} ${n} added by hand since.` : base;
}

// ── Re-running ──────────────────────────────────────────────────────────────
// The agent remembers its last assessment of each requirement. A change to the requirement, or new spaces in the
// collection, makes that assessment out of date; the next run says what changed and how the matches moved.

export interface Snapshot { values: Values; spaces: number; fits: number; total: number; at: string }
const snapshots = new Map<string, Snapshot>();
const sig = (v: Values, spaces: number) => JSON.stringify([v.location, v.type, v.capacity, v.budget, v.radiusMi, spaces]);

export function isStale(r: MvpRequirement): boolean {
  const s = snapshots.get(r.id);
  return !!s && sig(s.values, s.spaces) !== sig(currentValues(r), r.collection?.totalSpaces ?? 0);
}

/** One short line for the hover card. */
export function quickStatus(r: MvpRequirement) {
  const a = assess(r);
  return a ? { status: a.status, text: a.statusText, stale: isStale(r) } : null;
}

const fmtVal = (k: keyof Values, v: Values[keyof Values]) => (k === 'budget' ? (v ? `${money(v as number)}/mo` : 'not set') : k === 'type' ? (v || 'any') : v == null || v === '' ? 'not set' : String(v));
function diffs(prev: Snapshot, now: Values, spaces: number): string[] {
  const out: string[] = [];
  const label: Record<string, string> = { location: 'location', type: 'workspace type', capacity: 'people', budget: 'budget', radiusMi: 'search distance (miles)' };
  (Object.keys(label) as (keyof Values)[]).forEach((k) => { if (String(prev.values[k] ?? '') !== String(now[k] ?? '')) out.push(`${label[k]} ${fmtVal(k, prev.values[k])} → ${fmtVal(k, now[k])}`); });
  if (prev.spaces !== spaces) out.push(`${prev.spaces} → ${spaces} spaces in the collection`);
  return out;
}

export interface RunInfo { first: boolean; since?: { at: string; changes: string[]; fitsBefore: number; fitsNow: number }; log?: string }

/** Record this assessment as the latest run, and say what changed since the one before. */
export function recordRun(r: MvpRequirement, a: Assessment): RunInfo {
  const prev = snapshots.get(r.id);
  const values = currentValues(r);
  const spaces = r.collection?.totalSpaces ?? 0;
  const at = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  snapshots.set(r.id, { values, spaces, fits: a.confirmedFits, total: a.total, at });
  if (!prev) return { first: true, log: `Collection assessed: ${a.confirmedFits} of ${a.total} ${a.total === 1 ? 'space meets' : 'spaces meet'} every criterion.` };
  const changes = diffs(prev, values, spaces);
  if (!changes.length) return { first: false, since: { at: prev.at, changes: [], fitsBefore: prev.fits, fitsNow: a.confirmedFits } };
  return { first: false, since: { at: prev.at, changes, fitsBefore: prev.fits, fitsNow: a.confirmedFits }, log: `Reassessed after ${changes.join(', ')}: ${prev.fits} → ${a.confirmedFits} of ${a.total} meet every criterion.` };
}


/** How one space measures against the requirement, before it is added. */
export function evaluateFor(r: MvpRequirement, sp: AssessSpace): SpaceResult | null {
  const a = assess(r);
  if (!a || a.state !== 'ok') return null;
  const { members } = membersFor(r);
  return evaluate(sp, a.criteria, mediansFor([...members, ...marketPool(a.criteria.city)]));
}

export interface ProposalInput { venue: string; title: string; type: string; desks: number; rate: number; miles: number; validUntil: string; availableFrom: string }

/** A venue proposal entered by hand. It sits `miles` due north of the search center, since a proposal carries no coordinates here. */
export function proposalSpace(r: MvpRequirement, p: ProposalInput): AssessSpace | null {
  const a = assess(r);
  if (!a || a.state !== 'ok') return null;
  return { id: `prop-${Date.now()}`, url: '', venue: p.venue, title: p.title, type: p.type, desks: p.desks, rate: p.rate, lat: a.criteria.lat + p.miles / 69, lng: a.criteria.lng, modified: new Date().toISOString().slice(0, 10), inCollection: true, visibility: 'Private', validUntil: p.validUntil, availableFrom: p.availableFrom };
}

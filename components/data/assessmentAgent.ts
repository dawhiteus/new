// Scripted Collection Assessment Agent (prototype). Computes from the recorded Pulse facts in assessmentData.ts.
// The rules are written in docs/collection-assessment-spec.md so that one definition of a match exists.
import { criteriaFor, capacityBand } from './collectionAgent';
import { CENTERS, collectionSpaces, collectionCityFor, marketPool, listingByUrl, listingsAtVenue, type AssessSpace } from './assessmentData';
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
}

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

/** Spaces added to a collection during this demo session (the browser cannot write to LiquidSpace). */
export const addedSpaces = new Map<string, string[]>();

function membersFor(r: MvpRequirement): { members: AssessSpace[]; recorded: boolean } {
  const key = collectionCityFor(r.collection?.url);
  const base = key ? collectionSpaces(key) : [];
  const extras = (addedSpaces.get(r.id) ?? []).map((u) => listingByUrl(u)?.space).filter((x): x is AssessSpace => !!x).map((x) => ({ ...x, inCollection: true }));
  const members = [...base, ...extras];
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
  const age = daysAgo(sp.modified);
  const perSeat = sp.rate != null && sp.desks ? sp.rate / sp.desks : null;
  const mps = medians[sp.type];

  const issues: string[] = [];
  if (area !== 'pass') issues.push(`${mi.toFixed(1)} mi from ${c.centerLabel}`);
  if (budget === 'fail') issues.push(`${money((sp.rate as number) - (c.budget as number))}/mo over budget`);
  if (capacity === 'near') issues.push(`larger than needed (${sp.desks} seats)`);
  if (capacity === 'fail') issues.push(`holds ${sp.desks}, needs ${c.capacity}`);
  if (type === 'fail') issues.push(`not ${c.type}`);
  if (perSeat != null && mps && perSeat > mps * 1.15) issues.push('over the local market rate');
  if (age > 90) issues.push(`listing not updated in ${age} days`);
  const facts = [`${mi.toFixed(1)} mi`, `${sp.desks} seats`, sp.rate != null ? `${money(sp.rate)}/mo` : 'not priced monthly', `updated ${age} day${age === 1 ? '' : 's'} ago`].join(' · ');
  return { space: sp, miles: mi, fit, confirmed: age <= 90, ageDays: age, issues, facts, reason: issues.length ? issues[0].charAt(0).toUpperCase() + issues.join(', ').slice(1) : 'Meets every criterion' };
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
  const statusText = total === 0 ? 'Empty collection' : status === 'Plenty' ? 'Plenty of matches' : status === 'Few' ? 'Few matches' : 'No matches';

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
    const verdict = F > 0 ? `${plural(F, 'matching space')} ${F === 1 ? 'exists' : 'exist'} nearby, so it doesn't need to be empty.` : `Nothing nearby meets every criterion. ${worst ? worst.label : 'The combination of criteria'} is the biggest blocker.`;
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
  if (c.termMonths) { const long = off((x) => { const m = x.space.minTerm?.match(/(\d+)\s*month/); return !!m && +m[1] > (c.termMonths as number); }); if (long) gaps.push({ label: 'Term', text: `${plural(long, 'space')} require${long === 1 ? 's' : ''} a longer minimum term than ${c.termMonths} months.` }); }
  const missing = [!c.capacity ? 'headcount' : '', !c.budget ? 'budget' : '', !c.type ? 'workspace type' : ''].filter(Boolean);
  gaps.push({ label: 'Not assessed', text: `${missing.length ? `${missing.join(', ').replace(/^./, (m) => m.toUpperCase())} ${missing.length === 1 ? 'was' : 'were'} not provided. ` : ''}Availability, amenity needs and program needs aren't in the available data.` });

  const reasons: { n: number; text: string; name: string }[] = [
    { n: tooFar, text: `area (${tooFar === total ? 'all' : tooFar} too far)`, name: 'area' },
    ...(c.capacity ? [{ n: off((x) => { const [lo, hi] = capacityBand(c.capacity as number); return x.space.desks < lo || x.space.desks > hi; }), text: `capacity (outside ${band})`, name: 'capacity' }] : []),
    ...(c.budget ? [{ n: off((x) => x.space.rate != null && x.space.rate > (c.budget as number)), text: 'budget', name: 'budget' }] : []),
    ...(c.type ? [{ n: off((x) => x.space.type !== c.type), text: `workspace type (not ${c.type})`, name: 'workspace type' }] : []),
  ].filter((x) => x.n > 0).sort((x, y) => y.n - x.n).slice(0, 2);
  const names = reasons.map((x) => x.name);
  const gapPhrase = names.length ? `${names.join(' and ').replace(/^./, (m) => m.toUpperCase())} ${names.length > 1 ? 'are' : 'is'} the main gap${names.length > 1 ? 's' : ''}.` : '';
  const verdict = confirmedFits === 0 ? `None fit. ${gapPhrase}`.trim() : status === 'Plenty' ? `${confirmedFits} of ${total} fit. Plenty to work with.` : `${confirmedFits} of ${total} fit. ${gapPhrase}`.trim();
  const fitSentence = confirmedFits === 0 ? 'None of them fit.' : `${confirmedFits} ${confirmedFits === 1 ? 'fits' : 'fit'}.${unconfirmed ? ` ${plural(unconfirmed, 'more')} would, but ${unconfirmed === 1 ? 'its listing is' : 'their listings are'} over 90 days old.` : ''}`;
  const why = reasons.length ? ` ${confirmedFits === 0 ? 'They miss' : 'The rest miss'} on ${reasons.map((x) => x.text).join(' and ')}.` : '';
  const more = marketFits.length ? ` ${plural(marketFits.length, 'more matching space')} nearby ${marketFits.length === 1 ? "isn't" : "aren't"} in the collection.` : '';
  return { ...base, verdict, gapsTitle: 'Gaps and trade-offs', gaps, summary: `I checked the ${plural(total, 'space')} in ${col.name} against your requirement (${phrase(c, band)}). ${fitSentence}${why}${more}` };
}

/** One short line for the hover card. */
export const quickStatus = (r: MvpRequirement) => { const a = assess(r); return a ? { status: a.status, text: a.statusText } : null; };

/** Fits under the adjusted values that were not fits before, so a change can be shown. */
export function newlyFit(before: Assessment, after: Assessment): SpaceResult[] {
  const had = new Set([...before.results, ...before.marketFits].filter((x) => x.fit && x.confirmed).map((x) => x.space.url));
  return [...after.results.filter((x) => x.fit && x.confirmed), ...after.marketFits].filter((x) => !had.has(x.space.url));
}

// ── Ask ─────────────────────────────────────────────────────────────────────
// One question, one plain answer. Free text is matched to a few question types, each answered by a deterministic
// query over the recorded data. (The product would use a language model for the matching step only.)
// Answers never change anything, except that pasting a LiquidSpace link adds that space to the collection.

export interface Answer {
  id: string;
  question: string;
  text: string;
  /** Spaces added right away (a pasted link). */
  added?: string[];
}

interface Filters { type?: string; maxRate?: number; miles?: number; seatsFor?: number; scope: 'collection' | 'nearby' | 'both' }
const TYPES: [RegExp, string][] = [[/private offices?/, 'Private Office'], [/team offices?/, 'Team Office'], [/office suites?/, 'Office Suite']];
const cap = (s: string) => s.replace(/\b\w/g, (m) => m.toUpperCase());
const names = (xs: string[]) => (xs.length <= 3 ? xs.join(', ') : `${xs.slice(0, 3).join(', ')} and ${xs.length - 3} more`);

function parseFilters(t: string): Filters {
  const f: Filters = { scope: /in this collection|in the collection|already in/.test(t) ? 'collection' : /nearby|not in (?:the|this)|outside the collection|market/.test(t) ? 'nearby' : 'both' };
  for (const [re, label] of TYPES) if (re.test(t)) { f.type = label; break; }
  const price = t.match(/(?:under|below|less than|up to|within|max(?:imum)?(?: of)?)\s*\$\s*([\d,]+(?:\.\d+)?)\s*(k)?/) ?? t.match(/(?:under|below|less than)\s*([\d.]+)\s*k\b/);
  if (price) f.maxRate = price.length === 3 ? parseFloat(price[1]) * 1000 : parseFloat(price[1].replace(/,/g, '')) * (price[2] ? 1000 : 1);
  const mi = t.match(/(\d+(?:\.\d+)?)\s*(?:miles?|mi)\b/);
  if (mi) f.miles = parseFloat(mi[1]);
  const seats = t.match(/(?:for|fits?|hold(?:s)?)\s+(\d+)\s*(?:people|seats|desks|staff|persons?)?/) ?? t.match(/(\d+)\s*(?:people|seats|persons?)/);
  if (seats) f.seatsFor = parseInt(seats[1], 10);
  return f;
}
const hasFilter = (f: Filters) => !!(f.type || f.maxRate != null || f.miles != null || f.seatsFor != null);
const filterText = (f: Filters) => [f.type, f.maxRate != null ? `under ${money(f.maxRate)}/mo` : '', f.miles != null ? `within ${f.miles} mi` : '', f.seatsFor != null ? `for ${capacityBand(f.seatsFor).join('-')} people` : ''].filter(Boolean).join(', ');

const HELP = "I can explain what I see, count or list spaces (“How many Private Offices under $5,000 within 3 miles?”), try a change (“What if the budget goes up 15%?” or “What if we look in Austin?”), or explain a space (“Why isn't Regus Westlake a fit?”). Paste a LiquidSpace link and I'll add that space.";

export function ask(text: string, r: MvpRequirement): Answer {
  const id = `q-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const q = text.trim();
  const t = q.toLowerCase();
  const reply = (body: { text: string; added?: string[] }): Answer => ({ id, question: q, ...body });
  const a = assess(r);
  if (!a || !q) return reply({ text: HELP });
  const colName = r.collection?.name ?? 'the collection';
  const base = currentValues(r);

  // What I see.
  if (/\b(why is it empty|why is (?:this|the collection) empty|what(?:'s| is) (?:wrong|going on)|summari[sz]e|what do you see|overview|how does it look)\b/.test(t)) {
    return reply({ text: `${a.summary}${a.next ? ' ' + a.next : ''}` });
  }

  // A what-if: a location, a budget, a distance or a headcount. Only ever an answer.
  const cityHit = Object.keys(CENTERS).find((k) => new RegExp(`\\b${k}\\b`).test(t));
  const whatIf = /\b(what if|what about|what happens|suppose|widen|expand|raise|increase|lower|reduce|cut|drop)\b|^\s*if\b/.test(t);
  if (whatIf || (cityHit && a.state !== 'ok')) {
    const ov: Partial<Values> = {};
    const said: string[] = [];
    if (cityHit && cityKey(base.location) !== cityHit) { ov.location = cap(cityHit); said.push(`we look in ${cap(cityHit)}`); }
    const down = /\b(lower|reduce|cut|decrease|drop|down)\b/.test(t);
    const abs = t.match(/\$\s*([\d,]+(?:\.\d+)?)\s*(k)?/);
    const pct = t.match(/(\d+(?:\.\d+)?)\s*%/);
    if (base.budget && (abs || pct)) {
      const nb = Math.round((abs ? parseFloat(abs[1].replace(/,/g, '')) * (abs[2] ? 1000 : 1) : base.budget * (1 + (down ? -1 : 1) * parseFloat((pct as RegExpMatchArray)[1]) / 100)) / 100) * 100;
      ov.budget = nb; said.push(`the budget goes to ${money(nb)}/mo`);
    }
    const mi = t.match(/(\d+(?:\.\d+)?)\s*(?:miles?|mi)\b/);
    if (mi && /(search|area|within|widen|radius|distance|miles)/.test(t)) { ov.radiusMi = parseFloat(mi[1]); said.push(`we search within ${mi[1]} miles`); }
    const hc = t.match(/(\d+)\s*(?:people|seats|persons?|staff|headcount)/);
    if (hc && /(need|headcount|people|seats|team|grow|hire)/.test(t)) { ov.capacity = parseInt(hc[1], 10); said.push(`we need ${hc[1]} people`); }
    if (!said.length) return reply({ text: 'I can try a change to the location, budget, search distance or headcount, for example “What if the budget goes up 15%?”' });
    const after = assess(r, ov);
    if (!after) return reply({ text: HELP });
    if (after.state === 'unlocated') return reply({ text: `If ${said.join(' and ')}: ${after.summary}` });
    const fresh = a.state === 'ok' ? newlyFit(a, after) : [...after.results, ...after.marketFits].filter((x) => x.fit && x.confirmed);
    const effect = fresh.length === 0 ? 'No additional spaces would fit.' : `${plural(fresh.length, 'space')} would ${a.state === 'ok' ? 'newly ' : ''}fit: ${names(fresh.map((x) => x.space.title))}.`;
    return reply({ text: `If ${said.join(' and ')}: ${a.statusText} → ${after.statusText}. ${effect}` });
  }

  if (a.state !== 'ok') return reply({ text: a.state === 'unlocated' ? 'I can only look at spaces once the requirement has a location I can find. Ask me, for example, “What if we look in Austin?”' : HELP });
  const c = a.criteria;
  const { members } = membersFor(r);
  const pool = marketPool(c.city).filter((p) => !members.some((m) => m.url === p.url));
  const all = [...members, ...pool];
  const meds = mediansFor(all);

  // A link adds the space.
  const url = q.match(/https?:\/\/\S+/)?.[0];
  if (url) {
    let host = '';
    try { host = new URL(url).hostname.replace(/^www\./, ''); } catch { /* not a link */ }
    if (host !== 'liquidspace.com') return reply({ text: "That isn't a LiquidSpace link, so I can't add it. A space outside LiquidSpace needs a private listing, which the supply team creates." });
    const hit = listingByUrl(url);
    if (!hit) return reply({ text: listingsAtVenue(url).length ? "That's a link to a venue. Paste the link to one of its spaces and I'll add it." : "I couldn't find that listing. The demo can only look up listings it has recorded; the product looks the link up in Pulse." });
    const sp = hit.space;
    if (members.some((m) => m.url === sp.url)) return reply({ text: `${sp.title} (${sp.venue}) is already in ${colName}.` });
    const res = evaluate(sp, c, meds);
    return reply({ text: `Added ${sp.title} (${sp.venue}) to ${colName}. ${res.fit && res.confirmed ? 'It fits the requirement.' : `It doesn't fit every criterion: ${res.issues.join(', ')}.`}`, added: [sp.url] });
  }

  // Explain a space.
  if (/^\s*(why|explain)\b|\bwhy (?:is|isn'?t|are|aren'?t)\b/.test(t)) {
    const stop = new Set(['team', 'office', 'suite', 'private', 'person', 'with', 'from', 'that', 'this', 'what', 'does', 'isnt', 'fit', 'explain', 'collection']);
    const words = (s: string) => s.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 3 && !stop.has(w));
    const qw = new Set(words(q));
    let best: AssessSpace | null = null, score = 0;
    for (const sp of all) { const sc = words(`${sp.venue} ${sp.title}`).filter((w) => qw.has(w)).length; if (sc > score) { best = sp; score = sc; } }
    if (!best) return reply({ text: "I couldn't tell which space you mean. Name the venue or the space, for example “Why isn't Regus Westlake a fit?”" });
    const res = evaluate(best, c, meds);
    return reply({ text: `${best.title} (${best.venue}) ${res.fit && res.confirmed ? 'fits. It meets the area, capacity, budget and workspace type, and its listing is current.' : `is not a fit: ${res.issues.length ? res.issues.join(', ') : 'its listing could not be confirmed'}.`}` });
  }

  // Count or list.
  if (/that fit|fits? (?:our|the|my) (?:requirement|needs)/.test(t)) {
    const fits = [...a.results.filter((z) => z.fit && z.confirmed), ...a.marketFits];
    return reply({ text: `${plural(a.confirmedFits, 'confirmed fit')} in ${colName} and ${a.marketMore} more nearby that aren't in it.${fits.length ? ` They are ${names(fits.map((z) => z.space.title))}.` : ''}` });
  }
  const f = parseFilters(t);
  if ((/^\s*how many\b/.test(t) || /^\s*(show|find|list)\b/.test(t)) && hasFilter(f)) {
    const matches = all.filter((sp) => {
      const mi = miles(sp, c);
      if (f.type && sp.type !== f.type) return false;
      if (f.maxRate != null && (sp.rate == null || sp.rate > f.maxRate)) return false;
      if (f.miles != null && mi > f.miles) return false;
      if (f.seatsFor != null) { const [lo, hi] = capacityBand(f.seatsFor); if (sp.desks < lo || sp.desks > hi) return false; }
      return true;
    }).sort((p, q2) => miles(p, c) - miles(q2, c));
    const inC = matches.filter((m) => m.inCollection).length;
    const near = matches.length - inC;
    const scoped = f.scope === 'collection' ? `${inC} in ${colName}` : f.scope === 'nearby' ? `${near} nearby, not in ${colName}` : `${inC} in ${colName} and ${near} nearby, not in it`;
    return reply({ text: `${scoped} (${filterText(f)}). That covers the ${all.length} listings recorded near ${c.centerLabel}, not the whole market.${matches.length ? ` The closest are ${names(matches.slice(0, 3).map((s) => s.title))}.` : ''}` });
  }
  return reply({ text: HELP });
}

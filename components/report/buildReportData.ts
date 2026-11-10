// Turns a requirement's current collection assessment into the data the PDF report renders.
// Mirrors what Assess Collection shows: scorecard, gap line, requirement details, spaces by group, red misses.
import { assess, CONFIRMED_NEEDED, GROUPS, groupOf, type SpaceResult } from '../data/assessmentAgent';
import { capacityBand, criteriaFor } from '../data/collectionAgent';
import type { MvpRequirement } from '../data/mvpRequirements';
import type { ReportData, ReportRow } from './AssessmentReport';

const money = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;
const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`;
const fmt = (iso: string, year = true) => new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', ...(year ? { year: 'numeric' } : {}) });
const passes = (r: SpaceResult) => [r.pass.area, r.pass.capacity, r.pass.budget, r.pass.type];

/** Null when the collection can't be assessed (no spaces, unreadable, or no location). */
export function buildReportData(requirement: MvpRequirement, today = new Date()): ReportData | null {
  const a = assess(requirement);
  const col = requirement.collection;
  if (!a || !col || a.state !== 'ok' || a.total === 0) return null;
  const c = a.criteria;
  const total = a.total;
  const band = c.capacity ? capacityBand(c.capacity) : null;
  const bandShort = band ? `${band[0]}–${band[1]}` : '';

  const src = criteriaFor(requirement);
  const stated = [
    { k: 'Headcount', v: c.capacity ? plural(c.capacity, 'person').replace(/persons$/, 'people') : '' },
    { k: 'Budget', v: c.budget ? `${money(c.budget)}/mo` : '' },
    { k: 'Location', v: c.location },
    { k: 'Workspace type', v: c.type },
    { k: 'Start date', v: src.startDate ? fmt(src.startDate) : '' },
    { k: 'Term', v: c.termMonths ? plural(c.termMonths, 'month') : '' },
  ];
  const searched: ReportData['searched'] = [
    ...(band ? [{ k: 'Seats', v: bandShort, why: 'from headcount', prov: 'Derived' as const }] : []),
    ...(c.budget ? [{ k: 'Price', v: `Up to ${money(c.budget)}/mo`, prov: 'Provided' as const }] : []),
    { k: 'Area', v: `${c.radiusMi} mi of ${c.centerLabel}`, why: c.radiusIsDefault ? 'no search area given' : undefined, prov: c.radiusIsDefault ? 'Assumed' as const : 'Provided' as const },
    ...(c.type ? [{ k: 'Type', v: c.type, prov: 'Provided' as const }] : []),
  ];

  const typeCount = c.type ? a.results.filter((x) => x.space.type === c.type).length : 0;
  const criteria = [
    { key: 'area', label: 'Distance', n: a.inArea, rule: `Within ${c.radiusMi} mi` },
    ...(band ? [{ key: 'capacity', label: 'Seats', n: a.forPeople ?? 0, rule: `${bandShort} people` }] : []),
    ...(c.budget ? [{ key: 'budget', label: 'Price', n: a.withinBudget ?? 0, rule: `Up to ${money(c.budget)}/mo` }] : []),
    ...(c.type ? [{ key: 'type', label: 'Type', n: typeCount, rule: c.type }] : []),
  ];

  const worst = criteria.reduce((m, k) => (k.n < m.n ? k : m));
  const missN = total - worst.n;
  const of = `${missN} of ${total} spaces`;
  const gapLine = missN === 0 ? null
    : worst.key === 'capacity' ? { title: 'Headcount is the gap.', text: `${of} fall outside ${bandShort} people.` }
    : worst.key === 'budget' ? { title: 'Price is the gap.', text: `${of} are over ${money(c.budget as number)}/mo.` }
    : worst.key === 'type' ? { title: 'Workspace type is the gap.', text: `${of} aren't ${c.type}.` }
    : { title: 'Distance is the gap.', text: `${of} are more than ${c.radiusMi} mi from ${c.centerLabel}.` };
  const thin = a.confirmedFits < CONFIRMED_NEEDED;

  const columns = [
    { key: 'area', label: 'Distance', sub: `Within ${c.radiusMi} mi`, width: 64 },
    ...(band ? [{ key: 'capacity', label: 'Seats', sub: bandShort, width: 52 }] : []),
    ...(c.budget ? [{ key: 'budget', label: 'Price / mo', sub: `Up to ${money(c.budget)}`, width: 80 }] : []),
    ...(c.type ? [{ key: 'type', label: 'Type', sub: c.type, width: 78 }] : []),
  ];
  const rowOf = (r: SpaceResult): ReportRow => {
    const listing = r.space.visibility === 'Private'
      ? (r.space.validUntil ? `Private · quote to ${fmt(r.space.validUntil, false)}` : 'Private · no quote date')
      : `Public · updated ${r.ageDays} d ago`;
    return {
      title: r.space.title,
      venue: `${r.space.venue}${!c.type ? ` · ${r.space.type}` : ''}`,
      listing: `${listing}${r.confirmed ? '' : ' · unconfirmed'}`,
      cells: {
        area: { value: `${r.miles.toFixed(1)} mi`, miss: r.pass.area === false },
        capacity: { value: String(r.space.desks), miss: r.pass.capacity === false },
        budget: r.space.rate == null
          ? { value: 'Unknown', miss: false, unknown: true }
          : { value: money(r.space.rate), miss: r.pass.budget === false, note: r.costPP != null ? `${money(r.costPP)} / person` : undefined },
        type: { value: r.space.type, miss: r.pass.type === false },
      },
    };
  };
  const met = (r: SpaceResult) => passes(r).filter((x) => x === true).length;
  const misses = (r: SpaceResult) => passes(r).filter((x) => x === false).length;
  const rows = [...a.results].sort((x, y) => met(y) - met(x) || x.miles - y.miles);
  const summary = (list: SpaceResult[]) => {
    const n = list.map(misses);
    const all = n.filter((x) => x === 0).length, one = n.filter((x) => x === 1).length, more = n.filter((x) => x > 1).length;
    return [
      all ? `${all} ${all === 1 ? 'meets' : 'meet'} all` : '',
      one ? `${one} ${one === 1 ? 'misses' : 'miss'} one` : '',
      more ? `${more} ${more === 1 ? 'misses' : 'miss'} 2 or more` : '',
    ].filter(Boolean).join(' · ');
  };

  return {
    collection: col.name,
    requirement: requirement.name,
    company: requirement.company,
    assessedOn: today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    link: col.url || 'https://liquidspace.com',
    meet: a.confirmedFits,
    total,
    thinBelow: CONFIRMED_NEEDED,
    criteria,
    insight: gapLine || thin ? {
      title: gapLine?.title ?? 'The collection is thin.',
      text: [gapLine?.text, thin ? `The workflow counts a collection as thin below ${CONFIRMED_NEEDED} confirmed spaces. This one has ${a.confirmedFits}.` : ''].filter(Boolean).join(' '),
    } : null,
    stated,
    searched,
    columns,
    groups: GROUPS
      .map((g) => ({ name: g as string, list: rows.filter((r) => groupOf(requirement, r.space) === g) }))
      .filter((g) => g.list.length > 0)
      .map((g) => ({ name: g.name, summary: summary(g.list), rows: g.list.map(rowOf) })),
    notAssessed: a.gaps.filter((g) => g.label === 'Not assessed').map((g) => g.text),
  };
}

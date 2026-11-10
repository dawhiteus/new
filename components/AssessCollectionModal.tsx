import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { X, Bot, ExternalLink, ChevronDown, GripVertical, Check, AlertTriangle, Info, Lock } from 'lucide-react';
import { assess, addedWhy, recordRun, requirementChanges, CONFIRMED_NEEDED, GROUPS, groupOf, setGroup, type Group, type RunInfo, type SpaceResult } from './data/assessmentAgent';
import { capacityBand, criteriaFor } from './data/collectionAgent';
import { builtByAgent } from './data/assessmentData';
import type { MvpRequirement } from './data/mvpRequirements';
import { ASSESS_LAYOUT } from './data/assessLayout';

// LiquidSpace Design System v4 tokens
const FONT = 'Inter, sans-serif';
const BLUE = '#005b94'; // interactive
const TEXT = '#374151'; // text-primary
const MUTED = '#6b7280'; // text-muted
const DISABLED = '#9ca3af'; // text-disabled
const BORDER = '#e5e7eb';
const BORDER_STRONG = '#d1d5db';
const HAIR = '#f3f4f6';
const PAGE = '#f8f9fa'; // surface-page
const SUCCESS = '#28a745';
const WARNING = '#ffa500';
const DANGER = '#dc3545';
const AMBER_TEXT = '#b45309';
const SHADOW_CARD = '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)';

const money = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;
const EYEBROW: React.CSSProperties = { fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: MUTED };
const SECTION: React.CSSProperties = { ...EYEBROW, margin: '28px 0 10px' };
const NUM: React.CSSProperties = { fontVariantNumeric: 'tabular-nums' };
const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`;
const rag = (p: number) => (p >= 0.7 ? SUCCESS : p >= 0.4 ? WARNING : DANGER);

type Prov = 'Provided' | 'Derived' | 'Assumed';
const PROV: Record<Prov, React.CSSProperties> = {
  Provided: { background: '#e6f1f8', border: '1px solid #cce3f1', color: '#004d7d' },
  Derived: { background: HAIR, border: `1px solid ${BORDER}`, color: MUTED },
  Assumed: { background: '#fffbeb', border: '1px solid #fde68a', color: AMBER_TEXT },
};
const ProvPill = ({ p }: { p: Prov }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', height: 18, padding: '0 7px', borderRadius: 9999, fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap', ...PROV[p] }}>{p}</span>
);
const Count = ({ n, blue }: { n: number; blue?: boolean }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', height: 20, padding: '0 7px', borderRadius: 9999, fontSize: 12, fontWeight: 600, ...NUM, ...(blue ? { background: '#e6f1f8', border: '1px solid #cce3f1', color: '#004d7d' } : { background: HAIR, color: MUTED }) }}>{n}</span>
);

interface Props {
  requirement: MvpRequirement | null;
  onClose: () => void;
  /** Called when this run is the first, or the requirement or collection changed since the last one. */
  onAssessed: (req: MvpRequirement, text: string) => void;
  /** Open Update collection for this requirement. */
  onUpdate?: (req: MvpRequirement) => void;
  /** A space was moved to another group. */
  onGroupChange?: (req: MvpRequirement, text: string) => void;
}

export function AssessCollectionModal({ requirement, onClose, onAssessed, onUpdate, onGroupChange }: Props) {
  const [run, setRun] = useState<RunInfo | null>(null);
  const [showSpaces, setShowSpaces] = useState(false);
  const [openRow, setOpenRow] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overGroup, setOverGroup] = useState<Group | null>(null);
  const [, setTick] = useState(0);
  const ran = useRef<string | null>(null);

  // Opening the assessment is a run. It is recorded once, so the next run can say what changed.
  useEffect(() => {
    if (!requirement || !requirement.collection) { ran.current = null; setRun(null); setShowSpaces(false); setOpenRow(null); return; }
    if (ran.current === requirement.id) return;
    const a = assess(requirement);
    if (!a) return;
    ran.current = requirement.id;
    const info = recordRun(requirement, a);
    setRun(info);
    if (info.log) onAssessed(requirement, info.log);
  }, [requirement?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!requirement || !requirement.collection) return <Dialog open={false}><DialogContent className="hidden" /></Dialog>;
  const a = assess(requirement);
  if (!a) return <Dialog open={false}><DialogContent className="hidden" /></Dialog>;
  const col = requirement.collection;
  const c = a.criteria;
  const total = a.total;
  const ok = a.state === 'ok';
  const reqChanges = requirementChanges(requirement);
  const since = run?.since && run.since.changes.length ? run.since : null;
  const useTable = ASSESS_LAYOUT === 'table' && ok && total > 0;
  const band = c.capacity ? capacityBand(c.capacity) : null;
  const bandShort = band ? `${band[0]}–${band[1]}` : '';
  const typeCount = c.type ? a.results.filter((x) => x.space.type === c.type).length : null;

  // ── Context ledger: what the requirement says, and what the agent searched with (read-only) ───────────────────
  const src = criteriaFor(requirement);
  const startDate = src.startDate ? new Date(src.startDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
  const stated: { k: string; v: string }[] = [
    { k: 'Headcount', v: c.capacity ? plural(c.capacity, 'person').replace(/persons$/, 'people') : '' },
    { k: 'Budget', v: c.budget ? `${money(c.budget)}/mo` : '' },
    { k: 'Location', v: c.location },
    { k: 'Workspace type', v: c.type },
    { k: 'Start date', v: startDate },
    { k: 'Term', v: c.termMonths ? plural(c.termMonths, 'month') : '' },
  ];
  const searched: { k: string; v: string; why?: string; prov: Prov }[] = [
    ...(band ? [{ k: 'Seats', v: bandShort, why: 'from headcount', prov: 'Derived' as Prov }] : []),
    ...(c.budget ? [{ k: 'Price', v: `Up to ${money(c.budget)}/mo`, prov: 'Provided' as Prov }] : []),
    { k: 'Area', v: `${c.radiusMi} mi of ${c.centerLabel}`, why: c.radiusIsDefault ? 'no search area given' : undefined, prov: (c.radiusIsDefault ? 'Assumed' : 'Provided') as Prov },
    ...(c.type ? [{ k: 'Type', v: c.type, prov: 'Provided' as Prov }] : []),
  ];
  const thisYear = String(new Date().getFullYear());
  const colDate = col.updated.endsWith(`, ${thisYear}`) ? col.updated.slice(0, -6) : col.updated;
  const ledgerRow = (label: string, children: React.ReactNode, shaded?: boolean) => (
    <div style={{ display: 'grid', gridTemplateColumns: '156px minmax(0, 1fr)', background: shaded ? PAGE : undefined, borderTop: shaded ? `1px solid ${HAIR}` : undefined }}>
      <div style={{ ...EYEBROW, display: 'flex', alignItems: 'center', padding: '12px 20px', borderRight: `1px solid ${HAIR}` }}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 28px', padding: '12px 20px' }}>{children}</div>
    </div>
  );
  const requirementRow = (
    <section aria-label="What this collection was built from" style={{ border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
      {ledgerRow('Requirement says', stated.map((s) => (
        <span key={s.k} style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 12, color: MUTED }}>{s.k}</span>
          <span style={{ fontSize: 13, fontWeight: s.v ? 600 : 500, color: s.v ? TEXT : MUTED, ...NUM }}>{s.v || 'Not stated'}</span>
        </span>
      )))}
      {ledgerRow('Agent searched', searched.map((s) => (
        <span key={s.k} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: MUTED }}>{s.k}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: TEXT, ...NUM }}>{s.v}</span>
          {s.why && <span style={{ fontSize: 12, color: MUTED }}>· {s.why}</span>}
          <ProvPill p={s.prov} />
        </span>
      )), true)}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderTop: `1px solid ${BORDER}`, fontSize: 12, color: MUTED }}>
        <Lock size={12} strokeWidth={2} aria-hidden />
        <span>
          {builtByAgent(col.url) ? `Collection built by Create Collection Agent · updated ${colDate}` : `Collection updated ${colDate}`}
          {reqChanges.length > 0 ? ' · requirement changed since' : ' · requirement unchanged since'}
        </span>
      </div>
    </section>
  );

  // ── Scorecard: how many spaces pass each criterion ─────────────────────────────────────────────────────────────
  const criteria = [
    { key: 'area', label: 'Distance', n: a.inArea, rule: `Within ${c.radiusMi} mi` },
    ...(band ? [{ key: 'capacity', label: 'Seats', n: a.forPeople ?? 0, rule: `${bandShort} people` }] : []),
    ...(c.budget ? [{ key: 'budget', label: 'Price', n: a.withinBudget ?? 0, rule: `Up to ${money(c.budget)}/mo` }] : []),
    ...(c.type ? [{ key: 'type', label: 'Type', n: typeCount ?? 0, rule: c.type }] : []),
  ];
  const scorecard = ok && total > 0 && (
    <div style={{ display: 'grid', gridTemplateColumns: `1.35fr repeat(${criteria.length}, minmax(0, 1fr))`, border: `1px solid ${BORDER}`, borderRadius: 16, boxShadow: SHADOW_CARD, overflow: 'hidden' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '18px 20px', background: PAGE, borderRight: `1px solid ${BORDER}` }}>
        <span style={EYEBROW}>Meet every criterion</span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, ...NUM }}>
          <span style={{ fontSize: 32, lineHeight: 1, fontWeight: 700, color: a.confirmedFits >= CONFIRMED_NEEDED ? SUCCESS : a.confirmedFits === 0 ? DANGER : TEXT }}>{a.confirmedFits}</span>
          <span style={{ fontSize: 14, fontWeight: 500, color: TEXT }}>of {plural(total, 'space')}</span>
        </div>
        <span style={{ fontSize: 12, color: MUTED }}>Thin below {CONFIRMED_NEEDED} confirmed spaces</span>
      </div>
      {criteria.map((k, i) => {
        const p = total ? k.n / total : 0;
        return (
          <div key={k.key} style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '18px 20px', borderRight: i < criteria.length - 1 ? `1px solid ${BORDER}` : undefined }}>
            <span style={EYEBROW}>{k.label}</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, ...NUM }}>
              <span style={{ fontSize: 22, lineHeight: 1, fontWeight: 600, color: TEXT }}>{k.n}</span>
              <span style={{ fontSize: 13, color: MUTED }}>of {total}</span>
            </div>
            <div style={{ height: 6, borderRadius: 9999, background: HAIR, overflow: 'hidden' }}>
              <div style={{ height: 6, borderRadius: 9999, width: `${Math.round(p * 100)}%`, background: rag(p), transition: 'width 700ms ease-out' }} />
            </div>
            <span style={{ fontSize: 12, color: MUTED }}>{k.rule}</span>
          </div>
        );
      })}
    </div>
  );

  // ── The one takeaway: the criterion most spaces miss ──────────────────────────────────────────────────────────
  const worst = criteria.length ? criteria.reduce((m, k) => (k.n < m.n ? k : m)) : null;
  const missN = worst ? total - worst.n : 0;
  const gapLine = !worst || missN === 0 ? null : (() => {
    const of = `${missN} of ${total} spaces`;
    if (worst.key === 'capacity') return { title: 'Headcount is the gap.', text: `${of} fall outside ${bandShort} people.` };
    if (worst.key === 'budget') return { title: 'Price is the gap.', text: `${of} are over ${money(c.budget as number)}/mo.` };
    if (worst.key === 'type') return { title: 'Workspace type is the gap.', text: `${of} aren't ${c.type}.` };
    return { title: 'Distance is the gap.', text: `${of} are more than ${c.radiusMi} mi from ${c.centerLabel}.` };
  })();
  const thin = a.confirmedFits < CONFIRMED_NEEDED;
  const insight = useTable && (gapLine || thin) && (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', borderRadius: 8, background: '#fffbeb', border: '1px solid #fde68a' }}>
      <AlertTriangle size={16} color={AMBER_TEXT} strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} aria-hidden />
      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: TEXT }}>
        {gapLine && <><strong style={{ fontWeight: 600 }}>{gapLine.title}</strong> {gapLine.text} </>}
        {thin && <>The workflow counts a collection as thin below {CONFIRMED_NEEDED} confirmed spaces. This one has {a.confirmedFits}.</>}
      </p>
    </div>
  );

  // ── Table layout: a row per space, a column per criterion ──────────────────────────────────────────────────────
  const metCount = (r: SpaceResult) => [r.pass.area, r.pass.capacity, r.pass.budget, r.pass.type].filter((x) => x === true).length;
  const rows = [...a.results].sort((x, y) => metCount(y) - metCount(x) || x.miles - y.miles);
  const shortDate = (d?: string) => (d ? new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '');
  const footnotes = a.gaps.filter((g) => g.label === 'Not assessed');
  const move = (r: SpaceResult, g: Group) => {
    if (groupOf(requirement, r.space) === g) return;
    setGroup(requirement, r.space, g);
    setTick((x) => x + 1);
    onGroupChange?.(requirement, `Moved “${r.space.title}” (${r.space.venue}) to ${g}.`);
  };
  const dz = (g: Group) => ({
    onDragOver: (e: React.DragEvent) => { if (dragId) { e.preventDefault(); setOverGroup(g); } },
    onDragLeave: () => setOverGroup((x) => (x === g ? null : x)),
    onDrop: (e: React.DragEvent) => { e.preventDefault(); const r = rows.find((x) => x.space.id === dragId); setDragId(null); setOverGroup(null); if (r) move(r, g); },
  });

  const GRID = ['16px', 'minmax(0, 1fr)', '112px', band ? '104px' : '', c.budget ? '144px' : '', c.type ? '132px' : '', '124px', '32px'].filter(Boolean).join(' ');
  const rowGrid: React.CSSProperties = { display: 'grid', gridTemplateColumns: GRID, columnGap: 10 };
  const head = (t: string, sub?: string) => (
    <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={EYEBROW}>{t}</span>
      {sub !== undefined && <span style={{ fontSize: 12, color: MUTED, ...NUM }}>{sub}</span>}
    </span>
  );
  // One rule for every criterion: a value that meets is just the value; a miss is one red chip with the gap in
  // words; a value we don't have is the muted word "Unknown". `note` is neutral context, never a status.
  const cell = (value: React.ReactNode, pass: boolean | null, gap = '', note = '') => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
      {value === 'Unknown'
        ? <span style={{ fontSize: 13, color: MUTED }}>Unknown</span>
        : pass === false
          ? <span style={{ alignSelf: 'flex-start', padding: '0 6px', borderRadius: 4, background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', fontSize: 13, fontWeight: 600, lineHeight: '20px', ...NUM }}>{value}{gap ? ` · ${gap}` : ''}</span>
          : <span style={{ fontSize: 13, lineHeight: '22px', color: TEXT, ...NUM }}>{value}</span>}
      {note && <span style={{ fontSize: 12, lineHeight: 1.4, color: MUTED, ...NUM }}>{note}</span>}
    </div>
  );
  const LABEL = { area: 'Distance', capacity: 'Seats', budget: 'Price', type: 'Type' } as const;
  const missesOf = (r: SpaceResult) => (Object.keys(LABEL) as (keyof typeof LABEL)[]).filter((k) => r.pass[k] === false).map((k) => LABEL[k]);
  const resultBadge = (r: SpaceResult) => {
    const m = missesOf(r);
    const okRow = m.length === 0;
    return (
      <span style={{ justifySelf: 'start', alignSelf: 'start', display: 'inline-flex', alignItems: 'center', gap: 4, height: 22, padding: '0 8px', borderRadius: 9999, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', ...(okRow ? { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d' } : { background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c' }) }}>
        {okRow ? <Check size={11} strokeWidth={3} aria-hidden /> : <X size={11} strokeWidth={3} aria-hidden />}
        {okRow ? 'Meets all' : m.length === 1 ? `Misses ${m[0]}` : `Misses ${m.length}`}
      </span>
    );
  };
  const groupSummary = (list: SpaceResult[]) => {
    const n = list.map((r) => missesOf(r).length);
    const all = n.filter((x) => x === 0).length, one = n.filter((x) => x === 1).length, more = n.filter((x) => x > 1).length;
    return [
      all ? `${all} ${all === 1 ? 'meets' : 'meet'} all` : '',
      one ? `${one} ${one === 1 ? 'misses' : 'miss'} one` : '',
      more ? `${more} ${more === 1 ? 'misses' : 'miss'} 2 or more` : '',
    ].filter(Boolean).join(' · ');
  };

  const spaceRow = (r: SpaceResult, g: Group, first: boolean) => {
    const id = r.space.id; const open = openRow === id;
    const priv = r.space.visibility === 'Private';
    const seatGap = band && r.pass.capacity === false ? (r.space.desks < band[0] ? `${band[0] - r.space.desks} short` : `${r.space.desks - band[1]} over`) : '';
    const distGap = r.pass.area === false ? `${Math.max(0.1, r.miles - c.radiusMi).toFixed(1)} mi over` : '';
    const priceGap = c.budget && r.pass.budget === false && r.space.rate != null ? `${money(r.space.rate - c.budget)} over` : '';
    const listing = priv ? (r.space.validUntil ? `Private · quote to ${shortDate(r.space.validUntil)}` : 'Private · no quote date') : `Public · updated ${r.ageDays} d ago`;
    return (
      <div key={id} {...dz(g)} style={{ borderTop: first ? undefined : `1px solid ${HAIR}`, background: open ? PAGE : '#fff', opacity: dragId === id ? 0.45 : 1 }}>
        <div
          draggable
          onDragStart={(e) => { e.dataTransfer.setData('text/plain', id); e.dataTransfer.effectAllowed = 'move'; setDragId(id); }}
          onDragEnd={() => { setDragId(null); setOverGroup(null); }}
          onClick={() => setOpenRow(open ? null : id)}
          style={{ ...rowGrid, alignItems: 'start', padding: '14px 16px', cursor: 'grab' }}
        >
          <GripVertical size={16} color={DISABLED} style={{ marginTop: 1 }} aria-hidden />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
            <span style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.4, color: TEXT }}>{r.space.title}</span>
            <span style={{ fontSize: 12, lineHeight: 1.4, color: MUTED }}>{r.space.venue}{!c.type ? ` · ${r.space.type}` : ''}</span>
            <span style={{ fontSize: 12, lineHeight: 1.4, color: r.confirmed ? MUTED : DANGER }}>{listing}{r.confirmed ? '' : ' · unconfirmed'}</span>
          </div>
          {cell(`${r.miles.toFixed(1)} mi`, r.pass.area, distGap)}
          {band ? cell(r.space.desks, r.pass.capacity, seatGap) : null}
          {c.budget ? cell(r.space.rate != null ? money(r.space.rate) : 'Unknown', r.pass.budget, priceGap, r.costPP != null ? `${money(r.costPP)} / person` : '') : null}
          {c.type ? cell(r.space.type, r.pass.type, 'not requested') : null}
          {resultBadge(r)}
          <button type="button" aria-label={open ? 'Hide details' : 'Show details'} aria-expanded={open} onClick={(e) => { e.stopPropagation(); setOpenRow(open ? null : id); }} style={{ width: 32, height: 32, marginTop: -6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: 0, borderRadius: 8, background: 'transparent', color: MUTED, cursor: 'pointer' }}>
            <ChevronDown size={16} style={{ transform: open ? 'rotate(180deg)' : undefined, transition: 'transform 150ms ease' }} />
          </button>
        </div>
        {open && (
          <div style={{ margin: '0 16px 16px 42px', padding: '16px 20px', background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', columnGap: 32 }}>
              {r.detail.map((d) => (
                <div key={d.k} style={{ display: 'grid', gridTemplateColumns: '136px minmax(0, 1fr)', gap: 12, padding: '8px 0', borderBottom: `1px solid ${HAIR}` }}>
                  <span style={{ fontSize: 12, color: MUTED }}>{d.k}</span>
                  <span style={{ fontSize: 13, color: TEXT, overflowWrap: 'anywhere' }}>{d.v}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingTop: 2 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: MUTED }}>Group
                <span style={{ position: 'relative', display: 'inline-flex' }}>
                  <select className="ac-group-select" value={g} onClick={(e) => e.stopPropagation()} onChange={(e) => move(r, e.target.value as Group)} style={{ appearance: 'none', WebkitAppearance: 'none', height: 32, minWidth: 168, padding: '0 32px 0 12px', border: `1px solid ${BORDER_STRONG}`, borderRadius: 8, background: '#fff', fontFamily: FONT, fontSize: 13, fontWeight: 500, color: TEXT, cursor: 'pointer', outline: 'none', transition: 'border-color 150ms ease, box-shadow 150ms ease' }}>
                    {GROUPS.map((x) => <option key={x}>{x}</option>)}
                  </select>
                  <ChevronDown size={14} color={MUTED} aria-hidden style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </span>
              </label>
              {r.space.url && <a href={r.space.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: BLUE, textDecoration: 'none' }}>Open Listing <ExternalLink size={13} aria-hidden /></a>}
              <style>{`.ac-group-select:hover{border-color:#9CA3AF!important}.ac-group-select:focus-visible{border-color:${BLUE}!important;box-shadow:0 0 0 3px rgba(0,91,148,.15)}`}</style>
            </div>
          </div>
        )}
      </div>
    );
  };

  const groups = GROUPS.map((g) => ({ g, list: rows.filter((r) => groupOf(requirement, r.space) === g) }));
  const emptyGroups = groups.filter((x) => x.list.length === 0);
  const fullGroups = groups.filter((x) => x.list.length > 0);
  const tableBody = (
    <>
      {emptyGroups.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${emptyGroups.length}, minmax(0, 1fr))`, gap: 12 }}>
          {emptyGroups.map(({ g }) => {
            const over = overGroup === g && dragId !== null;
            return (
              <div key={g} {...dz(g)} style={{ display: 'flex', alignItems: 'center', gap: 8, height: 48, padding: '0 16px', border: `1px dashed ${over ? BLUE : BORDER_STRONG}`, borderRadius: 12, background: over ? '#e6f1f8' : '#fff', transition: 'background 150ms ease, border-color 150ms ease' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{g}</span>
                <Count n={0} />
                <span style={{ marginLeft: 'auto', fontSize: 12, color: over ? BLUE : MUTED }}>Drag spaces here</span>
              </div>
            );
          })}
        </div>
      )}
      {fullGroups.map(({ g, list }) => {
        const over = overGroup === g && dragId !== null;
        return (
          <div key={g} style={{ border: `1px solid ${over ? BLUE : BORDER}`, borderRadius: 16, overflow: 'hidden', transition: 'border-color 150ms ease' }}>
            <div {...dz(g)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 16px', borderBottom: `1px solid ${BORDER}`, background: over ? '#e6f1f8' : '#fff' }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{g}</span>
              <Count n={list.length} blue />
              <span style={{ marginLeft: 'auto', fontSize: 12, color: MUTED, ...NUM }}>{groupSummary(list)}</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <div style={{ minWidth: 760 }}>
                <div style={{ ...rowGrid, alignItems: 'start', padding: '10px 16px', background: PAGE, borderBottom: `1px solid ${BORDER}` }}>
                  <span />
                  {head('Space')}
                  {head('Distance', `≤ ${c.radiusMi} mi`)}
                  {band ? head('Seats', bandShort) : null}
                  {c.budget ? head('Price / mo', `≤ ${money(c.budget)}`) : null}
                  {c.type ? head('Type', c.type) : null}
                  {head('Result')}
                  <span />
                </div>
                {list.map((r, i) => spaceRow(r, g, i === 0))}
              </div>
            </div>
          </div>
        );
      })}
      {footnotes.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <Info size={15} color={MUTED} style={{ flexShrink: 0, marginTop: 2 }} aria-hidden />
          <div style={{ display: 'grid', gap: 4 }}>
            {footnotes.map((g) => <p key={g.label} style={{ margin: 0, fontSize: 12, lineHeight: 1.5, color: MUTED }}><strong style={{ fontWeight: 600, color: TEXT }}>{g.label}:</strong> {g.text}</p>)}
          </div>
        </div>
      )}
    </>
  );

  const spaceLine = (r: SpaceResult, i: number) => (
    <div key={`${r.space.id}-${i}`} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '12px 0', borderTop: i ? `1px solid ${HAIR}` : undefined }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{r.space.title}<span style={{ fontWeight: 400, color: MUTED }}> · {r.space.venue}</span></div>
        <div style={{ fontSize: 13, color: r.fit && r.confirmed ? '#15803d' : TEXT, marginTop: 2 }}>{r.reason}</div>
        <div style={{ fontSize: 12, color: MUTED, marginTop: 1 }}>{r.facts}</div>
        {r.extra.length > 0 && <div style={{ fontSize: 12, color: MUTED, marginTop: 1 }}>{r.extra.join(' · ')}</div>}
      </div>
      {r.space.url && <a href={r.space.url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: BLUE, textDecoration: 'none', whiteSpace: 'nowrap', alignSelf: 'flex-start' }}>Open Listing <ExternalLink size={13} aria-hidden /></a>}
    </div>
  );

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className={`${useTable ? 'sm:max-w-[960px]' : 'sm:max-w-[700px]'} p-0 overflow-hidden [&>button]:hidden gap-0`} style={{ borderRadius: 16, border: 'none', maxHeight: '92vh', boxShadow: '0 20px 60px rgba(0,0,0,.15)', background: '#fff', display: 'flex', flexDirection: 'column', fontFamily: FONT, color: TEXT }}>
        <DialogDescription className="sr-only">The Collection Assessment Agent explains how well this collection covers the requirement</DialogDescription>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, padding: '22px 24px 20px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
            <DialogTitle style={{ margin: 0, fontSize: 20, lineHeight: 1.25, fontWeight: 600, letterSpacing: '-0.01em', color: TEXT, fontFamily: FONT }}>Assess Collection</DialogTitle>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: MUTED }}>{col.name} · {requirement.name} · {addedWhy(requirement)}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 26, padding: '0 10px', borderRadius: 9999, background: '#ecfeff', border: '1px solid #a5f3fc', color: '#0e7490', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
              <Bot size={13} aria-hidden /> Collection Assessment Agent
            </span>
            <button type="button" onClick={onClose} aria-label="Close" style={{ width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: 0, borderRadius: 8, background: 'transparent', color: MUTED, cursor: 'pointer' }}><X size={18} /></button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px 24px', overflowY: 'auto', flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gridAutoRows: 'max-content', alignContent: 'start', gap: 20 }}>
          {requirementRow}
          {scorecard}
          {insight}

          {(a.verdict || (!useTable && !ok) || reqChanges.length > 0 || since) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {a.verdict && <div style={{ fontSize: 14, color: TEXT, lineHeight: 1.5 }}>{a.verdict}</div>}
              {reqChanges.length > 0 && onUpdate && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '12px 14px', border: '1px solid #fde68a', background: '#fffbeb', borderRadius: 8 }}>
                  <div style={{ fontSize: 13, color: TEXT, lineHeight: 1.5 }}><strong style={{ fontWeight: 600 }}>The requirement has changed since this collection was built:</strong> {reqChanges.join('; ')}.</div>
                  <button type="button" onClick={() => onUpdate(requirement)} style={{ height: 36, background: '#fff', color: TEXT, border: `1px solid ${BORDER_STRONG}`, borderRadius: 12, padding: '0 14px', fontSize: 13, fontWeight: 500, fontFamily: FONT, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>Update Collection</button>
                </div>
              )}
              {since && (
                <div style={{ display: 'flex', gap: 10, padding: '12px 14px', borderRadius: 8, background: '#e6f1f8', border: '1px solid #cce3f1', fontSize: 13, color: TEXT, lineHeight: 1.5 }}>
                  <Info size={15} color="#004d7d" style={{ flexShrink: 0, marginTop: 2 }} aria-hidden />
                  <span><strong style={{ fontWeight: 600 }}>Since last assessed on {since.at}:</strong> {since.changes.join('; ')}. Matches <span style={NUM}>{since.fitsBefore} → {since.fitsNow}</span>.</span>
                </div>
              )}
            </div>
          )}

          {useTable ? tableBody : (
          <div>
          {a.cards.length > 0 && !scorecard && (
            <>
              <div style={SECTION}>By criterion</div>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${a.cards.length}, 1fr)`, gap: 12 }}>
                {a.cards.map((k) => (
                  <div key={k.label} style={{ border: `1px solid ${BORDER}`, borderRadius: 16, padding: '14px 16px', background: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 10 }}>
                    <div style={{ fontSize: 13, color: TEXT, lineHeight: 1.35 }}>{k.label}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, ...NUM }}>
                      <span style={{ fontSize: 22, fontWeight: 600, lineHeight: 1, color: TEXT }}>{k.n}</span>
                      <span style={{ fontSize: 13, color: MUTED }}>of {k.of}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Gaps and trade-offs, or why it's empty */}
          <div style={{ ...SECTION, marginTop: 0 }}>{a.gapsTitle}</div>
          <div style={{ border: `1px solid ${BORDER}`, borderRadius: 16, padding: '2px 20px' }}>
            {a.gaps.map((g, i) => {
              const muted = g.label === 'Not assessed';
              return (
                <div key={g.label} style={{ display: 'flex', gap: 16, padding: '12px 0', borderTop: i ? `1px solid ${HAIR}` : undefined }}>
                  <div style={{ width: 118, flexShrink: 0, fontSize: 13, fontWeight: 600, color: muted ? MUTED : TEXT }}>{g.label}</div>
                  <div style={{ flex: 1, fontSize: 13, color: muted ? MUTED : TEXT, lineHeight: 1.5 }}>{g.text}</div>
                </div>
              );
            })}
          </div>

          {ok && total > 0 && (
            <div style={{ border: `1px solid ${BORDER}`, borderRadius: 16, padding: '14px 20px', marginTop: 12 }}>
              <button type="button" onClick={() => setShowSpaces((s) => !s)} style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: FONT, fontSize: 14, fontWeight: 600, color: TEXT, textAlign: 'left' }}>
                <span>The {plural(total, 'space')} in this collection</span>
                <ChevronDown size={16} color={MUTED} style={{ transform: showSpaces ? 'rotate(180deg)' : undefined, transition: 'transform 150ms ease' }} />
              </button>
              {showSpaces && <div style={{ marginTop: 6 }}>{a.results.map((r, i) => spaceLine(r, i))}</div>}
            </div>
          )}
          </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '16px 24px', borderTop: `1px solid ${BORDER}`, background: PAGE, flexShrink: 0 }}>
          <span style={{ fontSize: 12, color: MUTED }}>{useTable ? 'Drag a space to move it between Shortlist, Favorites and Recommendations.' : ''}</span>
          <button type="button" onClick={onClose} style={{ height: 36, padding: '0 18px', border: 0, borderRadius: 12, background: BLUE, color: '#fff', fontFamily: FONT, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Done</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

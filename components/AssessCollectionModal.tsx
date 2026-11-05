import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { X, Bot, ExternalLink, ChevronDown, GripVertical } from 'lucide-react';
import { assess, addedWhy, recordRun, requirementChanges, CONFIRMED_NEEDED, GROUPS, groupOf, setGroup, type Group, type RunInfo, type SpaceResult } from './data/assessmentAgent';
import type { MvpRequirement } from './data/mvpRequirements';
import { ASSESS_LAYOUT } from './data/assessLayout';

const FONT = 'Inter, sans-serif';
const BLUE = '#0D619B';
const INK = '#0F2A3D';
const GREEN = '#0F7B4F';
const money = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;
const EYEBROW_GRAY: React.CSSProperties = { fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B7280' };
const SECTION: React.CSSProperties = { fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#005B94', margin: '28px 0 10px' };
const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`;

interface Props {
  requirement: MvpRequirement | null;
  onClose: () => void;
  /** Called when this run is the first, or the requirement or collection changed since the last one. */
  onAssessed: (req: MvpRequirement, text: string) => void;
  /** Open Update collection for this requirement. */
  onUpdate?: (req: MvpRequirement) => void;
  /** Open Requirement Details to edit the criteria. */
  onEdit?: (req: MvpRequirement) => void;
  /** A space was moved to another group. */
  onGroupChange?: (req: MvpRequirement, text: string) => void;
}

export function AssessCollectionModal({ requirement, onClose, onAssessed, onUpdate, onEdit, onGroupChange }: Props) {
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

  // Color only for contrast: a criterion nobody meets stands out, one everybody meets is quietly confirmed.
  const numColor = (n: number, of: number) => (n === 0 ? '#B91C1C' : n === of ? '#15803D' : INK);
  const checked = a.state === 'ok' ? [c.capacity ? a.bandText : '', c.type, c.budget ? `under ${money(c.budget)}/mo` : '', `within ${c.radiusMi} miles of ${c.centerLabel}`].filter(Boolean).join(', ') : '';
  const every = [c.capacity ? 'headcount' : '', c.type ? 'workspace type' : '', c.budget ? 'budget' : '', 'area'].filter(Boolean);
  const reqChanges = requirementChanges(requirement);
  const since = run?.since && run.since.changes.length ? run.since : null;

  const useTable = ASSESS_LAYOUT === 'table' && a.state === 'ok' && a.total > 0;
  const big = (n: number, color: string = INK) => <span style={{ fontSize: 32, fontWeight: 700, lineHeight: 1, letterSpacing: '-0.03em', color }}>{n}</span>;


  // ── Table layout: a row per space, a column per criterion ──────────────────────────────────────────────────────
  const metCount = (r: SpaceResult) => [r.pass.area, r.pass.capacity, r.pass.budget, r.pass.type].filter((x) => x === true).length;
  const rows = [...a.results].sort((x, y) => metCount(y) - metCount(x) || x.miles - y.miles);
  const colHead = (t: string, sub?: string) => <th style={{ textAlign: 'left', padding: '12px 10px 10px', fontWeight: 400, verticalAlign: 'top', whiteSpace: 'nowrap' }}><div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B7280' }}>{t}</div><div style={{ fontSize: 12, color: '#6B7280', marginTop: 3, minHeight: 16 }}>{sub}</div></th>;
  const td = (v: React.ReactNode, fail: boolean) => <td style={{ padding: '12px 10px', fontSize: 13.5, color: fail ? '#B91C1C' : '#374151', fontWeight: fail ? 600 : 400, verticalAlign: 'top', whiteSpace: 'nowrap' }}>{v}</td>;
  const shortDate = (d?: string) => (d ? new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '');
  const total = a.total;
  const footnotes = a.gaps.filter((g) => g.label === 'Not assessed');
  const move = (r: SpaceResult, g: Group) => {
    if (groupOf(requirement, r.space) === g) return;
    setGroup(requirement, r.space, g);
    setTick((x) => x + 1);
    onGroupChange?.(requirement, `Moved “${r.space.title}” (${r.space.venue}) to ${g}.`);
  };
  const tint = (ok: boolean | null): React.CSSProperties => (ok === null ? {} : { background: ok ? '#F0FAF4' : '#FEF2F2' });
  const crit = (v: React.ReactNode, ok: boolean | null, sub?: string) => (
    <td style={{ padding: '12px 10px', verticalAlign: 'top', whiteSpace: 'nowrap', ...tint(ok) }}>
      <div style={{ fontSize: 13.5, color: ok === false ? '#B91C1C' : '#374151', fontWeight: ok === false ? 600 : 400 }}>{v}</div>
      {sub && <div style={{ fontSize: 12.5, color: '#6B7280' }}>{sub}</div>}
    </td>
  );
  const nCols = 6 + (c.capacity ? 1 : 0) + (c.budget ? 1 : 0) + (c.type ? 1 : 0);
  const tableBody = (
    <>
      <div style={SECTION}>The {plural(total, 'space')}, against the requirement</div>
      <div style={{ border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FONT }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E5E7EB', background: '#F9FAFB' }}>
                {colHead('Space')}
                {colHead('Distance', `within ${c.radiusMi} mi`)}
                {c.capacity ? colHead('Seats', a.bandText ? a.bandText.replace(/ people$/, '') : undefined) : null}
                {c.budget ? colHead('Price', `up to ${money(c.budget)}/mo`) : null}
                {c.type ? colHead('Type', c.type) : null}
                {colHead('Amenities')}
                {colHead('Meets', 'criteria')}
                {colHead('Listing')}<th />
              </tr>
            </thead>
            <tbody>
              {GROUPS.map((g) => {
                const list = rows.filter((r) => groupOf(requirement, r.space) === g);
                const meet = list.filter((r) => r.fit && r.confirmed).length;
                const over = overGroup === g && dragId !== null;
                const dz = { onDragOver: (e: React.DragEvent) => { if (dragId) { e.preventDefault(); setOverGroup(g); } }, onDrop: (e: React.DragEvent) => { e.preventDefault(); const r = rows.find((x) => x.space.id === dragId); setDragId(null); setOverGroup(null); if (r) move(r, g); } };
                return (
                  <React.Fragment key={g}>
                    <tr {...dz} style={{ background: over ? '#E6F0F8' : '#F3F4F6', borderTop: '1px solid #E5E7EB' }}>
                      <td colSpan={nCols} style={{ padding: '9px 12px' }}>
                        <span style={{ fontSize: 13.5, fontWeight: 700, color: INK }}>{g}</span>
                        <span style={{ fontSize: 13, color: '#6B7280', marginLeft: 8 }}>{plural(list.length, 'space')}{list.length ? ` · ${meet} of ${list.length} meet all criteria` : ''}</span>
                      </td>
                    </tr>
                    {list.length === 0 && (
                      <tr {...dz} style={{ background: over ? '#EEF5FB' : undefined }}>
                        <td colSpan={nCols} style={{ padding: '14px 12px', fontSize: 13, color: '#9CA3AF', textAlign: 'center' }}>Drag spaces here</td>
                      </tr>
                    )}
                    {list.map((r) => {
                      const id = r.space.id; const open = openRow === id; const all = r.fit && r.confirmed;
                      const priv = r.space.visibility === 'Private';
                      const k = [r.pass.area, r.pass.capacity, r.pass.budget, r.pass.type].filter((x) => x !== null).length; const n = metCount(r);
                      return (
                        <React.Fragment key={id}>
                          <tr
                            {...dz}
                            draggable
                            onDragStart={(e) => { e.dataTransfer.setData('text/plain', id); e.dataTransfer.effectAllowed = 'move'; setDragId(id); }}
                            onDragEnd={() => { setDragId(null); setOverGroup(null); }}
                            onClick={() => setOpenRow(open ? null : id)}
                            aria-expanded={open}
                            style={{ borderTop: '1px solid #F1F3F5', cursor: 'grab', opacity: dragId === id ? 0.45 : 1, background: open ? '#F9FAFB' : over ? '#F5F9FD' : undefined }}
                          >
                            <td style={{ padding: '12px 10px', verticalAlign: 'top', minWidth: 180 }}>
                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}>
                                <GripVertical size={16} color="#9CA3AF" style={{ marginTop: 1, flexShrink: 0 }} />
                                <div>
                                  <div style={{ fontSize: 13.5, fontWeight: 600, color: INK }}>{r.space.title}</div>
                                  <div style={{ fontSize: 12.5, color: '#6B7280' }}>{r.space.venue}{!c.type ? ` · ${r.space.type}` : ''}</div>
                                </div>
                              </div>
                            </td>
                            {crit(`${r.miles.toFixed(1)} mi`, r.pass.area)}
                            {c.capacity ? crit(r.space.desks, r.pass.capacity) : null}
                            {c.budget ? crit(r.space.rate != null ? money(r.space.rate) : 'n/a', r.pass.budget, r.costPP != null ? `${money(r.costPP)} per person${r.detail.some((d) => d.k === 'Rate') ? ' · over market' : ''}` : undefined) : null}
                            {c.type ? crit(r.space.type, r.pass.type) : null}
                            <td style={{ padding: '12px 10px', verticalAlign: 'top', fontSize: 13, color: '#374151', maxWidth: 150 }}>{r.amenities || <span style={{ color: '#9CA3AF' }}>None recorded</span>}</td>
                            <td style={{ padding: '12px 10px', verticalAlign: 'top', fontSize: 13.5, fontWeight: 600, color: n === k ? GREEN : INK, whiteSpace: 'nowrap' }}>{n} of {k}</td>
                            <td style={{ padding: '12px 10px', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                              <div style={{ fontSize: 13.5, color: '#374151' }}>{priv ? 'Private' : 'Public'}</div>
                              <div style={{ fontSize: 12.5, color: r.confirmed ? '#6B7280' : '#B91C1C' }}>{priv ? (r.space.validUntil ? `quote to ${shortDate(r.space.validUntil)}` : 'no quote date') : `${r.ageDays} d ago`}</div>
                            </td>
                            <td style={{ padding: '12px 12px 12px 0', verticalAlign: 'top', width: 28 }}><ChevronDown size={16} color="#6B7280" style={{ transform: open ? 'rotate(180deg)' : undefined, transition: 'transform .15s' }} /></td>
                          </tr>
                          {open && (
                            <tr style={{ background: '#F9FAFB' }}>
                              <td colSpan={nCols} style={{ padding: '4px 14px 16px 32px' }}>
                                <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, padding: '14px 18px' }}>
                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', columnGap: 36 }}>
                                    {r.detail.map((d) => (
                                      <div key={d.k} style={{ display: 'flex', gap: 12, fontSize: 13, padding: '6px 0', borderBottom: '1px solid #F1F3F5' }}>
                                        <div style={{ width: 120, flexShrink: 0, color: '#6B7280' }}>{d.k}</div>
                                        <div style={{ color: INK, minWidth: 0, overflowWrap: 'anywhere' }}>{d.v}</div>
                                      </div>
                                    ))}
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 14, fontSize: 13 }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#6B7280' }}>Group
                                      <select value={g} onClick={(e) => e.stopPropagation()} onChange={(e) => move(r, e.target.value as Group)} aria-label="Move to group" style={{ border: '1px solid #D1D5DB', borderRadius: 6, padding: '4px 8px', fontSize: 13, fontFamily: FONT, color: INK, background: '#fff' }}>
                                        {GROUPS.map((x) => <option key={x}>{x}</option>)}
                                      </select>
                                    </label>
                                    {r.space.url && <a href={r.space.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 600, color: BLUE, textDecoration: 'none' }}>Open listing <ExternalLink size={12} /></a>}
                                    <button type="button" onClick={(e) => { e.stopPropagation(); setOpenRow(null); }} style={{ marginLeft: 'auto', background: 'none', border: 'none', padding: 0, fontWeight: 600, fontSize: 13, fontFamily: FONT, color: BLUE, cursor: 'pointer' }}>Hide details</button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: '1px solid #E5E7EB', background: '#F9FAFB' }}>
                <td style={{ padding: '12px 10px 12px 30px', fontSize: 13.5, fontWeight: 600, color: INK }}>Spaces that meet</td>
                {[a.inArea, c.capacity ? a.forPeople : null, c.budget ? a.withinBudget : null, c.type ? a.results.filter((x) => x.space.type === c.type).length : null].filter((x, i) => i === 0 || x !== null).map((n, i) => (
                  <td key={i} style={{ padding: '12px 10px', fontSize: 13.5, fontWeight: 700, color: numColor(n as number, total), whiteSpace: 'nowrap' }}>{n} of {total}</td>
                ))}
                <td />
                <td style={{ padding: '12px 10px', fontSize: 13.5, fontWeight: 700, color: numColor(a.confirmedFits, total), whiteSpace: 'nowrap' }}>{a.confirmedFits} of {total} meet all</td>
                <td style={{ padding: '12px 10px', fontSize: 13.5, color: '#6B7280', whiteSpace: 'nowrap' }}>{a.results.filter((x) => x.confirmed).length} of {total} current</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <div style={{ fontSize: 12.5, color: '#6B7280', marginTop: 8 }}>Drag a space to move it between Shortlist, Favorites and Recommendations. Select a space for venue facts.</div>
      {footnotes.length > 0 && (
        <div style={{ marginTop: 18, display: 'grid', gap: 6 }}>
          {footnotes.map((g) => <div key={g.label} style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}><b style={{ color: '#374151', fontWeight: 600 }}>{g.label}.</b> {g.text}</div>)}
        </div>
      )}
    </>
  );

  const spaceLine = (r: SpaceResult, i: number) => (
    <div key={`${r.space.id}-${i}`} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '12px 0', borderTop: i ? '1px solid #F1F3F5' : undefined }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: INK }}>{r.space.title}<span style={{ fontWeight: 400, color: '#6B7280' }}> · {r.space.venue}</span></div>
        <div style={{ fontSize: 13, color: r.fit && r.confirmed ? GREEN : '#374151', marginTop: 2 }}>{r.reason}</div>
        <div style={{ fontSize: 12.5, color: '#9CA3AF', marginTop: 1 }}>{r.facts}</div>
        {r.extra.length > 0 && <div style={{ fontSize: 12.5, color: '#9CA3AF', marginTop: 1 }}>{r.extra.join(' · ')}</div>}
      </div>
      {r.space.url && <a href={r.space.url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, color: BLUE, textDecoration: 'none', whiteSpace: 'nowrap', alignSelf: 'flex-start' }}>Open listing <ExternalLink size={12} /></a>}
    </div>
  );

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className={`${useTable ? 'sm:max-w-[980px]' : 'sm:max-w-[700px]'} p-0 overflow-hidden [&>button]:hidden gap-0`} style={{ borderRadius: 16, border: 'none', maxHeight: '92vh', boxShadow: '0 20px 60px rgba(0,0,0,.15)', background: '#fff', display: 'flex', flexDirection: 'column' }}>
        <DialogDescription className="sr-only">The Collection Assessment Agent explains how well this collection covers the requirement</DialogDescription>

        {/* Title bar: the same as the other modals */}
        <div style={{ background: BLUE, padding: '20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <DialogTitle style={{ color: '#fff', fontSize: 24, fontWeight: 700, fontFamily: FONT }}>Assess Collection</DialogTitle>
          <button type="button" onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        <div style={{ padding: '20px 24px 28px', overflowY: 'auto', flex: 1, minHeight: 0, fontFamily: FONT }}>
          {/* The agent, as elsewhere */}
          <div style={{ border: '1px solid #E5E7EB', background: '#F9FAFB', borderRadius: 12, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Bot size={18} color="#059669" /></div>
            <div style={{ flex: 1, minWidth: 0, fontSize: 14, fontWeight: 700, color: INK }}>Collection Assessment Agent</div>
            <div style={{ fontSize: 13, color: '#6B7280', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{requirement.name} · {col.name}</div>
          </div>

          {/* Result: the two facts in one panel, same structure each */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', border: '1px solid #E5E7EB', borderRadius: 12, marginTop: 16 }}>
            <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
              {big(a.total)}
              <div>
                <div style={EYEBROW_GRAY}>Spaces in collection</div>
                <div style={{ fontSize: 13, color: '#6B7280', marginTop: 3, lineHeight: 1.4 }}>{addedWhy(requirement)}</div>
              </div>
            </div>
            <div style={{ padding: '12px 20px', borderLeft: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: 14 }}>
              {big(a.confirmedFits, a.confirmedFits === 0 ? '#B91C1C' : INK)}
              <div>
                <div style={EYEBROW_GRAY}>Meet every criterion</div>
                <div style={{ fontSize: 13, color: '#6B7280', marginTop: 3, lineHeight: 1.4 }}>{a.state === 'ok' ? `${cap(every.slice(0, -1).join(', ') + (every.length > 1 ? ' and ' : '') + every[every.length - 1])}, all together.` : 'Nothing to compare yet.'}</div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div style={{ marginTop: 20 }}>
            {a.verdict && <div style={{ fontSize: 15, color: INK, lineHeight: 1.6 }}>{a.verdict}</div>}
            {checked && <div style={{ fontSize: 13, color: '#6B7280', marginTop: a.verdict ? 8 : 0, lineHeight: 1.5 }}>Checked against {checked}.{onEdit && <> <button type="button" onClick={() => onEdit(requirement)} style={{ background: 'none', border: 'none', padding: 0, color: BLUE, fontWeight: 600, fontFamily: FONT, fontSize: 13, cursor: 'pointer' }}>Edit requirement</button></>}</div>}
            {a.state === 'ok' && a.total > 0 && <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4, lineHeight: 1.5 }}>The workflow counts a collection as thin below {CONFIRMED_NEEDED} confirmed spaces. This one has {a.confirmedFits}.</div>}
            {reqChanges.length > 0 && onUpdate && (
              <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '10px 12px 10px 14px', border: '1px solid #F3D9B1', background: '#FFFAF0', borderRadius: 10 }}>
                <div style={{ fontSize: 13.5, color: '#374151', lineHeight: 1.5 }}><b style={{ color: INK }}>The requirement has changed since this collection was built:</b> {reqChanges.join('; ')}.</div>
                <button type="button" onClick={() => onUpdate(requirement)} style={{ background: '#fff', color: BLUE, border: `1px solid ${BLUE}`, borderRadius: 6, padding: '7px 14px', fontSize: 13.5, fontWeight: 600, fontFamily: FONT, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>Update collection</button>
              </div>
            )}
            {since && (
              <div style={{ fontSize: 13, color: '#374151', marginTop: 12, lineHeight: 1.5, paddingLeft: 12, borderLeft: `2px solid ${BLUE}` }}>
                <b style={{ color: INK }}>Since last assessed on {since.at}:</b> {since.changes.join('; ')}. Matches {since.fitsBefore} → {since.fitsNow}.
              </div>
            )}
          </div>

          {useTable ? tableBody : (
          <>
          {a.cards.length > 0 && (
            <>
              <div style={SECTION}>By criterion</div>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${a.cards.length}, 1fr)`, gap: 12 }}>
                {a.cards.map((k) => (
                  <div key={k.label} style={{ border: '1px solid #E5E7EB', borderRadius: 12, padding: '14px 16px', background: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 10 }}>
                    <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.35 }}>{k.label}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                      <span style={{ fontSize: 26, fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em', color: numColor(k.n, k.of) }}>{k.n}</span>
                      <span style={{ fontSize: 13.5, color: '#6B7280' }}>of {k.of}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Gaps and trade-offs, or why it's empty */}
          <div style={SECTION}>{a.gapsTitle}</div>
          <div style={{ border: '1px solid #E5E7EB', borderRadius: 12, padding: '2px 20px' }}>
            {a.gaps.map((g, i) => {
              const muted = g.label === 'Not assessed';
              return (
                <div key={g.label} style={{ display: 'flex', gap: 16, padding: '12px 0', borderTop: i ? '1px solid #F1F3F5' : undefined }}>
                  <div style={{ width: 118, flexShrink: 0, fontSize: 13.5, fontWeight: 600, color: muted ? '#6B7280' : INK }}>{g.label}</div>
                  <div style={{ flex: 1, fontSize: 13.5, color: muted ? '#6B7280' : '#374151', lineHeight: 1.55 }}>{g.text}</div>
                </div>
              );
            })}
          </div>

          {/* The spaces */}
          {a.state === 'ok' && a.total > 0 && (
            <div style={{ border: '1px solid #E5E7EB', borderRadius: 12, padding: '14px 20px', marginTop: 12 }}>
              <button type="button" onClick={() => setShowSpaces((s) => !s)} style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: FONT, fontSize: 14, fontWeight: 600, color: INK, textAlign: 'left' }}>
                <span>The {plural(a.total, 'space')} in this collection</span>
                <ChevronDown size={16} color="#9CA3AF" style={{ transform: showSpaces ? 'rotate(180deg)' : undefined, transition: 'transform .15s' }} />
              </button>
              {showSpaces && <div style={{ marginTop: 6 }}>{a.results.map((r, i) => spaceLine(r, i))}</div>}
            </div>
          )}
          </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

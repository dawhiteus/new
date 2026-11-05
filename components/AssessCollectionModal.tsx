import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { X, Bot, ExternalLink, ChevronDown } from 'lucide-react';
import { assess, addedWhy, recordRun, CONFIRMED_NEEDED, type RunInfo, type SpaceResult } from './data/assessmentAgent';
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
}

export function AssessCollectionModal({ requirement, onClose, onAssessed }: Props) {
  const [run, setRun] = useState<RunInfo | null>(null);
  const [showSpaces, setShowSpaces] = useState(false);
  const [openRow, setOpenRow] = useState<string | null>(null);
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
  const since = run?.since && run.since.changes.length ? run.since : null;

  const useTable = ASSESS_LAYOUT === 'table' && a.state === 'ok' && a.total > 0;
  const big = (n: number, color: string = INK) => <span style={{ fontSize: 44, fontWeight: 700, lineHeight: 1, letterSpacing: '-0.03em', color }}>{n}</span>;


  // ── Table layout: a row per space, a column per criterion ──────────────────────────────────────────────────────
  const metCount = (r: SpaceResult) => [r.pass.area, r.pass.capacity, r.pass.budget, r.pass.type].filter((x) => x === true).length;
  const rows = [...a.results].sort((x, y) => metCount(y) - metCount(x) || x.miles - y.miles);
  const colHead = (t: string, sub?: string) => <th style={{ textAlign: 'left', padding: '10px 10px 8px', fontWeight: 400, verticalAlign: 'bottom' }}><div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B7280' }}>{t}</div>{sub && <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{sub}</div>}</th>;
  const td = (v: React.ReactNode, fail: boolean) => <td style={{ padding: '12px 10px', fontSize: 13.5, color: fail ? '#B91C1C' : '#374151', fontWeight: fail ? 600 : 400, verticalAlign: 'top', whiteSpace: 'nowrap' }}>{v}</td>;
  const shortDate = (d?: string) => (d ? new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '');
  const total = a.total;
  const footnotes = a.gaps.filter((g) => g.label === 'Not assessed');
  const nCols = 3 + (c.capacity ? 1 : 0) + (c.budget ? 1 : 0) + (c.type ? 1 : 0) + 2;
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
                {c.capacity ? colHead('Seats', a.bandText ?? undefined) : null}
                {c.budget ? colHead('Price', `up to ${money(c.budget)}/mo`) : null}
                {c.type ? colHead('Type', c.type) : null}
                {colHead('Meets', 'criteria')}
                {colHead('Listing')}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const id = r.space.id; const open = openRow === id; const all = r.fit && r.confirmed;
                const priv = r.space.visibility === 'Private';
                return (
                  <React.Fragment key={id}>
                    <tr onClick={() => setOpenRow(open ? null : id)} aria-expanded={open} style={{ borderTop: '1px solid #F1F3F5', cursor: 'pointer', background: open ? '#F9FAFB' : undefined }}>
                      <td style={{ padding: '12px 10px', verticalAlign: 'top', minWidth: 200 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                          <ChevronDown size={16} color="#6B7280" style={{ marginTop: 1, flexShrink: 0, transform: open ? 'rotate(180deg)' : undefined, transition: 'transform .15s' }} />
                          <div>
                            <div style={{ fontSize: 13.5, fontWeight: 600, color: INK }}>{r.space.title}</div>
                            <div style={{ fontSize: 12.5, color: '#6B7280' }}>{r.space.venue}{!c.type ? ` · ${r.space.type}` : ''}</div>
                            {all && <div style={{ fontSize: 12.5, color: GREEN, marginTop: 2 }}>Meets every criterion</div>}
                          </div>
                        </div>
                      </td>
                      {td(`${r.miles.toFixed(1)} mi`, !r.pass.area)}
                      {c.capacity ? td(r.space.desks, r.pass.capacity === false) : null}
                      {c.budget ? <td style={{ padding: '12px 10px', verticalAlign: 'top', whiteSpace: 'nowrap' }}><div style={{ fontSize: 13.5, color: r.pass.budget === false ? '#B91C1C' : '#374151', fontWeight: r.pass.budget === false ? 600 : 400 }}>{r.space.rate != null ? money(r.space.rate) : 'n/a'}</div>{r.detail.some((d) => d.k === 'Rate') && <div style={{ fontSize: 12.5, color: '#6B7280' }}>over market</div>}</td> : null}
                      {c.type ? td(r.space.type, r.pass.type === false) : null}
                      {(() => { const k = [r.pass.area, r.pass.capacity, r.pass.budget, r.pass.type].filter((x) => x !== null).length; const n = metCount(r); return <td style={{ padding: '12px 10px', fontSize: 13.5, fontWeight: 600, color: n === k ? GREEN : INK, verticalAlign: 'top', whiteSpace: 'nowrap' }}>{n} of {k}</td>; })()}
                      <td style={{ padding: '12px 10px', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                        <div style={{ fontSize: 13.5, color: '#374151' }}>{priv ? 'Private' : 'Public'}</div>
                        <div style={{ fontSize: 12.5, color: r.confirmed ? '#6B7280' : '#B91C1C' }}>{priv ? (r.space.validUntil ? `quote to ${shortDate(r.space.validUntil)}` : 'no quote date') : `${r.ageDays} d ago`}</div>
                      </td>
                    </tr>
                    {open && (
                      <tr style={{ background: '#F9FAFB' }}>
                        <td colSpan={nCols} style={{ padding: '4px 10px 14px 32px' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', columnGap: 32, rowGap: 6 }}>
                            {r.detail.map((d) => (
                              <div key={d.k} style={{ display: 'flex', gap: 12, fontSize: 13 }}>
                                <div style={{ width: 130, flexShrink: 0, color: '#6B7280' }}>{d.k}</div>
                                <div style={{ color: '#374151' }}>{d.v}</div>
                              </div>
                            ))}
                          </div>
                          {r.space.url && <a href={r.space.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, color: BLUE, textDecoration: 'none', marginTop: 10 }}>Open listing <ExternalLink size={12} /></a>}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: '1px solid #E5E7EB', background: '#F9FAFB' }}>
                <td style={{ padding: '12px 10px 12px 30px', fontSize: 13.5, fontWeight: 600, color: INK }}>Meet the criterion</td>
                {[a.inArea, c.capacity ? a.forPeople : null, c.budget ? a.withinBudget : null, c.type ? a.results.filter((x) => x.space.type === c.type).length : null].filter((x, i) => i === 0 || x !== null).map((n, i) => (
                  <td key={i} style={{ padding: '12px 10px', fontSize: 13.5, fontWeight: 700, color: numColor(n as number, total), whiteSpace: 'nowrap' }}>{n} of {total}</td>
                ))}
                <td style={{ padding: '12px 10px', fontSize: 13.5, fontWeight: 700, color: numColor(a.confirmedFits, total), whiteSpace: 'nowrap' }}>{a.confirmedFits} of {total}</td>
                <td style={{ padding: '12px 10px', fontSize: 13.5, color: '#6B7280', whiteSpace: 'nowrap' }}>{a.results.filter((x) => x.confirmed).length} of {total} current</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <div style={{ fontSize: 12.5, color: '#6B7280', marginTop: 8 }}>Select a space for venue facts: booking, reviews, demand, dedicated contracts, term.</div>
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
      <DialogContent className={`${useTable ? 'sm:max-w-[900px]' : 'sm:max-w-[700px]'} p-0 overflow-hidden [&>button]:hidden gap-0`} style={{ borderRadius: 16, border: 'none', maxHeight: '92vh', boxShadow: '0 20px 60px rgba(0,0,0,.15)', background: '#fff', display: 'flex', flexDirection: 'column' }}>
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
            <div style={{ padding: '18px 24px' }}>
              <div style={EYEBROW_GRAY}>Spaces in collection</div>
              <div style={{ marginTop: 8 }}>{big(a.total)}</div>
              <div style={{ fontSize: 13, color: '#6B7280', marginTop: 8, lineHeight: 1.5 }}>{addedWhy(requirement)}</div>
            </div>
            <div style={{ padding: '18px 24px', borderLeft: '1px solid #E5E7EB' }}>
              <div style={EYEBROW_GRAY}>Meet every criterion</div>
              <div style={{ marginTop: 8 }}>{big(a.confirmedFits, a.confirmedFits === 0 ? '#B91C1C' : INK)}</div>
              <div style={{ fontSize: 13, color: '#6B7280', marginTop: 8, lineHeight: 1.5 }}>{a.state === 'ok' ? `${cap(every.slice(0, -1).join(', ') + (every.length > 1 ? ' and ' : '') + every[every.length - 1])}, all together.` : 'Nothing to compare yet.'}</div>
            </div>
          </div>

          {/* Summary */}
          <div style={{ marginTop: 20 }}>
            {a.verdict && <div style={{ fontSize: 15, color: INK, lineHeight: 1.6 }}>{a.verdict}</div>}
            {checked && <div style={{ fontSize: 13, color: '#6B7280', marginTop: a.verdict ? 8 : 0, lineHeight: 1.5 }}>Checked against {checked}.</div>}
            {a.state === 'ok' && a.total > 0 && <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4, lineHeight: 1.5 }}>The workflow counts a collection as thin below {CONFIRMED_NEEDED} confirmed spaces. This one has {a.confirmedFits}.</div>}
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

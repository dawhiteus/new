import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { X, MapPin, DollarSign, Users, ChevronDown, ExternalLink } from 'lucide-react';
import { assess, type SpaceResult, type Widen } from './data/assessmentAgent';
import type { MvpRequirement } from './data/mvpRequirements';

const FONT = 'Inter, sans-serif';
const BLUE = '#0D619B';
const INK = '#0F2A3D';
const money = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;

const STATUS_DOT = { Plenty: '#2E9D4A', Few: '#E8A91C', None: '#9CA3AF' } as const;
const TIER_DOT = { Strong: '#2E9D4A', Partial: '#E8A91C', Weak: '#9CA3AF' } as const;

const secondary: React.CSSProperties = { height: 40, padding: '0 18px', borderRadius: 10, border: '1px solid #D1D5DB', background: '#fff', color: '#374151', fontSize: 14.5, fontWeight: 600, fontFamily: FONT, cursor: 'pointer' };
const primary: React.CSSProperties = { height: 36, padding: '0 16px', borderRadius: 10, border: 'none', background: BLUE, color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: FONT, cursor: 'pointer' };
const sectionTitle: React.CSSProperties = { margin: '22px 0 8px', fontSize: 14, fontWeight: 700, color: INK, fontFamily: FONT };
const box: React.CSSProperties = { border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden', fontFamily: FONT };

interface Props {
  requirement: MvpRequirement | null;
  onClose: () => void;
  /** Accepting a proposal changes the Requirement, never the Collection directly. */
  onApply: (req: MvpRequirement, patch: { budget?: number; searchArea?: string }, summary: string) => void;
}

export function AssessCollectionModal({ requirement, onClose, onApply }: Props) {
  const [accepted, setAccepted] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState<string | null>(null);
  const [note, setNote] = useState('');

  useEffect(() => { setAccepted({}); setOpen(null); setNote(''); }, [requirement?.id]);

  if (!requirement) return <Dialog open={false}><DialogContent className="hidden" /></Dialog>;
  const a = assess(requirement);
  if (!a || !requirement.collection) {
    return (
      <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
        <DialogContent className="sm:max-w-[460px] p-6" style={{ borderRadius: 16 }}>
          <DialogTitle style={{ fontFamily: FONT }}>Assess Collection</DialogTitle>
          <DialogDescription style={{ fontFamily: FONT }}>This collection can't be assessed in the demo yet.</DialogDescription>
        </DialogContent>
      </Dialog>
    );
  }
  const c = a.criteria;
  const col = requirement.collection;

  const chosen = a.widen.filter((w) => accepted[w.id]);
  const apply = () => {
    const patch: { budget?: number; searchArea?: string } = {};
    chosen.forEach((w) => Object.assign(patch, w.patch));
    onApply(requirement, patch, chosen.map((w) => w.title).join('; '));
    setAccepted({});
    setNote('Requirement updated and the collection re-checked.');
  };

  const row = (Icon: typeof MapPin, label: string, n: number | null) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 14, padding: '4px 0' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9CA3AF' }}><Icon size={13} /> {label}</span>
      {n == null ? <span style={{ color: '#9CA3AF' }}>—</span> : <span style={{ fontWeight: 700, color: INK }}>{n} {n === 1 ? 'space' : 'spaces'}</span>}
    </div>
  );

  const evidence = (r: SpaceResult) => {
    const s = r.space;
    const lines: [string, string][] = [
      ['Distance', `${r.miles.toFixed(1)} mi from ${c.centerLabel} (venue location)`],
      ['Seats', `${s.desks}${a.bandText ? ` (needs ${a.bandText})` : ''}`],
      ['Rate', s.rate != null ? `${money(s.rate)}/mo${r.perSeat ? ` · ${money(r.perSeat)} a seat${r.marketPerSeat ? `, local median ${money(r.marketPerSeat)} a seat` : ''}` : ''}` : 'Not priced monthly'],
      ...(s.minTerm ? [['Minimum term', s.minTerm] as [string, string]] : []),
      ['Booking', s.booking ?? 'Not recorded'],
      ['Listing', `Updated ${r.ageDays} day${r.ageDays === 1 ? '' : 's'} ago. ${r.confirmed ? 'Confirmed.' : 'Not confirmed (older than 90 days).'}`],
      ...(s.responseMin ? [['Venue response', `Replies in about ${s.responseMin >= 120 ? `${Math.round(s.responseMin / 60)} hours` : `${s.responseMin} minutes`}`] as [string, string]] : []),
      ['Availability', 'Not known'],
    ];
    return (
      <div style={{ padding: '4px 16px 12px 16px', background: '#F9FAFB' }}>
        {lines.map(([k, v]) => (
          <div key={k} style={{ display: 'flex', gap: 12, fontSize: 13, padding: '3px 0' }}>
            <span style={{ width: 110, flexShrink: 0, color: '#6B7280' }}>{k}</span>
            <span style={{ color: '#374151' }}>{v}</span>
          </div>
        ))}
        <a href={s.url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, color: BLUE, marginTop: 4, textDecoration: 'none' }}>
          Open listing <ExternalLink size={12} />
        </a>
      </div>
    );
  };

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-[640px] p-0 overflow-hidden [&>button]:hidden gap-0" style={{ borderRadius: 16, border: 'none', maxHeight: '92vh', boxShadow: '0 20px 50px rgba(15,42,61,0.25)' }}>
        <DialogDescription className="sr-only">Assess how well this Collection covers the Requirement</DialogDescription>
        <div style={{ padding: '20px 24px 14px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <DialogTitle style={{ fontSize: 19, fontWeight: 700, color: INK, fontFamily: FONT, letterSpacing: '-0.01em' }}>Assess Collection</DialogTitle>
            <div style={{ fontSize: 13.5, color: '#6B7280', marginTop: 3, fontFamily: FONT }}>For {requirement.name}{requirement.company ? ` · ${requirement.company}` : ''}</div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="hover:bg-gray-100" style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', borderRadius: 8, padding: 6, marginTop: -4, marginRight: -6 }}><X size={18} /></button>
        </div>

        <div style={{ padding: '0 24px 24px', overflowY: 'auto', maxHeight: 'calc(92vh - 150px)' }}>
          {/* Result */}
          <div style={{ ...box, background: '#F9FAFB', padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, fontWeight: 700, color: INK }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: STATUS_DOT[a.status] }} /> {a.status === 'None' ? 'No matches' : a.status === 'Few' ? 'Few matches' : 'Plenty of matches'}
            </div>
            <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.5, marginTop: 6 }}>{a.headline}</div>
            {a.funnel.length > 0 && (
              <div style={{ fontSize: 13, color: '#6B7280', marginTop: 8 }}>
                What limits it: {a.funnel.map((f) => `${f.label} removes ${f.removes} of ${a.total}`).join(' · ')}
              </div>
            )}
            {a.marketMore > 0 && (
              <div style={{ fontSize: 13, color: '#374151', marginTop: 6, fontWeight: 600 }}>
                {a.marketMore} more matching space{a.marketMore === 1 ? '' : 's'} nearby {a.marketMore === 1 ? "isn't" : "aren't"} in this collection.
              </div>
            )}
          </div>
          {note && <div style={{ fontSize: 13, color: '#0F7B4F', marginTop: 8, fontFamily: FONT }}>{note}</div>}

          {/* Overview (original structure) */}
          <div style={{ ...box, marginTop: 14 }}>
            <div style={{ padding: '14px 16px 10px' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: INK }}>{col.name}</div>
              <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>{a.total} space{a.total === 1 ? '' : 's'} total</div>
            </div>
            <div style={{ borderTop: '1px solid #E5E7EB', padding: '8px 16px' }}>
              {row(MapPin, `Within ${c.radiusMi} mi of ${c.centerLabel}`, a.inArea)}
              {row(DollarSign, c.budget ? `Within ${money(c.budget)}/mo` : 'Budget not provided', a.withinBudget)}
              {row(Users, a.bandText ? `For ${a.bandText}` : 'Headcount not provided', a.forPeople)}
            </div>
            <div style={{ borderTop: '1px solid #E5E7EB', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
              {(['Strong', 'Partial', 'Weak'] as const).map((t, i) => (
                <div key={t} style={{ padding: '10px 16px', borderLeft: i ? '1px solid #E5E7EB' : undefined }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: INK, lineHeight: 1.1 }}>{a.tiers[t]}</div>
                  <div style={{ fontSize: 12, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: TIER_DOT[t] }} /> {t} match{a.tiers[t] === 1 ? '' : 'es'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gaps and trade-offs (original structure) */}
          <div style={sectionTitle}>Gaps and trade-offs</div>
          <div style={box}>
            {a.gaps.map((g, i) => (
              <div key={g.label} style={{ display: 'flex', gap: 16, padding: '10px 14px', borderTop: i ? '1px solid #F1F3F5' : undefined, alignItems: 'flex-start' }}>
                <div style={{ width: 112, flexShrink: 0, fontSize: 13.5, fontWeight: 600, color: INK }}>{g.label}</div>
                <div style={{ flex: 1, fontSize: 13.5, color: '#374151', lineHeight: 1.5 }}>{g.text}</div>
              </div>
            ))}
          </div>

          {/* Ways to widen */}
          {a.widen.length > 0 && (
            <>
              <div style={sectionTitle}>Ways to widen it</div>
              <div style={box}>
                {a.widen.map((w: Widen, i) => {
                  const on = !!accepted[w.id];
                  return (
                    <div key={w.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 14px', borderTop: i ? '1px solid #F1F3F5' : undefined }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: INK }}>{w.title}</div>
                        <div style={{ fontSize: 13, color: '#374151' }}>{w.detail}</div>
                        <div style={{ fontSize: 12, color: '#6B7280' }}>Changes the requirement: {w.patch.budget ? `Budget ${c.budget ? money(c.budget) : '—'} → ${money(w.patch.budget)}/mo` : `Search area: ${w.patch.searchArea}`}.</div>
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                        {(['Accept', 'Keep mine'] as const).map((lbl) => {
                          const sel = (lbl === 'Accept') === on;
                          return <button key={lbl} type="button" onClick={() => setAccepted((p) => ({ ...p, [w.id]: lbl === 'Accept' }))}
                            style={{ border: `1px solid ${sel ? BLUE : '#D1D5DB'}`, background: sel ? BLUE : '#fff', color: sel ? '#fff' : '#374151', borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{lbl}</button>;
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" disabled={!chosen.length} onClick={apply} style={{ ...primary, opacity: chosen.length ? 1 : 0.5, cursor: chosen.length ? 'pointer' : 'default' }}>
                  Apply{chosen.length ? ` ${chosen.length} change${chosen.length === 1 ? '' : 's'}` : ''}
                </button>
              </div>
            </>
          )}

          {/* Not in the collection yet */}
          {a.marketFits.length > 0 && (
            <>
              <div style={sectionTitle}>Nearby spaces that fit, not yet in this collection</div>
              <div style={box}>
                {a.marketFits.map((r, i) => (
                  <div key={r.space.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '9px 14px', borderTop: i ? '1px solid #F1F3F5' : undefined }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: INK }}>{r.space.title}</div>
                      <div style={{ fontSize: 12.5, color: '#6B7280' }}>{r.space.venue} · {r.miles.toFixed(1)} mi · {r.space.desks} seats · {r.space.rate != null ? `${money(r.space.rate)}/mo` : 'Not priced monthly'}</div>
                    </div>
                    <a href={r.space.url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, color: BLUE, textDecoration: 'none', whiteSpace: 'nowrap' }}>Open listing <ExternalLink size={12} /></a>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 6, fontFamily: FONT }}>The nearest {a.marketFits.length} of {a.marketMore}. Use Update collection to refresh the collection.</div>
            </>
          )}

          {/* Spaces, evidence on demand */}
          <div style={sectionTitle}>Spaces in this collection</div>
          <div style={box}>
            {a.results.map((r, i) => {
              const isOpen = open === r.space.id;
              return (
                <div key={r.space.id} style={{ borderTop: i ? '1px solid #F1F3F5' : undefined }}>
                  <button type="button" onClick={() => setOpen(isOpen ? null : r.space.id)} className="hover:bg-gray-50"
                    style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 14px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontFamily: FONT }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: INK, display: 'flex', alignItems: 'center', gap: 8 }}>
                        {r.space.title}
                        <span title={`${r.tier} match`} style={{ width: 8, height: 8, borderRadius: '50%', background: TIER_DOT[r.tier] }} />
                        {r.fit && r.confirmed && <span style={{ fontSize: 11, fontWeight: 600, color: '#0F7B4F' }}>Fits</span>}
                      </div>
                      <div style={{ fontSize: 12.5, color: '#6B7280' }}>{r.space.venue}</div>
                      <div style={{ fontSize: 12.5, color: '#374151', marginTop: 2 }}>{r.reason}</div>
                    </div>
                    <ChevronDown size={16} color="#9CA3AF" style={{ transform: isOpen ? 'rotate(180deg)' : undefined, flexShrink: 0 }} />
                  </button>
                  {isOpen && evidence(r)}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ padding: '14px 24px', borderTop: '1px solid #E5E7EB', background: '#F9FAFB', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" onClick={onClose} style={secondary}>Close</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

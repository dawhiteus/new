import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { X, Bot, ExternalLink, MapPin, DollarSign, Users, Building2, ChevronDown } from 'lucide-react';
import { assess, addedWhy, recordRun, type RunInfo, type SpaceResult } from './data/assessmentAgent';
import type { MvpRequirement } from './data/mvpRequirements';

const FONT = 'Inter, sans-serif';
const BLUE = '#0D619B';
const INK = '#0F2A3D';
const GREEN = '#0F7B4F';
const money = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;
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
  const ran = useRef<string | null>(null);

  // Opening the assessment is a run. It is recorded once, so the next run can say what changed.
  useEffect(() => {
    if (!requirement || !requirement.collection) { ran.current = null; setRun(null); setShowSpaces(false); return; }
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
  const cardIcon = (label: string) => (/ mi of /.test(label) ? MapPin : /\/mo$/.test(label) ? DollarSign : /^For /.test(label) ? Users : Building2);
  const checked = a.state === 'ok' ? [c.capacity ? a.bandText : '', c.type, c.budget ? `under ${money(c.budget)}/mo` : '', `within ${c.radiusMi} miles of ${c.centerLabel}`].filter(Boolean).join(', ') : '';
  const every = [c.capacity ? 'headcount' : '', c.type ? 'workspace type' : '', c.budget ? 'budget' : '', 'area'].filter(Boolean);
  const thin = a.state === 'ok' && a.total > 0 && a.confirmedFits < 5;
  const since = run?.since && run.since.changes.length ? run.since : null;

  const big = (n: number) => <span style={{ fontSize: 40, fontWeight: 700, lineHeight: 1, letterSpacing: '-0.03em', color: INK }}>{n}</span>;

  const spaceLine = (r: SpaceResult, i: number) => (
    <div key={`${r.space.id}-${i}`} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '12px 0', borderTop: i ? '1px solid #F1F3F5' : undefined }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: INK }}>{r.space.title}<span style={{ fontWeight: 400, color: '#6B7280' }}> · {r.space.venue}</span></div>
        <div style={{ fontSize: 13, color: r.fit && r.confirmed ? GREEN : '#374151', marginTop: 2 }}>{r.reason}</div>
        <div style={{ fontSize: 12.5, color: '#9CA3AF', marginTop: 1 }}>{r.facts}</div>
      </div>
      <a href={r.space.url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, color: BLUE, textDecoration: 'none', whiteSpace: 'nowrap', alignSelf: 'flex-start' }}>Open listing <ExternalLink size={12} /></a>
    </div>
  );

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden [&>button]:hidden gap-0" style={{ borderRadius: 16, border: 'none', maxHeight: '92vh', boxShadow: '0 20px 60px rgba(0,0,0,.15)', background: '#fff', display: 'flex', flexDirection: 'column' }}>
        <DialogDescription className="sr-only">The Collection Assessment Agent explains how well this collection covers the requirement</DialogDescription>

        {/* Title bar: the same as the other modals */}
        <div style={{ background: BLUE, padding: '20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <DialogTitle style={{ color: '#fff', fontSize: 24, fontWeight: 700, fontFamily: FONT }}>Assess Collection</DialogTitle>
          <button type="button" onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        <div style={{ padding: '16px 20px 24px', overflowY: 'auto', flex: 1, minHeight: 0, fontFamily: FONT }}>
          {/* The agent, as elsewhere */}
          <div style={{ border: '1px solid #E5E7EB', background: '#F9FAFB', borderRadius: 14, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Bot size={20} color="#059669" /></div>
            <div style={{ flex: 1, minWidth: 0, fontSize: 14, fontWeight: 700, color: INK }}>Collection Assessment Agent</div>
            <div style={{ fontSize: 13, color: '#6B7280', textAlign: 'right' }}>{requirement.name} · {col.name}</div>
          </div>

          {/* The two facts: what is in the collection, and how much of it meets every criterion */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, margin: '22px 0 0' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>{big(a.total)}<span style={{ fontSize: 16, fontWeight: 600, color: INK }}>{a.total === 1 ? 'space added' : 'spaces added'}</span></div>
              <div style={{ fontSize: 13, color: '#6B7280', marginTop: 6, lineHeight: 1.5 }}>{addedWhy(requirement)}</div>
            </div>
            <div style={{ borderLeft: '1px solid #E5E7EB', paddingLeft: 24 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 40, fontWeight: 700, lineHeight: 1, letterSpacing: '-0.03em', color: a.confirmedFits === 0 ? '#B91C1C' : INK }}>{a.confirmedFits}</span>
                <span style={{ fontSize: 16, fontWeight: 600, color: INK }}>{a.confirmedFits === 1 ? 'meets every criterion' : 'meet every criterion'}</span>
              </div>
              <div style={{ fontSize: 13, color: '#6B7280', marginTop: 6, lineHeight: 1.5 }}>{a.state === 'ok' ? `${every.slice(0, -1).join(', ')}${every.length > 1 ? ' and ' : ''}${every[every.length - 1]}` : 'Nothing to compare yet.'}</div>
            </div>
          </div>

          {/* The summary */}
          <div style={{ fontSize: 15, color: '#374151', lineHeight: 1.6, marginTop: 18 }}>
            {a.verdict}{thin ? ' That is thin (fewer than 5 confirmed fits), so an RFP to venues is the next step.' : ''}
          </div>
          {checked && <div style={{ fontSize: 13.5, color: '#6B7280', marginTop: 6, lineHeight: 1.5 }}>Checked against {checked}.</div>}
          {since && (
            <div style={{ fontSize: 13.5, color: '#374151', marginTop: 10, lineHeight: 1.5, paddingTop: 10, borderTop: '1px solid #F1F3F5' }}>
              <b style={{ color: INK }}>Since last assessed on {since.at}:</b> {since.changes.join('; ')}. Matches {since.fitsBefore} → {since.fitsNow}.
            </div>
          )}

          {a.cards.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${a.cards.length}, 1fr)`, gap: 12, marginTop: 18 }}>
              {a.cards.map((k) => {
                const Icon = cardIcon(k.label);
                return (
                  <div key={k.label} style={{ border: '1px solid #E5E7EB', borderRadius: 12, padding: '14px 16px', background: '#fff' }}>
                    <Icon size={16} color="#9CA3AF" />
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 8 }}>
                      <span style={{ fontSize: 28, fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em', color: numColor(k.n, k.of) }}>{k.n}</span>
                      <span style={{ fontSize: 14, color: '#6B7280' }}>of {k.of}</span>
                    </div>
                    <div style={{ fontSize: 12.5, color: '#6B7280', marginTop: 6, lineHeight: 1.35 }}>{k.label}</div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Gaps and trade-offs, or why it's empty */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.04)', padding: '14px 20px 4px', marginTop: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#005B94' }}>{a.gapsTitle}</div>
            <div style={{ marginTop: 4 }}>
              {a.gaps.map((g, i) => {
                const muted = g.label === 'Not assessed';
                return (
                  <div key={g.label} style={{ display: 'flex', gap: 16, padding: '11px 0', borderTop: i ? '1px solid #f3f4f6' : undefined }}>
                    <div style={{ width: 118, flexShrink: 0, fontSize: 13.5, fontWeight: 600, color: muted ? '#6b7280' : INK }}>{g.label}</div>
                    <div style={{ flex: 1, fontSize: 13.5, color: muted ? '#6b7280' : '#374151', lineHeight: 1.55 }}>{g.text}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* The spaces */}
          {a.state === 'ok' && a.total > 0 && (
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.04)', padding: '14px 20px', marginTop: 12 }}>
              <button type="button" onClick={() => setShowSpaces((s) => !s)} style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: FONT, fontSize: 15, fontWeight: 700, color: INK, textAlign: 'left' }}>
                <span>The {plural(a.total, 'space')} in this collection</span>
                <ChevronDown size={16} color="#9CA3AF" style={{ transform: showSpaces ? 'rotate(180deg)' : undefined, transition: 'transform .15s' }} />
              </button>
              {showSpaces && <div style={{ marginTop: 6 }}>{a.results.map((r, i) => spaceLine(r, i))}</div>}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

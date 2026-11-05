import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { X, Bot } from 'lucide-react';
import { listingByUrl, type AssessSpace } from './data/assessmentData';
import { assess, evaluateFor, hasSpace, proposalSpace, type SpaceResult } from './data/assessmentAgent';
import type { MvpRequirement } from './data/mvpRequirements';

const FONT = 'Inter, sans-serif';
const BLUE = '#0D619B';
const INK = '#0F2A3D';
const LABEL: React.CSSProperties = { fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B7280', marginBottom: 6 };
const INPUT: React.CSSProperties = { width: '100%', border: '1px solid #D1D5DB', borderRadius: 8, padding: '9px 12px', fontSize: 14, fontFamily: FONT, color: INK, background: '#fff', outline: 'none', boxSizing: 'border-box' };
const WORKSPACE_TYPES = ['Team Office', 'Private Office', 'Office Suite', 'Coworking Desk', 'Dedicated Desk'];
const iso = (d: Date) => d.toISOString().slice(0, 10);

interface Props {
  requirement: MvpRequirement | null;
  onClose: () => void;
  /** Called after the space is added, with a plain line for the timeline. */
  onAdded: (req: MvpRequirement, space: AssessSpace, text: string) => void;
  addSpace: (req: MvpRequirement, space: AssessSpace) => void;
}

export function AddSpaceModal({ requirement, onClose, onAdded, addSpace }: Props) {
  const [mode, setMode] = useState<'link' | 'proposal'>('link');
  const [url, setUrl] = useState('');
  const [looked, setLooked] = useState<{ space: AssessSpace | null; tried: boolean }>({ space: null, tried: false });
  const [f, setF] = useState({ venue: '', title: '', type: '', desks: '', rate: '', miles: '', validUntil: iso(new Date(Date.now() + 30 * 864e5)), availableFrom: '' });
  const [draft, setDraft] = useState<AssessSpace | null>(null);

  useEffect(() => { setMode('link'); setUrl(''); setLooked({ space: null, tried: false }); setDraft(null); }, [requirement?.id]);

  const a = requirement ? assess(requirement) : null;
  if (!requirement || !requirement.collection || !a) return <Dialog open={false}><DialogContent className="hidden" /></Dialog>;
  const col = requirement.collection;
  const ready = a.state === 'ok';
  const sp = mode === 'link' ? looked.space : draft;
  const result: SpaceResult | null = sp && ready ? evaluateFor(requirement, sp) : null;
  const already = sp ? hasSpace(requirement, sp) : false;

  const lookUp = () => {
    const hit = listingByUrl(url);
    setLooked({ space: hit ? hit.space : null, tried: true });
  };
  const num = (v: string) => (v.trim() === '' || isNaN(+v) ? null : +v);
  const proposalOk = f.venue.trim() && f.title.trim() && f.type && num(f.desks) && num(f.rate) != null && num(f.miles) != null && f.availableFrom;
  const preview = () => {
    const p = proposalSpace(requirement, { venue: f.venue.trim(), title: f.title.trim(), type: f.type, desks: num(f.desks) as number, rate: num(f.rate) as number, miles: num(f.miles) as number, validUntil: f.validUntil, availableFrom: f.availableFrom });
    setDraft(p);
  };
  const confirm = () => {
    if (!sp || already) return;
    addSpace(requirement, sp);
    const vis = sp.visibility === 'Private' ? 'private' : 'public';
    onAdded(requirement, sp, `Added “${sp.title}” (${sp.venue}, ${vis}) to ${col.name}.`);
    onClose();
  };

  const field = (label: string, node: React.ReactNode, flex = 1) => <div style={{ flex }}><div style={LABEL}>{label}</div>{node}</div>;
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => { setDraft(null); setF({ ...f, [k]: e.target.value }); };

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-[640px] p-0 overflow-hidden [&>button]:hidden gap-0" style={{ borderRadius: 16, border: 'none', maxHeight: '92vh', boxShadow: '0 20px 60px rgba(0,0,0,.15)', background: '#fff', display: 'flex', flexDirection: 'column' }}>
        <DialogDescription className="sr-only">Add a space to this requirement's collection</DialogDescription>
        <div style={{ background: BLUE, padding: '20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <DialogTitle style={{ color: '#fff', fontSize: 24, fontWeight: 700, fontFamily: FONT }}>Add Space</DialogTitle>
          <button type="button" onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        <div style={{ padding: '20px 24px 24px', overflowY: 'auto', flex: 1, minHeight: 0, fontFamily: FONT }}>
          <div style={{ border: '1px solid #E5E7EB', background: '#F9FAFB', borderRadius: 12, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Bot size={18} color="#059669" /></div>
            <div style={{ flex: 1, fontSize: 14, fontWeight: 700, color: INK }}>Collection Assessment Agent</div>
            <div style={{ fontSize: 13, color: '#6B7280' }}>{requirement.name} · {col.name}</div>
          </div>

          <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.55, marginTop: 16 }}>
            {mode === 'link'
              ? 'Paste a link to a listing. I show how it measures against the requirement before anything is added.'
              : 'Enter what the venue proposed. A proposal becomes a private listing, and it counts as confirmed while its quote is valid.'}
          </div>

          {!ready && <div style={{ fontSize: 13.5, color: '#6B7280', marginTop: 14, lineHeight: 1.5 }}>I can't measure a space against this requirement yet ({a.verdict || 'its location is not set'}), so there is nothing to add to here.</div>}

          {ready && mode === 'link' && (
            <div style={{ marginTop: 16 }}>
              <div style={LABEL}>Listing link</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input style={INPUT} placeholder="https://liquidspace.com/us/…" value={url} onChange={(e) => { setUrl(e.target.value); setLooked({ space: null, tried: false }); }} onKeyDown={(e) => { if (e.key === 'Enter') lookUp(); }} />
                <button type="button" onClick={lookUp} disabled={!url.trim()} style={{ background: BLUE, color: '#fff', border: 'none', borderRadius: 8, padding: '0 18px', whiteSpace: 'nowrap', fontSize: 14, fontWeight: 600, fontFamily: FONT, cursor: url.trim() ? 'pointer' : 'default', opacity: url.trim() ? 1 : 0.5 }}>Look up</button>
              </div>
              {looked.tried && !looked.space && (
                <div style={{ fontSize: 13.5, color: '#374151', marginTop: 12, lineHeight: 1.5 }}>I can't look that listing up from the demo. <button type="button" onClick={() => { setMode('proposal'); setLooked({ space: null, tried: false }); }} style={{ background: 'none', border: 'none', padding: 0, color: BLUE, fontWeight: 600, fontFamily: FONT, fontSize: 13.5, cursor: 'pointer' }}>Enter it as a venue proposal</button> instead.</div>
              )}
            </div>
          )}

          {ready && mode === 'proposal' && (
            <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                {field('Venue', <input style={INPUT} value={f.venue} onChange={set('venue')} />)}
                {field('Space', <input style={INPUT} value={f.title} onChange={set('title')} />)}
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                {field('Workspace type', <select style={INPUT} value={f.type} onChange={set('type')}><option value="">Choose</option>{WORKSPACE_TYPES.map((t) => <option key={t}>{t}</option>)}</select>)}
                {field('Seats', <input style={INPUT} inputMode="numeric" value={f.desks} onChange={set('desks')} />)}
                {field('Price per month', <input style={INPUT} inputMode="numeric" value={f.rate} onChange={set('rate')} />)}
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                {field(`Miles from ${a.criteria.centerLabel}`, <input style={INPUT} inputMode="decimal" value={f.miles} onChange={set('miles')} />)}
                {field('Available from', <input style={INPUT} type="date" value={f.availableFrom} onChange={set('availableFrom')} />)}
                {field('Quote valid until', <input style={INPUT} type="date" value={f.validUntil} onChange={set('validUntil')} />)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button type="button" onClick={() => { setMode('link'); setDraft(null); }} style={{ background: 'none', border: 'none', padding: 0, color: BLUE, fontWeight: 600, fontFamily: FONT, fontSize: 13.5, cursor: 'pointer' }}>Use a listing link instead</button>
                <button type="button" onClick={preview} disabled={!proposalOk} style={{ background: BLUE, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 14, fontWeight: 600, fontFamily: FONT, cursor: proposalOk ? 'pointer' : 'default', opacity: proposalOk ? 1 : 0.5 }}>Check</button>
              </div>
            </div>
          )}

          {sp && result && (
            <>
              <div style={{ border: '1px solid #E5E7EB', borderRadius: 12, padding: '14px 18px', marginTop: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: INK }}>{sp.title}<span style={{ fontWeight: 400, color: '#6B7280' }}> · {sp.venue}</span></div>
                  <div style={{ fontSize: 13, color: '#6B7280', whiteSpace: 'nowrap' }}>{sp.visibility === 'Private' ? 'Private' : 'Public'}</div>
                </div>
                <div style={{ fontSize: 13.5, color: result.fit && result.confirmed ? '#0F7B4F' : '#374151', marginTop: 6 }}>{result.reason}</div>
                <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>{result.facts}</div>
                {result.extra.filter((x) => x !== 'Public' && x !== 'Private (from a venue proposal)').length > 0 && <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>{result.extra.filter((x) => x !== 'Public' && x !== 'Private (from a venue proposal)').join(' · ')}</div>}
              </div>
              <div style={{ marginTop: 18 }}>
                <div style={LABEL}>This will</div>
                <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.55 }}>
                  {already ? 'Nothing. This space is already in the collection.' : `Add 1 workspace to ${col.name}. The assessment then shows as out of date, and the next run says what changed.`}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
                <button type="button" onClick={onClose} style={{ background: '#fff', color: INK, border: '1px solid #D1D5DB', borderRadius: 8, padding: '9px 18px', fontSize: 14, fontWeight: 600, fontFamily: FONT, cursor: 'pointer' }}>Cancel</button>
                <button type="button" onClick={confirm} disabled={already} style={{ background: BLUE, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 14, fontWeight: 600, fontFamily: FONT, cursor: already ? 'default' : 'pointer', opacity: already ? 0.5 : 1 }}>Add to collection</button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

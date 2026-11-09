import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { X, Zap, ExternalLink, ChevronLeft, Loader2, Check } from 'lucide-react';
import {
  criteriaFor, sourceCollection, resolveCollectionUrl, newCollectionUrl, realCollectionFor, capacityBand,
} from './data/collectionAgent';
import type { MvpRequirement } from './data/mvpRequirements';

const FONT = 'Inter, sans-serif';
const BLUE = '#0D619B';
const INK = '#0F2A3D';

export type CollectionMethod = 'existing' | 'agent' | 'manual';

export interface CollectionOutcome {
  method: CollectionMethod;
  name: string;
  url: string;
  spaces: number;
  saved: number;
  shortlisted: number;
  locationSpaces: number;
  budgetSpaces: number;
  peopleSpaces: number;
  assessment?: { summary: string; gaps: string[] };
}

interface Props {
  requirement: MvpRequirement | null;
  onClose: () => void;
  onComplete: (req: MvpRequirement, outcome: CollectionOutcome) => void;
}

type View = 'main' | 'existing';
type Stage = 'setup' | 'working' | 'done';

const input: React.CSSProperties = { width: '100%', border: '1px solid #D1D5DB', borderRadius: 10, padding: '10px 14px', fontSize: 15, fontFamily: FONT, color: INK, background: '#fff', outline: 'none', transition: 'border-color .15s, box-shadow .15s' };
const inputFocus = 'focus:!border-[#0D619B] focus:!shadow-[0_0_0_3px_rgba(13,97,155,0.15)]';
const lbl: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6, fontFamily: FONT };
const btn: React.CSSProperties = { height: 40, padding: '0 18px', borderRadius: 10, fontSize: 14.5, fontWeight: 600, fontFamily: FONT, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, whiteSpace: 'nowrap' };
const primary: React.CSSProperties = { ...btn, border: 'none', background: BLUE, color: '#fff', boxShadow: '0 1px 2px rgba(13,97,155,0.3)' };
const secondary: React.CSSProperties = { ...btn, border: '1px solid #D1D5DB', background: '#fff', color: '#374151' };
const footer: React.CSSProperties = { padding: '14px 24px', borderTop: '1px solid #E5E7EB', background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 };

export function CreateCollectionModal({ requirement, onClose, onComplete }: Props) {
  const [view, setView] = useState<View>('main');
  const [stage, setStage] = useState<Stage>('setup');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [name, setName] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<CollectionOutcome | null>(null);

  const open = requirement !== null;
  useEffect(() => {
    if (!requirement) return;
    setView('main'); setStage('setup'); setUrl(''); setError(''); setName(null); setOutcome(null);
  }, [requirement?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!requirement) return <Dialog open={false}><DialogContent className="hidden" /></Dialog>;

  const criteria = criteriaFor(requirement);
  const city = criteria.location.split(',')[0];
  const realC = realCollectionFor(criteria.location);
  const shownName = name ?? `${requirement.name} Collection`;
  const finalName = realC ? realC.name : shownName.trim();
  const canCreate = !!finalName && criteria.location !== '';

  const linkByUrl = () => {
    const r = resolveCollectionUrl(url);
    if ('error' in r) { setError(r.error); return; }
    onComplete(requirement, {
      method: 'existing', name: r.name, url: r.url, spaces: r.spaces, saved: r.saved, shortlisted: r.shortlisted,
      locationSpaces: 0, budgetSpaces: 0, peopleSpaces: 0,
    });
    onClose();
  };

  /** One step, as in production: create the collection, populate it, assess it, link it. */
  const create = () => {
    if (!canCreate) return;
    setStage('working');
    setTimeout(() => {
      const r = sourceCollection(criteria, finalName);
      const collectionUrl = realC ? realC.url : newCollectionUrl(finalName);
      let o: CollectionOutcome;
      if (!r) {
        o = {
          method: 'agent', name: finalName, url: collectionUrl, spaces: 0, saved: 0, shortlisted: 0,
          locationSpaces: 0, budgetSpaces: 0, peopleSpaces: 0,
          assessment: { summary: `No suitable LiquidSpace inventory was found in ${city}, so “${finalName}” was created empty.`, gaps: [`Overall: No suitable inventory was found in ${city}. Add spaces in LiquidSpace or link another Collection.`] },
        };
      } else {
        const band = criteria.capacity != null ? capacityBand(criteria.capacity) : null;
        const people = band ? r.spaces.filter((v) => v.desks >= band[0] && v.desks <= band[1]).length : 0;
        o = {
          method: 'agent', name: finalName, url: collectionUrl, spaces: r.found, saved: r.found, shortlisted: 0,
          locationSpaces: r.inMarket, budgetSpaces: r.withinBudget, peopleSpaces: people,
          assessment: { summary: r.summary, gaps: r.gaps.map((g) => `${g.label}: ${g.text}`) },
        };
      }
      setOutcome(o);
      onComplete(requirement, o);
      setStage('done');
    }, 1400);
  };

  const header = (title: string, sub?: string) => (
    <div style={{ padding: '20px 24px 16px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
      <div>
        <DialogTitle style={{ fontSize: 19, fontWeight: 700, color: INK, fontFamily: FONT, letterSpacing: '-0.01em' }}>{title}</DialogTitle>
        {sub && <div style={{ fontSize: 13.5, color: '#6B7280', marginTop: 3, fontFamily: FONT }}>{sub}</div>}
      </div>
      <button type="button" onClick={onClose} aria-label="Close" className="hover:bg-gray-100" style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', borderRadius: 8, padding: 6, marginTop: -4, marginRight: -6 }}><X size={18} /></button>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden [&>button]:hidden gap-0" style={{ borderRadius: 16, border: 'none', maxHeight: '92vh', boxShadow: '0 20px 50px rgba(15,42,61,0.25)' }}>
        <DialogDescription className="sr-only">Create or link a LiquidSpace Collection for this requirement</DialogDescription>

        {view === 'existing' && (
          <>
            {header('Link a Collection', `For ${requirement.name}${requirement.company ? ` · ${requirement.company}` : ''}`)}
            <div style={{ padding: '4px 24px 24px', fontFamily: FONT }}>
              <div style={{ fontSize: 14, color: '#6B7280', marginBottom: 16, lineHeight: 1.5 }}>Paste the link to a Collection in LiquidSpace. Its contents aren't changed.</div>
              <label style={lbl}>Collection URL</label>
              <input value={url} onChange={(e) => { setUrl(e.target.value); setError(''); }} placeholder="https://liquidspace.com/collections/…" style={input} className={inputFocus} autoFocus
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); linkByUrl(); } }} />
              {error && <div style={{ fontSize: 13, color: '#B91C1C', marginTop: 8 }}>{error}</div>}
            </div>
            <div style={footer}>
              <button type="button" onClick={() => { setView('main'); setError(''); }} style={{ background: 'none', border: 'none', color: BLUE, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, padding: 0, fontFamily: FONT }}>
                <ChevronLeft size={16} /> Back
              </button>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" onClick={onClose} style={secondary}>Cancel</button>
                <button type="button" onClick={linkByUrl} style={primary}>Link Collection</button>
              </div>
            </div>
          </>
        )}

        {view === 'main' && stage !== 'done' && (
          <>
            {header('New Collection', `For ${requirement.name}${requirement.company ? ` · ${requirement.company}` : ''}`)}
            <div style={{ padding: '4px 24px 24px', fontFamily: FONT }}>
              <label style={lbl}>Collection name</label>
              <input value={realC ? realC.name : shownName} disabled={!!realC || stage === 'working'} onChange={(e) => setName(e.target.value)} className={inputFocus}
                style={{ ...input, background: realC || stage === 'working' ? '#F3F4F6' : '#fff' }}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); create(); } }} />
              <div style={{ background: '#F5F9FD', border: '1px solid #DCE8F5', borderRadius: 12, padding: '14px 16px', margin: '18px 0 14px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: '#E3EEFA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Zap size={15} color={BLUE} />
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.55, color: '#1E3A5F' }}>
                  <b style={{ fontWeight: 600 }}>The Create Collection Agent</b> searches LiquidSpace for spaces that match this requirement's location, headcount and workspace type, and builds the collection for you. You can add or remove spaces at any time.
                </div>
              </div>
              {!criteria.location && (
                <div style={{ fontSize: 13.5, color: '#6B7280', lineHeight: 1.55 }}>
                  This requirement needs a location first. Add one, or link an existing collection.
                </div>
              )}
            </div>
            <div style={footer}>
              <button type="button" onClick={() => setView('existing')} disabled={stage === 'working'} style={{ background: 'none', border: 'none', color: BLUE, fontSize: 14, fontWeight: 600, cursor: 'pointer', padding: 0, fontFamily: FONT }}>
                Link an Existing Collection
              </button>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" onClick={onClose} disabled={stage === 'working'} style={secondary}>Cancel</button>
                <button type="button" onClick={create} disabled={!canCreate || stage === 'working'} style={{ ...primary, opacity: canCreate ? 1 : 0.5, cursor: canCreate ? 'pointer' : 'default' }}>
                  {stage === 'working' && <Loader2 size={16} className="animate-spin" />} {stage === 'working' ? 'Creating…' : 'Create Collection'}
                </button>
              </div>
            </div>
          </>
        )}

        {view === 'main' && stage === 'done' && outcome && (
          <>
            <div style={{ padding: '32px 32px 24px', textAlign: 'center', fontFamily: FONT, position: 'relative' }}>
              <button type="button" onClick={onClose} aria-label="Close" className="hover:bg-gray-100" style={{ position: 'absolute', top: 14, right: 14, background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', borderRadius: 8, padding: 6 }}><X size={18} /></button>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#E6F4EC', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <Check size={24} color="#0F7B4F" />
              </div>
              <DialogTitle style={{ fontSize: 19, fontWeight: 700, color: INK, fontFamily: FONT, letterSpacing: '-0.01em' }}>
                {outcome.spaces > 0 ? 'Collection populated' : 'Collection created'}
              </DialogTitle>
              <div style={{ fontSize: 14.5, color: '#4B5563', lineHeight: 1.6, marginTop: 8 }}>
                {outcome.spaces > 0
                  ? <>“{outcome.name}” now has {outcome.spaces} space{outcome.spaces === 1 ? '' : 's'} for the requirement “{requirement.name}”.</>
                  : <>“{outcome.name}” was created, but no suitable spaces were found in {city}. You can add spaces in LiquidSpace.</>}
              </div>
            </div>
            <div style={{ ...footer, justifyContent: 'flex-end' }}>
              <button type="button" onClick={onClose} style={secondary}>Close</button>
              <a href={outcome.url} target="_blank" rel="noreferrer" onClick={onClose} style={{ ...primary, textDecoration: 'none' }}>
                View Collection <ExternalLink size={15} />
              </a>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

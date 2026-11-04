import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { X, Zap, ExternalLink, ChevronLeft, Loader2 } from 'lucide-react';
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

const input: React.CSSProperties = { width: '100%', border: '1.5px solid #0F2A3D', borderRadius: 8, padding: '11px 14px', fontSize: 15, fontFamily: FONT, color: INK, background: '#fff', outline: 'none' };
const lbl: React.CSSProperties = { display: 'block', fontSize: 14, fontWeight: 600, color: INK, marginBottom: 8, fontFamily: FONT };
const primary: React.CSSProperties = { padding: '10px 16px', borderRadius: 8, border: 'none', background: BLUE, color: '#fff', fontSize: 15, fontWeight: 600, fontFamily: FONT, cursor: 'pointer' };
const secondary: React.CSSProperties = { padding: '10px 16px', borderRadius: 8, border: `1px solid ${BLUE}`, background: '#fff', color: BLUE, fontSize: 15, fontWeight: 500, fontFamily: FONT, cursor: 'pointer' };

export function CreateCollectionModal({ requirement, onClose, onComplete }: Props) {
  const [view, setView] = useState<View>('main');
  const [stage, setStage] = useState<Stage>('setup');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [outcome, setOutcome] = useState<CollectionOutcome | null>(null);

  const open = requirement !== null;
  useEffect(() => {
    if (!requirement) return;
    setView('main'); setStage('setup'); setUrl(''); setError(''); setName(`${requirement.name} Collection`); setOutcome(null);
  }, [requirement?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!requirement) return <Dialog open={false}><DialogContent className="hidden" /></Dialog>;

  const criteria = criteriaFor(requirement);
  const city = criteria.location.split(',')[0];
  const realC = realCollectionFor(criteria.location);
  const finalName = realC ? realC.name : name.trim();
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

  const header = (title: string) => (
    <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <DialogTitle style={{ fontSize: 18, fontWeight: 600, color: '#374151', fontFamily: FONT }}>{title}</DialogTitle>
      <button type="button" onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer' }}><X size={18} /></button>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden [&>button]:hidden gap-0" style={{ borderRadius: 20, border: 'none', maxHeight: '92vh' }}>
        <DialogDescription className="sr-only">Create or link a LiquidSpace Collection for this requirement</DialogDescription>

        {view === 'existing' && (
          <>
            {header('Link a Collection')}
            <div style={{ padding: 20, fontFamily: FONT }}>
              <button type="button" onClick={() => { setView('main'); setError(''); }} style={{ background: 'none', border: 'none', color: BLUE, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, padding: 0, marginBottom: 14 }}>
                <ChevronLeft size={16} /> Back
              </button>
              <div style={{ fontSize: 14, color: '#6B7280', marginBottom: 14 }}>Paste the link to a Collection in LiquidSpace. Its contents aren't changed.</div>
              <label style={lbl}>Collection URL</label>
              <input value={url} onChange={(e) => { setUrl(e.target.value); setError(''); }} placeholder="https://liquidspace.com/collections/…" style={input}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); linkByUrl(); } }} />
              {error && <div style={{ fontSize: 13, color: '#B91C1C', marginTop: 6 }}>{error}</div>}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
                <button type="button" onClick={onClose} style={secondary}>Cancel</button>
                <button type="button" onClick={linkByUrl} style={primary}>Link Collection</button>
              </div>
            </div>
          </>
        )}

        {view === 'main' && stage !== 'done' && (
          <>
            {header('New Collection')}
            <div style={{ padding: 20, fontFamily: FONT }}>
              <div style={{ fontSize: 15, color: INK, marginBottom: 14 }}>Requirement: <b>{requirement.name}</b></div>
              <label style={lbl}>Collection Name</label>
              <input value={realC ? realC.name : name} disabled={!!realC || stage === 'working'} onChange={(e) => setName(e.target.value)} style={{ ...input, background: realC ? '#F3F4F6' : '#fff' }}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); create(); } }} />
              <div style={{ background: '#EEF5FD', border: '1px solid #C9DDF3', borderRadius: 10, padding: '14px 16px', margin: '16px 0', display: 'flex', gap: 10, fontSize: 15, lineHeight: 1.5, color: '#1D4ED8' }}>
                <Zap size={16} style={{ marginTop: 4, flexShrink: 0 }} />
                <div><b style={{ fontWeight: 600 }}>The Create Collection Agent</b> will source spaces based on this requirement's metadata — location, headcount, budget, and workspace type.</div>
              </div>
              <div style={{ fontSize: 15, color: '#374151', lineHeight: 1.5 }}>
                {criteria.location
                  ? <>Once the collection is ready, a <b>collection link</b> and <b>fitness assessment</b> will appear in the Requirements table.</>
                  : <>This requirement needs a location first. Add one, or link an existing collection.</>}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
                <button type="button" onClick={() => setView('existing')} disabled={stage === 'working'} style={{ background: 'none', border: 'none', color: BLUE, fontSize: 14, fontWeight: 600, cursor: 'pointer', padding: 0 }}>
                  Already have a collection? Link it
                </button>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="button" onClick={onClose} disabled={stage === 'working'} style={secondary}>Cancel</button>
                  <button type="button" onClick={create} disabled={!canCreate || stage === 'working'}
                    style={{ ...primary, opacity: canCreate ? 1 : 0.5, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    {stage === 'working' && <Loader2 size={16} className="animate-spin" />} {stage === 'working' ? 'Creating…' : 'Create Collection'}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {view === 'main' && stage === 'done' && outcome && (
          <>
            {header(outcome.spaces > 0 ? 'Collection Populated' : 'Collection Created')}
            <div style={{ padding: 20, fontFamily: FONT }}>
              <div style={{ fontSize: 15, color: '#374151', lineHeight: 1.55 }}>
                {outcome.spaces > 0
                  ? <>The collection for the requirement “{requirement.name}” has been populated successfully. You can view the collection by clicking the button below.</>
                  : <>The collection for the requirement “{requirement.name}” was created, but no suitable spaces were found in {city}. You can add spaces in LiquidSpace.</>}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
                <button type="button" onClick={onClose} style={secondary}>Close</button>
                <a href={outcome.url} target="_blank" rel="noreferrer" onClick={onClose} style={{ ...primary, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  View Collection <ExternalLink size={15} />
                </a>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

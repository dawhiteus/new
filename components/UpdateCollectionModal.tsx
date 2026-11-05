import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { X, Bot } from 'lucide-react';
import { previewUpdate, requirementChanges } from './data/assessmentAgent';
import type { MvpRequirement } from './data/mvpRequirements';

const FONT = 'Inter, sans-serif';
const BLUE = '#0D619B';
const INK = '#0F2A3D';
const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`;

interface Props {
  requirement: MvpRequirement | null;
  onClose: () => void;
  onConfirm: (req: MvpRequirement) => void;
}

export function UpdateCollectionModal({ requirement, onClose, onConfirm }: Props) {
  if (!requirement || !requirement.collection) return <Dialog open={false}><DialogContent className="hidden" /></Dialog>;
  const col = requirement.collection;
  const changes = requirementChanges(requirement);
  const p = previewUpdate(requirement);

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-[560px] p-0 overflow-hidden [&>button]:hidden gap-0" style={{ borderRadius: 16, border: 'none', boxShadow: '0 20px 60px rgba(0,0,0,.15)', background: '#fff' }}>
        <DialogDescription className="sr-only">Search again with the current requirement and update the collection</DialogDescription>
        <div style={{ background: BLUE, padding: '20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <DialogTitle style={{ color: '#fff', fontSize: 24, fontWeight: 700, fontFamily: FONT }}>Update Collection</DialogTitle>
          <button type="button" onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        <div style={{ padding: '20px 24px 24px', fontFamily: FONT }}>
          <div style={{ border: '1px solid #E5E7EB', background: '#F9FAFB', borderRadius: 12, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Bot size={18} color="#059669" /></div>
            <div style={{ flex: 1, fontSize: 14, fontWeight: 700, color: INK }}>Collection Assessment Agent</div>
            <div style={{ fontSize: 13, color: '#6B7280' }}>{requirement.name} · {col.name}</div>
          </div>

          {changes.length > 0 && <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.55, marginTop: 16, paddingLeft: 12, borderLeft: `2px solid ${BLUE}` }}>The requirement has changed since this collection was built: {changes.join('; ')}.</div>}

          <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.6, marginTop: 16 }}>
            {!p
              ? "I can't search for spaces until the requirement has a location I can find."
              : p.keep.length === 0
                ? `I'll search again with the current requirement. No nearby listing meets every criterion, so ${plural(p.remove, 'space')} would be removed and none added.`
                : `I'll search again with the current requirement. ${plural(p.keep.length, 'space')} meet every criterion: ${p.add} would be added and ${p.remove} removed.`}
            {p && p.handAdded > 0 ? ` The ${plural(p.handAdded, 'space')} you added by hand will be added back.` : ''}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 22 }}>
            <button type="button" onClick={onClose} style={{ background: '#fff', color: INK, border: '1px solid #D1D5DB', borderRadius: 8, padding: '9px 18px', fontSize: 14, fontWeight: 600, fontFamily: FONT, cursor: 'pointer' }}>Cancel</button>
            <button type="button" disabled={!p} onClick={() => onConfirm(requirement)} style={{ background: BLUE, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 14, fontWeight: 600, fontFamily: FONT, cursor: p ? 'pointer' : 'default', opacity: p ? 1 : 0.5 }}>Update collection</button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

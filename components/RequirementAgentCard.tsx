import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { FIELD_LABEL, proposeUpdate, shortVal, type FieldChange, type IntakeFields, type UpdateProposal } from './data/intakeAgent';

const FONT = 'Inter, sans-serif';
const BLUE = '#0D619B';
const GREEN = '#0F7B4F';

interface Props {
  fields: IntakeFields;
  hasCollection: boolean;
  /** Apply the proposed changes. The parent saves them and logs the update. */
  onApply: (changes: FieldChange[], sourceText: string) => void;
}

/** Update from text: paste new correspondence, review before and after, apply. */
export function RequirementAgentCard({ fields, hasCollection, onApply }: Props) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [proposal, setProposal] = useState<UpdateProposal | null>(null);

  const close = () => { setOpen(false); setText(''); setProposal(null); };
  const review = () => {
    try { setProposal(proposeUpdate(fields, text, { hasCollection })); }
    catch { setProposal({ changes: [], unchanged: [], unclear: ["I couldn't read that text. Nothing was changed."], notes: [], consequence: null, found: true }); }
  };
  const apply = () => { onApply(proposal!.changes, text.trim()); close(); };

  const btn: React.CSSProperties = { background: BLUE, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: FONT };
  const ghost: React.CSSProperties = { background: 'none', border: 'none', color: '#6B7280', fontSize: 14, cursor: 'pointer', fontFamily: FONT, padding: '8px 4px' };

  if (!open) {
    return (
      <div style={{ marginBottom: 16, fontFamily: FONT }}>
        <button type="button" onClick={() => setOpen(true)} style={{ background: 'none', border: 'none', padding: 0, color: GREEN, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Sparkles size={14} /> Update from text
        </button>
      </div>
    );
  }

  return (
    <div style={{ border: '1px solid #E5E7EB', background: '#F9FAFB', borderRadius: 12, padding: '12px 16px', marginBottom: 16, fontFamily: FONT }}>
      {!proposal ? (
        <div>
          <textarea autoFocus value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste a reply, call notes or a revised brief."
            style={{ width: '100%', minHeight: 90, border: '1px solid #D1D5DB', borderRadius: 8, padding: 10, fontSize: 14, fontFamily: FONT, background: '#fff', boxSizing: 'border-box' }} />
          <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
            <button type="button" disabled={!text.trim()} onClick={review} style={{ ...btn, opacity: text.trim() ? 1 : 0.5, cursor: text.trim() ? 'pointer' : 'default' }}>Review changes</button>
            <button type="button" onClick={close} style={ghost}>Cancel</button>
          </div>
        </div>
      ) : (
        <div>
          {proposal.changes.length > 0 ? (
            <>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0F2A3D', marginBottom: 4 }}>{proposal.changes.length === 1 ? '1 change' : `${proposal.changes.length} changes`}</div>
              {proposal.changes.map((c, i) => (
                <div key={c.field} style={{ display: 'flex', gap: 12, padding: '7px 0', borderTop: i ? '1px solid #E5E7EB' : 'none', fontSize: 14, color: '#374151' }}>
                  <div style={{ width: 150, flexShrink: 0, color: '#6B7280' }}>{FIELD_LABEL[c.field].replace(/ \(.*\)/, '')}</div>
                  <div style={{ minWidth: 0 }}>
                    {(c.shownFrom ?? c.from) ? <span style={{ color: '#9CA3AF', textDecoration: 'line-through' }}>{shortVal(c.field, c.shownFrom ?? c.from)}</span> : <span style={{ color: '#9CA3AF' }}>Empty</span>}
                    {' → '}<b style={{ color: '#0F2A3D' }}>{shortVal(c.field, c.shown ?? c.to)}</b>
                  </div>
                </div>
              ))}
              {proposal.unclear.length > 0 && <div style={{ fontSize: 13, color: '#92400E', marginTop: 8 }}>Not applied: {proposal.unclear.join(' ')}</div>}
              {proposal.consequence && <div style={{ fontSize: 13, color: '#6B7280', marginTop: 8 }}>{proposal.consequence}</div>}
              <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center' }}>
                <button type="button" onClick={apply} style={btn}>Apply</button>
                <button type="button" onClick={() => setProposal(null)} style={ghost}>Edit text</button>
                <button type="button" onClick={close} style={ghost}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 14, color: '#374151' }}>{proposal.unclear.length ? proposal.unclear.join(' ') : 'No changes found. Nothing in that text differs from this requirement.'}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button type="button" onClick={close} style={btn}>Close</button>
                <button type="button" onClick={() => setProposal(null)} style={ghost}>Edit text</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

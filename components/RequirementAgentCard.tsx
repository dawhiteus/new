import React, { useEffect, useState } from 'react';
import { Bot, Copy, X } from 'lucide-react';
import { toast } from './ui/toast';
import {
  AGENT_NAME, FIELD_LABEL, proposeUpdate, summarize, optionalMissing, describeChange, shortVal,
  type FieldChange, type IntakeFields, type Provenance, type UpdateProposal,
} from './data/intakeAgent';

const FONT = 'Inter, sans-serif';
const BLUE = '#0D619B';
const INK = '#0F2A3D';
const GREEN = '#0F7B4F';
const EYEBROW: React.CSSProperties = { fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6B7280' };

export interface AgentIntake {
  questions: string[]; useful?: string[]; notes?: string[]; fieldOfQuestion?: Record<string, string>;
}
interface Props {
  fields: IntakeFields;
  prov: Partial<Record<string, Provenance>>;
  intake?: AgentIntake;
  hasCollection: boolean;
  /** Apply accepted changes. The parent saves them and logs the update. */
  onApply: (changes: FieldChange[], sourceText: string) => void;
  onIntakeChange: (next: AgentIntake) => void;
  /** Lets the parent open the panel (for example from a question's Answer action). */
  openSignal?: number;
}

const legacyField = (q: string): keyof IntakeFields | null => {
  const map: [RegExp, keyof IntakeFields][] = [[/neighborhood|radius/i, 'otherFunctional'], [/budget/i, 'budget'], [/start/i, 'startDate'], [/term|how long/i, 'termLength'], [/how many people/i, 'capacity'], [/type of space|what type/i, 'workspaceType'], [/size|sq ft/i, 'size']];
  return map.find(([re]) => re.test(q))?.[1] ?? null;
};
/** Open questions whose field now has a value are answered. */
export function pruneQuestions<T extends AgentIntake>(intake: T, f: Partial<IntakeFields>): T {
  const keep = (q: string) => {
    const fld = (intake.fieldOfQuestion?.[q] as keyof IntakeFields | undefined) ?? legacyField(q);
    return !(fld && String(f[fld] ?? '').trim());
  };
  return { ...intake, questions: intake.questions.filter(keep), useful: intake.useful?.filter(keep) };
}

export function RequirementAgentCard({ fields, prov, intake, hasCollection, onApply, onIntakeChange, openSignal }: Props) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [proposal, setProposal] = useState<UpdateProposal | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => { if (openSignal) setOpen(true); }, [openSignal]);

  const sm = summarize(fields, prov as any);
  const questions = intake?.questions ?? [];
  const useful = intake?.useful ?? [];
  const optional = optionalMissing(fields);

  const review = () => {
    let p: UpdateProposal;
    try { p = proposeUpdate(fields, text, { hasCollection }); }
    catch { p = { changes: [], unchanged: [], unclear: ["I couldn't read that text. Nothing was changed. You can edit it and try again."], notes: [], consequence: null, found: true }; }
    setProposal(p);
    setChecked(Object.fromEntries(p.changes.map((c) => [c.field, true])));
  };
  const close = () => { setOpen(false); setText(''); setProposal(null); };
  const apply = () => {
    const chosen = proposal!.changes.filter((c) => checked[c.field]);
    if (!chosen.length) return;
    onApply(chosen, text.trim());
    close();
  };
  const dismiss = (q: string) => onIntakeChange({ ...intake!, questions: questions.filter((x) => x !== q), useful: useful.filter((x) => x !== q) });

  const nChosen = proposal ? proposal.changes.filter((c) => checked[c.field]).length : 0;
  const link: React.CSSProperties = { background: 'none', border: 'none', padding: 0, color: BLUE, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: FONT };
  const btn: React.CSSProperties = { background: BLUE, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: FONT };
  const ghost: React.CSSProperties = { background: 'none', border: 'none', color: '#6B7280', fontSize: 14, cursor: 'pointer', fontFamily: FONT, padding: '8px 4px' };

  return (
    <div style={{ border: '1px solid #E5E7EB', background: '#F9FAFB', borderRadius: 12, padding: '14px 16px', marginBottom: 16, fontFamily: FONT }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Bot size={18} color="#059669" /></div>
        <div style={{ flex: 1, fontSize: 14, fontWeight: 700, color: INK }}>{AGENT_NAME}</div>
        {!open && <button type="button" onClick={() => setOpen(true)} style={{ ...link, color: GREEN }}>Update from text</button>}
      </div>

      <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.55, marginTop: 10 }}>
        <div>{sm.text}</div>
        {sm.assumptions.length > 0 && <div style={{ marginTop: 6, color: '#92400E' }}><b>Assumed:</b> {sm.assumptions.join('; ')}.</div>}
        {sm.needed.length > 0 && <div style={{ marginTop: 6 }}><b>Still needed:</b> {sm.needed.join(', ')}.</div>}
        {(intake?.notes?.length ?? 0) > 0 && <div style={{ marginTop: 6, color: '#6B7280' }}>{intake!.notes!.join(' ')}</div>}
      </div>

      {(questions.length > 0 || useful.length > 0) && (
        <div style={{ marginTop: 14, borderTop: '1px solid #E5E7EB', paddingTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Open questions <span style={{ fontWeight: 400, color: '#6B7280', fontSize: 12 }}>· saved with this requirement</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <button type="button" onClick={() => setOpen(true)} style={link}>Answer</button>
              <button type="button" onClick={() => { navigator.clipboard?.writeText([...questions, ...useful].map((q, i) => `${i + 1}. ${q}`).join('\n')); toast.success('Questions copied.'); }} style={{ ...link, display: 'inline-flex', alignItems: 'center', gap: 5 }}><Copy size={13} /> Copy</button>
              <button type="button" aria-label="Dismiss open questions" title="Dismiss: no longer needed" onClick={() => { onIntakeChange({ ...intake!, questions: [], useful: [] }); toast.success('Open questions dismissed.'); }}
                style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: 0, display: 'inline-flex' }}><X size={16} /></button>
            </div>
          </div>
          {questions.length > 0 && <>
            <div style={{ ...EYEBROW, margin: '4px 0' }}>Needed for sourcing</div>
            <ol style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: '#374151', lineHeight: 1.65 }}>
              {questions.map((q) => <li key={q}>{q} <button type="button" onClick={() => dismiss(q)} style={{ ...link, fontSize: 12 }}>Mark answered</button></li>)}
            </ol>
          </>}
          {useful.length > 0 && <>
            <div style={{ ...EYEBROW, margin: '10px 0 4px' }}>Useful to know</div>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: '#374151', lineHeight: 1.65 }}>
              {useful.map((q) => <li key={q}>{q} <button type="button" onClick={() => dismiss(q)} style={{ ...link, fontSize: 12 }}>Mark answered</button></li>)}
            </ul>
          </>}
          {optional.length > 0 && <div style={{ fontSize: 12.5, color: '#6B7280', marginTop: 8 }}>Optional, can stay open: {optional.join(', ')}.</div>}
        </div>
      )}

      {open && (
        <div style={{ marginTop: 14, borderTop: '1px solid #E5E7EB', paddingTop: 12 }}>
          {!proposal ? (
            <div>
              <textarea autoFocus value={text} onChange={(e) => setText(e.target.value)}
                placeholder="Paste a reply, call notes or a revised brief. You can also answer the open questions in your own words."
                style={{ width: '100%', minHeight: 96, border: '1px solid #D1D5DB', borderRadius: 8, padding: 10, fontSize: 14, fontFamily: FONT, background: '#fff', boxSizing: 'border-box' }} />
              <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
                <button type="button" disabled={!text.trim()} onClick={review} style={{ ...btn, opacity: text.trim() ? 1 : 0.5, cursor: text.trim() ? 'pointer' : 'default' }}>Review changes</button>
                <button type="button" onClick={close} style={ghost}>Cancel</button>
              </div>
            </div>
          ) : (
            <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, padding: '12px 14px' }}>
              {proposal.changes.length > 0 ? (
                <>
                  <div style={{ fontSize: 14, fontWeight: 700, color: INK, marginBottom: 6 }}>{proposal.changes.length} {proposal.changes.length === 1 ? 'change' : 'changes'} found</div>
                  {proposal.changes.map((c, i) => (
                    <label key={c.field} style={{ display: 'flex', gap: 10, padding: '8px 0', borderTop: i ? '1px solid #F3F4F6' : 'none', cursor: 'pointer', alignItems: 'flex-start' }}>
                      <input type="checkbox" checked={!!checked[c.field]} onChange={(e) => setChecked((x) => ({ ...x, [c.field]: e.target.checked }))} style={{ marginTop: 3 }} />
                      <div style={{ fontSize: 13.5, color: '#374151', lineHeight: 1.5, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, color: '#111827' }}>{FIELD_LABEL[c.field]}</div>
                        <div>
                          {c.from ? <span style={{ color: '#9CA3AF', textDecoration: 'line-through' }}>{shortVal(c.field, c.shownFrom ?? c.from)}</span> : <span style={{ color: '#9CA3AF' }}>Empty</span>}
                          {' → '}<b>{shortVal(c.field, c.shown ?? c.to)}</b>
                        </div>
                        <div style={{ color: c.inferred ? '#92400E' : '#6B7280', fontSize: 12.5 }}>
                          {c.inferred ? 'Interpreted: ' : c.kind === 'added' ? 'Added to what is there. ' : ''}{c.note.replace(/^“[^”]*”\s*$/, (m) => `Stated as ${m}`)}
                        </div>
                      </div>
                    </label>
                  ))}
                </>
              ) : (
                <div style={{ fontSize: 14, color: '#374151' }}>
                  {proposal.found ? (proposal.unchanged.length ? 'Everything in that text is already in the requirement. There is nothing to apply.' : 'I found details in that text but nothing I can apply.') : "I didn't find any requirement details in that text."}
                </div>
              )}
              {proposal.unchanged.length > 0 && proposal.changes.length > 0 && <div style={{ fontSize: 12.5, color: '#6B7280', marginTop: 8 }}>Already recorded, unchanged: {proposal.unchanged.map((k) => FIELD_LABEL[k].replace(/ \(.*\)/, '')).join(', ')}.</div>}
              {proposal.unclear.length > 0 && (
                <div style={{ fontSize: 13, color: '#374151', marginTop: 10 }}><b>Needs your call, not applied:</b>
                  <ul style={{ margin: '2px 0 0', paddingLeft: 18 }}>{proposal.unclear.map((u) => <li key={u}>{u}</li>)}</ul>
                </div>
              )}
              {proposal.notes.length > 0 && <div style={{ fontSize: 12.5, color: '#6B7280', marginTop: 8 }}>{proposal.notes.join(' ')}</div>}
              {proposal.consequence && proposal.changes.length > 0 && <div style={{ fontSize: 13, color: '#374151', marginTop: 10, paddingLeft: 10, borderLeft: `2px solid ${BLUE}` }}>{proposal.consequence}</div>}
              <div style={{ display: 'flex', gap: 8, marginTop: 12, alignItems: 'center' }}>
                {proposal.changes.length > 0 && <button type="button" onClick={apply} disabled={!nChosen} style={{ ...btn, opacity: nChosen ? 1 : 0.5, cursor: nChosen ? 'pointer' : 'default' }}>Apply {nChosen === proposal.changes.length ? (nChosen === 1 ? 'change' : `${nChosen} changes`) : `${nChosen} of ${proposal.changes.length}`}</button>}
                <button type="button" onClick={() => setProposal(null)} style={ghost}>Edit text</button>
                <button type="button" onClick={close} style={ghost}>{proposal.changes.length ? 'Cancel' : 'Close'}</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export { describeChange };

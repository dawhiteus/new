import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { X, ChevronsUpDown } from 'lucide-react';

const FONT = 'Inter, sans-serif';
const BLUE = '#0D619B';
const STATUSES = ['Active', 'Draft', 'Executed', 'Archived'];
const WORKSPACE_TYPES = ['Office Suite', 'Private Office', 'Team Office', 'Coworking', 'Meeting Space'];
const CONFIGURATIONS = ['Single space', 'Collection of spaces'];

export interface NewRequirementData {
  company: string;
  status: string;
  name: string;
  location: string;
  workspaceType: string;
  capacity: string;
  size: string;
  programNeeds: string;
  amenityNeeds: string;
  configuration: string;
  otherFunctional: string;
  startDate: string;
  termLength: string;
  closeDate: string;
  budget: string;
  otherCommercial: string;
}

const EMPTY: NewRequirementData = {
  company: '', status: 'Active', name: '', location: '', workspaceType: '', capacity: '', size: '',
  programNeeds: '', amenityNeeds: '', configuration: '', otherFunctional: '',
  startDate: '', termLength: '', closeDate: '', budget: '', otherCommercial: '',
};

const inputStyle: React.CSSProperties = {
  width: '100%', border: '1px solid #D1D5DB', borderRadius: 8, padding: '10px 12px',
  fontSize: 15, fontFamily: FONT, color: '#111827', background: '#fff', outline: 'none',
};
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 15, fontWeight: 600, color: '#374151', marginBottom: 8, fontFamily: FONT };
const sectionStyle: React.CSSProperties = {
  fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', color: BLUE, textTransform: 'uppercase',
  borderBottom: '1px solid #E5E7EB', paddingBottom: 6, margin: '8px 0 18px', fontFamily: FONT,
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (data: NewRequirementData) => void;
}

export function NewRequirementModal({ isOpen, onClose, onCreate }: Props) {
  const [f, setF] = useState<NewRequirementData>(EMPTY);
  const set = (k: keyof NewRequirementData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  const close = () => { setF(EMPTY); onClose(); };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate?.(f);
    close();
  };

  const field = (label: string, k: keyof NewRequirementData, opts: { required?: boolean; type?: string } = {}) => (
    <div>
      <label style={labelStyle}>{label}{opts.required ? ' *' : ''}</label>
      <input type={opts.type || 'text'} required={opts.required} value={f[k]} onChange={set(k)} style={inputStyle} />
    </div>
  );
  const area = (label: string, k: keyof NewRequirementData, placeholder: string) => (
    <div style={{ marginBottom: 20 }}>
      <label style={labelStyle}>{label}</label>
      <textarea value={f[k]} onChange={set(k)} placeholder={placeholder} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
    </div>
  );
  const chip = (selected: boolean, label: string, onClick: () => void, grow = false) => (
    <button
      key={label}
      type="button"
      onClick={onClick}
      style={{
        flex: grow ? 1 : undefined, padding: grow ? '12px' : '9px 16px', borderRadius: grow ? 8 : 999,
        border: `1px solid ${selected ? BLUE : '#D1D5DB'}`, background: selected ? '#E8F1F8' : '#fff',
        color: selected ? BLUE : '#111827', fontSize: 14, fontWeight: selected ? 600 : 500, fontFamily: FONT, cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );
  const row2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 };

  return (
    <Dialog open={isOpen} onOpenChange={(o) => { if (!o) close(); }}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden [&>button]:hidden" style={{ borderRadius: 24, border: 'none', maxHeight: '92vh' }}>
        <DialogDescription className="sr-only">Create a new workspace requirement</DialogDescription>
        <div style={{ background: BLUE, padding: '20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <DialogTitle style={{ color: '#fff', fontSize: 24, fontWeight: 700, fontFamily: FONT }}>Create New Requirement</DialogTitle>
          <button type="button" onClick={close} aria-label="Close" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={submit} style={{ padding: '16px 20px 28px', overflowY: 'auto', maxHeight: 'calc(92vh - 72px)' }}>
          <div style={sectionStyle}>Deal Details</div>
          <div style={row2}>
            {field('Company', 'company', { required: true })}
            <div>
              <label style={labelStyle}>Status *</label>
              <div style={{ position: 'relative' }}>
                <select value={f.status} onChange={set('status')} required style={{ ...inputStyle, appearance: 'none', WebkitAppearance: 'none', paddingRight: 30 }}>
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
                <ChevronsUpDown size={13} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#374151' }} />
              </div>
            </div>
          </div>

          <div style={sectionStyle}>Business Requirements</div>
          <div style={{ marginBottom: 20 }}>{field('Requirement Name', 'name', { required: true })}</div>
          <div style={{ marginBottom: 20 }}>{field('Location', 'location', { required: true })}</div>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Workspace Type</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {WORKSPACE_TYPES.map((t) => chip(f.workspaceType === t, t, () => setF((p) => ({ ...p, workspaceType: p.workspaceType === t ? '' : t }))))}
            </div>
          </div>
          <div style={row2}>
            {field('Capacity / Headcount', 'capacity', { required: true, type: 'number' })}
            {field('Size (sq ft)', 'size', { type: 'number' })}
          </div>
          {area('Program Needs', 'programNeeds', 'Open workstations, 3 meeting rooms, 2 team rooms, and a kitchen/pantry.')}
          {area('Amenity Needs', 'amenityNeeds', 'On-site staffed reception, secure badge access, and bookable phone booths.')}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Configuration</label>
            <div style={{ display: 'flex', gap: 12 }}>
              {CONFIGURATIONS.map((c) => chip(f.configuration === c, c, () => setF((p) => ({ ...p, configuration: p.configuration === c ? '' : c })), true))}
            </div>
          </div>
          {area('Other Functional Requirements', 'otherFunctional', 'Any other functional needs')}

          <div style={sectionStyle}>Commercial Terms</div>
          <div style={row2}>
            {field('Start Date', 'startDate', { required: true, type: 'date' })}
            {field('Term Length (mos)', 'termLength', { required: true, type: 'number' })}
          </div>
          <div style={row2}>
            {field('Expected Close Date', 'closeDate', { type: 'date' })}
            {field('Budget ($/mo)', 'budget', { required: true, type: 'number' })}
          </div>
          {area('Other Commercial Requirements', 'otherCommercial', 'Any other commercial terms')}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 28 }}>
            <button type="button" onClick={close} style={{ padding: '10px 16px', borderRadius: 8, border: `1px solid ${BLUE}`, background: '#fff', color: BLUE, fontSize: 15, fontWeight: 500, fontFamily: FONT, cursor: 'pointer' }}>Cancel</button>
            <button type="submit" style={{ padding: '10px 16px', borderRadius: 8, border: 'none', background: BLUE, color: '#fff', fontSize: 15, fontWeight: 600, fontFamily: FONT, cursor: 'pointer' }}>Create Requirement</button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

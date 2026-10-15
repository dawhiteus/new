import React, { useState } from 'react';
import { Mail, Phone, Building2, UserCircle, Bot, Pencil, Trash2, ChevronsUpDown, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import type { TeamMember, MemberType } from './data/mvpRequirements';

const FONT = 'Inter, sans-serif';
const BLUE = '#0D619B';
const INK = '#0F2A3D';

// Filter lists show the MVP enum values verbatim.
const ROLE_FILTERS = [
  'Unknown', 'ServiceProvider', 'ClientContact', 'LegalCounsel', 'DealCoordinator', 'RequirementsLead',
  'MarketLead', 'Other', 'RequirementsAgent', 'MarketplaceSearchAgent', 'CollectionEvaluationAgent',
];
const TYPE_FILTERS: MemberType[] = ['Unknown', 'Internal', 'External', 'Agent'];

// Roles a person can be added with (humanized).
const FORM_ROLES = ['Service Provider', 'Client Contact', 'Legal Counsel', 'Deal Coordinator', 'Requirements Lead', 'Market Lead', 'Other', 'Unknown'];
const FORM_TYPES: MemberType[] = ['Internal', 'External', 'Unknown'];

const humanize = (v: string) => v.replace(/([a-z])([A-Z])/g, '$1 $2');
const toEnum = (v: string) => v.replace(/\s+/g, '');

const TYPE_BG: Record<MemberType, string> = { Internal: '#0D619B', External: '#7C3AED', Agent: '#2E9D4A', Unknown: '#6B7280' };

const fieldInput: React.CSSProperties = {
  width: '100%', border: '1.5px solid #0F2A3D', borderRadius: 8, padding: '12px 14px', fontSize: 15,
  fontFamily: FONT, color: INK, background: '#fff', outline: 'none',
};
const fieldLabel: React.CSSProperties = { display: 'block', fontSize: 15, fontWeight: 600, color: INK, marginBottom: 8, fontFamily: FONT };

function FilterSelect({ value, onChange, all, options }: { value: string; onChange: (v: string) => void; all: string; options: string[] }) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ appearance: 'none', WebkitAppearance: 'none', fontFamily: FONT, fontSize: 14, color: INK, background: '#fff', border: '1.5px solid #0F2A3D', borderRadius: 4, padding: '8px 34px 8px 9px', minWidth: 140, cursor: 'pointer', outline: 'none' }}
      >
        <option value="">{all}</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <ChevronsUpDown size={13} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: INK }} />
    </div>
  );
}

interface FormState { name: string; email: string; role: string; type: MemberType; organization: string; phone: string }
const EMPTY: FormState = { name: '', email: '', role: 'Service Provider', type: 'Internal', organization: '', phone: '' };

interface Props {
  team: TeamMember[];
  onChange: (team: TeamMember[]) => void;
}

export function RequirementTeamTab({ team, onChange }: Props) {
  const [roleFilter, setRoleFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [dialog, setDialog] = useState<{ editId: string | null } | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);

  const shown = team.filter((m) => (!roleFilter || m.role === roleFilter) && (!typeFilter || m.type === typeFilter));

  const openAdd = () => { setForm(EMPTY); setDialog({ editId: null }); };
  const openEdit = (m: TeamMember) => {
    setForm({ name: m.name, email: m.email, role: humanize(m.role), type: m.type, organization: m.organization, phone: m.phone });
    setDialog({ editId: m.id });
  };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dialog) return;
    const data = { name: form.name.trim(), email: form.email.trim(), role: toEnum(form.role), type: form.type, organization: form.organization.trim(), phone: form.phone.trim() };
    onChange(
      dialog.editId
        ? team.map((m) => (m.id === dialog.editId ? { ...m, ...data } : m))
        : [...team, { id: `m-${Date.now()}`, ...data }],
    );
    setDialog(null);
  };

  const select = (k: 'role' | 'type', options: string[]) => (
    <div style={{ position: 'relative' }}>
      <select value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value } as FormState)} style={{ ...fieldInput, appearance: 'none', WebkitAppearance: 'none', paddingRight: 32 }}>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <ChevronsUpDown size={13} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: INK }} />
    </div>
  );
  const text = (k: keyof FormState, type = 'text', required = false) => (
    <input type={type} required={required} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} style={fieldInput} />
  );
  const row = (label: string, node: React.ReactNode) => (
    <div style={{ marginBottom: 18 }}><label style={fieldLabel}>{label}</label>{node}</div>
  );

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <FilterSelect value={roleFilter} onChange={setRoleFilter} all="All Roles" options={ROLE_FILTERS} />
          <FilterSelect value={typeFilter} onChange={setTypeFilter} all="All Types" options={TYPE_FILTERS} />
        </div>
        <button onClick={openAdd} style={{ background: BLUE, color: '#fff', border: 'none', borderRadius: 8, padding: '12px 18px', fontSize: 15, fontWeight: 600, fontFamily: FONT, cursor: 'pointer' }}>
          + Add Member
        </button>
      </div>

      {shown.length === 0 && (
        <div style={{ padding: '40px 0', textAlign: 'center', color: '#9CA3AF', fontFamily: FONT, fontSize: 15 }}>No team members match your filters.</div>
      )}

      {shown.map((m) => {
        const agent = m.type === 'Agent';
        return (
          <div key={m.id} style={{ border: '1px solid #E5E7EB', borderRadius: 16, padding: '16px 16px', marginBottom: 12, display: 'flex', gap: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', background: '#fff' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: agent ? '#D1FAE5' : '#E3F2FD' }}>
              {agent ? <Bot size={28} color="#059669" /> : <UserCircle size={28} color={BLUE} />}
            </div>
            <div style={{ flex: 1, minWidth: 0, fontFamily: FONT }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: INK }}>{m.name}</span>
                <span style={{ background: TYPE_BG[m.type], color: '#fff', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999 }}>{m.type}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 14 }}>
                <span style={{ color: BLUE, fontWeight: 500 }}>{agent && m.taskLabel ? m.taskLabel : humanize(m.role)}</span>
                {!agent && m.organization && (
                  <>
                    <span style={{ color: '#9CA3AF' }}>•</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#6B7280' }}><Building2 size={14} />{m.organization}</span>
                  </>
                )}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 14, color: '#6B7280' }}>
                {m.email && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <Mail size={13} /><a href={`mailto:${m.email}`} style={{ color: BLUE }}>{m.email}</a>
                  </span>
                )}
                {m.phone && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Phone size={13} />{m.phone}</span>}
              </div>
              {m.description && <div style={{ marginTop: 8, fontSize: 14, color: '#9CA3AF', lineHeight: 1.6 }}>{m.description}</div>}
            </div>
            {!agent && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, paddingRight: 8 }}>
                <button aria-label={`Edit ${m.name}`} onClick={() => openEdit(m)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: BLUE, padding: 2 }}><Pencil size={16} /></button>
                <button aria-label={`Remove ${m.name}`} onClick={() => onChange(team.filter((x) => x.id !== m.id))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626', padding: 2 }}><Trash2 size={16} /></button>
              </div>
            )}
          </div>
        );
      })}

      <Dialog open={dialog !== null} onOpenChange={(o) => { if (!o) setDialog(null); }}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden [&>button]:hidden gap-0" style={{ borderRadius: 24, border: 'none' }}>
          <DialogDescription className="sr-only">Team member details</DialogDescription>
          <form onSubmit={submit}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <DialogTitle style={{ fontSize: 20, fontWeight: 600, color: '#374151', fontFamily: FONT }}>
                {dialog?.editId ? 'Edit Team Member' : 'Add Team Member'}
              </DialogTitle>
              <button type="button" onClick={() => setDialog(null)} aria-label="Close" style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ padding: '20px 24px', maxHeight: '70vh', overflowY: 'auto' }}>
              {row('Name', text('name', 'text', true))}
              {row('Email', text('email', 'email'))}
              {row('Role', select('role', FORM_ROLES))}
              {row('Type', select('type', FORM_TYPES))}
              {row('Organization', text('organization'))}
              {row('Phone', text('phone', 'tel'))}
            </div>
            <div style={{ padding: '14px 24px', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button type="button" onClick={() => setDialog(null)} style={{ padding: '10px 16px', borderRadius: 8, border: `1px solid ${BLUE}`, background: '#fff', color: BLUE, fontSize: 15, fontWeight: 500, fontFamily: FONT, cursor: 'pointer' }}>Cancel</button>
              <button type="submit" style={{ padding: '10px 16px', borderRadius: 8, border: 'none', background: BLUE, color: '#fff', fontSize: 15, fontWeight: 600, fontFamily: FONT, cursor: 'pointer' }}>
                {dialog?.editId ? 'Save' : 'Add Member'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

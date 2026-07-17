import React, { useState, useRef, useEffect } from 'react';
import { PageHeader } from './PageHeader';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Settings, MoreHorizontal, Plus, Download, Upload, ChevronLeft, ChevronRight, Copy, RefreshCw } from 'lucide-react';
import { toast } from './ui/toast';

// ─── Types ────────────────────────────────────────────────────────────────────

type SetupSection = 'general' | 'admins' | 'enrollment' | 'integrations';

interface WorkplaceSetupProps {
  onAIAssistantOpen?: () => void;
  isAIDrawerOpen?: boolean;
}

interface Admin {
  id: string;
  name: string;
  email: string;
  created: string;
  role: string;
  status: 'Active' | 'Invited';
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_ADMINS: Admin[] = [
  { id: '1',  name: 'Amanda Foley',      email: 'amanda.foley@teltech.com',      created: '03/12/2022', role: 'Admin', status: 'Active' },
  { id: '2',  name: 'Brian Calloway',      email: 'brian.c@teltech.com',           created: '01/04/2021', role: 'Admin', status: 'Active' },
  { id: '3',  name: 'Carmen Diaz',       email: 'carmen.diaz@teltech.com',       created: '06/18/2022', role: 'Admin', status: 'Active' },
  { id: '4',  name: 'Derek Lam',         email: 'derek.lam@teltech.com',         created: '09/02/2022', role: 'Admin', status: 'Active' },
  { id: '5',  name: 'Elena Petrova',     email: 'elena.petrova@teltech.com',     created: '11/29/2022', role: 'Admin', status: 'Active' },
  { id: '6',  name: 'Frank Osei',        email: 'frank.osei@teltech.com',        created: '02/14/2023', role: 'Admin', status: 'Active' },
  { id: '7',  name: 'Grace Kim',         email: 'grace.kim@teltech.com',         created: '04/07/2023', role: 'Admin', status: 'Active' },
  { id: '8',  name: 'Hannah Berg',       email: 'hannah.berg@teltech.com',       created: '07/21/2023', role: 'Admin', status: 'Active' },
  { id: '9',  name: 'Ivan Sokolov',      email: 'ivan.sokolov@teltech.com',      created: '10/03/2023', role: 'Admin', status: 'Active' },
  { id: '10', name: 'Julia Mendes',      email: 'julia.mendes@teltech.com',      created: '01/16/2024', role: 'Admin', status: 'Active' },
  { id: '11', name: 'Kevin Wright',      email: 'kevin.wright@teltech.com',      created: '03/28/2024', role: 'Admin', status: 'Active' },
  { id: '12', name: 'Laura Chen',        email: 'laura.chen@teltech.com',        created: '06/09/2024', role: 'Admin', status: 'Active' },
  { id: '13', name: 'Marcus Hill',       email: 'marcus.hill@teltech.com',       created: '09/22/2024', role: 'Admin', status: 'Active' },
  { id: '14', name: 'Nina Rossi',        email: 'nina.rossi@teltech.com',        created: '12/05/2024', role: 'Admin', status: 'Active' },
  { id: '15', name: 'Oscar Vega',        email: 'oscar.vega@teltech.com',        created: '02/18/2025', role: 'Admin', status: 'Active' },
  { id: '16', name: 'Priya Nair',        email: 'priya.nair@teltech.com',        created: '05/30/2025', role: 'Admin', status: 'Invited' },
];

// ─── Shared styles ────────────────────────────────────────────────────────────

const S = {
  input: {
    fontSize: 14, fontFamily: 'Inter, sans-serif', borderRadius: 8,
    border: '1px solid #D1D5DB', padding: '9px 12px', width: '100%',
    outline: 'none', color: '#374151', backgroundColor: '#fff',
  } as React.CSSProperties,
  inputReadonly: {
    fontSize: 14, fontFamily: 'Inter, sans-serif', borderRadius: 8,
    border: '1px solid #E5E7EB', padding: '9px 12px', width: '100%',
    outline: 'none', color: '#6B7280', backgroundColor: '#F9FAFB',
  } as React.CSSProperties,
  select: {
    fontSize: 14, fontFamily: 'Inter, sans-serif', borderRadius: 8,
    border: '1px solid #D1D5DB', padding: '9px 12px', width: '100%',
    outline: 'none', color: '#374151', backgroundColor: '#fff', cursor: 'pointer',
  } as React.CSSProperties,
  label: {
    fontSize: 13, fontWeight: 600, color: '#374151',
    fontFamily: 'Inter, sans-serif', display: 'block', marginBottom: 6,
  } as React.CSSProperties,
  th: {
    fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' as const,
    letterSpacing: '0.05em', fontFamily: 'Inter, sans-serif', textAlign: 'left' as const,
    padding: '10px 16px', borderBottom: '1px solid #E5E7EB',
  } as React.CSSProperties,
  td: {
    fontSize: 14, fontFamily: 'Inter, sans-serif', color: '#374151',
    padding: '13px 16px', borderBottom: '1px solid #F3F4F6',
  } as React.CSSProperties,
  btnPrimary: {
    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px',
    borderRadius: 8, border: 'none', backgroundColor: '#005B94', color: '#fff',
    fontSize: 13, fontWeight: 500, fontFamily: 'Inter, sans-serif', cursor: 'pointer',
  } as React.CSSProperties,
  btnOutline: {
    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px',
    borderRadius: 8, border: '1px solid #D1D5DB', backgroundColor: '#fff',
    color: '#374151', fontSize: 13, fontWeight: 500, fontFamily: 'Inter, sans-serif',
    cursor: 'pointer',
  } as React.CSSProperties,
};

// ─── Shared sub-components ────────────────────────────────────────────────────

function Card({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden" style={{ marginBottom: 20 }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '13px 20px', borderBottom: '1px solid #E5E7EB', backgroundColor: '#FAFBFC',
      }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#005B94', fontFamily: 'Inter, sans-serif' }}>{title}</span>
        {action}
      </div>
      <div style={{ padding: 20 }}>{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        width: 44, height: 24, borderRadius: 12, flexShrink: 0,
        backgroundColor: checked ? '#005B94' : '#D1D5DB',
        border: 'none', cursor: 'pointer', position: 'relative',
        transition: 'background-color 0.15s', display: 'inline-flex', alignItems: 'center',
      }}
    >
      <span style={{
        position: 'absolute', top: 2, left: checked ? 22 : 2, width: 20, height: 20,
        borderRadius: 10, backgroundColor: '#fff', transition: 'left 0.15s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </button>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
      <Toggle checked={checked} onChange={onChange} />
      <span style={{ fontSize: 14, fontFamily: 'Inter, sans-serif', color: '#374151' }}>{label}</span>
    </div>
  );
}

function SaveBtn({ onClick, label = 'Save' }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      style={{ marginTop: 16, padding: '9px 22px', borderRadius: 8, border: 'none', backgroundColor: '#005B94', color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}
    >
      {label}
    </button>
  );
}

function DotMenu({ items }: { items: { label: string; danger?: boolean; onClick: () => void }[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);
  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 6, borderRadius: 6, color: '#9CA3AF', display: 'inline-flex' }}
        className="hover:bg-gray-100"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: '100%', marginTop: 4, zIndex: 30,
          backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: 10,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: 150, overflow: 'hidden', padding: 4,
        }}>
          {items.map(it => (
            <button
              key={it.label}
              onClick={() => { setOpen(false); it.onClick(); }}
              style={{
                display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px',
                fontSize: 13, fontFamily: 'Inter, sans-serif', border: 'none', background: 'none',
                cursor: 'pointer', borderRadius: 6, color: it.danger ? '#DC2626' : '#374151',
              }}
              className="hover:bg-gray-50"
            >
              {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 16, alignItems: 'start', marginBottom: 14 }}>
      <span style={{ ...S.label, marginBottom: 0, paddingTop: 10 }}>{label}</span>
      <div>{children}</div>
    </div>
  );
}

// ─── Section: General ─────────────────────────────────────────────────────────

function GeneralSection() {
  const [form, setForm] = useState({
    name: 'Tel Tech',
    description: 'Tel Tech coworking support program. Provides employees who live far from a Tel Tech office with access to on-demand workspace near their home.',
    contactName: 'Amanda Foley',
    contactEmail: 'coworkingspace@teltech.com',
    address1: '525 Market St',
    address2: '',
    city: 'San Francisco',
    state: 'CA',
    zip: '94103',
    country: 'United States',
    salesRep: 'Matthew Weiner',
    accountManager: 'Sarah Chen',
    accountStatus: 'Active',
  });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <Card title="General">
      <div style={{ maxWidth: 720 }}>
        <FieldRow label="Name">
          <input style={S.input} value={form.name} onChange={set('name')} />
        </FieldRow>
        <FieldRow label="Description">
          <textarea style={{ ...S.input, minHeight: 90, resize: 'vertical' }} value={form.description} onChange={set('description')} />
        </FieldRow>
        <FieldRow label="Contact Name">
          <input style={S.input} value={form.contactName} onChange={set('contactName')} />
        </FieldRow>
        <FieldRow label="Contact Email">
          <input style={S.input} value={form.contactEmail} onChange={set('contactEmail')} />
        </FieldRow>
        <FieldRow label="Location">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input style={S.input} placeholder="Address 1" value={form.address1} onChange={set('address1')} />
            <input style={S.input} placeholder="Address 2" value={form.address2} onChange={set('address2')} />
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 10 }}>
              <input style={S.input} placeholder="City" value={form.city} onChange={set('city')} />
              <input style={S.input} placeholder="State" value={form.state} onChange={set('state')} />
              <input style={S.input} placeholder="Zip" value={form.zip} onChange={set('zip')} />
            </div>
            <select style={S.select} value={form.country} onChange={set('country')}>
              <option>United States</option>
              <option>Canada</option>
              <option>United Kingdom</option>
              <option>Ireland</option>
              <option>Germany</option>
              <option>France</option>
              <option>India</option>
              <option>Australia</option>
            </select>
          </div>
        </FieldRow>
        <FieldRow label="Primary Sales Rep">
          <select style={S.select} value={form.salesRep} onChange={set('salesRep')}>
            <option>Matthew Weiner</option>
            <option>Sarah Chen</option>
            <option>Michael Torres</option>
          </select>
        </FieldRow>
        <FieldRow label="Account Manager">
          <select style={S.select} value={form.accountManager} onChange={set('accountManager')}>
            <option>Sarah Chen</option>
            <option>Matthew Weiner</option>
            <option>Michael Torres</option>
          </select>
        </FieldRow>
        <FieldRow label="Account Status">
          <select style={S.select} value={form.accountStatus} onChange={set('accountStatus')}>
            <option>Active</option>
            <option>Trial</option>
            <option>Suspended</option>
            <option>Churned</option>
          </select>
        </FieldRow>
        <SaveBtn onClick={() => toast.success('General settings saved.')} />
      </div>
    </Card>
  );
}

// ─── Section: Admins ──────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

function AdminsSection() {
  const [admins, setAdmins] = useState<Admin[]>(MOCK_ADMINS);
  const [page, setPage] = useState(0);
  const [addOpen, setAddOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');

  const pageCount = Math.max(1, Math.ceil(admins.length / PAGE_SIZE));
  const rows = admins.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleAdd = () => {
    const email = newEmail.trim();
    if (!email) return;
    const name = email.split('@')[0].split(/[._-]/).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
    setAdmins(a => [...a, {
      id: String(Date.now()), name, email,
      created: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
      role: 'Admin', status: 'Invited',
    }]);
    setNewEmail('');
    setAddOpen(false);
    toast.success(`Invite sent to ${email}.`);
  };

  return (
    <>
      <Card
        title="Admins"
        action={
          <button style={S.btnPrimary} onClick={() => setAddOpen(true)}>
            <Plus className="h-3.5 w-3.5" /> Add Admin
          </button>
        }
      >
        <div style={{ margin: -20 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={S.th}>Name</th>
                <th style={S.th}>Email</th>
                <th style={S.th}>Created</th>
                <th style={S.th}>Role</th>
                <th style={S.th}>Status</th>
                <th style={{ ...S.th, width: 50 }} />
              </tr>
            </thead>
            <tbody>
              {rows.map(a => (
                <tr key={a.id}>
                  <td style={{ ...S.td, fontWeight: 500 }}>{a.name}</td>
                  <td style={S.td}>{a.email}</td>
                  <td style={S.td}>{a.created}</td>
                  <td style={S.td}>{a.role}</td>
                  <td style={S.td}>
                    <span style={{
                      fontSize: 12, fontWeight: 500, fontFamily: 'Inter, sans-serif',
                      padding: '3px 10px', borderRadius: 20,
                      backgroundColor: a.status === 'Active' ? '#DCFCE7' : '#FEF3C7',
                      color: a.status === 'Active' ? '#166534' : '#92400E',
                    }}>
                      {a.status}
                    </span>
                  </td>
                  <td style={{ ...S.td, textAlign: 'right' }}>
                    <DotMenu items={[
                      { label: 'Remove', danger: true, onClick: () => { setAdmins(list => list.filter(x => x.id !== a.id)); toast.info(`${a.name} removed.`); } },
                    ]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
            <span style={{ fontSize: 13, color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
              Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, admins.length)} of {admins.length} admins
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                style={{ ...S.btnOutline, padding: '6px 10px', opacity: page === 0 ? 0.5 : 1 }}
                disabled={page === 0}
                onClick={() => setPage(p => Math.max(0, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                style={{ ...S.btnOutline, padding: '6px 10px', opacity: page >= pageCount - 1 ? 0.5 : 1 }}
                disabled={page >= pageCount - 1}
                onClick={() => setPage(p => Math.min(pageCount - 1, p + 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Add Admin modal */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden" style={{ borderRadius: 12 }}>
          <div style={{ backgroundColor: '#005B94', padding: '16px 20px' }}>
            <DialogHeader>
              <DialogTitle style={{ fontSize: 18, fontWeight: 600, color: '#fff', fontFamily: 'Inter, sans-serif' }}>
                Add Admin
              </DialogTitle>
              <DialogDescription style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontFamily: 'Inter, sans-serif' }}>
                Invite a new administrator by email
              </DialogDescription>
            </DialogHeader>
          </div>
          <div style={{ padding: 20 }}>
            <label style={S.label}>Email</label>
            <input
              style={S.input}
              placeholder="name@teltech.com"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
              autoFocus
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 18 }}>
              <button style={S.btnOutline} onClick={() => setAddOpen(false)}>Cancel</button>
              <button style={S.btnPrimary} onClick={handleAdd}>Save</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─── Section: Enrollment & SSO ────────────────────────────────────────────────

function EnrollmentSection() {
  const [autoEnroll, setAutoEnroll] = useState(true);
  const [ssoEnabled, setSsoEnabled] = useState(true);
  const [emailDomains, setEmailDomains] = useState('teltech.com');
  const [idpTarget, setIdpTarget] = useState('https://teltech.okta.com/app/liquidspace/exk8colwbmiQPU3BY357/sso/saml');
  const [idpLogout, setIdpLogout] = useState('https://teltech.okta.com/login/signout');
  const [sessionExp, setSessionExp] = useState('480');
  const [authContext, setAuthContext] = useState('PasswordProtectedTransport');
  const [authComparison, setAuthComparison] = useState('exact');
  const [signRequests, setSignRequests] = useState(true);
  const [forceAuthn, setForceAuthn] = useState(false);
  const [allowUnsolicited, setAllowUnsolicited] = useState(true);
  const [scimEnabled, setScimEnabled] = useState(true);
  const [scimSyncProfile, setScimSyncProfile] = useState(true);
  const [scimDeactivate, setScimDeactivate] = useState(true);
  const [scimGroups, setScimGroups] = useState(false);
  const certFileRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Card title="Enrollment Configuration">
        <ToggleRow label="Enable Automatic Enrollment" checked={autoEnroll} onChange={setAutoEnroll} />
        <p style={{ fontSize: 13, color: '#6B7280', fontFamily: 'Inter, sans-serif', marginLeft: 56, marginTop: -6 }}>
          Users with a verified email on an approved domain are enrolled automatically on first sign-in.
        </p>
        <SaveBtn onClick={() => toast.success('Enrollment configuration saved.')} />
      </Card>

      <Card title="SSO — Basic Info">
        <div style={{ maxWidth: 720 }}>
          <ToggleRow label="Enable SSO" checked={ssoEnabled} onChange={setSsoEnabled} />
          <FieldRow label="Email Domains">
            <input style={S.input} value={emailDomains} onChange={e => setEmailDomains(e.target.value)} placeholder="example.com, example.org" />
          </FieldRow>
          <FieldRow label="Assertion Consumer Endpoint">
            <div style={{ display: 'flex', gap: 8 }}>
              <input style={S.inputReadonly} readOnly value="https://liquidspace.com/auth/saml/callback?org=teltech" />
              <button
                style={{ ...S.btnOutline, flexShrink: 0 }}
                onClick={() => { navigator.clipboard?.writeText('https://liquidspace.com/auth/saml/callback?org=teltech'); toast.success('Copied to clipboard.'); }}
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
          </FieldRow>
          <button style={{ ...S.btnOutline, marginTop: 4 }} onClick={() => toast.info('Downloading federation metadata…')}>
            <Download className="h-3.5 w-3.5" /> Download Federation Metadata
          </button>
        </div>
      </Card>

      <Card title="SSO — Advanced">
        <div style={{ maxWidth: 720 }}>
          <FieldRow label="IDP SSO Target URL">
            <input style={S.input} value={idpTarget} onChange={e => setIdpTarget(e.target.value)} />
          </FieldRow>
          <FieldRow label="IDP Logout URL">
            <input style={S.input} value={idpLogout} onChange={e => setIdpLogout(e.target.value)} />
          </FieldRow>
          <FieldRow label="Session Expiration (minutes)">
            <input style={{ ...S.input, maxWidth: 160 }} value={sessionExp} onChange={e => setSessionExp(e.target.value)} />
          </FieldRow>
          <FieldRow label="IDP x509 Certificate">
            <div
              onClick={() => certFileRef.current?.click()}
              style={{
                border: '2px dashed #D1D5DB', borderRadius: 10, padding: '26px 20px',
                textAlign: 'center', cursor: 'pointer', backgroundColor: '#FAFBFC',
              }}
              className="hover:border-blue-300 transition-colors"
            >
              <Upload className="h-5 w-5" style={{ color: '#9CA3AF', margin: '0 auto 8px' }} />
              <p style={{ fontSize: 13, color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                Drag and drop your certificate here, or <span style={{ color: '#005B94', fontWeight: 500 }}>browse</span>
              </p>
              <p style={{ fontSize: 12, color: '#9CA3AF', fontFamily: 'Inter, sans-serif', marginTop: 4 }}>
                Current: teltech-okta-2026.pem (expires 03/2027)
              </p>
              <input ref={certFileRef} type="file" style={{ display: 'none' }} onChange={() => toast.success('Certificate uploaded.')} />
            </div>
          </FieldRow>
          <FieldRow label="Authentication Context">
            <select style={S.select} value={authContext} onChange={e => setAuthContext(e.target.value)}>
              <option value="PasswordProtectedTransport">PasswordProtectedTransport</option>
              <option value="Password">Password</option>
              <option value="X509">X509</option>
              <option value="Kerberos">Kerberos</option>
              <option value="unspecified">unspecified</option>
            </select>
          </FieldRow>
          <FieldRow label="Auth Context Comparison">
            <select style={S.select} value={authComparison} onChange={e => setAuthComparison(e.target.value)}>
              <option value="exact">exact</option>
              <option value="minimum">minimum</option>
              <option value="maximum">maximum</option>
              <option value="better">better</option>
            </select>
          </FieldRow>
          <div style={{ marginTop: 18 }}>
            <ToggleRow label="Sign AuthN requests" checked={signRequests} onChange={setSignRequests} />
            <ToggleRow label="Force re-authentication" checked={forceAuthn} onChange={setForceAuthn} />
            <ToggleRow label="Allow unsolicited (IDP-initiated) responses" checked={allowUnsolicited} onChange={setAllowUnsolicited} />
          </div>
          <SaveBtn onClick={() => toast.success('SSO settings saved.')} />
        </div>
      </Card>

      <Card title="SCIM Provisioning">
        <div style={{ maxWidth: 720 }}>
          <FieldRow label="Client Id">
            <input style={S.inputReadonly} readOnly value="scim-teltech-8f4c21b0" />
          </FieldRow>
          <FieldRow label="Client Secret">
            <div style={{ display: 'flex', gap: 8 }}>
              <input style={S.inputReadonly} readOnly value="••••••••••••••••••••••••" />
              <button style={{ ...S.btnOutline, flexShrink: 0 }} onClick={() => toast.success('New client secret generated.')}>
                <RefreshCw className="h-3.5 w-3.5" /> New Client Secret
              </button>
            </div>
          </FieldRow>
          <FieldRow label="Token">
            <div style={{ display: 'flex', gap: 8 }}>
              <input style={S.inputReadonly} readOnly value="••••••••••••••••••••••••••••••••" />
              <button style={{ ...S.btnOutline, flexShrink: 0 }} onClick={() => toast.success('New token generated.')}>
                <RefreshCw className="h-3.5 w-3.5" /> New Token
              </button>
            </div>
          </FieldRow>
          <div style={{ marginTop: 18 }}>
            <ToggleRow label="Enable SCIM provisioning" checked={scimEnabled} onChange={setScimEnabled} />
            <ToggleRow label="Sync user profile updates" checked={scimSyncProfile} onChange={setScimSyncProfile} />
            <ToggleRow label="Auto-deactivate removed users" checked={scimDeactivate} onChange={setScimDeactivate} />
            <ToggleRow label="Sync group membership" checked={scimGroups} onChange={setScimGroups} />
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button style={S.btnOutline} onClick={() => toast.info('SCIM data set from LiquidSpace.')}>Set SCIM data from LS</button>
            <button
              style={{ padding: '9px 22px', borderRadius: 8, border: 'none', backgroundColor: '#005B94', color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}
              onClick={() => toast.success('SCIM settings saved.')}
            >
              Save
            </button>
          </div>
        </div>
      </Card>
    </>
  );
}

// ─── Section: Integrations ────────────────────────────────────────────────────

function IntegrationsSection() {
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignClient, setAssignClient] = useState('');
  const [assignScopes, setAssignScopes] = useState('');

  const kvRow = (k: string, v: string) => (
    <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 16, padding: '8px 0', borderBottom: '1px solid #F3F4F6' }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>{k}</span>
      <span style={{ fontSize: 13, color: '#374151', fontFamily: 'Inter, sans-serif', wordBreak: 'break-all' }}>{v}</span>
    </div>
  );

  return (
    <>
      <Card
        title="API Clients"
        action={
          <button style={S.btnPrimary} onClick={() => setAssignOpen(true)}>
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        }
      >
        <div style={{
          border: '1px solid #E5E7EB', borderRadius: 12, padding: '16px 20px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <div style={{ flex: 1 }}>
            {kvRow('ClientID', 'teltech-workplace-prod-4d92')}
            {kvRow('Client Secret', '••••••••••••••••••••••••')}
            {kvRow('Subscription Key', '••••••••••••••••')}
            {kvRow('Name', 'Tel Tech Workplace Integration')}
            {kvRow('Grant Types', 'client_credentials, authorization_code')}
            {kvRow('Scopes', 'reservations:read, reservations:write, members:read, reporting:read')}
            <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 16, padding: '8px 0' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>Impersonation Scopes</span>
              <span style={{ fontSize: 13, color: '#374151', fontFamily: 'Inter, sans-serif' }}>members:impersonate</span>
            </div>
          </div>
          <DotMenu items={[
            { label: 'Edit Scopes', onClick: () => setAssignOpen(true) },
            { label: 'Revoke', danger: true, onClick: () => toast.info('API client revoked.') },
          ]} />
        </div>
        <p style={{ fontSize: 13, color: '#6B7280', fontFamily: 'Inter, sans-serif', marginTop: 14 }}>
          Contact your LiquidSpace SysAdmin to create new API clients.
        </p>
      </Card>

      <Card title="Slack">
        <p style={{ fontSize: 14, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: 14 }}>
          Connect LiquidSpace to your Slack workspace to receive booking notifications and enable team coordination.
        </p>
        <button
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 18px',
            borderRadius: 8, border: '1px solid #D1D5DB', backgroundColor: '#fff',
            fontSize: 14, fontWeight: 600, fontFamily: 'Inter, sans-serif', color: '#1D1C1D', cursor: 'pointer',
          }}
          onClick={() => toast.info('Redirecting to Slack authorization…')}
        >
          <svg width="18" height="18" viewBox="0 0 122.8 122.8" aria-hidden>
            <path d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z" fill="#e01e5a"/>
            <path d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z" fill="#36c5f0"/>
            <path d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z" fill="#2eb67d"/>
            <path d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z" fill="#ecb22e"/>
          </svg>
          Add to Slack
        </button>
      </Card>

      {/* Assign API Client modal */}
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden" style={{ borderRadius: 12 }}>
          <div style={{ backgroundColor: '#005B94', padding: '16px 20px' }}>
            <DialogHeader>
              <DialogTitle style={{ fontSize: 18, fontWeight: 600, color: '#fff', fontFamily: 'Inter, sans-serif' }}>
                Assign API Client
              </DialogTitle>
              <DialogDescription style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontFamily: 'Inter, sans-serif' }}>
                Attach an existing API client to this account
              </DialogDescription>
            </DialogHeader>
          </div>
          <div style={{ padding: 20 }}>
            <label style={S.label}>API Client</label>
            <select style={S.select} value={assignClient} onChange={e => setAssignClient(e.target.value)}>
              <option value="">Select an API client…</option>
              <option value="teltech-workplace-prod-4d92">teltech-workplace-prod-4d92</option>
              <option value="teltech-workplace-staging-77e1">teltech-workplace-staging-77e1</option>
            </select>
            <label style={{ ...S.label, marginTop: 16 }}>Impersonation Scopes</label>
            <select style={S.select} value={assignScopes} onChange={e => setAssignScopes(e.target.value)}>
              <option value="">None</option>
              <option value="members:impersonate">members:impersonate</option>
              <option value="admins:impersonate">admins:impersonate</option>
            </select>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 18 }}>
              <button style={S.btnOutline} onClick={() => setAssignOpen(false)}>Cancel</button>
              <button style={S.btnPrimary} onClick={() => { setAssignOpen(false); toast.success('API client assigned.'); }}>Save</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const TABS: { id: SetupSection; label: string }[] = [
  { id: 'general',      label: 'General' },
  { id: 'admins',       label: 'Admins' },
  { id: 'enrollment',   label: 'Enrollment & SSO' },
  { id: 'integrations', label: 'Integrations' },
];

export function WorkplaceSetup({ onAIAssistantOpen, isAIDrawerOpen }: WorkplaceSetupProps) {
  const [tab, setTab] = useState<SetupSection>('general');

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--surface-page, #F9FAFB)' }}>
      <PageHeader
        icon={<Settings className="h-6 w-6" />}
        title="Setup"
        subtitle="Manage account details, admins, enrollment, and integrations."
        onAIAssistantOpen={onAIAssistantOpen}
        isAIDrawerOpen={isAIDrawerOpen}
        hideAIButton
      />
      <div style={{ padding: 24, maxWidth: 1080, margin: '0 auto' }}>
        {/* Tab bar */}
        <div className="rounded-2xl border border-gray-200 bg-white" style={{ display: 'flex', gap: 4, padding: '6px 10px', marginBottom: 20 }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: '9px 16px', border: 'none', background: 'none', cursor: 'pointer',
                fontSize: 14, fontFamily: 'Inter, sans-serif',
                fontWeight: tab === t.id ? 600 : 400,
                color: tab === t.id ? '#005B94' : '#6B7280',
                borderBottom: tab === t.id ? '2px solid #005B94' : '2px solid transparent',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'general'      && <GeneralSection />}
        {tab === 'admins'       && <AdminsSection />}
        {tab === 'enrollment'   && <EnrollmentSection />}
        {tab === 'integrations' && <IntegrationsSection />}
      </div>
    </div>
  );
}

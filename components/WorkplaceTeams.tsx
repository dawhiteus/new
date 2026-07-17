import React, { useState, useRef, useEffect } from 'react';
import { PageHeader } from './PageHeader';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import {
  Users, Search, MoreHorizontal, CreditCard, Building2,
  Globe, LayoutGrid, Ban, X, ChevronDown, ChevronRight,
  Plus, Upload, Mail, Download,
} from 'lucide-react';
import { toast } from './ui/toast';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TeamMember {
  id: string;
  name: string;
  email: string;
  created: string;
  notes: string;
  homeBase: string;
  status: 'Active' | 'Inactive';
}

interface Team {
  id: string;
  name: string;
  owner: string;
  members: TeamMember[];
}

type TabId = 'members' | 'general' | 'permissions' | 'communications' | 'reports';
type LocationPerm = 'Open' | 'Limited' | 'None';
type ModalState = 'none' | 'invite' | 'payment-choose' | 'credit-card' | 'bank-account';

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_TEAMS: Team[] = [
  {
    id: '1',
    name: 'License Tracker – Admins',
    owner: 'matt@liquidspace.com',
    members: [
      { id: '1', name: 'Darren Toshi', email: 'darren.toshi@slalom.com', created: '01/15/2018', notes: '', homeBase: 'Chicago, IL', status: 'Active' },
      { id: '2', name: 'Drew Maclean', email: 'drew.maclean@slalom.com', created: '11/20/2025', notes: '', homeBase: 'New York, NY', status: 'Active' },
    ],
  },
  {
    id: '2',
    name: 'EMEA',
    owner: 'sarah@liquidspace.com',
    members: [
      { id: '3', name: 'James Whitfield', email: 'james.w@slalom.com', created: '03/10/2023', notes: '', homeBase: 'London, UK', status: 'Active' },
      { id: '4', name: 'Sophie Müller', email: 'sophie.m@slalom.com', created: '05/22/2023', notes: '', homeBase: 'Berlin, DE', status: 'Active' },
      { id: '5', name: 'Luca Ferrari', email: 'luca.f@slalom.com', created: '07/01/2024', notes: '', homeBase: 'Milan, IT', status: 'Active' },
      { id: '6', name: 'Elena Rossi', email: 'elena.r@slalom.com', created: '09/15/2024', notes: '', homeBase: 'Rome, IT', status: 'Inactive' },
    ],
  },
  {
    id: '3',
    name: 'Engineering',
    owner: 'dev-lead@liquidspace.com',
    members: [
      { id: '7', name: 'Priya Kapoor', email: 'priya.k@liquidspace.com', created: '02/14/2022', notes: 'Senior engineer', homeBase: 'Austin, TX', status: 'Active' },
      { id: '8', name: 'Marcus Chen', email: 'marcus.c@liquidspace.com', created: '04/30/2023', notes: '', homeBase: 'Seattle, WA', status: 'Active' },
      { id: '9', name: 'Aisha Okonkwo', email: 'aisha.o@liquidspace.com', created: '11/01/2024', notes: '', homeBase: 'Atlanta, GA', status: 'Active' },
    ],
  },
  {
    id: '4',
    name: 'Domain Unassigned',
    owner: '',
    members: [],
  },
];

const BANK_LIST = [
  { name: 'Chase', domain: 'chase.com', color: '#003087', initials: 'C' },
  { name: 'Bank of America', domain: 'bankofamerica.com', color: '#E31837', initials: 'BoA' },
  { name: 'Wells Fargo', domain: 'wellsfargo.com', color: '#CD1409', initials: 'WF' },
  { name: 'US Bank', domain: 'usbank.com', color: '#00529B', initials: 'US' },
  { name: 'Capital One', domain: 'capitalone.com', color: '#004977', initials: 'CO' },
  { name: 'Navy Federal Credit Union', domain: 'navyfederal.org', color: '#003366', initials: 'NF' },
];

// ─── Shared styles ────────────────────────────────────────────────────────────

const S = {
  input: {
    fontSize: 14, fontFamily: 'Inter, sans-serif', borderRadius: 8,
    border: '1px solid #D1D5DB', padding: '9px 12px', width: '100%',
    outline: 'none', color: '#374151', backgroundColor: '#fff',
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
  sectionTitle: {
    fontSize: 14, fontWeight: 600, color: '#005B94', fontFamily: 'Inter, sans-serif',
  } as React.CSSProperties,
  cell: {
    paddingTop: 14, paddingBottom: 14, fontSize: 14,
    fontFamily: 'Inter, sans-serif', color: '#374151',
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

// ─── Sub-components ───────────────────────────────────────────────────────────

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
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
      <Toggle checked={checked} onChange={onChange} />
      <span style={{ fontSize: 14, fontFamily: 'Inter, sans-serif', color: '#374151' }}>{label}</span>
    </div>
  );
}

function SaveBtn({ onClick, label = 'Save' }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      style={{ marginTop: 18, padding: '9px 22px', borderRadius: 8, border: 'none', backgroundColor: '#005B94', color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}
    >
      {label}
    </button>
  );
}

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 16, alignItems: 'center' }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>{label}</span>
      <div>{children}</div>
    </div>
  );
}

function BudgetSection({ title, open, onToggle, children }: { title: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div style={{ borderRadius: 8, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
      <button
        onClick={onToggle}
        style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '11px 14px', border: 'none', background: '#F9FAFB', cursor: 'pointer', borderBottom: open ? '1px solid #E5E7EB' : 'none', textAlign: 'left' }}
      >
        {open
          ? <ChevronDown className="h-4 w-4" style={{ color: '#6B7280', flexShrink: 0 }} />
          : <ChevronRight className="h-4 w-4" style={{ color: '#6B7280', flexShrink: 0 }} />}
        <span style={{ fontSize: 13, fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>{title}</span>
      </button>
      {open && (
        <div style={{ padding: '14px 16px' }} className="space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}

function BudgetField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16, alignItems: 'center' }}>
      <span style={{ fontSize: 13, fontFamily: 'Inter, sans-serif', color: '#374151' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #D1D5DB', borderRadius: 8, overflow: 'hidden' }}>
        <span style={{ padding: '9px 10px', fontSize: 14, color: '#6B7280', fontFamily: 'Inter, sans-serif', backgroundColor: '#F9FAFB', borderRight: '1px solid #D1D5DB', flexShrink: 0 }}>$</span>
        <input
          type="number"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ flex: 1, padding: '9px 12px', fontSize: 14, fontFamily: 'Inter, sans-serif', border: 'none', outline: 'none', color: '#374151' }}
        />
      </div>
    </div>
  );
}

function RowMenu({ onRemove }: { onRemove: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);
  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button onClick={() => setOpen(o => !o)} style={{ padding: '4px 6px', borderRadius: 6, border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: '#9CA3AF' }} className="hover:bg-gray-100">
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div style={{ position: 'absolute', right: 0, top: '100%', zIndex: 50, backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.10)', minWidth: 130, overflow: 'hidden' }}>
          <button onClick={() => { setOpen(false); onRemove(); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '9px 14px', fontSize: 13, fontFamily: 'Inter, sans-serif', color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }} className="hover:bg-red-50">
            Remove
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface WorkplaceTeamsProps {
  onAIAssistantOpen?: () => void;
  isAIDrawerOpen?: boolean;
}

export function WorkplaceTeams({ onAIAssistantOpen = () => {}, isAIDrawerOpen = false }: WorkplaceTeamsProps) {
  const [teams, setTeams] = useState<Team[]>(MOCK_TEAMS);
  const [selectedId, setSelectedId] = useState(MOCK_TEAMS[0].id);
  const [teamSearch, setTeamSearch] = useState('');
  const [activeTab, setActiveTab] = useState<TabId>('members');

  // Members tab
  const [memberSearch, setMemberSearch] = useState('');

  // General tab
  const [genName, setGenName] = useState(MOCK_TEAMS[0].name);
  const [genOwner, setGenOwner] = useState(MOCK_TEAMS[0].owner);
  const [genAdminInput, setGenAdminInput] = useState('');
  const [genNotifInput, setGenNotifInput] = useState('');

  // Permissions tab
  const [locationPerm, setLocationPerm] = useState<LocationPerm>('Open');
  const [bookingHourly, setBookingHourly] = useState(true);
  const [bookingMonthly, setBookingMonthly] = useState(true);
  const [spaceTypes, setSpaceTypes] = useState({ meeting: true, offices: true, desks: true, events: true });
  const [proOnly, setProOnly] = useState(false);
  const [preferredVenues, setPreferredVenues] = useState('Default');
  const [budgetOpen, setBudgetOpen] = useState({ hourly: true, dedicated: true, enhanced: false });
  const [budget, setBudget] = useState({ teamMonthly: '', memberDay: '', memberMonth: '', teamDedicated: '', memberDedicated: '', coworking: '', meeting: '', office: '', event: '' });
  const [disableCreditCard, setDisableCreditCard] = useState(false);
  const [requireReason, setRequireReason] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);

  // Communications tab
  const [overrideBanner, setOverrideBanner] = useState(false);

  // Modals
  const [modal, setModal] = useState<ModalState>('none');
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', title: '', company: '', geoCity: '', geoCountry: '', phone: '', accountId: '', costCenter: '', notes: '' });
  const [ccForm, setCcForm] = useState({ cardholder: '', address: '', city: '', country: 'United States', state: '', zip: '', cardNumber: '', expDate: '', cvv: '', captcha: false });
  const [bankSearch, setBankSearch] = useState('');

  const selectedTeam = teams.find(t => t.id === selectedId) ?? teams[0];

  const handleSelectTeam = (id: string) => {
    const team = teams.find(t => t.id === id);
    if (!team) return;
    setSelectedId(id);
    setGenName(team.name);
    setGenOwner(team.owner);
    setActiveTab('members');
    setMemberSearch('');
  };

  const filteredTeams = teams.filter(t => t.name.toLowerCase().includes(teamSearch.toLowerCase()));
  const visibleMembers = selectedTeam.members.filter(m =>
    m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.email.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const handleSaveGeneral = () => {
    setTeams(prev => prev.map(t => t.id === selectedId ? { ...t, name: genName, owner: genOwner } : t));
    toast.success('Team settings saved.');
  };

  const handleInvite = () => {
    if (!inviteForm.name || !inviteForm.email) return;
    const member: TeamMember = {
      id: String(Date.now()),
      name: inviteForm.name,
      email: inviteForm.email,
      created: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
      notes: inviteForm.notes,
      homeBase: inviteForm.geoCity ? `${inviteForm.geoCity}${inviteForm.geoCountry ? ', ' + inviteForm.geoCountry : ''}` : '',
      status: 'Active',
    };
    setTeams(prev => prev.map(t => t.id === selectedId ? { ...t, members: [...t.members, member] } : t));
    setInviteForm({ name: '', email: '', title: '', company: '', geoCity: '', geoCountry: '', phone: '', accountId: '', costCenter: '', notes: '' });
    setModal('none');
    toast.success(`Invite sent to ${member.email}.`);
  };

  const handleRemoveMember = (memberId: string) => {
    setTeams(prev => prev.map(t => t.id === selectedId ? { ...t, members: t.members.filter(m => m.id !== memberId) } : t));
    toast.info('Member removed.');
  };

  const handleAddCreditCard = () => {
    if (!ccForm.cardholder || !ccForm.cardNumber || !ccForm.captcha) return;
    const last4 = ccForm.cardNumber.replace(/\s/g, '').slice(-4);
    setPaymentMethods(prev => [...prev, `Card ending in ${last4}`]);
    setCcForm({ cardholder: '', address: '', city: '', country: 'United States', state: '', zip: '', cardNumber: '', expDate: '', cvv: '', captcha: false });
    setModal('none');
    toast.success('Credit card added.');
  };

  const filteredBanks = BANK_LIST.filter(b => !bankSearch || b.name.toLowerCase().includes(bankSearch.toLowerCase()));

  const TABS: { id: TabId; label: string }[] = [
    { id: 'members', label: 'Members' },
    { id: 'general', label: 'General' },
    { id: 'permissions', label: 'Permissions' },
    { id: 'communications', label: 'Communications' },
    { id: 'reports', label: 'Reports' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--surface-page, #F9FAFB)' }}>
      <PageHeader
        icon={<Users className="h-6 w-6" />}
        title="Teams"
        subtitle="Manage team membership, permissions, budgets, and communication settings."
        onAIAssistantOpen={onAIAssistantOpen}
        isAIDrawerOpen={isAIDrawerOpen}
        hideAIButton
      />

      <div style={{ padding: '24px', maxWidth: 1280, margin: '0 auto', display: 'flex', gap: 20, alignItems: 'flex-start' }}>

        {/* ── Left: Team list ──────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-gray-200 bg-white" style={{ width: 236, flexShrink: 0 }}>
          <div style={{ padding: '14px 14px 10px' }}>
            <div style={{ position: 'relative' }}>
              <Search className="h-4 w-4" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
              <input
                value={teamSearch}
                onChange={e => setTeamSearch(e.target.value)}
                placeholder="Search teams..."
                style={{ ...S.input, paddingLeft: 32, fontSize: 13 }}
              />
            </div>
          </div>

          <div>
            {filteredTeams.map(team => (
              <button
                key={team.id}
                onClick={() => handleSelectTeam(team.id)}
                style={{
                  display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 14px', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left',
                  borderLeft: team.id === selectedId ? '3px solid #005B94' : '3px solid transparent',
                  backgroundColor: team.id === selectedId ? '#EFF6FF' : 'transparent',
                }}
                className="hover:bg-blue-50 transition-colors"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
                  <Users className="h-3.5 w-3.5 flex-shrink-0" style={{ color: team.id === selectedId ? '#005B94' : '#9CA3AF' }} />
                  <span style={{ fontSize: 13, fontFamily: 'Inter, sans-serif', fontWeight: team.id === selectedId ? 600 : 400, color: team.id === selectedId ? '#005B94' : '#374151', lineHeight: 1.35, wordBreak: 'break-word' }}>
                    {team.name}
                  </span>
                </div>
                <span style={{ fontSize: 11, fontFamily: 'Inter, sans-serif', color: '#9CA3AF', flexShrink: 0, marginLeft: 6, backgroundColor: '#F3F4F6', padding: '2px 7px', borderRadius: 20 }}>
                  {team.members.length}
                </span>
              </button>
            ))}
          </div>

          <div style={{ padding: '10px 14px 14px', borderTop: '1px solid #F3F4F6' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontFamily: 'Inter, sans-serif', color: '#005B94', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <Plus className="h-3.5 w-3.5" />
              New Team
            </button>
          </div>
        </div>

        {/* ── Right: Team detail ───────────────────────────────────────────── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">

            {/* Tab bar */}
            <div style={{ borderBottom: '1px solid #E5E7EB', padding: '0 20px', display: 'flex', gap: 2 }}>
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '14px 14px 12px', fontSize: 14, fontFamily: 'Inter, sans-serif',
                    fontWeight: activeTab === tab.id ? 600 : 400,
                    color: activeTab === tab.id ? '#005B94' : '#6B7280',
                    background: 'none', border: 'none', cursor: 'pointer',
                    borderBottom: activeTab === tab.id ? '2px solid #005B94' : '2px solid transparent',
                    marginBottom: -1, whiteSpace: 'nowrap',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div style={{ padding: 24 }}>

              {/* ── Members ──────────────────────────────────────────── */}
              {activeTab === 'members' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, maxWidth: 260 }}>
                      <Search className="h-4 w-4" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
                      <input value={memberSearch} onChange={e => setMemberSearch(e.target.value)} placeholder="Search members..." style={{ ...S.input, paddingLeft: 32, fontSize: 13 }} />
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <button style={S.btnOutline} onClick={() => toast.info('Import via CSV coming soon.')}>
                        <Upload className="h-3.5 w-3.5" /> Import
                      </button>
                      <button style={S.btnPrimary} onClick={() => setModal('invite')}>
                        <Plus className="h-3.5 w-3.5" /> Add Member
                      </button>
                      <button style={S.btnOutline} onClick={() => toast.info('Invites resent.')}>
                        <Mail className="h-3.5 w-3.5" /> Resend Invites
                      </button>
                      <button style={S.btnOutline} onClick={() => toast.info('CSV download starting.')}>
                        <Download className="h-3.5 w-3.5" /> CSV
                      </button>
                    </div>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow style={{ borderColor: '#E5E7EB' }}>
                        {['Name', 'Email', 'Created', 'Home Base', 'Status', ''].map((h, i) => (
                          <TableHead key={i} style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            {h}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {visibleMembers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} style={{ textAlign: 'center', padding: '40px', fontSize: 14, color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>
                            No members match the current search.
                          </TableCell>
                        </TableRow>
                      ) : visibleMembers.map(m => (
                        <TableRow key={m.id} className="hover:bg-gray-50 transition-colors" style={{ borderColor: '#F3F4F6' }}>
                          <TableCell style={{ ...S.cell, fontWeight: 500 }}>{m.name}</TableCell>
                          <TableCell style={{ ...S.cell, color: '#6B7280' }}>{m.email}</TableCell>
                          <TableCell style={{ ...S.cell, color: '#6B7280', whiteSpace: 'nowrap' }}>{m.created}</TableCell>
                          <TableCell style={{ ...S.cell, color: '#6B7280' }}>{m.homeBase || '—'}</TableCell>
                          <TableCell style={S.cell}>
                            <span style={{
                              display: 'inline-block', padding: '3px 10px', borderRadius: 20,
                              fontSize: 12, fontWeight: 500, fontFamily: 'Inter, sans-serif',
                              backgroundColor: m.status === 'Active' ? '#DCFCE7' : '#F3F4F6',
                              color: m.status === 'Active' ? '#166534' : '#6B7280',
                            }}>
                              {m.status}
                            </span>
                          </TableCell>
                          <TableCell style={{ ...S.cell, textAlign: 'right' }}>
                            <RowMenu onRemove={() => handleRemoveMember(m.id)} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <p style={{ marginTop: 12, fontSize: 13, color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>
                    Showing {visibleMembers.length} of {selectedTeam.members.length} member{selectedTeam.members.length !== 1 ? 's' : ''}
                  </p>
                </div>
              )}

              {/* ── General ──────────────────────────────────────────── */}
              {activeTab === 'general' && (
                <div style={{ maxWidth: 580 }} className="space-y-5">
                  <div className="rounded-xl border border-gray-200 p-5 space-y-4">
                    <p style={S.sectionTitle}>General</p>
                    <FormRow label="Name">
                      <input value={genName} onChange={e => setGenName(e.target.value)} style={S.input} />
                    </FormRow>
                    <FormRow label="Owner">
                      <input value={genOwner} onChange={e => setGenOwner(e.target.value)} placeholder="owner@company.com" style={S.input} />
                    </FormRow>
                    <FormRow label="Admins">
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input value={genAdminInput} onChange={e => setGenAdminInput(e.target.value)} placeholder="email@company.com" style={{ ...S.input }} />
                        <button onClick={() => { if (genAdminInput.trim()) { setGenAdminInput(''); toast.success('Admin added.'); } }} style={{ ...S.btnPrimary, flexShrink: 0 }}>Add</button>
                      </div>
                    </FormRow>
                    <FormRow label="Notification Emails">
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input value={genNotifInput} onChange={e => setGenNotifInput(e.target.value)} placeholder="email@company.com" style={{ ...S.input }} />
                        <button onClick={() => { if (genNotifInput.trim()) { setGenNotifInput(''); toast.success('Email added.'); } }} style={{ ...S.btnPrimary, flexShrink: 0 }}>Add</button>
                      </div>
                    </FormRow>
                    <SaveBtn onClick={handleSaveGeneral} />
                  </div>
                </div>
              )}

              {/* ── Permissions ──────────────────────────────────────── */}
              {activeTab === 'permissions' && (
                <div className="space-y-4">

                  {/* Location Permissions */}
                  <div className="rounded-xl border border-gray-200 p-5">
                    <p style={S.sectionTitle}>Location Permissions</p>
                    <p style={{ fontSize: 13, color: '#6B7280', fontFamily: 'Inter, sans-serif', margin: '8px 0 16px', lineHeight: 1.5 }}>
                      Give your team access to workspace locations in the LiquidSpace Marketplace. Choose Limited to curate by space type, or choose None to only make HQ and Preferred Locations visible.
                    </p>

                    {/* Segmented control */}
                    <div style={{ display: 'inline-flex', borderRadius: 8, overflow: 'hidden', border: '1px solid #D1D5DB' }}>
                      {(['Open', 'Limited', 'None'] as LocationPerm[]).map((perm, i) => (
                        <button
                          key={perm}
                          onClick={() => setLocationPerm(perm)}
                          style={{
                            padding: '8px 20px', fontSize: 14, fontFamily: 'Inter, sans-serif', fontWeight: 500,
                            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                            backgroundColor: locationPerm === perm ? '#005B94' : '#fff',
                            color: locationPerm === perm ? '#fff' : '#374151',
                            borderRight: i < 2 ? '1px solid #D1D5DB' : 'none',
                          }}
                        >
                          {perm === 'Open' && <Globe className="h-4 w-4" />}
                          {perm === 'Limited' && <LayoutGrid className="h-4 w-4" />}
                          {perm === 'None' && <Ban className="h-4 w-4" />}
                          {perm}
                        </button>
                      ))}
                    </div>

                    {/* Limited sub-controls */}
                    {locationPerm === 'Limited' && (
                      <div style={{ marginTop: 20 }} className="space-y-5">
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: 10 }}>Booking Type</p>
                          <ToggleRow label="Hourly spaces" checked={bookingHourly} onChange={setBookingHourly} />
                          <ToggleRow label="Monthly spaces" checked={bookingMonthly} onChange={setBookingMonthly} />
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: 10 }}>Space Type</p>
                          <ToggleRow label="Meeting Spaces" checked={spaceTypes.meeting} onChange={v => setSpaceTypes(s => ({ ...s, meeting: v }))} />
                          <ToggleRow label="Offices" checked={spaceTypes.offices} onChange={v => setSpaceTypes(s => ({ ...s, offices: v }))} />
                          <ToggleRow label="Desks" checked={spaceTypes.desks} onChange={v => setSpaceTypes(s => ({ ...s, desks: v }))} />
                          <ToggleRow label="Event Spaces" checked={spaceTypes.events} onChange={v => setSpaceTypes(s => ({ ...s, events: v }))} />
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: 10 }}>LiquidSpace PRO</p>
                          <ToggleRow label="Only display LiquidSpace PRO locations" checked={proOnly} onChange={setProOnly} />
                        </div>
                      </div>
                    )}

                    {/* None sub-controls */}
                    {locationPerm === 'None' && (
                      <div style={{ marginTop: 16, maxWidth: 340 }}>
                        <label style={S.label}>Display only preferred venues</label>
                        <select value={preferredVenues} onChange={e => setPreferredVenues(e.target.value)} style={S.select}>
                          <option>Default</option>
                          <option>HQ Only</option>
                          <option>Preferred Only</option>
                        </select>
                      </div>
                    )}

                    <SaveBtn onClick={() => toast.success('Location permissions saved.')} />
                  </div>

                  {/* Budget Limits */}
                  <div className="rounded-xl border border-gray-200 p-5">
                    <p style={S.sectionTitle}>Budget Limits</p>
                    <div style={{ marginTop: 16 }} className="space-y-3">
                      <BudgetSection title="Hourly / Daily Budget Settings" open={budgetOpen.hourly} onToggle={() => setBudgetOpen(b => ({ ...b, hourly: !b.hourly }))}>
                        <BudgetField label="Team Budget (per month)" value={budget.teamMonthly} onChange={v => setBudget(b => ({ ...b, teamMonthly: v }))} />
                        <BudgetField label="Member Limit (per day)" value={budget.memberDay} onChange={v => setBudget(b => ({ ...b, memberDay: v }))} />
                        <BudgetField label="Member Limit (per month)" value={budget.memberMonth} onChange={v => setBudget(b => ({ ...b, memberMonth: v }))} />
                      </BudgetSection>
                      <BudgetSection title="Dedicated Budget Settings" open={budgetOpen.dedicated} onToggle={() => setBudgetOpen(b => ({ ...b, dedicated: !b.dedicated }))}>
                        <BudgetField label="Team Dedicated Budget (per month)" value={budget.teamDedicated} onChange={v => setBudget(b => ({ ...b, teamDedicated: v }))} />
                        <BudgetField label="Member Dedicated Budget (per month)" value={budget.memberDedicated} onChange={v => setBudget(b => ({ ...b, memberDedicated: v }))} />
                      </BudgetSection>
                      <BudgetSection title="Enhanced Budget Settings" open={budgetOpen.enhanced} onToggle={() => setBudgetOpen(b => ({ ...b, enhanced: !b.enhanced }))}>
                        <BudgetField label="Coworking Desk (per reservation)" value={budget.coworking} onChange={v => setBudget(b => ({ ...b, coworking: v }))} />
                        <BudgetField label="Meeting Room (per reservation)" value={budget.meeting} onChange={v => setBudget(b => ({ ...b, meeting: v }))} />
                        <BudgetField label="Office Space (per reservation)" value={budget.office} onChange={v => setBudget(b => ({ ...b, office: v }))} />
                        <BudgetField label="Event Space (per reservation)" value={budget.event} onChange={v => setBudget(b => ({ ...b, event: v }))} />
                        <div style={{ marginTop: 4 }}>
                          <ToggleRow label="Disable credit card entry by team member" checked={disableCreditCard} onChange={setDisableCreditCard} />
                        </div>
                      </BudgetSection>
                    </div>
                    <SaveBtn onClick={() => toast.success('Budget limits saved.')} />
                  </div>

                  {/* Booking Details */}
                  <div className="rounded-xl border border-gray-200 p-5">
                    <p style={S.sectionTitle}>Booking Details</p>
                    <div style={{ marginTop: 14 }}>
                      <ToggleRow label="Require Reason for Booking" checked={requireReason} onChange={setRequireReason} />
                    </div>
                    <SaveBtn onClick={() => toast.success('Booking details saved.')} />
                  </div>

                  {/* Payment Methods */}
                  <div className="rounded-xl border border-gray-200 p-5">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                      <p style={S.sectionTitle}>Payment Methods</p>
                      <button onClick={() => setModal('payment-choose')} style={S.btnPrimary}>
                        <Plus className="h-3.5 w-3.5" /> Add Payment Method
                      </button>
                    </div>
                    {paymentMethods.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '28px', fontSize: 14, color: '#9CA3AF', fontFamily: 'Inter, sans-serif', backgroundColor: '#F9FAFB', borderRadius: 8, border: '1px dashed #E5E7EB' }}>
                        No payment methods on file.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {paymentMethods.map((pm, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', border: '1px solid #E5E7EB', borderRadius: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <CreditCard className="h-4 w-4" style={{ color: '#005B94' }} />
                              <span style={{ fontSize: 14, fontFamily: 'Inter, sans-serif', color: '#374151' }}>{pm}</span>
                            </div>
                            <button onClick={() => setPaymentMethods(prev => prev.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 4 }}>
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── Communications ────────────────────────────────────── */}
              {activeTab === 'communications' && (
                <div>
                  <div className="rounded-xl border border-gray-200 p-5">
                    <p style={S.sectionTitle}>Banner & Popup</p>
                    <div style={{ marginTop: 14 }}>
                      <ToggleRow
                        label="Override default banner and popup settings for this specific team."
                        checked={overrideBanner}
                        onChange={setOverrideBanner}
                      />
                    </div>
                    <SaveBtn onClick={() => toast.success('Communication settings saved.')} />
                  </div>
                </div>
              )}

              {/* ── Reports ──────────────────────────────────────────── */}
              {activeTab === 'reports' && (
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow style={{ borderColor: '#E5E7EB' }}>
                        {['Created', 'Parameters', 'Status'].map(h => (
                          <TableHead key={h} style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            {h}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell colSpan={3} style={{ textAlign: 'center', padding: '48px', fontSize: 14, color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>
                          No reports generated yet.
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* ── Invite Members modal ─────────────────────────────────────────── */}
      <Dialog open={modal === 'invite'} onOpenChange={open => { if (!open) setModal('none'); }}>
        <DialogContent className="max-w-lg p-0 overflow-hidden" style={{ borderRadius: 12 }}>
          <div style={{ backgroundColor: '#005B94', padding: '16px 20px' }}>
            <DialogHeader>
              <DialogTitle style={{ fontSize: 18, fontWeight: 600, color: '#fff', fontFamily: 'Inter, sans-serif' }}>Add Member</DialogTitle>
              <DialogDescription className="sr-only">Invite a new member to this team</DialogDescription>
            </DialogHeader>
          </div>
          <div style={{ padding: 24 }} className="space-y-4">
            <p style={{ fontSize: 13, color: '#6B7280', fontFamily: 'Inter, sans-serif', marginTop: -4 }}>* Indicates required field</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label style={S.label}>Full Name *</label>
                <input value={inviteForm.name} onChange={e => setInviteForm(f => ({ ...f, name: e.target.value }))} style={S.input} />
              </div>
              <div>
                <label style={S.label}>Email *</label>
                <input type="email" value={inviteForm.email} onChange={e => setInviteForm(f => ({ ...f, email: e.target.value }))} style={S.input} />
              </div>
              <div>
                <label style={S.label}>Title</label>
                <input value={inviteForm.title} onChange={e => setInviteForm(f => ({ ...f, title: e.target.value }))} style={S.input} />
              </div>
              <div>
                <label style={S.label}>Company</label>
                <input value={inviteForm.company} onChange={e => setInviteForm(f => ({ ...f, company: e.target.value }))} style={S.input} />
              </div>
              <div>
                <label style={S.label}>Geo-City</label>
                <input value={inviteForm.geoCity} onChange={e => setInviteForm(f => ({ ...f, geoCity: e.target.value }))} style={S.input} />
              </div>
              <div>
                <label style={S.label}>Geo-Country</label>
                <input value={inviteForm.geoCountry} onChange={e => setInviteForm(f => ({ ...f, geoCountry: e.target.value }))} style={S.input} />
              </div>
              <div>
                <label style={S.label}>Phone</label>
                <input value={inviteForm.phone} onChange={e => setInviteForm(f => ({ ...f, phone: e.target.value }))} style={S.input} />
              </div>
              <div>
                <label style={S.label}>Account ID</label>
                <input value={inviteForm.accountId} onChange={e => setInviteForm(f => ({ ...f, accountId: e.target.value }))} style={S.input} />
              </div>
            </div>
            <div>
              <label style={S.label}>Cost Center</label>
              <input value={inviteForm.costCenter} onChange={e => setInviteForm(f => ({ ...f, costCenter: e.target.value }))} style={S.input} />
            </div>
            <div>
              <label style={S.label}>Notes</label>
              <textarea value={inviteForm.notes} onChange={e => setInviteForm(f => ({ ...f, notes: e.target.value }))} style={{ ...S.input, minHeight: 64, resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
              <button onClick={handleInvite} disabled={!inviteForm.name || !inviteForm.email} style={{ ...S.btnPrimary, opacity: !inviteForm.name || !inviteForm.email ? 0.5 : 1, padding: '10px 22px', fontSize: 14, fontWeight: 600 }}>
                Send Invite
              </button>
              <button onClick={() => setModal('none')} style={{ ...S.btnOutline, padding: '10px 20px', fontSize: 14 }}>Cancel</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Add Payment Method — choose ──────────────────────────────────── */}
      <Dialog open={modal === 'payment-choose'} onOpenChange={open => { if (!open) setModal('none'); }}>
        <DialogContent className="max-w-sm p-0 overflow-hidden" style={{ borderRadius: 12 }}>
          <div style={{ backgroundColor: '#005B94', padding: '16px 20px' }}>
            <DialogHeader>
              <DialogTitle style={{ fontSize: 18, fontWeight: 600, color: '#fff', fontFamily: 'Inter, sans-serif' }}>Add Payment Method</DialogTitle>
              <DialogDescription className="sr-only">Choose a payment type</DialogDescription>
            </DialogHeader>
          </div>
          <div style={{ padding: 24, display: 'flex', gap: 16 }}>
            {[
              { label: 'Credit Card', icon: <CreditCard className="h-8 w-8" style={{ color: '#005B94' }} />, next: 'credit-card' as ModalState },
              { label: 'Bank Account', icon: <Building2 className="h-8 w-8" style={{ color: '#005B94' }} />, next: 'bank-account' as ModalState },
            ].map(opt => (
              <button
                key={opt.label}
                onClick={() => setModal(opt.next)}
                style={{ flex: 1, padding: '24px 16px', border: '1px solid #D1D5DB', borderRadius: 12, backgroundColor: '#fff', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}
                className="hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                {opt.icon}
                <span style={{ fontSize: 14, fontWeight: 500, fontFamily: 'Inter, sans-serif', color: '#374151' }}>{opt.label}</span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Add Credit Card ──────────────────────────────────────────────── */}
      <Dialog open={modal === 'credit-card'} onOpenChange={open => { if (!open) setModal('none'); }}>
        <DialogContent className="max-w-lg p-0 overflow-hidden" style={{ borderRadius: 12 }}>
          <div style={{ backgroundColor: '#005B94', padding: '16px 20px' }}>
            <DialogHeader>
              <DialogTitle style={{ fontSize: 18, fontWeight: 600, color: '#fff', fontFamily: 'Inter, sans-serif' }}>Add Credit Card</DialogTitle>
              <DialogDescription className="sr-only">Enter credit card billing details</DialogDescription>
            </DialogHeader>
          </div>
          <div style={{ padding: 24 }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label style={S.label}>Cardholder Name</label>
                <input value={ccForm.cardholder} onChange={e => setCcForm(f => ({ ...f, cardholder: e.target.value }))} style={S.input} />
              </div>
              <div>
                <label style={S.label}>Address</label>
                <input value={ccForm.address} onChange={e => setCcForm(f => ({ ...f, address: e.target.value }))} style={S.input} />
              </div>
              <div>
                <label style={S.label}>City</label>
                <input value={ccForm.city} onChange={e => setCcForm(f => ({ ...f, city: e.target.value }))} style={S.input} />
              </div>
              <div>
                <label style={S.label}>Country</label>
                <select value={ccForm.country} onChange={e => setCcForm(f => ({ ...f, country: e.target.value }))} style={S.select}>
                  {['United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Australia'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={S.label}>State</label>
                <select value={ccForm.state} onChange={e => setCcForm(f => ({ ...f, state: e.target.value }))} style={S.select}>
                  <option value="">Select state</option>
                  {['AL','AK','AZ','CA','CO','CT','FL','GA','IL','MA','MI','MN','NY','NC','OH','PA','TX','VA','WA'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={S.label}>ZIP / Postal Code</label>
                <input value={ccForm.zip} onChange={e => setCcForm(f => ({ ...f, zip: e.target.value }))} style={S.input} />
              </div>
            </div>
            <div>
              <label style={S.label}>Card Number</label>
              <input value={ccForm.cardNumber} onChange={e => setCcForm(f => ({ ...f, cardNumber: e.target.value }))} placeholder="•••• •••• •••• ••••" style={S.input} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label style={S.label}>Expiration Date</label>
                <input value={ccForm.expDate} onChange={e => setCcForm(f => ({ ...f, expDate: e.target.value }))} placeholder="MM / YY" style={S.input} />
              </div>
              <div>
                <label style={S.label}>CVV</label>
                <input value={ccForm.cvv} onChange={e => setCcForm(f => ({ ...f, cvv: e.target.value }))} placeholder="•••" style={S.input} />
              </div>
            </div>
            {/* Mock reCAPTCHA */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #D1D5DB', borderRadius: 4, padding: '10px 14px', backgroundColor: '#F9FAFB', width: 'fit-content' }}>
              <input type="checkbox" checked={ccForm.captcha} onChange={e => setCcForm(f => ({ ...f, captcha: e.target.checked }))} style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#005B94' }} />
              <span style={{ fontSize: 14, fontFamily: 'Inter, sans-serif', color: '#374151', userSelect: 'none' }}>I'm not a robot</span>
              <div style={{ marginLeft: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: '#4A90D9', letterSpacing: '0.04em' }}>reCAPTCHA</div>
                <div style={{ fontSize: 7, color: '#9CA3AF' }}>Privacy · Terms</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
              <button
                onClick={handleAddCreditCard}
                disabled={!ccForm.cardholder || !ccForm.cardNumber || !ccForm.captcha}
                style={{ ...S.btnPrimary, padding: '10px 22px', fontSize: 14, fontWeight: 600, opacity: !ccForm.cardholder || !ccForm.cardNumber || !ccForm.captcha ? 0.5 : 1 }}
              >
                Save
              </button>
              <button onClick={() => setModal('payment-choose')} style={{ ...S.btnOutline, padding: '10px 20px', fontSize: 14 }}>Back</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Add Bank Account (Plaid-style) ───────────────────────────────── */}
      <Dialog open={modal === 'bank-account'} onOpenChange={open => { if (!open) setModal('none'); }}>
        <DialogContent className="max-w-sm p-0 overflow-hidden" style={{ borderRadius: 12 }}>
          <div style={{ backgroundColor: '#005B94', padding: '16px 20px' }}>
            <DialogHeader>
              <DialogTitle style={{ fontSize: 18, fontWeight: 600, color: '#fff', fontFamily: 'Inter, sans-serif' }}>Add Bank Account</DialogTitle>
              <DialogDescription className="sr-only">Connect a bank account via your institution</DialogDescription>
            </DialogHeader>
          </div>
          <div style={{ padding: 20 }}>
            <p style={{ fontSize: 13, color: '#6B7280', fontFamily: 'Inter, sans-serif', marginBottom: 12 }}>Select your financial institution</p>
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <Search className="h-4 w-4" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
              <input value={bankSearch} onChange={e => setBankSearch(e.target.value)} placeholder="Search" style={{ ...S.input, paddingLeft: 32 }} />
            </div>
            <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #E5E7EB' }}>
              {filteredBanks.map((bank, i) => (
                <button
                  key={bank.name}
                  onClick={() => { setModal('none'); toast.success(`${bank.name} connected.`); }}
                  style={{ display: 'flex', width: '100%', alignItems: 'center', gap: 12, padding: '12px 14px', border: 'none', background: '#fff', cursor: 'pointer', borderBottom: i < filteredBanks.length - 1 ? '1px solid #F3F4F6' : 'none' }}
                  className="hover:bg-blue-50 transition-colors"
                >
                  <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: bank.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>{bank.initials}</span>
                  </div>
                  <div style={{ textAlign: 'left', flex: 1 }}>
                    <p style={{ fontSize: 14, fontFamily: 'Inter, sans-serif', fontWeight: 500, color: '#374151', margin: 0 }}>{bank.name}</p>
                    <p style={{ fontSize: 11, fontFamily: 'Inter, sans-serif', color: '#9CA3AF', margin: 0 }}>{bank.domain}</p>
                  </div>
                  <ChevronRight className="h-4 w-4" style={{ color: '#9CA3AF', flexShrink: 0 }} />
                </button>
              ))}
              {filteredBanks.length === 0 && (
                <div style={{ padding: '24px', textAlign: 'center', fontSize: 14, color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>No institutions found.</div>
              )}
            </div>
            <button onClick={() => setModal('payment-choose')} style={{ ...S.btnOutline, marginTop: 12, width: '100%', justifyContent: 'center' }}>
              Back
            </button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}

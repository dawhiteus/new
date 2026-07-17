import React, { useState, useRef, useEffect } from 'react';
import { PageHeader } from './PageHeader';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { MapPin, Search, MoreHorizontal, Globe, LayoutGrid, Ban, Plus, Check } from 'lucide-react';
import { toast } from './ui/toast';

// ─── Types ────────────────────────────────────────────────────────────────────

type TabId = 'hq-preferred' | 'brands';
type BrandMode = 'Open' | 'Limited' | 'None';
type LocationType = 'HQ' | 'Preferred';
type ModalState = 'none' | 'add-preferred' | 'add-hq' | 'edit-location';

interface Location {
  id: string;
  type: LocationType;
  venue: string;
  description: string;
  city: string;
  state: string;
  geofence: boolean;
  radius: string;
  message: string;
  customCTA: boolean;
  ctaText: string;
  ctaUrl: string;
}

interface Brand {
  id: string;
  name: string;
  locationCount: number;
  enabled: boolean;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_LOCATIONS: Location[] = [
  { id: '1',  type: 'HQ', venue: 'Airbnb – Beijing HQ',     description: 'Airbnb – Beijing HQ',     city: 'Chao Yang Qu',        state: 'Bei Jing Shi', geofence: true,  radius: '50', message: "Looks like you are searching for space where we have an Airbnb Office! We'd love to have you work from our office.", customCTA: true,  ctaText: 'Book at Airbnb', ctaUrl: 'https://air.bb/bookadesk' },
  { id: '2',  type: 'HQ', venue: 'Airbnb – Bengaluru HQ',   description: 'Airbnb – Bengaluru HQ',   city: 'Bengaluru',           state: 'KA',           geofence: true,  radius: '50', message: '', customCTA: false, ctaText: '', ctaUrl: '' },
  { id: '3',  type: 'HQ', venue: 'Airbnb – Berlin HQ',      description: 'Airbnb – Berlin HQ',      city: 'Berlin',              state: 'BE',           geofence: false, radius: '',   message: '', customCTA: false, ctaText: '', ctaUrl: '' },
  { id: '4',  type: 'HQ', venue: 'Airbnb – Dublin HQ',      description: 'Airbnb – Dublin HQ',      city: 'Dublin',              state: 'D',            geofence: true,  radius: '50', message: '', customCTA: false, ctaText: '', ctaUrl: '' },
  { id: '5',  type: 'HQ', venue: 'Airbnb – Gurugram HQ',    description: 'Airbnb – Gurugram HQ',    city: 'Gurugram',            state: 'Haryana',      geofence: true,  radius: '50', message: '', customCTA: false, ctaText: '', ctaUrl: '' },
  { id: '6',  type: 'HQ', venue: 'Airbnb – London HQ',      description: 'Airbnb – London HQ',      city: 'London',              state: 'England',      geofence: true,  radius: '50', message: '', customCTA: false, ctaText: '', ctaUrl: '' },
  { id: '7',  type: 'HQ', venue: 'Airbnb – Manila HQ',      description: 'Airbnb – Manila HQ',      city: 'Bonifacio Global City', state: 'Taguig',     geofence: true,  radius: '50', message: '', customCTA: false, ctaText: '', ctaUrl: '' },
  { id: '8',  type: 'HQ', venue: 'Airbnb – Mexico City HQ', description: 'Airbnb – Mexico City HQ', city: 'Ciudad de México',    state: 'CDMX',         geofence: true,  radius: '50', message: '', customCTA: false, ctaText: '', ctaUrl: '' },
  { id: '9',  type: 'HQ', venue: 'Airbnb – Milan HQ',       description: 'Airbnb – Milan HQ',       city: 'Milano',              state: 'Lombardia',    geofence: true,  radius: '50', message: '', customCTA: false, ctaText: '', ctaUrl: '' },
  { id: '10', type: 'HQ', venue: 'Airbnb – Montreal HQ',    description: 'Airbnb – Montreal HQ',    city: 'Montréal',            state: 'QC',           geofence: true,  radius: '50', message: '', customCTA: false, ctaText: '', ctaUrl: '' },
  { id: '11', type: 'HQ', venue: 'Airbnb – NYC HQ',         description: 'Airbnb – NYC HQ',         city: 'New York',            state: 'NY',           geofence: true,  radius: '25', message: '', customCTA: false, ctaText: '', ctaUrl: '' },
  { id: '12', type: 'HQ', venue: 'Airbnb – Paris HQ',       description: 'Airbnb – Paris HQ',       city: 'Paris',               state: 'Île-de-France',geofence: false, radius: '',   message: '', customCTA: false, ctaText: '', ctaUrl: '' },
  { id: '13', type: 'Preferred', venue: 'WeWork – Bryant Park',  description: 'WeWork – Bryant Park',  city: 'New York',  state: 'NY',  geofence: false, radius: '', message: '', customCTA: false, ctaText: '', ctaUrl: '' },
  { id: '14', type: 'Preferred', venue: 'Industrious – Chicago', description: 'Industrious – Chicago', city: 'Chicago',   state: 'IL',  geofence: false, radius: '', message: '', customCTA: false, ctaText: '', ctaUrl: '' },
];

const MOCK_BRANDS: Brand[] = [
  { id: '1',  name: '25N Coworking',                  locationCount: 4,  enabled: true },
  { id: '2',  name: '360 Suites',                     locationCount: 3,  enabled: true },
  { id: '3',  name: '91Springboard',                  locationCount: 29, enabled: true },
  { id: '4',  name: 'AEC – American Executive Centers', locationCount: 6, enabled: true },
  { id: '5',  name: 'AfricaWorks',                    locationCount: 1,  enabled: true },
  { id: '6',  name: 'ALCOVE',                         locationCount: 4,  enabled: true },
  { id: '7',  name: 'AmeriCenters, Inc.',             locationCount: 8,  enabled: true },
  { id: '8',  name: 'Apt CoWork',                     locationCount: 16, enabled: true },
  { id: '9',  name: 'ARC Club',                       locationCount: 1,  enabled: true },
  { id: '10', name: 'Argyll',                         locationCount: 0,  enabled: true },
  { id: '11', name: 'Bizspace',                       locationCount: 12, enabled: true },
  { id: '12', name: 'Bond Collective',                locationCount: 5,  enabled: true },
  { id: '13', name: 'CoWork Inc.',                    locationCount: 7,  enabled: false },
  { id: '14', name: 'Deskpass',                       locationCount: 22, enabled: true },
  { id: '15', name: 'Endeavor',                       locationCount: 3,  enabled: true },
];

// ─── Shared styles ────────────────────────────────────────────────────────────

const S = {
  input: {
    fontSize: 14, fontFamily: 'Inter, sans-serif', borderRadius: 8,
    border: '1px solid #D1D5DB', padding: '9px 12px', width: '100%',
    outline: 'none', color: '#374151', backgroundColor: '#fff',
  } as React.CSSProperties,
  label: {
    fontSize: 13, fontWeight: 600, color: '#374151',
    fontFamily: 'Inter, sans-serif', display: 'block', marginBottom: 6,
  } as React.CSSProperties,
  cell: {
    paddingTop: 13, paddingBottom: 13, fontSize: 14,
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
      role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
      style={{ width: 44, height: 24, borderRadius: 12, flexShrink: 0, backgroundColor: checked ? '#005B94' : '#D1D5DB', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background-color 0.15s', display: 'inline-flex', alignItems: 'center' }}
    >
      <span style={{ position: 'absolute', top: 2, left: checked ? 22 : 2, width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff', transition: 'left 0.15s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
    </button>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
      <Toggle checked={checked} onChange={onChange} />
      <span style={{ fontSize: 14, fontFamily: 'Inter, sans-serif', color: '#374151' }}>{label}</span>
    </div>
  );
}

function RowMenu({ items }: { items: { label: string; danger?: boolean; onClick: () => void }[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);
  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button onClick={() => setOpen(o => !o)} style={{ padding: '4px 6px', borderRadius: 6, border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: '#9CA3AF' }} className="hover:bg-gray-100">
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div style={{ position: 'absolute', right: 0, top: '100%', zIndex: 50, backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.10)', minWidth: 120, overflow: 'hidden' }}>
          {items.map(item => (
            <button key={item.label} onClick={() => { setOpen(false); item.onClick(); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '9px 14px', fontSize: 13, fontFamily: 'Inter, sans-serif', color: item.danger ? '#EF4444' : '#374151', background: 'none', border: 'none', cursor: 'pointer' }} className={item.danger ? 'hover:bg-red-50' : 'hover:bg-gray-50'}>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: 16, alignItems: 'center' }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>{label}</span>
      <div>{children}</div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface WorkplaceLocationsProps {
  onAIAssistantOpen?: () => void;
  isAIDrawerOpen?: boolean;
}

export function WorkplaceLocations({ onAIAssistantOpen = () => {}, isAIDrawerOpen = false }: WorkplaceLocationsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('hq-preferred');
  const [locations, setLocations] = useState<Location[]>(MOCK_LOCATIONS);
  const [brands, setBrands] = useState<Brand[]>(MOCK_BRANDS);
  const [brandMode, setBrandMode] = useState<BrandMode>('Open');

  // Search
  const [locationSearch, setLocationSearch] = useState('');
  const [brandSearch, setBrandSearch] = useState('');

  // Modals
  const [modal, setModal] = useState<ModalState>('none');
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  // Add HQ form
  const [addHQForm, setAddHQForm] = useState({ name: '', venue: '', geofence: false, radius: '', message: '', customCTA: false, ctaText: '', ctaUrl: '' });

  // Add Preferred form
  const [addPrefForm, setAddPrefForm] = useState({ name: '', venueGroup: '' });

  // Edit form (seeded from editingLocation)
  const [editForm, setEditForm] = useState({ name: '', venue: '', geofence: false, radius: '', message: '', customCTA: false, ctaText: '', ctaUrl: '' });

  const openEdit = (loc: Location) => {
    setEditingLocation(loc);
    setEditForm({ name: loc.venue, venue: loc.venue, geofence: loc.geofence, radius: loc.radius, message: loc.message, customCTA: loc.customCTA, ctaText: loc.ctaText, ctaUrl: loc.ctaUrl });
    setModal('edit-location');
  };

  const handleSaveEdit = () => {
    if (!editingLocation) return;
    setLocations(prev => prev.map(l => l.id === editingLocation.id ? {
      ...l,
      venue: editForm.venue, description: editForm.venue,
      geofence: editForm.geofence, radius: editForm.geofence ? editForm.radius : '',
      message: editForm.message, customCTA: editForm.customCTA,
      ctaText: editForm.customCTA ? editForm.ctaText : '',
      ctaUrl: editForm.customCTA ? editForm.ctaUrl : '',
    } : l));
    setModal('none');
    toast.success('Location updated.');
  };

  const handleAddHQ = () => {
    if (!addHQForm.name || !addHQForm.venue) return;
    const loc: Location = {
      id: String(Date.now()), type: 'HQ',
      venue: addHQForm.venue, description: addHQForm.venue,
      city: '', state: '',
      geofence: addHQForm.geofence, radius: addHQForm.geofence ? addHQForm.radius : '',
      message: addHQForm.message, customCTA: addHQForm.customCTA,
      ctaText: addHQForm.customCTA ? addHQForm.ctaText : '',
      ctaUrl: addHQForm.customCTA ? addHQForm.ctaUrl : '',
    };
    setLocations(prev => [...prev, loc]);
    setAddHQForm({ name: '', venue: '', geofence: false, radius: '', message: '', customCTA: false, ctaText: '', ctaUrl: '' });
    setModal('none');
    toast.success('HQ location added.');
  };

  const handleAddPreferred = () => {
    if (!addPrefForm.name) return;
    const loc: Location = {
      id: String(Date.now()), type: 'Preferred',
      venue: addPrefForm.name, description: addPrefForm.name,
      city: '', state: '', geofence: false, radius: '',
      message: '', customCTA: false, ctaText: '', ctaUrl: '',
    };
    setLocations(prev => [...prev, loc]);
    setAddPrefForm({ name: '', venueGroup: '' });
    setModal('none');
    toast.success('Preferred location added.');
  };

  const handleRemoveLocation = (id: string) => {
    setLocations(prev => prev.filter(l => l.id !== id));
    toast.info('Location removed.');
  };

  const toggleGeofenceInTable = (id: string) => {
    setLocations(prev => prev.map(l => l.id === id ? { ...l, geofence: !l.geofence, radius: !l.geofence ? '50' : '' } : l));
  };

  const allBrandsChecked = brands.every(b => b.enabled);
  const someBrandsChecked = brands.some(b => b.enabled) && !allBrandsChecked;

  const toggleAllBrands = () => {
    setBrands(prev => prev.map(b => ({ ...b, enabled: !allBrandsChecked })));
  };

  const filteredLocations = locations.filter(l =>
    !locationSearch ||
    l.venue.toLowerCase().includes(locationSearch.toLowerCase()) ||
    l.city.toLowerCase().includes(locationSearch.toLowerCase()) ||
    l.state.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const filteredBrands = brands.filter(b =>
    !brandSearch || b.name.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const TABS = [
    { id: 'hq-preferred' as TabId, label: 'HQ & Preferred Locations' },
    { id: 'brands' as TabId, label: 'Brands' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--surface-page, #F9FAFB)' }}>
      <PageHeader
        icon={<MapPin className="h-6 w-6" />}
        title="Locations"
        subtitle="Manage the locations your members can access. Curate brands, set preferred locations, and add HQ and Hub locations."
        onAIAssistantOpen={onAIAssistantOpen}
        isAIDrawerOpen={isAIDrawerOpen}
        hideAIButton
      />

      <div style={{ padding: '24px', maxWidth: 1280, margin: '0 auto' }}>
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">

          {/* Tab bar */}
          <div style={{ borderBottom: '1px solid #E5E7EB', padding: '0 20px', display: 'flex', gap: 2 }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '14px 16px 12px', fontSize: 14, fontFamily: 'Inter, sans-serif',
                  fontWeight: activeTab === tab.id ? 600 : 400,
                  color: activeTab === tab.id ? '#005B94' : '#6B7280',
                  background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                  borderBottom: activeTab === tab.id ? '2px solid #005B94' : '2px solid transparent',
                  marginBottom: -1,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ padding: 24 }}>

            {/* ── HQ & Preferred Locations ─────────────────────────────── */}
            {activeTab === 'hq-preferred' && (
              <div>
                {/* Toolbar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ position: 'relative', flex: 1, maxWidth: 280 }}>
                    <Search className="h-4 w-4" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
                    <input value={locationSearch} onChange={e => setLocationSearch(e.target.value)} placeholder="Search locations..." style={{ ...S.input, paddingLeft: 32, fontSize: 13 }} />
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => setModal('add-preferred')} style={S.btnOutline}>
                      <Plus className="h-3.5 w-3.5" /> Add Preferred Location
                    </button>
                    <button onClick={() => setModal('add-hq')} style={S.btnPrimary}>
                      <Plus className="h-3.5 w-3.5" /> Add HQ
                    </button>
                  </div>
                </div>

                {/* Table */}
                <Table>
                  <TableHeader>
                    <TableRow style={{ borderColor: '#E5E7EB' }}>
                      {['Type', 'Venue', 'Description', 'City', 'State', 'Geofence', 'Radius (mi)', ''].map((h, i) => (
                        <TableHead key={i} style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                          {h}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLocations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} style={{ textAlign: 'center', padding: 40, fontSize: 14, color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>
                          No locations found.
                        </TableCell>
                      </TableRow>
                    ) : filteredLocations.map(loc => (
                      <TableRow key={loc.id} className="hover:bg-gray-50 transition-colors" style={{ borderColor: '#F3F4F6' }}>
                        <TableCell style={S.cell}>
                          <span style={{
                            display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, fontFamily: 'Inter, sans-serif',
                            backgroundColor: loc.type === 'HQ' ? '#EFF6FF' : '#F0FDF4',
                            color: loc.type === 'HQ' ? '#1D4ED8' : '#15803D',
                          }}>
                            {loc.type}
                          </span>
                        </TableCell>
                        <TableCell style={{ ...S.cell, fontWeight: 500, maxWidth: 180 }}>
                          <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{loc.venue}</span>
                        </TableCell>
                        <TableCell style={{ ...S.cell, color: '#6B7280', maxWidth: 180 }}>
                          <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{loc.description}</span>
                        </TableCell>
                        <TableCell style={{ ...S.cell, color: '#6B7280', whiteSpace: 'nowrap' }}>{loc.city}</TableCell>
                        <TableCell style={{ ...S.cell, color: '#6B7280' }}>{loc.state}</TableCell>
                        <TableCell style={S.cell}>
                          <button
                            onClick={() => toggleGeofenceInTable(loc.id)}
                            style={{
                              width: 18, height: 18, borderRadius: 4, border: '2px solid',
                              borderColor: loc.geofence ? '#005B94' : '#D1D5DB',
                              backgroundColor: loc.geofence ? '#005B94' : '#fff',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              cursor: 'pointer', padding: 0, flexShrink: 0,
                            }}
                          >
                            {loc.geofence && <Check className="h-3 w-3" style={{ color: '#fff', strokeWidth: 3 }} />}
                          </button>
                        </TableCell>
                        <TableCell style={{ ...S.cell, color: '#6B7280' }}>
                          {loc.geofence && loc.radius ? loc.radius : ''}
                        </TableCell>
                        <TableCell style={{ ...S.cell, textAlign: 'right' }}>
                          <RowMenu items={[
                            { label: 'Edit', onClick: () => openEdit(loc) },
                            { label: 'Remove', danger: true, onClick: () => handleRemoveLocation(loc.id) },
                          ]} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ fontSize: 13, color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>
                    Showing {filteredLocations.length} of {locations.length} entries
                  </p>
                </div>
              </div>
            )}

            {/* ── Brands ───────────────────────────────────────────────── */}
            {activeTab === 'brands' && (
              <div>
                <div className="rounded-xl border border-gray-200 p-5">
                  <p style={{ fontSize: 13, color: '#6B7280', fontFamily: 'Inter, sans-serif', marginBottom: 14 }}>
                    Manage the coworking brands that are discoverable by your team members.
                  </p>

                  {/* Segmented control */}
                  <div style={{ display: 'inline-flex', borderRadius: 8, overflow: 'hidden', border: '1px solid #D1D5DB' }}>
                    {(['Open', 'Limited', 'None'] as BrandMode[]).map((mode, i) => (
                      <button
                        key={mode}
                        onClick={() => setBrandMode(mode)}
                        style={{
                          padding: '8px 20px', fontSize: 14, fontFamily: 'Inter, sans-serif', fontWeight: 500,
                          border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                          backgroundColor: brandMode === mode ? '#005B94' : '#fff',
                          color: brandMode === mode ? '#fff' : '#374151',
                          borderRight: i < 2 ? '1px solid #D1D5DB' : 'none',
                        }}
                      >
                        {mode === 'Open' && <Globe className="h-4 w-4" />}
                        {mode === 'Limited' && <LayoutGrid className="h-4 w-4" />}
                        {mode === 'None' && <Ban className="h-4 w-4" />}
                        {mode}
                      </button>
                    ))}
                  </div>

                  {/* Limited: brand checklist */}
                  {brandMode === 'Limited' && (
                    <div style={{ marginTop: 20 }}>
                      <div style={{ position: 'relative', marginBottom: 12, maxWidth: 280 }}>
                        <Search className="h-4 w-4" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
                        <input value={brandSearch} onChange={e => setBrandSearch(e.target.value)} placeholder="Search brands..." style={{ ...S.input, paddingLeft: 32, fontSize: 13 }} />
                      </div>

                      <Table>
                        <TableHeader>
                          <TableRow style={{ borderColor: '#E5E7EB' }}>
                            <TableHead style={{ width: 48 }}>
                              <button
                                onClick={toggleAllBrands}
                                style={{
                                  width: 18, height: 18, borderRadius: 4, border: '2px solid',
                                  borderColor: allBrandsChecked || someBrandsChecked ? '#005B94' : '#D1D5DB',
                                  backgroundColor: allBrandsChecked ? '#005B94' : '#fff',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  cursor: 'pointer', padding: 0,
                                }}
                              >
                                {allBrandsChecked && <Check className="h-3 w-3" style={{ color: '#fff', strokeWidth: 3 }} />}
                                {someBrandsChecked && <span style={{ width: 8, height: 2, backgroundColor: '#005B94', display: 'block' }} />}
                              </button>
                            </TableHead>
                            <TableHead style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Name</TableHead>
                            <TableHead style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.06em' }}># Locations</TableHead>
                            <TableHead />
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredBrands.map(brand => (
                            <TableRow key={brand.id} className="hover:bg-gray-50 transition-colors" style={{ borderColor: '#F3F4F6' }}>
                              <TableCell style={S.cell}>
                                <button
                                  onClick={() => setBrands(prev => prev.map(b => b.id === brand.id ? { ...b, enabled: !b.enabled } : b))}
                                  style={{
                                    width: 18, height: 18, borderRadius: 4, border: '2px solid',
                                    borderColor: brand.enabled ? '#005B94' : '#D1D5DB',
                                    backgroundColor: brand.enabled ? '#005B94' : '#fff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', padding: 0,
                                  }}
                                >
                                  {brand.enabled && <Check className="h-3 w-3" style={{ color: '#fff', strokeWidth: 3 }} />}
                                </button>
                              </TableCell>
                              <TableCell style={{ ...S.cell, fontWeight: 500 }}>{brand.name}</TableCell>
                              <TableCell style={{ ...S.cell, color: '#6B7280' }}>
                                {brand.locationCount === 1 ? '1 location' : `${brand.locationCount} locations`}
                              </TableCell>
                              <TableCell style={{ ...S.cell, textAlign: 'right' }}>
                                <RowMenu items={[{ label: 'Preview', onClick: () => toast.info(`Previewing ${brand.name}`) }]} />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <p style={{ fontSize: 13, color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>
                          Showing {filteredBrands.length} of {brands.length} entries
                        </p>
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
                    <button onClick={() => toast.success('Brand settings saved.')} style={{ ...S.btnPrimary, padding: '9px 22px', fontSize: 14, fontWeight: 600 }}>
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ── Edit Location modal ──────────────────────────────────────────── */}
      <Dialog open={modal === 'edit-location'} onOpenChange={open => { if (!open) setModal('none'); }}>
        <DialogContent className="max-w-lg p-0 overflow-hidden" style={{ borderRadius: 12 }}>
          <div style={{ backgroundColor: '#005B94', padding: '16px 20px' }}>
            <DialogHeader>
              <DialogTitle style={{ fontSize: 18, fontWeight: 600, color: '#fff', fontFamily: 'Inter, sans-serif' }}>
                Edit {editingLocation?.type === 'HQ' ? 'HQ' : 'Preferred Location'}
              </DialogTitle>
              <DialogDescription className="sr-only">Edit location details</DialogDescription>
            </DialogHeader>
          </div>
          <div style={{ padding: 24 }} className="space-y-4">
            <FormRow label="Name">
              <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} style={S.input} />
            </FormRow>
            <FormRow label="Venue">
              <input value={editForm.venue} onChange={e => setEditForm(f => ({ ...f, venue: e.target.value }))} style={S.input} />
            </FormRow>
            <div>
              <ToggleRow label="Geofence" checked={editForm.geofence} onChange={v => setEditForm(f => ({ ...f, geofence: v }))} />
            </div>
            {editForm.geofence && (
              <FormRow label="Radius (miles)">
                <input type="number" value={editForm.radius} onChange={e => setEditForm(f => ({ ...f, radius: e.target.value }))} style={S.input} />
              </FormRow>
            )}
            {editForm.geofence && (
              <FormRow label="Message">
                <input value={editForm.message} onChange={e => setEditForm(f => ({ ...f, message: e.target.value }))} style={S.input} />
              </FormRow>
            )}
            <div>
              <ToggleRow label="Custom CTA" checked={editForm.customCTA} onChange={v => setEditForm(f => ({ ...f, customCTA: v }))} />
            </div>
            {editForm.customCTA && (
              <>
                <FormRow label="CTA Text">
                  <input value={editForm.ctaText} onChange={e => setEditForm(f => ({ ...f, ctaText: e.target.value }))} style={S.input} />
                </FormRow>
                <FormRow label="CTA URL">
                  <input value={editForm.ctaUrl} onChange={e => setEditForm(f => ({ ...f, ctaUrl: e.target.value }))} style={S.input} />
                </FormRow>
              </>
            )}
            <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
              <button onClick={handleSaveEdit} style={{ ...S.btnPrimary, padding: '10px 22px', fontSize: 14, fontWeight: 600 }}>Save</button>
              <button onClick={() => setModal('none')} style={{ ...S.btnOutline, padding: '10px 20px', fontSize: 14 }}>Cancel</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Add Preferred Location modal ─────────────────────────────────── */}
      <Dialog open={modal === 'add-preferred'} onOpenChange={open => { if (!open) setModal('none'); }}>
        <DialogContent className="max-w-md p-0 overflow-hidden" style={{ borderRadius: 12 }}>
          <div style={{ backgroundColor: '#005B94', padding: '16px 20px' }}>
            <DialogHeader>
              <DialogTitle style={{ fontSize: 18, fontWeight: 600, color: '#fff', fontFamily: 'Inter, sans-serif' }}>Add Preferred Location</DialogTitle>
              <DialogDescription className="sr-only">Add a preferred location</DialogDescription>
            </DialogHeader>
          </div>
          <div style={{ padding: 24 }} className="space-y-4">
            <FormRow label="Name">
              <input value={addPrefForm.name} onChange={e => setAddPrefForm(f => ({ ...f, name: e.target.value }))} style={S.input} />
            </FormRow>
            <FormRow label="Venue Group">
              <input value={addPrefForm.venueGroup} onChange={e => setAddPrefForm(f => ({ ...f, venueGroup: e.target.value }))} style={S.input} />
            </FormRow>
            <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
              <button onClick={handleAddPreferred} disabled={!addPrefForm.name} style={{ ...S.btnPrimary, padding: '10px 22px', fontSize: 14, fontWeight: 600, opacity: !addPrefForm.name ? 0.5 : 1 }}>Save</button>
              <button onClick={() => setModal('none')} style={{ ...S.btnOutline, padding: '10px 20px', fontSize: 14 }}>Cancel</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Add HQ modal ──────────────────────────────────────────────────── */}
      <Dialog open={modal === 'add-hq'} onOpenChange={open => { if (!open) setModal('none'); }}>
        <DialogContent className="max-w-md p-0 overflow-hidden" style={{ borderRadius: 12 }}>
          <div style={{ backgroundColor: '#005B94', padding: '16px 20px' }}>
            <DialogHeader>
              <DialogTitle style={{ fontSize: 18, fontWeight: 600, color: '#fff', fontFamily: 'Inter, sans-serif' }}>Add HQ</DialogTitle>
              <DialogDescription className="sr-only">Add an HQ location</DialogDescription>
            </DialogHeader>
          </div>
          <div style={{ padding: 24 }} className="space-y-4">
            <FormRow label="Name">
              <input value={addHQForm.name} onChange={e => setAddHQForm(f => ({ ...f, name: e.target.value }))} style={S.input} />
            </FormRow>
            <FormRow label="Venue">
              <input value={addHQForm.venue} onChange={e => setAddHQForm(f => ({ ...f, venue: e.target.value }))} style={S.input} />
            </FormRow>
            <div>
              <ToggleRow label="Geofence" checked={addHQForm.geofence} onChange={v => setAddHQForm(f => ({ ...f, geofence: v }))} />
            </div>
            {addHQForm.geofence && (
              <>
                <FormRow label="Radius (miles)">
                  <input type="number" value={addHQForm.radius} onChange={e => setAddHQForm(f => ({ ...f, radius: e.target.value }))} placeholder="50" style={S.input} />
                </FormRow>
                <FormRow label="Message">
                  <input value={addHQForm.message} onChange={e => setAddHQForm(f => ({ ...f, message: e.target.value }))} style={S.input} />
                </FormRow>
              </>
            )}
            <div>
              <ToggleRow label="Custom CTA" checked={addHQForm.customCTA} onChange={v => setAddHQForm(f => ({ ...f, customCTA: v }))} />
            </div>
            {addHQForm.customCTA && (
              <>
                <FormRow label="CTA Text">
                  <input value={addHQForm.ctaText} onChange={e => setAddHQForm(f => ({ ...f, ctaText: e.target.value }))} style={S.input} />
                </FormRow>
                <FormRow label="CTA URL">
                  <input value={addHQForm.ctaUrl} onChange={e => setAddHQForm(f => ({ ...f, ctaUrl: e.target.value }))} style={S.input} />
                </FormRow>
              </>
            )}
            <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
              <button onClick={handleAddHQ} disabled={!addHQForm.name || !addHQForm.venue} style={{ ...S.btnPrimary, padding: '10px 22px', fontSize: 14, fontWeight: 600, opacity: !addHQForm.name || !addHQForm.venue ? 0.5 : 1 }}>Save</button>
              <button onClick={() => setModal('none')} style={{ ...S.btnOutline, padding: '10px 20px', fontSize: 14 }}>Cancel</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}

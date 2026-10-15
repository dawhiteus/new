import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  LayoutPanelLeft,
  TrendingUp,
  FileText,
  CheckCircle2,
  Zap,
  ChevronsUpDown,
  ArrowUp,
  ArrowUpDown,
  Folder,
  MapPin,
  DollarSign,
  Users,
  ArrowRight,
} from 'lucide-react';
import { CreateEditDealModal } from './CreateEditDealModal';
import { toast } from './ui/toast';
import { MVP_REQUIREMENTS, type MvpRequirement } from './data/mvpRequirements';

const FONT = 'Inter, sans-serif';
const NAVY = '#0B4F7F';

type SortKey = 'name' | 'company' | 'status' | 'stage' | 'budget' | 'collection' | 'lastUpdated';

const COLUMNS: { key: SortKey; label: string; width: string }[] = [
  { key: 'name', label: 'REQUIREMENT', width: '16%' },
  { key: 'company', label: 'COMPANY', width: '16%' },
  { key: 'status', label: 'STATUS', width: '14%' },
  { key: 'stage', label: 'STAGE', width: '14%' },
  { key: 'budget', label: 'BUDGET', width: '12%' },
  { key: 'collection', label: 'COLLECTION', width: '14%' },
  { key: 'lastUpdated', label: 'LAST UPDATED', width: '10%' },
];

const money = (n: number) => `$${n.toLocaleString('en-US')}`;
const fmtDate = (iso: string) => {
  const [y, m, d] = iso.split('-');
  return `${m}/${d}/${y}`;
};

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  Active: { bg: '#2E9D4A', color: '#fff' },
  Draft: { bg: '#9CA3AF', color: '#fff' },
  Executed: { bg: '#005B94', color: '#fff' },
  Archived: { bg: '#6B7280', color: '#fff' },
};

function Pill({ label, bg, color }: { label: string; bg: string; color: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 12px',
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 600,
        backgroundColor: bg,
        color,
      }}
    >
      {label}
    </span>
  );
}

function FilterButton({
  value,
  onChange,
  allLabel,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  allLabel: string;
  options: string[];
}) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          appearance: 'none',
          WebkitAppearance: 'none',
          fontFamily: FONT,
          fontSize: 14,
          color: '#0F2A3D',
          background: '#fff',
          border: '1.5px solid #0F2A3D',
          borderRadius: 4,
          padding: '8px 34px 8px 9px',
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        <option value="">{allLabel}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronsUpDown
        size={13}
        style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#0F2A3D' }}
      />
    </div>
  );
}

function RowMenu({ onAction }: { onAction: (a: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const item = (label: string) => (
    <button
      key={label}
      onClick={() => {
        setOpen(false);
        onAction(label);
      }}
      className="hover:bg-gray-200/70"
      style={{ display: 'block', width: '100%', textAlign: 'left', padding: '7px 24px 7px 16px', fontSize: 14, color: '#0F2A3D', fontFamily: FONT, background: 'transparent', border: 'none', cursor: 'pointer' }}
    >
      {label}
    </button>
  );

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        aria-label="Row actions"
        onClick={() => setOpen((o) => !o)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: 20, letterSpacing: 1, padding: '0 8px', lineHeight: 1 }}
      >
        •••
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: '100%',
            zIndex: 30,
            minWidth: 190,
            background: '#fff',
            borderRadius: 8,
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            padding: '6px 0',
          }}
        >
          {item('View Requirement')}
          {item('Remove Requirement')}
          <div style={{ height: 1, background: '#E5E7EB', margin: '4px 0' }} />
          {item('View collection')}
          {item('Update collection')}
          {item('Remove collection')}
        </div>
      )}
    </div>
  );
}

function CollectionPill({ req }: { req: MvpRequirement }) {
  const c = req.collection;
  const [show, setShow] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const row = (Icon: typeof MapPin, label: string, n: number) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 14, padding: '3px 0' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9CA3AF' }}>
        <Icon size={13} /> {label}
      </span>
      <span style={{ fontWeight: 700, color: '#0F2A3D' }}>{n} spaces</span>
    </div>
  );
  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => { clearTimeout(timer.current); setShow(true); }}
      onMouseLeave={() => { timer.current = setTimeout(() => setShow(false), 120); }}
    >
        <span
          style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 12px', borderRadius: 999, fontSize: 13, fontWeight: 600, background: '#E8F0FE', color: '#1D4ED8', border: '1px solid #D5E3FB', cursor: 'pointer' }}
        >
          <Folder size={13} /> {c.totalSpaces} spaces
        </span>
      {show && (
      <div style={{ position: 'absolute', left: '50%', bottom: '100%', transform: 'translateX(-50%)', paddingBottom: 6, zIndex: 40 }}>
      <div style={{ width: 240, padding: 0, fontFamily: FONT, background: '#fff', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.18)', border: '1px solid #E5E7EB' }}>
        <div style={{ padding: '12px 12px 10px' }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#0F2A3D' }}>{c.name}</div>
          <div style={{ fontSize: 13, color: '#6B7280' }}>{c.totalSpaces} spaces total</div>
        </div>
        <div style={{ borderTop: '1px solid #E5E7EB', padding: '8px 12px' }}>
          {row(MapPin, c.location, c.locationSpaces)}
          {row(DollarSign, c.budgetLabel, c.budgetSpaces)}
          {row(Users, c.peopleLabel, c.peopleSpaces)}
        </div>
        <div style={{ borderTop: '1px solid #E5E7EB', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <div style={{ padding: '8px 12px', borderRight: '1px solid #E5E7EB' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#0F2A3D' }}>{c.saved}</div>
            <div style={{ fontSize: 12, color: '#6B7280' }}>Saved</div>
          </div>
          <div style={{ padding: '8px 12px' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#0F2A3D' }}>{c.shortlisted}</div>
            <div style={{ fontSize: 12, color: '#6B7280' }}>Shortlisted</div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #E5E7EB', padding: '8px 12px 12px' }}>
          <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>Updated {c.updated}</div>
          <button
            onClick={() => toast.info('Collection view is not available in the demo yet.')}
            style={{ width: '100%', background: '#005B94', color: '#fff', border: 'none', borderRadius: 4, padding: '8px', fontSize: 14, fontWeight: 600, fontFamily: FONT, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            View Collection <ArrowRight size={14} />
          </button>
        </div>
      </div>
      </div>
      )}
    </div>
  );
}

export function RequirementsHome() {
  const [rows, setRows] = useState<MvpRequirement[]>(MVP_REQUIREMENTS);
  const [statusFilter, setStatusFilter] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 'name', dir: 'asc' });
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);

  const uniq = (f: (r: MvpRequirement) => string) => Array.from(new Set(rows.map(f)));

  const filtered = useMemo(() => {
    const out = rows.filter(
      (r) =>
        (!statusFilter || r.status === statusFilter) &&
        (!stageFilter || r.stage === stageFilter) &&
        (!cityFilter || r.city === cityFilter),
    );
    const val = (r: MvpRequirement): string | number =>
      sort.key === 'collection' ? r.collection.totalSpaces : (r as any)[sort.key];
    out.sort((a, b) => {
      const x = val(a), y = val(b);
      const c = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y));
      return sort.dir === 'asc' ? c : -c;
    });
    return out;
  }, [rows, statusFilter, stageFilter, cityFilter, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * pageSize;
  const visible = filtered.slice(start, start + pageSize);

  const active = rows.filter((r) => r.status === 'Active');
  const metrics = [
    { label: 'REQUIREMENT COSTS', value: money(active.reduce((s, r) => s + r.budget, 0)), sub: 'Total estimated value of active requirements', Icon: TrendingUp, bg: '#2E9D4A' },
    { label: 'ACTIVE REQUIREMENTS', value: String(active.length), sub: 'Number of requirements currently moving through workflow', Icon: FileText, bg: '#1DB5C4' },
    { label: 'COLLECTIONS CREATED', value: String(rows.length), sub: 'Total collections generated for requirements', Icon: CheckCircle2, bg: '#6D5BF0' },
    { label: 'AGENT TASKS COMPLETED', value: String(rows.reduce((s, r) => s + r.agentTasks, 0)), sub: 'Total tasks executed by agents', Icon: Zap, bg: '#0B4F7F' },
  ];

  const toggleSort = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }));

  const handleAction = (req: MvpRequirement, action: string) => {
    if (action === 'Remove Requirement') {
      setRows((rs) => rs.filter((r) => r.id !== req.id));
      toast.success(`Requirement "${req.name}" removed.`);
    } else if (action === 'Remove collection') {
      setRows((rs) =>
        rs.map((r) => (r.id === req.id ? { ...r, collection: { ...r.collection, totalSpaces: 0, saved: 0, shortlisted: 0 } } : r)),
      );
      toast.success(`Collection for "${req.name}" removed.`);
    } else {
      toast.info(`${action} is not available in the demo yet.`);
    }
  };

  const th: React.CSSProperties = {
    padding: '14px 16px',
    textAlign: 'left',
    fontSize: 12,
    fontWeight: 700,
    color: '#0F2A3D',
    letterSpacing: '0.04em',
    fontFamily: FONT,
    cursor: 'pointer',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  };
  const td: React.CSSProperties = { padding: '14px 16px', fontSize: 14, color: '#0F2A3D', fontFamily: FONT };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: FONT }}>
      {/* Banner */}
      <div style={{ backgroundColor: '#0D619B', height: 274, padding: '48px 32px 0' }}>
        <div className="max-w-7xl mx-auto">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <LayoutPanelLeft size={24} style={{ color: 'rgba(255,255,255,0.7)' }} />
            <h1 style={{ fontSize: 36, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px', lineHeight: 1.1 }}>Requirements</h1>
          </div>
          <p style={{ fontSize: 18, color: '#fff', marginTop: 6 }}>Manage your workspace requirements and track opportunities.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto" style={{ padding: '0 32px 48px', marginTop: -144 }}>
        {/* Stat cards */}
        <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
          {metrics.map((m) => (
            <div key={m.label} style={{ background: '#fff', borderRadius: 20, padding: '24px 24px 20px', boxShadow: '0 4px 14px rgba(0,0,0,0.12)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <m.Icon size={22} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: 13, color: '#6B7280', letterSpacing: '0.02em' }}>{m.label}</div>
                  <div style={{ fontSize: 26, fontWeight: 700, color: '#0F2A3D', lineHeight: 1.2 }}>{m.value}</div>
                </div>
              </div>
              <div style={{ fontSize: 12.5, color: '#6B7280', marginTop: 16, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Table card */}
        <div style={{ background: '#fff', borderRadius: 20, padding: 20, marginTop: 20, boxShadow: '0 4px 14px rgba(0,0,0,0.08)' }}>
          <div style={{ border: '1px solid #E5E7EB', borderRadius: 20, padding: '40px 20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 20, borderBottom: '1px solid #E5E7EB' }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <FilterButton value={statusFilter} onChange={(v) => { setStatusFilter(v); setPage(1); }} allLabel="All Statuses" options={uniq((r) => r.status)} />
                <FilterButton value={stageFilter} onChange={(v) => { setStageFilter(v); setPage(1); }} allLabel="All Stages" options={uniq((r) => r.stage)} />
                <FilterButton value={cityFilter} onChange={(v) => { setCityFilter(v); setPage(1); }} allLabel="All Cities" options={uniq((r) => r.city)} />
              </div>
              <button
                onClick={() => setCreateOpen(true)}
                style={{ background: NAVY, color: '#fff', border: 'none', borderRadius: 6, padding: '12px 17px', fontSize: 15, fontWeight: 600, fontFamily: FONT, cursor: 'pointer' }}
              >
                New Requirement
              </button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 24, tableLayout: 'fixed' }}>
              <thead>
                <tr style={{ background: '#F3F4F6' }}>
                  {COLUMNS.map((c) => (
                    <th key={c.key} style={{ ...th, width: c.width }} onClick={() => toggleSort(c.key)}>
                      {c.label}{' '}
                      {sort.key === c.key ? (
                        <ArrowUp size={12} style={{ display: 'inline', transform: sort.dir === 'desc' ? 'rotate(180deg)' : undefined }} />
                      ) : (
                        <ArrowUpDown size={12} style={{ display: 'inline', color: '#6B7280' }} />
                      )}
                    </th>
                  ))}
                  <th style={{ ...th, width: '4%', cursor: 'default' }} />
                </tr>
              </thead>
              <tbody>
                {visible.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ ...td, textAlign: 'center', color: '#9CA3AF', padding: 40 }}>
                      No requirements match your filters.
                    </td>
                  </tr>
                ) : (
                  visible.map((r, i) => (
                    <tr key={r.id} style={{ borderTop: '1px solid #E5E7EB', background: i % 2 ? '#F9FAFB' : '#fff' }}>
                      <td style={td}>{r.name}</td>
                      <td style={td}>{r.company}</td>
                      <td style={td}><Pill label={r.status} {...(({ bg, color }) => ({ bg, color }))(STATUS_STYLE[r.status])} /></td>
                      <td style={td}><Pill label={r.stage} bg="#E8A91C" color="#fff" /></td>
                      <td style={td}>{money(r.budget)}</td>
                      <td style={td}><CollectionPill req={r} /></td>
                      <td style={td}>{fmtDate(r.lastUpdated)}</td>
                      <td style={{ ...td, textAlign: 'right', padding: '14px 8px' }}>
                        <RowMenu onAction={(a) => handleAction(r, a)} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, fontSize: 15, color: '#9CA3AF' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span>Show</span>
                <div style={{ position: 'relative' }}>
                  <select
                    value={pageSize}
                    onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                    style={{ appearance: 'none', WebkitAppearance: 'none', fontFamily: FONT, fontSize: 14, color: '#0F2A3D', border: '1.5px solid #0F2A3D', borderRadius: 4, padding: '8px 30px 8px 9px', background: '#fff' }}
                  >
                    {[10, 25, 50].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <ChevronsUpDown size={13} style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#0F2A3D' }} />
                </div>
                <span>entries</span>
                <span>{filtered.length === 0 ? '0' : `${start + 1} - ${start + visible.length}`} of {filtered.length}</span>
              </div>
              <div style={{ display: 'flex', border: '1px solid #E5E7EB', borderRadius: 6, overflow: 'hidden' }}>
                <button onClick={() => setPage(Math.max(1, current - 1))} disabled={current === 1} style={{ padding: '10px 12px', background: '#fff', border: 'none', color: '#6B7280', fontFamily: FONT, fontSize: 15, cursor: current === 1 ? 'default' : 'pointer' }}>Previous</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setPage(p)} style={{ minWidth: 32, padding: '10px 8px', border: 'none', fontFamily: FONT, fontSize: 15, cursor: 'pointer', background: p === current ? '#0D619B' : '#fff', color: p === current ? '#fff' : '#0F2A3D' }}>{p}</button>
                ))}
                <button onClick={() => setPage(Math.min(totalPages, current + 1))} disabled={current === totalPages} style={{ padding: '10px 12px', background: '#fff', border: 'none', color: '#0F2A3D', fontFamily: FONT, fontSize: 15, cursor: current === totalPages ? 'default' : 'pointer' }}>Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreateEditDealModal isOpen={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}

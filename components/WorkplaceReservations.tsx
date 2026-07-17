import React, { useState, useRef, useEffect } from 'react';
import { PageHeader } from './PageHeader';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import {
  Calendar, ChevronDown, ChevronRight, MoreHorizontal, Search,
  Globe, LayoutGrid, Ban, Check, Trash2, Download,
} from 'lucide-react';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { toast } from './ui/toast';

// ─── Types ────────────────────────────────────────────────────────────────────

type ResTab = 'on-demand' | 'dedicated' | 'reports';
type MemberTab = 'profile' | 'permissions' | 'activity' | 'insights';
type AccessMode = 'Open' | 'Limited' | 'None';

interface OnDemandRes {
  id: string; date: string; member: string; team: string;
  location: string; venue: string; space: string; cost: string; status: string;
}
interface DedicatedRes {
  id: string; startDate: string; endDate: string; venue: string; workspace: string;
  booker: string; totalCost: string; setupFee: string; deposit: string;
  incidentals: string; paymentMethod: string; status: string;
}
interface Report {
  id: string; created: string; parameters: string; status: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const CHART_DATA = [
  { month: 'Jul 25', onDemandRes: 450, dedicatedRes: 0,   onDemandSpend: 38000, dedicatedSpend: 4000  },
  { month: 'Aug 25', onDemandRes: 462, dedicatedRes: 0,   onDemandSpend: 40000, dedicatedSpend: 4500  },
  { month: 'Sep 25', onDemandRes: 608, dedicatedRes: 10,  onDemandSpend: 49000, dedicatedSpend: 7000  },
  { month: 'Oct 25', onDemandRes: 572, dedicatedRes: 16,  onDemandSpend: 46000, dedicatedSpend: 9000  },
  { month: 'Nov 25', onDemandRes: 382, dedicatedRes: 22,  onDemandSpend: 31000, dedicatedSpend: 11000 },
  { month: 'Dec 25', onDemandRes: 418, dedicatedRes: 28,  onDemandSpend: 34000, dedicatedSpend: 14000 },
  { month: 'Jan 26', onDemandRes: 440, dedicatedRes: 82,  onDemandSpend: 36000, dedicatedSpend: 20000 },
  { month: 'Feb 26', onDemandRes: 476, dedicatedRes: 102, onDemandSpend: 39000, dedicatedSpend: 24000 },
  { month: 'Mar 26', onDemandRes: 456, dedicatedRes: 118, onDemandSpend: 37000, dedicatedSpend: 27000 },
  { month: 'Apr 26', onDemandRes: 368, dedicatedRes: 108, onDemandSpend: 29000, dedicatedSpend: 26000 },
  { month: 'May 26', onDemandRes: 418, dedicatedRes: 162, onDemandSpend: 34000, dedicatedSpend: 34000 },
  { month: 'Jun 26', onDemandRes: 374, dedicatedRes: 168, onDemandSpend: 30000, dedicatedSpend: 36000 },
  { month: 'Jul 26', onDemandRes: 278, dedicatedRes: 128, onDemandSpend: 21000, dedicatedSpend: 28000 },
].map(d => ({ ...d, totalSpend: d.onDemandSpend + d.dedicatedSpend }));

const ON_DEMAND: OnDemandRes[] = [
  { id:'1', date:'07/31/2026', member:'Jordan Meeker',    team:'Los Angeles Metro Area',      location:'Los Angeles, CA',  venue:'BLANKSPACES Venice',           space:'Desk',   cost:'$35',    status:'Future' },
  { id:'2', date:'07/31/2026', member:'Bo Yuan',          team:'Los Angeles Metro Area',      location:'El Segundo, CA',   venue:'CENTRL Office – South Bay',     space:'Office', cost:'$100',   status:'Future' },
  { id:'3', date:'07/31/2026', member:'Jose Alvarez',     team:'50+ Mile Members (Global)',   location:'San Diego, CA',    venue:'Regus | One Pacific Heights',   space:'Desk',   cost:'$25.88', status:'Future' },
  { id:'4', date:'07/30/2026', member:'Jose Alvarez',     team:'50+ Mile Members (Global)',   location:'San Diego, CA',    venue:'Regus | One Pacific Heights',   space:'Desk',   cost:'$25.88', status:'Future' },
  { id:'5', date:'07/29/2026', member:'Jose Alvarez',     team:'50+ Mile Members (Global)',   location:'San Diego, CA',    venue:'Regus | One Pacific Heights',   space:'Desk',   cost:'$25.88', status:'Future' },
  { id:'6', date:'07/27/2026', member:'Jose Alvarez',     team:'50+ Mile Members (Global)',   location:'San Diego, CA',    venue:'Regus | One Pacific Heights',   space:'Desk',   cost:'$34.50', status:'Future' },
  { id:'7', date:'07/27/2026', member:'Lorenzo Castillo', team:'50+ Mile Members (Global)',   location:'Boca Raton, FL',   venue:'Venture X | Boca Raton',        space:'Desk',   cost:'$69',    status:'Future' },
  { id:'8', date:'07/26/2026', member:'Maria Chen',       team:'Chicago Metro Area',          location:'Chicago, IL',      venue:'WeWork | 1 N Dearborn',         space:'Desk',   cost:'$45',    status:'Future' },
  { id:'9', date:'07/25/2026', member:'Tyler Brooks',     team:'New York Metro Area',         location:'New York, NY',     venue:'Industrious | Bryant Park',     space:'Office', cost:'$185',   status:'Future' },
  { id:'10',date:'07/24/2026', member:'Priya Singh',      team:'Los Angeles Metro Area',      location:'Culver City, CA',  venue:'BLANKSPACES | Playa Vista',     space:'Desk',   cost:'$35',    status:'Future' },
];

const DEDICATED: DedicatedRes[] = [
  { id:'1', startDate:'07/17/2026', endDate:'07/31/2026', venue:'Dayhouse Coworking Schaumburg', workspace:'Dedicated Desk | Schaumburg',  booker:'Andrez Aguayo',    totalCost:'$260',  setupFee:'$35', deposit:'$0', incidentals:'$0', paymentMethod:'Marketplace Account', status:'Active' },
  { id:'2', startDate:'07/01/2026', endDate:'07/31/2026', venue:"It's Just a Feeling",           workspace:'Coworking Membership',         booker:'Timothy Saputo',   totalCost:'$325',  setupFee:'$0',  deposit:'$0', incidentals:'$0', paymentMethod:'Marketplace Account', status:'Active' },
  { id:'3', startDate:'07/01/2026', endDate:'07/31/2026', venue:'Kiln – Salt Lake City',         workspace:'Resident Desk',               booker:'Stanley Yeo',      totalCost:'$535',  setupFee:'$0',  deposit:'$0', incidentals:'$0', paymentMethod:'Marketplace Account', status:'Active' },
  { id:'4', startDate:'07/01/2026', endDate:'07/31/2026', venue:"It's Just a Feeling",           workspace:'Coworking Membership',         booker:'Lauren Vigliotta', totalCost:'$325',  setupFee:'$0',  deposit:'$0', incidentals:'$0', paymentMethod:'Marketplace Account', status:'Active' },
  { id:'5', startDate:'07/01/2026', endDate:'07/31/2026', venue:"It's Just a Feeling",           workspace:'Coworking Membership',         booker:"Laura O'Quin",     totalCost:'$325',  setupFee:'$0',  deposit:'$0', incidentals:'$0', paymentMethod:'Marketplace Account', status:'Active' },
  { id:'6', startDate:'07/01/2026', endDate:'07/31/2026', venue:'CENTRL Office – Pearl District', workspace:'Small Office (2–4 people)',   booker:'Julia Herrington', totalCost:'$800',  setupFee:'$0',  deposit:'$0', incidentals:'$0', paymentMethod:'Marketplace Account', status:'Active' },
  { id:'7', startDate:'07/01/2026', endDate:'07/31/2026', venue:'Grays Crossing Golf Course',    workspace:'Coworking Desk',               booker:'Marcus Webb',      totalCost:'$475',  setupFee:'$0',  deposit:'$0', incidentals:'$0', paymentMethod:'Marketplace Account', status:'Active' },
];

const REPORTS: Report[] = [
  { id:'1', created:'07/09/2026', parameters:'Hourly, StartDate: 6/1/2026, EndDate: 6/30/2026, CSV',      status:'Completed (100%)' },
  { id:'2', created:'07/06/2026', parameters:'Hourly, StartDate: 6/1/2026, EndDate: 6/30/2026, CSV',      status:'Completed (100%)' },
  { id:'3', created:'07/02/2026', parameters:'Monthly, StartDate: 4/1/2023, EndDate: 6/30/2026, XLSX',    status:'Completed (100%)' },
  { id:'4', created:'07/02/2026', parameters:'Hourly, StartDate: 4/1/2023, EndDate: 6/30/2026, XLSX',     status:'Completed (100%)' },
  { id:'5', created:'06/30/2026', parameters:'Monthly, StartDate: 4/1/2026, EndDate: 6/30/2026, CSV',     status:'Completed (100%)' },
  { id:'6', created:'06/15/2026', parameters:'Hourly, StartDate: 5/1/2026, EndDate: 5/31/2026, CSV',      status:'Completed (100%)' },
];

const TEAMS = ['All Teams', 'Los Angeles Metro Area', '50+ Mile Members (Global)', 'Chicago Metro Area', 'New York Metro Area', 'Bay Area', 'Seattle Metro Area'];
const DATE_RANGES = ['July 1, 2026 – July 31, 2026', 'June 1, 2026 – June 30, 2026', 'Q2 2026 (Apr–Jun)', 'Last 12 months'];

// ─── Shared styles ────────────────────────────────────────────────────────────

const S = {
  input: { fontSize: 14, fontFamily: 'Inter, sans-serif', borderRadius: 8, border: '1px solid #D1D5DB', padding: '9px 12px', width: '100%', outline: 'none', color: '#374151', backgroundColor: '#fff' } as React.CSSProperties,
  select: { fontSize: 14, fontFamily: 'Inter, sans-serif', borderRadius: 8, border: '1px solid #D1D5DB', padding: '9px 12px', width: '100%', outline: 'none', color: '#374151', backgroundColor: '#fff', cursor: 'pointer' } as React.CSSProperties,
  label: { fontSize: 13, fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', display: 'block', marginBottom: 6 } as React.CSSProperties,
  cell: { paddingTop: 13, paddingBottom: 13, fontSize: 14, fontFamily: 'Inter, sans-serif', color: '#374151' } as React.CSSProperties,
  btnPrimary: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: 'none', backgroundColor: '#005B94', color: '#fff', fontSize: 13, fontWeight: 500, fontFamily: 'Inter, sans-serif', cursor: 'pointer' } as React.CSSProperties,
  btnOutline: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: '1px solid #D1D5DB', backgroundColor: '#fff', color: '#374151', fontSize: 13, fontWeight: 500, fontFamily: 'Inter, sans-serif', cursor: 'pointer' } as React.CSSProperties,
};

function pill(status: string) {
  const map: Record<string, { bg: string; color: string }> = {
    Future:    { bg: '#06B6D4', color: '#fff' },
    Active:    { bg: '#1E3A5F', color: '#fff' },
    Completed: { bg: '#16A34A', color: '#fff' },
    Cancelled: { bg: '#9CA3AF', color: '#fff' },
  };
  const s = map[status] ?? { bg: '#E5E7EB', color: '#374151' };
  return (
    <span style={{ display:'inline-block', padding:'3px 12px', borderRadius:20, fontSize:11, fontWeight:700, fontFamily:'Inter,sans-serif', backgroundColor:s.bg, color:s.color, letterSpacing:'0.02em' }}>
      {status}
    </span>
  );
}

// ─── RowMenu ─────────────────────────────────────────────────────────────────

function RowMenu({ items }: { items: { label: string; danger?: boolean; onClick: () => void }[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    if (open) document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);
  return (
    <div ref={ref} style={{ position:'relative', display:'inline-block' }}>
      <button onClick={() => setOpen(o => !o)} style={{ padding:'4px 6px', borderRadius:6, border:'none', backgroundColor:'transparent', cursor:'pointer', color:'#9CA3AF' }} className="hover:bg-gray-100">
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div style={{ position:'absolute', right:0, top:'100%', zIndex:50, backgroundColor:'#fff', border:'1px solid #E5E7EB', borderRadius:8, boxShadow:'0 4px 12px rgba(0,0,0,0.10)', minWidth:140, overflow:'hidden' }}>
          {items.map(item => (
            <button key={item.label} onClick={() => { setOpen(false); item.onClick(); }} style={{ display:'block', width:'100%', textAlign:'left', padding:'9px 14px', fontSize:13, fontFamily:'Inter,sans-serif', color:item.danger?'#EF4444':'#374151', background:'none', border:'none', cursor:'pointer' }} className={item.danger?'hover:bg-red-50':'hover:bg-gray-50'}>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── HeaderDropdown ───────────────────────────────────────────────────────────

function HeaderDropdown({ value, options, onChange, icon }: { value: string; options: string[]; onChange: (v: string) => void; icon?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    if (open) document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);
  return (
    <div ref={ref} style={{ position:'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:8, border:'1px solid rgba(255,255,255,0.5)', backgroundColor:'rgba(255,255,255,0.12)', color:'#fff', fontSize:13, fontFamily:'Inter,sans-serif', fontWeight:500, cursor:'pointer', backdropFilter:'blur(4px)' }}>
        {icon}{value}<ChevronDown className="h-3.5 w-3.5" style={{ opacity:0.8 }} />
      </button>
      {open && (
        <div style={{ position:'absolute', right:0, top:'calc(100% + 6px)', zIndex:100, backgroundColor:'#fff', border:'1px solid #E5E7EB', borderRadius:8, boxShadow:'0 8px 24px rgba(0,0,0,0.12)', minWidth:200, overflow:'hidden' }}>
          {options.map(o => (
            <button key={o} onClick={() => { onChange(o); setOpen(false); }} style={{ display:'block', width:'100%', textAlign:'left', padding:'10px 14px', fontSize:13, fontFamily:'Inter,sans-serif', color: o===value?'#005B94':'#374151', fontWeight: o===value?600:400, background:'none', border:'none', cursor:'pointer' }} className="hover:bg-gray-50">
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── DownloadSplitButton ──────────────────────────────────────────────────────

function DownloadSplitBtn() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    if (open) document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);
  return (
    <div ref={ref} style={{ position:'relative', display:'inline-flex', borderRadius:8, overflow:'hidden', border:'1px solid #D1D5DB' }}>
      <button onClick={() => toast.success('Downloading CSV…')} style={{ padding:'7px 14px', fontSize:13, fontFamily:'Inter,sans-serif', border:'none', background:'#fff', color:'#374151', cursor:'pointer', fontWeight:500 }}>
        Download CSV
      </button>
      <button onClick={() => setOpen(o => !o)} style={{ padding:'7px 10px', fontSize:13, border:'none', borderLeft:'1px solid #D1D5DB', background:'#fff', color:'#374151', cursor:'pointer' }}>
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
      {open && (
        <div style={{ position:'absolute', right:0, top:'calc(100% + 4px)', zIndex:50, backgroundColor:'#fff', border:'1px solid #E5E7EB', borderRadius:8, boxShadow:'0 4px 12px rgba(0,0,0,0.10)', minWidth:100, overflow:'hidden' }}>
          {['CSV','Excel'].map(fmt => (
            <button key={fmt} onClick={() => { toast.success(`Downloading ${fmt}…`); setOpen(false); }} style={{ display:'block', width:'100%', textAlign:'left', padding:'9px 14px', fontSize:13, fontFamily:'Inter,sans-serif', color:'#374151', background:'none', border:'none', cursor:'pointer' }} className="hover:bg-gray-50">
              {fmt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Toggle ──────────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
      style={{ width:44, height:24, borderRadius:12, flexShrink:0, backgroundColor:checked?'#005B94':'#D1D5DB', border:'none', cursor:'pointer', position:'relative', transition:'background-color 0.15s', display:'inline-flex', alignItems:'center' }}>
      <span style={{ position:'absolute', top:2, left:checked?22:2, width:20, height:20, borderRadius:10, backgroundColor:'#fff', transition:'left 0.15s', boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }} />
    </button>
  );
}

// ─── Chart tooltip ────────────────────────────────────────────────────────────

function ResChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const fmt = (v: number) => v >= 1000 ? `$${(v/1000).toFixed(0)}k` : `$${v}`;
  return (
    <div style={{ backgroundColor:'#fff', border:'1px solid #E5E7EB', borderRadius:8, padding:'10px 14px', boxShadow:'0 4px 12px rgba(0,0,0,0.1)', fontSize:12, fontFamily:'Inter,sans-serif' }}>
      <p style={{ fontWeight:700, marginBottom:6, color:'#374151' }}>{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ display:'flex', alignItems:'center', gap:6, marginBottom:2 }}>
          <span style={{ width:8, height:8, borderRadius:4, backgroundColor:p.color, display:'inline-block' }} />
          <span style={{ color:'#6B7280' }}>{p.name}: </span>
          <span style={{ fontWeight:600, color:'#374151' }}>
            {p.dataKey.includes('Spend') ? fmt(p.value) : p.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Member Profile Modal ─────────────────────────────────────────────────────

function MemberProfileModal({ name, onClose }: { name: string; onClose: () => void }) {
  const [tab, setTab] = useState<MemberTab>('profile');
  const [access, setAccess] = useState<AccessMode>('Limited');
  const [proOnly, setProOnly] = useState(true);
  const [payEnabled, setPayEnabled] = useState(true);
  const [hourlyExpanded, setHourlyExpanded] = useState(true);
  const [dedicatedExpanded, setDedicatedExpanded] = useState(true);
  const [enhancedExpanded, setEnhancedExpanded] = useState(false);

  const tabs: { id: MemberTab; label: string }[] = [
    { id:'profile', label:'Profile' },
    { id:'permissions', label:'Permissions' },
    { id:'activity', label:'Activity' },
    { id:'insights', label:'Insights' },
  ];

  const infoRows = [
    ['Name', 'Jordan Meeker'], ['Title', ''], ['Email', 'jordan.meeker@airbnb.com'],
    ['Phone', '+1 301-529-3269'], ['Location', ''], ['Account ID', ''], ['Cost Center', ''], ['Notes', ''],
  ];

  const events = [
    { date:'07/17/2025', text: <span>You favorited <a href="#" style={{color:'#005B94'}}>hot desk</a> and are now following <a href="#" style={{color:'#005B94'}}>moss</a></span> },
    { date:'07/17/2025', text: <span>You favorited <a href="#" style={{color:'#005B94'}}>WorkCafé</a> and are now following <a href="#" style={{color:'#005B94'}}>BLANKSPACES Venice</a></span> },
    { date:'07/17/2025', text: 'Active' },
    { date:'07/17/2025', text: 'Accepted' },
    { date:'07/14/2025', text: 'Proposed' },
    { date:'07/14/2025', text: 'Created' },
  ];

  const currentRes = [
    { date:'07/17/2026', time:'9:00 AM', status:'Future', space:'Desk for 1', venue:'BLANKSPACES Ve…', cost:'$35' },
    { date:'07/24/2026', time:'9:00 AM', status:'Future', space:'Desk for 1', venue:'BLANKSPACES Ve…', cost:'$35' },
    { date:'07/31/2026', time:'9:00 AM', status:'Future', space:'Desk for 1', venue:'BLANKSPACES Ve…', cost:'$35' },
  ];
  const pastRes = [
    { date:'07/18/2025', time:'9:00 AM', status:'Completed', space:'Desk for 1', venue:'BLANKSPACES Ve…', cost:'$35' },
  ];

  return (
    <div style={{ position:'fixed', inset:0, zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'rgba(0,0,0,0.45)' }} onClick={onClose}>
      <div style={{ width:840, maxHeight:'90vh', borderRadius:12, overflow:'hidden', display:'flex', flexDirection:'column', backgroundColor:'#fff' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ background:'linear-gradient(135deg,#004A7C,#005B94,#0071B8)', padding:'20px 24px', display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexShrink:0 }}>
          <div style={{ display:'flex', gap:16, alignItems:'center' }}>
            <div style={{ width:52, height:52, borderRadius:8, backgroundColor:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, color:'rgba(255,255,255,0.7)', fontFamily:'Inter,sans-serif' }}>No Image</div>
            <div>
              <h2 style={{ fontSize:20, fontWeight:700, color:'#fff', fontFamily:'Inter,sans-serif', margin:0 }}>{name}</h2>
              <span style={{ display:'inline-block', marginTop:4, padding:'3px 12px', borderRadius:20, backgroundColor:'#06B6D4', color:'#fff', fontSize:12, fontWeight:600, fontFamily:'Inter,sans-serif' }}>
                Los Angeles Metro Area
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.8)', cursor:'pointer', fontSize:20, lineHeight:1 }}>✕</button>
        </div>

        {/* Tab bar */}
        <div style={{ display:'flex', gap:2, padding:'0 24px', borderBottom:'1px solid #E5E7EB', flexShrink:0, backgroundColor:'#fff' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding:'12px 14px 10px', fontSize:14, fontFamily:'Inter,sans-serif', fontWeight:tab===t.id?600:400, color:tab===t.id?'#005B94':'#6B7280', background:'none', border:'none', cursor:'pointer', borderBottom:tab===t.id?'2px solid #005B94':'2px solid transparent', marginBottom:-1 }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div style={{ flex:1, overflowY:'auto', padding:24 }}>

          {/* ── Profile ── */}
          {tab === 'profile' && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              {/* Status card */}
              <div className="rounded-xl border border-gray-200 p-5">
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <span style={{ display:'inline-block', padding:'3px 12px', borderRadius:20, backgroundColor:'#DCFCE7', color:'#16A34A', fontSize:12, fontWeight:700, fontFamily:'Inter,sans-serif' }}>Active</span>
                  <button style={{ background:'none', border:'none', cursor:'pointer', color:'#9CA3AF' }}><MoreHorizontal className="h-4 w-4" /></button>
                </div>
                <ul style={{ listStyle:'disc', paddingLeft:18, marginTop:12, fontSize:14, fontFamily:'Inter,sans-serif', color:'#374151', lineHeight:2 }}>
                  <li>Created July 14, 2025</li>
                  <li>Joined July 17, 2025</li>
                  <li>Last Active 2 days ago</li>
                </ul>
              </div>

              {/* Budget card */}
              <div className="rounded-xl border border-gray-200 p-5">
                <p style={{ fontSize:14, fontWeight:600, color:'#374151', fontFamily:'Inter,sans-serif', marginBottom:2 }}>Spend this month</p>
                <p style={{ fontSize:13, color:'#6B7280', fontFamily:'Inter,sans-serif', marginBottom:12 }}>13% of budget</p>
                <a href="#" style={{ fontSize:13, color:'#005B94', fontFamily:'Inter,sans-serif', display:'block', marginBottom:8 }}>Manage</a>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <PieChart width={130} height={75}>
                    <Pie data={[{v:13},{v:87}]} cx={65} cy={70} startAngle={180} endAngle={0} innerRadius={48} outerRadius={62} dataKey="v" strokeWidth={0}>
                      <Cell fill="#22C55E" /><Cell fill="#E5E7EB" />
                    </Pie>
                  </PieChart>
                  <div style={{ textAlign:'center', marginLeft:-30, marginTop:20 }}>
                    <div style={{ fontSize:22, fontWeight:700, color:'#111827', fontFamily:'Inter,sans-serif' }}>$105</div>
                  </div>
                </div>
              </div>

              {/* Info card */}
              <div className="rounded-xl border border-gray-200 p-5" style={{ gridColumn:'1/-1' }}>
                <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:8 }}>
                  <button style={{ background:'none', border:'none', cursor:'pointer', color:'#9CA3AF' }}><MoreHorizontal className="h-4 w-4" /></button>
                </div>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <tbody>
                    {infoRows.map(([label, value]) => (
                      <tr key={label} style={{ borderBottom:'1px solid #F3F4F6' }}>
                        <td style={{ padding:'10px 0', fontSize:14, fontWeight:600, color:'#374151', fontFamily:'Inter,sans-serif', width:140 }}>{label}</td>
                        <td style={{ padding:'10px 0', fontSize:14, color:'#374151', fontFamily:'Inter,sans-serif' }}>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Permissions ── */}
          {tab === 'permissions' && (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {/* Team */}
              <div className="rounded-xl border border-gray-200 p-4" style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:14, fontFamily:'Inter,sans-serif', color:'#374151' }}>Los Angeles Metro Area</span>
                <button style={{ fontSize:13, color:'#005B94', fontFamily:'Inter,sans-serif', background:'none', border:'none', cursor:'pointer', fontWeight:600 }}>Edit</button>
              </div>

              {/* Access */}
              <div className="rounded-xl border border-gray-200 p-5">
                <p style={{ fontSize:14, fontWeight:600, color:'#374151', fontFamily:'Inter,sans-serif', marginBottom:12 }}>Access to Marketplace</p>
                <div style={{ display:'inline-flex', borderRadius:8, overflow:'hidden', border:'1px solid #D1D5DB', marginBottom:16 }}>
                  {(['Open','Limited','None'] as AccessMode[]).map((m,i) => (
                    <button key={m} onClick={() => setAccess(m)} style={{ padding:'8px 20px', fontSize:14, fontFamily:'Inter,sans-serif', fontWeight:500, border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:6, backgroundColor:access===m?'#005B94':'#fff', color:access===m?'#fff':'#374151', borderRight:i<2?'1px solid #D1D5DB':'none' }}>
                      {m==='Open'&&<Globe className="h-4 w-4"/>}{m==='Limited'&&<LayoutGrid className="h-4 w-4"/>}{m==='None'&&<Ban className="h-4 w-4"/>}{m}
                    </button>
                  ))}
                </div>
                {access==='Limited' && (
                  <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                    <p style={{ fontSize:13, fontWeight:600, color:'#374151', fontFamily:'Inter,sans-serif' }}>Search options</p>
                    <div style={{ display:'grid', gridTemplateColumns:'160px 1fr', gap:10, alignItems:'center' }}>
                      <span style={{ fontSize:14, fontWeight:500, fontFamily:'Inter,sans-serif', color:'#374151' }}>Booking Type</span>
                      <div style={{ padding:'9px 12px', borderRadius:8, border:'1px solid #D1D5DB', backgroundColor:'#F9FAFB', fontSize:14, fontFamily:'Inter,sans-serif', color:'#374151' }}>Hourly</div>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'160px 1fr', gap:10, alignItems:'center' }}>
                      <span style={{ fontSize:14, fontWeight:500, fontFamily:'Inter,sans-serif', color:'#374151' }}>Space Type</span>
                      <div style={{ padding:'9px 12px', borderRadius:8, border:'1px solid #D1D5DB', backgroundColor:'#F9FAFB', fontSize:14, fontFamily:'Inter,sans-serif', color:'#374151' }}>Meeting Space, Office, Desk</div>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'160px 1fr', gap:10, alignItems:'center' }}>
                      <span style={{ fontSize:14, fontWeight:500, fontFamily:'Inter,sans-serif', color:'#374151' }}>LiquidSpace PRO</span>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <Toggle checked={proOnly} onChange={setProOnly} />
                        <span style={{ fontSize:14, fontFamily:'Inter,sans-serif', color:'#374151' }}>Only LiquidSpace <strong>PRO</strong> workspaces are discoverable</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Budget */}
              <div className="rounded-xl border border-gray-200 p-5">
                <p style={{ fontSize:14, fontWeight:600, color:'#374151', fontFamily:'Inter,sans-serif', marginBottom:14 }}>Configure Budget</p>
                {[
                  { label:'Hourly/Daily Budget Limits', expanded:hourlyExpanded, toggle:setHourlyExpanded, rows:[['Member Limit (per day)','150'],['Member Limit (per month)','800']] },
                  { label:'Dedicated Budget Limits', expanded:dedicatedExpanded, toggle:setDedicatedExpanded, rows:[['Member Limit (per month)','800']] },
                  { label:'Enhanced Budget Limits', expanded:enhancedExpanded, toggle:setEnhancedExpanded, rows:[] },
                ].map(sec => (
                  <div key={sec.label} style={{ marginBottom:12 }}>
                    <button onClick={() => sec.toggle(!sec.expanded)} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', fontSize:14, fontFamily:'Inter,sans-serif', color:'#374151', fontWeight:500, marginBottom:8 }}>
                      {sec.expanded ? <ChevronDown className="h-4 w-4"/> : <ChevronRight className="h-4 w-4"/>}{sec.label}
                    </button>
                    {sec.expanded && sec.rows.map(([label, val]) => (
                      <div key={label} style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:12, alignItems:'center', marginBottom:10 }}>
                        <span style={{ fontSize:14, fontFamily:'Inter,sans-serif', color:'#374151' }}>{label}</span>
                        <div style={{ display:'flex', alignItems:'center', border:'1px solid #D1D5DB', borderRadius:8, overflow:'hidden' }}>
                          <span style={{ padding:'8px 10px', backgroundColor:'#F9FAFB', borderRight:'1px solid #D1D5DB', fontSize:14, color:'#6B7280' }}>$</span>
                          <input defaultValue={val} style={{ width:100, padding:'8px 10px', fontSize:14, fontFamily:'Inter,sans-serif', border:'none', outline:'none', color:'#374151' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
                <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:12, alignItems:'center', marginTop:8, marginBottom:16 }}>
                  <span style={{ fontSize:14, fontFamily:'Inter,sans-serif', color:'#374151' }}>Allow member to exceed budget limits</span>
                  <select defaultValue="inherit" style={{ padding:'8px 12px', borderRadius:8, border:'1px solid #D1D5DB', fontSize:13, fontFamily:'Inter,sans-serif', color:'#374151', cursor:'pointer', backgroundColor:'#fff', outline:'none' }}>
                    <option value="inherit">Inherit from team config (Disallow)</option>
                    <option value="allow">Allow</option>
                    <option value="disallow">Disallow</option>
                  </select>
                </div>
                <button onClick={() => toast.success('Budget settings saved.')} style={{ ...S.btnPrimary, padding:'9px 22px', fontSize:14 }}>Save</button>
              </div>

              {/* Payment */}
              <div className="rounded-xl border border-gray-200 p-5">
                <p style={{ fontSize:13, fontWeight:600, color:'#374151', fontFamily:'Inter,sans-serif', marginBottom:12 }}>Enable Payment Type</p>
                <Toggle checked={payEnabled} onChange={setPayEnabled} />
                <br /><button style={{ fontSize:13, color:'#005B94', fontFamily:'Inter,sans-serif', background:'none', border:'none', cursor:'pointer', marginTop:10 }}>Add Payment Method</button>
              </div>
            </div>
          )}

          {/* ── Activity ── */}
          {tab === 'activity' && (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {[
                { title:'Current Reservations', rows:currentRes },
                { title:'Past Reservations', rows:pastRes },
              ].map(section => (
                <div key={section.title} className="rounded-xl border border-gray-200 p-5">
                  <p style={{ fontSize:15, fontWeight:700, color:'#111827', fontFamily:'Inter,sans-serif', marginBottom:14 }}>{section.title}</p>
                  {section.rows.map((r, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:'1px solid #F3F4F6', fontSize:14, fontFamily:'Inter,sans-serif', color:'#374151' }}>
                      <span style={{ minWidth:80 }}>{r.date}</span>
                      <span style={{ minWidth:60, color:'#9CA3AF' }}>{r.time}</span>
                      {pill(r.status)}
                      <span style={{ minWidth:70 }}>{r.space}</span>
                      <span style={{ flex:1, color:'#6B7280' }}>{r.venue}</span>
                      <span style={{ fontWeight:600 }}>{r.cost}</span>
                      <RowMenu items={[
                        { label:'View Details', onClick: () => toast.info('Opening reservation details…') },
                        { label:'View Receipt', onClick: () => toast.info('Opening receipt…') },
                      ]} />
                    </div>
                  ))}
                  <button style={{ fontSize:13, color:'#005B94', fontFamily:'Inter,sans-serif', background:'none', border:'none', cursor:'pointer', marginTop:12 }}>See More</button>
                </div>
              ))}

              {/* Events timeline */}
              <div className="rounded-xl border border-gray-200 p-5">
                <p style={{ fontSize:15, fontWeight:700, color:'#111827', fontFamily:'Inter,sans-serif', marginBottom:14 }}>Events</p>
                {events.map((ev, i) => (
                  <div key={i} style={{ display:'flex', gap:12, alignItems:'flex-start', marginBottom:12 }}>
                    <span style={{ fontSize:12, color:'#9CA3AF', fontFamily:'Inter,sans-serif', minWidth:72, paddingTop:2 }}>{ev.date}</span>
                    <span style={{ width:8, height:8, borderRadius:4, backgroundColor:'#005B94', flexShrink:0, marginTop:5 }} />
                    <span style={{ fontSize:14, fontFamily:'Inter,sans-serif', color:'#374151' }}>{ev.text}</span>
                  </div>
                ))}
                <button style={{ fontSize:13, color:'#005B94', fontFamily:'Inter,sans-serif', background:'none', border:'none', cursor:'pointer', marginTop:4 }}>See More</button>
              </div>
            </div>
          )}

          {/* ── Insights ── */}
          {tab === 'insights' && (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
                {/* Reservations */}
                <div className="rounded-xl border border-gray-200 p-5" style={{ textAlign:'center' }}>
                  <p style={{ fontSize:13, color:'#6B7280', fontFamily:'Inter,sans-serif', marginBottom:8 }}>Reservations</p>
                  <div style={{ fontSize:14, color:'#005B94', margin:'8px 0' }}>📅</div>
                  <div style={{ fontSize:36, fontWeight:700, color:'#111827', fontFamily:'Inter,sans-serif' }}>4</div>
                  <p style={{ fontSize:12, color:'#6B7280', fontFamily:'Inter,sans-serif', marginTop:4 }}>4 active reservations, 5 total</p>
                </div>
                {/* Reviews */}
                <div className="rounded-xl border border-gray-200 p-5" style={{ textAlign:'center', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <p style={{ fontSize:14, color:'#9CA3AF', fontFamily:'Inter,sans-serif' }}>No Reviews</p>
                </div>
                {/* Total Spend */}
                <div className="rounded-xl border border-gray-200 p-5" style={{ textAlign:'center' }}>
                  <p style={{ fontSize:13, color:'#6B7280', fontFamily:'Inter,sans-serif', marginBottom:4 }}>Total Spend</p>
                  <div style={{ display:'flex', justifyContent:'center', alignItems:'center', position:'relative' }}>
                    <PieChart width={120} height={120}>
                      <Pie data={[{v:13},{v:87}]} cx={60} cy={60} startAngle={90} endAngle={-270} innerRadius={38} outerRadius={52} dataKey="v" strokeWidth={0}>
                        <Cell fill="#22C55E"/><Cell fill="#E5E7EB"/>
                      </Pie>
                    </PieChart>
                    <div style={{ position:'absolute', textAlign:'center' }}>
                      <div style={{ fontSize:11, color:'#6B7280', fontFamily:'Inter,sans-serif' }}>June</div>
                      <div style={{ fontSize:18, fontWeight:700, color:'#111827', fontFamily:'Inter,sans-serif' }}>$105</div>
                      <div style={{ fontSize:11, color:'#6B7280', fontFamily:'Inter,sans-serif' }}>13%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="rounded-xl border border-gray-200 p-5">
                <p style={{ fontSize:14, fontWeight:600, color:'#374151', fontFamily:'Inter,sans-serif', marginBottom:12 }}>Reservations in previous 12 months</p>
                <div style={{ borderRadius:8, overflow:'hidden', height:220 }}>
                  <iframe
                    title="member-activity-map"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=-118.6500%2C33.9000%2C-118.2000%2C34.1500&layer=mapnik&marker=33.9850%2C-118.4695"
                    style={{ width:'100%', height:'100%', border:'none' }}
                  />
                </div>
                <button style={{ fontSize:13, color:'#005B94', fontFamily:'Inter,sans-serif', background:'none', border:'none', cursor:'pointer', marginTop:10 }}>See More</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Reservation View Details Modal ──────────────────────────────────────────

function ReservationDetailsModal({ res, onClose }: { res: OnDemandRes; onClose: () => void }) {
  return (
    <div style={{ position:'fixed', inset:0, zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'rgba(0,0,0,0.45)' }} onClick={onClose}>
      <div style={{ width:860, maxHeight:'92vh', borderRadius:12, overflow:'hidden', display:'flex', flexDirection:'column', backgroundColor:'#fff' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ background:'linear-gradient(135deg,#004A7C,#005B94,#0071B8)', padding:'16px 24px', display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:44, height:44, borderRadius:6, backgroundColor:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:'rgba(255,255,255,0.7)', fontFamily:'Inter,sans-serif' }}>No Image</div>
              <div>
                <h2 style={{ fontSize:18, fontWeight:700, color:'#fff', fontFamily:'Inter,sans-serif', margin:0 }}>{res.member}</h2>
                <p style={{ fontSize:13, color:'rgba(255,255,255,0.85)', fontFamily:'Inter,sans-serif', margin:'2px 0 0' }}>{res.venue}</p>
              </div>
            </div>
            <div style={{ marginTop:8, display:'flex', alignItems:'center', gap:12 }}>
              <span style={{ fontSize:13, color:'rgba(255,255,255,0.85)', fontFamily:'Inter,sans-serif' }}>Fr, {res.date === '07/31/2026' ? 'Jul 31, 2026' : res.date} 9:00 am – 5:00 pm</span>
              {pill(res.status)}
            </div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.8)', cursor:'pointer', fontSize:20, lineHeight:1 }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ flex:1, overflowY:'auto', padding:24 }}>
          {/* Photo + Map */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
            <div style={{ borderRadius:10, overflow:'hidden', height:200 }}>
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&h=300&q=80"
                alt="Venue interior"
                style={{ width:'100%', height:'100%', objectFit:'cover' }}
              />
            </div>
            <div style={{ borderRadius:10, overflow:'hidden', height:200 }}>
              <iframe
                title="venue-map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-118.4795%2C33.9750%2C-118.4595%2C33.9950&layer=mapnik&marker=33.9850%2C-118.4695"
                style={{ width:'100%', height:'100%', border:'none' }}
              />
            </div>
          </div>

          {/* Info card */}
          <div className="rounded-xl border border-gray-200 p-5" style={{ marginBottom:16, position:'relative' }}>
            <button style={{ position:'absolute', top:14, right:14, background:'none', border:'none', cursor:'pointer', color:'#9CA3AF' }}><MoreHorizontal className="h-4 w-4" /></button>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <tbody>
                {[
                  ['Location', `WorkCafé at ${res.venue} – Desk for 1\n606 Venice Boulevard, Los Angeles, CA 90291`],
                  ['Date',     `Fr, Jul 31, 2026 from 9:00 am to 5:00 pm`],
                  ['Total Cost', res.cost],
                  ['Title', res.member],
                  ['Amenities', 'TV/Monitor, Whiteboard, WiFi, Accessibility, Bike Rack, Coffee/Tea, Filtered Water, Hosted Reception, Kitchen, On-site Restaurant, Pet Friendly'],
                  ['Venue Host', 'FrontDesk Venice –'],
                ].map(([label, value]) => (
                  <tr key={label} style={{ borderBottom:'1px solid #F3F4F6' }}>
                    <td style={{ padding:'10px 0', fontSize:14, fontWeight:600, color:'#374151', fontFamily:'Inter,sans-serif', width:130, verticalAlign:'top' }}>{label}</td>
                    <td style={{ padding:'10px 0', fontSize:14, color:'#374151', fontFamily:'Inter,sans-serif', whiteSpace:'pre-line' }}>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Payment card */}
          <div className="rounded-xl border border-gray-200 p-5" style={{ marginBottom:16 }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <tbody>
                {[
                  ['Sales Price', res.cost], ['Sales Tax', '$0'], ['Total', res.cost],
                  ['Amount paid', '$0'], ['Payment Method', 'Marketplace Account'],
                ].map(([label, value]) => (
                  <tr key={label} style={{ borderBottom:'1px solid #F3F4F6' }}>
                    <td style={{ padding:'10px 0', fontSize:14, fontWeight:600, color:'#374151', fontFamily:'Inter,sans-serif', width:160 }}>{label}</td>
                    <td style={{ padding:'10px 0', fontSize:14, color:'#374151', fontFamily:'Inter,sans-serif' }}>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Transaction table */}
          <div className="rounded-xl border border-gray-200" style={{ overflow:'hidden' }}>
            <Table>
              <TableHeader>
                <TableRow style={{ borderColor:'#E5E7EB' }}>
                  {['Date','Transaction Id','Payment','Amount','Status'].map(h => (
                    <TableHead key={h} style={{ fontSize:11, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'0.06em', fontFamily:'Inter,sans-serif' }}>{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5} style={{ textAlign:'center', padding:24, color:'#9CA3AF', fontSize:13, fontFamily:'Inter,sans-serif' }}>No transactions yet.</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface WorkplaceReservationsProps {
  onAIAssistantOpen?: () => void;
  isAIDrawerOpen?: boolean;
}

export function WorkplaceReservations({ onAIAssistantOpen = () => {}, isAIDrawerOpen = false }: WorkplaceReservationsProps) {
  const [activeTab, setActiveTab] = useState<ResTab>('on-demand');
  const [selectedTeam, setSelectedTeam] = useState('All Teams');
  const [selectedDate, setSelectedDate] = useState('July 1, 2026 – July 31, 2026');
  const [searchValue, setSearchValue] = useState('');
  const [viewDetailsRes, setViewDetailsRes] = useState<OnDemandRes | null>(null);
  const [memberName, setMemberName] = useState<string | null>(null);
  const [reports, setReports] = useState<Report[]>(REPORTS);

  const filteredOnDemand = ON_DEMAND.filter(r =>
    !searchValue ||
    r.member.toLowerCase().includes(searchValue.toLowerCase()) ||
    r.venue.toLowerCase().includes(searchValue.toLowerCase()) ||
    r.location.toLowerCase().includes(searchValue.toLowerCase())
  );
  const filteredDedicated = DEDICATED.filter(r =>
    !searchValue ||
    r.venue.toLowerCase().includes(searchValue.toLowerCase()) ||
    r.booker.toLowerCase().includes(searchValue.toLowerCase())
  );

  const CHART_LEGEND = [
    { label:'Total Spend',           color:'#10B981' },
    { label:'On-Demand Spend',       color:'#3B82F6' },
    { label:'Dedicated Spend',       color:'#F59E0B' },
    { label:'On-Demand Reservations',color:'#3B82F6' },
    { label:'Dedicated Reservations',color:'#F59E0B' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor:'var(--surface-page,#F9FAFB)' }}>
      <PageHeader
        icon={<Calendar className="h-7 w-7" />}
        title="Reservations"
        subtitle="Track and report on reservation activity across your teams."
        onAIAssistantOpen={onAIAssistantOpen}
        isAIDrawerOpen={isAIDrawerOpen}
        hideAIButton
      >
        <HeaderDropdown value={selectedTeam} options={TEAMS} onChange={setSelectedTeam} />
        <HeaderDropdown value={selectedDate} options={DATE_RANGES} onChange={setSelectedDate} icon={<Calendar className="h-3.5 w-3.5" style={{ marginRight:2 }} />} />
      </PageHeader>

      <div style={{ padding:'24px', maxWidth:1280, margin:'0 auto' }}>
        {/* Chart card */}
        <div className="rounded-2xl border border-gray-200 bg-white" style={{ padding:24, marginBottom:24 }}>
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={CHART_DATA} margin={{ top:8, right:60, left:0, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize:12, fontFamily:'Inter,sans-serif', fill:'#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize:12, fontFamily:'Inter,sans-serif', fill:'#9CA3AF' }} axisLine={false} tickLine={false} domain={[0,800]} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize:12, fontFamily:'Inter,sans-serif', fill:'#9CA3AF' }} axisLine={false} tickLine={false} domain={[0,80000]} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<ResChartTooltip />} />
              <Bar yAxisId="left" dataKey="onDemandRes"  name="On-Demand Reservations" stackId="a" fill="#3B82F6" radius={[0,0,0,0]} />
              <Bar yAxisId="left" dataKey="dedicatedRes" name="Dedicated Reservations" stackId="a" fill="#F59E0B" radius={[3,3,0,0]} />
              <Line yAxisId="right" type="monotone" dataKey="totalSpend"     name="Total Spend"       stroke="#10B981" strokeWidth={2} dot={{ r:4, fill:'#10B981', strokeWidth:0 }} activeDot={{ r:5 }} />
              <Line yAxisId="right" type="monotone" dataKey="onDemandSpend"  name="On-Demand Spend"   stroke="#3B82F6" strokeWidth={2} dot={{ r:4, fill:'#3B82F6', strokeWidth:0 }} activeDot={{ r:5 }} />
              <Line yAxisId="right" type="monotone" dataKey="dedicatedSpend" name="Dedicated Spend"   stroke="#F59E0B" strokeWidth={2} dot={{ r:4, fill:'#F59E0B', strokeWidth:0 }} activeDot={{ r:5 }} />
            </ComposedChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div style={{ display:'flex', gap:20, justifyContent:'center', marginTop:12, flexWrap:'wrap' }}>
            {CHART_LEGEND.map(l => (
              <div key={l.label} style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ width:10, height:10, borderRadius:5, backgroundColor:l.color, display:'inline-block' }} />
                <span style={{ fontSize:12, fontFamily:'Inter,sans-serif', color:'#6B7280' }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Table card */}
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
          {/* Tabs */}
          <div style={{ borderBottom:'1px solid #E5E7EB', padding:'0 20px', display:'flex', gap:2 }}>
            {(['on-demand','dedicated','reports'] as ResTab[]).map(tab => (
              <button key={tab} onClick={() => { setActiveTab(tab); setSearchValue(''); }} style={{ padding:'14px 16px 12px', fontSize:14, fontFamily:'Inter,sans-serif', fontWeight:activeTab===tab?600:400, color:activeTab===tab?'#005B94':'#6B7280', background:'none', border:'none', cursor:'pointer', whiteSpace:'nowrap', borderBottom:activeTab===tab?'2px solid #005B94':'2px solid transparent', marginBottom:-1, textTransform:'capitalize' }}>
                {tab === 'on-demand' ? 'On-Demand' : tab.charAt(0).toUpperCase()+tab.slice(1)}
              </button>
            ))}
          </div>

          <div style={{ padding:24 }}>
            {/* On-Demand */}
            {activeTab === 'on-demand' && (
              <>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', gap:10 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, fontFamily:'Inter,sans-serif', color:'#374151' }}>
                      Show
                      <select style={{ border:'1px solid #D1D5DB', borderRadius:6, padding:'5px 8px', fontSize:13, fontFamily:'Inter,sans-serif', color:'#374151', cursor:'pointer', outline:'none' }}>
                        <option>10</option><option>25</option><option>50</option>
                      </select>
                      entries
                    </div>
                    <div style={{ position:'relative' }}>
                      <Search className="h-3.5 w-3.5" style={{ position:'absolute', left:8, top:'50%', transform:'translateY(-50%)', color:'#9CA3AF', pointerEvents:'none' }} />
                      <input value={searchValue} onChange={e => setSearchValue(e.target.value)} placeholder="Search" style={{ ...S.input, paddingLeft:28, width:200, fontSize:13 }} />
                    </div>
                  </div>
                  <DownloadSplitBtn />
                </div>
                <Table>
                  <TableHeader>
                    <TableRow style={{ borderColor:'#E5E7EB' }}>
                      {['Date','Member','Team','Location','Venue','Space','Cost','Status',''].map((h,i) => (
                        <TableHead key={i} style={{ fontSize:11, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'0.06em', fontFamily:'Inter,sans-serif', whiteSpace:'nowrap' }}>{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOnDemand.map(r => (
                      <TableRow key={r.id} className="hover:bg-gray-50 transition-colors" style={{ borderColor:'#F3F4F6' }}>
                        <TableCell style={{ ...S.cell, whiteSpace:'nowrap' }}>{r.date}</TableCell>
                        <TableCell style={S.cell}>
                          <button onClick={() => setMemberName(r.member)} style={{ background:'none', border:'none', cursor:'pointer', color:'#005B94', fontSize:14, fontFamily:'Inter,sans-serif', fontWeight:500, padding:0, textAlign:'left' }}>
                            {r.member}
                          </button>
                        </TableCell>
                        <TableCell style={{ ...S.cell, color:'#6B7280', maxWidth:140 }}>
                          <span style={{ display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.team}</span>
                        </TableCell>
                        <TableCell style={{ ...S.cell, color:'#6B7280', whiteSpace:'nowrap' }}>{r.location}</TableCell>
                        <TableCell style={{ ...S.cell, maxWidth:160 }}>
                          <span style={{ display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.venue}</span>
                        </TableCell>
                        <TableCell style={S.cell}>{r.space}</TableCell>
                        <TableCell style={{ ...S.cell, fontWeight:600 }}>{r.cost}</TableCell>
                        <TableCell style={S.cell}>{pill(r.status)}</TableCell>
                        <TableCell style={{ ...S.cell, textAlign:'right' }}>
                          <RowMenu items={[
                            { label:'View Details',  onClick: () => setViewDetailsRes(r) },
                            { label:'View Receipt',  onClick: () => toast.info('Opens in product.') },
                            { label:'View Summary',  onClick: () => toast.info('Opens in product.') },
                            { label:'Cancel',        danger:true, onClick: () => toast.info('Cancel reservation?') },
                          ]} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {/* Summary footer */}
                <div style={{ borderTop:'2px solid #E5E7EB', marginTop:8, paddingTop:12, display:'flex', gap:24, flexWrap:'wrap', fontSize:13, fontFamily:'Inter,sans-serif', fontWeight:600, color:'#374151' }}>
                  <span>351 Reservations</span><span>162 Bookers</span><span>7 Teams</span><span>80 Cities</span><span>139 Venues</span><span>$29,589.25 Spend</span>
                </div>
                <div style={{ marginTop:12, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <p style={{ fontSize:13, color:'#9CA3AF', fontFamily:'Inter,sans-serif' }}>Showing 1 to 10 of 351 entries</p>
                  <div style={{ display:'flex', gap:4 }}>
                    {['Previous','1','2','3','4','…','36','Next'].map((p,i) => (
                      <button key={i} style={{ padding:'5px 10px', borderRadius:6, border:'1px solid #E5E7EB', backgroundColor:p==='1'?'#005B94':'#fff', color:p==='1'?'#fff':'#374151', fontSize:13, fontFamily:'Inter,sans-serif', cursor:'pointer' }}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Dedicated */}
            {activeTab === 'dedicated' && (
              <>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', gap:10 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, fontFamily:'Inter,sans-serif', color:'#374151' }}>
                      Show
                      <select style={{ border:'1px solid #D1D5DB', borderRadius:6, padding:'5px 8px', fontSize:13, fontFamily:'Inter,sans-serif', color:'#374151', cursor:'pointer', outline:'none' }}>
                        <option>10</option><option>25</option><option>50</option>
                      </select>
                      entries
                    </div>
                    <div style={{ position:'relative' }}>
                      <Search className="h-3.5 w-3.5" style={{ position:'absolute', left:8, top:'50%', transform:'translateY(-50%)', color:'#9CA3AF', pointerEvents:'none' }} />
                      <input value={searchValue} onChange={e => setSearchValue(e.target.value)} placeholder="Search" style={{ ...S.input, paddingLeft:28, width:200, fontSize:13 }} />
                    </div>
                  </div>
                  <DownloadSplitBtn />
                </div>
                <div style={{ overflowX:'auto' }}>
                  <Table>
                    <TableHeader>
                      <TableRow style={{ borderColor:'#E5E7EB' }}>
                        {['Start Date','End Date','Venue','Workspace','Booker','Total Cost','Setup Fee','Deposit','Incidentals','Payment Method','Status',''].map((h,i) => (
                          <TableHead key={i} style={{ fontSize:11, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'0.06em', fontFamily:'Inter,sans-serif', whiteSpace:'nowrap' }}>{h}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDedicated.map(r => (
                        <TableRow key={r.id} className="hover:bg-gray-50 transition-colors" style={{ borderColor:'#F3F4F6' }}>
                          <TableCell style={{ ...S.cell, whiteSpace:'nowrap' }}>{r.startDate}</TableCell>
                          <TableCell style={{ ...S.cell, whiteSpace:'nowrap' }}>{r.endDate}</TableCell>
                          <TableCell style={{ ...S.cell, maxWidth:140 }}>
                            <span style={{ display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.venue}</span>
                          </TableCell>
                          <TableCell style={{ ...S.cell, maxWidth:140 }}>
                            <span style={{ display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.workspace}</span>
                          </TableCell>
                          <TableCell style={{ ...S.cell, whiteSpace:'nowrap' }}>{r.booker}</TableCell>
                          <TableCell style={{ ...S.cell, fontWeight:600 }}>{r.totalCost}</TableCell>
                          <TableCell style={S.cell}>{r.setupFee}</TableCell>
                          <TableCell style={S.cell}>{r.deposit}</TableCell>
                          <TableCell style={S.cell}>{r.incidentals}</TableCell>
                          <TableCell style={{ ...S.cell, whiteSpace:'nowrap' }}>{r.paymentMethod}</TableCell>
                          <TableCell style={S.cell}>{pill(r.status)}</TableCell>
                          <TableCell style={{ ...S.cell, textAlign:'right' }}>
                            <RowMenu items={[
                              { label:'View Details',  onClick: () => toast.info('Opens in product.') },
                              { label:'View Receipt',  onClick: () => toast.info('Opens in product.') },
                              { label:'View Summary',  onClick: () => toast.info('Opens in product.') },
                            ]} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div style={{ marginTop:12, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <p style={{ fontSize:13, color:'#9CA3AF', fontFamily:'Inter,sans-serif' }}>Showing 1 to 7 of 7 entries</p>
                </div>
              </>
            )}

            {/* Reports */}
            {activeTab === 'reports' && (
              <>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', gap:10 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, fontFamily:'Inter,sans-serif', color:'#374151' }}>
                      Show
                      <select style={{ border:'1px solid #D1D5DB', borderRadius:6, padding:'5px 8px', fontSize:13, fontFamily:'Inter,sans-serif', color:'#374151', cursor:'pointer', outline:'none' }}>
                        <option>10</option><option>25</option><option>50</option>
                      </select>
                      entries
                    </div>
                  </div>
                  <div style={{ position:'relative' }}>
                    <Search className="h-3.5 w-3.5" style={{ position:'absolute', left:8, top:'50%', transform:'translateY(-50%)', color:'#9CA3AF', pointerEvents:'none' }} />
                    <input value={searchValue} onChange={e => setSearchValue(e.target.value)} placeholder="Search" style={{ ...S.input, paddingLeft:28, width:200, fontSize:13 }} />
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow style={{ borderColor:'#E5E7EB' }}>
                      {['Created','Parameters','Status',''].map((h,i) => (
                        <TableHead key={i} style={{ fontSize:11, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'0.06em', fontFamily:'Inter,sans-serif' }}>{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map(r => (
                      <TableRow key={r.id} className="hover:bg-gray-50 transition-colors" style={{ borderColor:'#F3F4F6' }}>
                        <TableCell style={{ ...S.cell, whiteSpace:'nowrap' }}>{r.created}</TableCell>
                        <TableCell style={{ ...S.cell, color:'#6B7280' }}>{r.parameters}</TableCell>
                        <TableCell style={S.cell}>{r.status}</TableCell>
                        <TableCell style={{ ...S.cell, textAlign:'right' }}>
                          <div style={{ display:'inline-flex', gap:8 }}>
                            <button onClick={() => setReports(prev => prev.filter(x => x.id !== r.id))} style={{ ...S.btnOutline, padding:'5px 12px', fontSize:12, color:'#EF4444', borderColor:'#FCA5A5' }}>Delete</button>
                            <button onClick={() => toast.success('Downloading report…')} style={{ ...S.btnPrimary, padding:'5px 12px', fontSize:12 }}>Download</button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div style={{ marginTop:12 }}>
                  <p style={{ fontSize:13, color:'#9CA3AF', fontFamily:'Inter,sans-serif' }}>Showing 1 to {reports.length} of {reports.length} entries</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {viewDetailsRes && <ReservationDetailsModal res={viewDetailsRes} onClose={() => setViewDetailsRes(null)} />}
      {memberName && <MemberProfileModal name={memberName} onClose={() => setMemberName(null)} />}
    </div>
  );
}

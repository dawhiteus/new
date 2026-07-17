import React, { useState, useRef, useEffect } from 'react';
import { PageHeader } from './PageHeader';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Activity, Calendar, ChevronDown, MoreHorizontal, Search } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { toast } from './ui/toast';

// ─── Mock data ────────────────────────────────────────────────────────────────

const CHART_DATA = [
  { month: 'Jul 25', searches: 2850 },
  { month: 'Aug 25', searches: 3150 },
  { month: 'Sep 25', searches: 5050 },
  { month: 'Oct 25', searches: 3200 },
  { month: 'Nov 25', searches: 3100 },
  { month: 'Dec 25', searches: 3500 },
  { month: 'Jan 26', searches: 3650 },
  { month: 'Feb 26', searches: 3750 },
  { month: 'Mar 26', searches: 3450 },
  { month: 'Apr 26', searches: 3300 },
  { month: 'May 26', searches: 2950 },
  { month: 'Jun 26', searches: 4100 },
  { month: 'Jul 26', searches: 1800 },
];

const SEARCHES = [
  { id:'1',  date:'07/01/2026', member:'Christina Silveira', team:'Los Angeles Metro Area',     search:'Los Angeles, CA',      type:'Hourly', capacity:'', spaceType:'Space', results:1617 },
  { id:'2',  date:'07/01/2026', member:'Britte McBride',     team:'50+ Mile Members (Global)',  search:'Lynnfield, MA 01940',  type:'Hourly', capacity:'', spaceType:'Space', results:683  },
  { id:'3',  date:'07/01/2026', member:'Britte McBride',     team:'50+ Mile Members (Global)',  search:'Lynnfield, MA 01940',  type:'Hourly', capacity:'', spaceType:'Space', results:674  },
  { id:'4',  date:'07/01/2026', member:'Britte McBride',     team:'50+ Mile Members (Global)',  search:'Lynnfield, MA 01940',  type:'Hourly', capacity:'', spaceType:'Space', results:683  },
  { id:'5',  date:'07/01/2026', member:'Britte McBride',     team:'50+ Mile Members (Global)',  search:'Lynnfield, MA 01940',  type:'Hourly', capacity:'', spaceType:'Space', results:674  },
  { id:'6',  date:'07/01/2026', member:'Britte McBride',     team:'50+ Mile Members (Global)',  search:'Boston, MA USA',       type:'Hourly', capacity:'', spaceType:'Space', results:729  },
  { id:'7',  date:'07/01/2026', member:'Dan Wu',             team:'Los Angeles Metro Area',     search:'Los Angeles, CA',      type:'Hourly', capacity:'', spaceType:'Space', results:1617 },
  { id:'8',  date:'07/01/2026', member:'Priya Singh',        team:'Los Angeles Metro Area',     search:'Santa Monica, CA',     type:'Hourly', capacity:'', spaceType:'Space', results:342  },
  { id:'9',  date:'07/01/2026', member:'Tyler Brooks',       team:'New York Metro Area',        search:'New York, NY',         type:'Hourly', capacity:'', spaceType:'Space', results:2104 },
  { id:'10', date:'07/01/2026', member:'Maria Chen',         team:'Chicago Metro Area',         search:'Chicago, IL',          type:'Hourly', capacity:'', spaceType:'Space', results:887  },
];

const TEAMS = ['All Teams', 'Los Angeles Metro Area', '50+ Mile Members (Global)', 'Chicago Metro Area', 'New York Metro Area', 'Bay Area', 'Seattle Metro Area'];
const DATE_RANGES = ['July 1, 2026 – July 31, 2026', 'June 1, 2026 – June 30, 2026', 'Q2 2026 (Apr–Jun)', 'Last 12 months'];

// ─── Shared styles ────────────────────────────────────────────────────────────

const S = {
  input: { fontSize: 14, fontFamily: 'Inter, sans-serif', borderRadius: 8, border: '1px solid #D1D5DB', padding: '9px 12px', width: '100%', outline: 'none', color: '#374151', backgroundColor: '#fff' } as React.CSSProperties,
  cell: { paddingTop: 13, paddingBottom: 13, fontSize: 14, fontFamily: 'Inter, sans-serif', color: '#374151' } as React.CSSProperties,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

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
      <button onClick={() => setOpen(o => !o)} style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:8, border:'1px solid rgba(255,255,255,0.5)', backgroundColor:'rgba(255,255,255,0.12)', color:'#fff', fontSize:13, fontFamily:'Inter,sans-serif', fontWeight:500, cursor:'pointer' }}>
        {icon}{value}<ChevronDown className="h-3.5 w-3.5" style={{ opacity:0.8 }} />
      </button>
      {open && (
        <div style={{ position:'absolute', right:0, top:'calc(100% + 6px)', zIndex:100, backgroundColor:'#fff', border:'1px solid #E5E7EB', borderRadius:8, boxShadow:'0 8px 24px rgba(0,0,0,0.12)', minWidth:200, overflow:'hidden' }}>
          {options.map(o => (
            <button key={o} onClick={() => { onChange(o); setOpen(false); }} style={{ display:'block', width:'100%', textAlign:'left', padding:'10px 14px', fontSize:13, fontFamily:'Inter,sans-serif', color:o===value?'#005B94':'#374151', fontWeight:o===value?600:400, background:'none', border:'none', cursor:'pointer' }} className="hover:bg-gray-50">
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function RowMenu({ items }: { items: { label: string; onClick: () => void }[] }) {
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
        <div style={{ position:'absolute', right:0, top:'100%', zIndex:50, backgroundColor:'#fff', border:'1px solid #E5E7EB', borderRadius:8, boxShadow:'0 4px 12px rgba(0,0,0,0.10)', minWidth:120, overflow:'hidden' }}>
          {items.map(item => (
            <button key={item.label} onClick={() => { setOpen(false); item.onClick(); }} style={{ display:'block', width:'100%', textAlign:'left', padding:'9px 14px', fontSize:13, fontFamily:'Inter,sans-serif', color:'#374151', background:'none', border:'none', cursor:'pointer' }} className="hover:bg-gray-50">
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

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
      <button onClick={() => toast.success('Downloading CSV…')} style={{ padding:'7px 14px', fontSize:13, fontFamily:'Inter,sans-serif', border:'none', background:'#fff', color:'#374151', cursor:'pointer', fontWeight:500 }}>Download CSV</button>
      <button onClick={() => setOpen(o => !o)} style={{ padding:'7px 10px', fontSize:13, border:'none', borderLeft:'1px solid #D1D5DB', background:'#fff', color:'#374151', cursor:'pointer' }}>
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
      {open && (
        <div style={{ position:'absolute', right:0, top:'calc(100% + 4px)', zIndex:50, backgroundColor:'#fff', border:'1px solid #E5E7EB', borderRadius:8, boxShadow:'0 4px 12px rgba(0,0,0,0.10)', minWidth:100, overflow:'hidden' }}>
          {['CSV','Excel'].map(fmt => (
            <button key={fmt} onClick={() => { toast.success(`Downloading ${fmt}…`); setOpen(false); }} style={{ display:'block', width:'100%', textAlign:'left', padding:'9px 14px', fontSize:13, fontFamily:'Inter,sans-serif', color:'#374151', background:'none', border:'none', cursor:'pointer' }} className="hover:bg-gray-50">{fmt}</button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Search Details Modal ─────────────────────────────────────────────────────

function SearchDetailsModal({ row, onClose }: { row: typeof SEARCHES[0]; onClose: () => void }) {
  const results = [
    'Alfi Trade Inc. (Los Angeles, CA)',
    'Alfi Trade Inc. (Los Angeles, CA)',
    'Union Cowork Los Angeles – Downtown/Arts District (Los Angeles, CA)',
    'CENTRL Office – Downtown Los Angeles (Los Angeles, CA)',
    'Union Cowork Los Angeles – Downtown/Arts District (Los Angeles, CA)',
    'The Collection-Monthly Private Offices & Event Location (Los Angeles, CA)',
    'moss (Los Angeles, CA)',
    'Studious Coworking Space (Los Angeles, CA)',
    'Wildfire 1881 Premium Flex Space & Coworking Solutions (Los Angeles, CA)',
  ];
  return (
    <div style={{ position:'fixed', inset:0, zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'rgba(0,0,0,0.45)' }} onClick={onClose}>
      <div style={{ width:740, maxHeight:'90vh', borderRadius:12, overflow:'hidden', display:'flex', flexDirection:'column', backgroundColor:'#fff' }} onClick={e => e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'18px 24px', borderBottom:'1px solid #E5E7EB', flexShrink:0 }}>
          <h2 style={{ fontSize:18, fontWeight:700, color:'#111827', fontFamily:'Inter,sans-serif', margin:0 }}>Search details</h2>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'#9CA3AF', cursor:'pointer', fontSize:20, lineHeight:1 }}>✕</button>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:24, display:'flex', flexDirection:'column', gap:16 }}>
          {/* Member info */}
          <div className="rounded-xl border border-gray-200 p-5">
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <tbody>
                {[
                  ['Date',         `Wed, ${row.date === '07/01/2026' ? 'Jul 1, 2026' : row.date} 5:49 PM`],
                  ['Member Email', `${row.member.toLowerCase().replace(' ','.')}.ext@teltech.com`],
                  ['Member Name',  row.member],
                  ['Team',         row.team],
                ].map(([label, value]) => (
                  <tr key={label} style={{ borderBottom:'1px solid #F3F4F6' }}>
                    <td style={{ padding:'10px 0', fontSize:14, fontWeight:600, color:'#374151', fontFamily:'Inter,sans-serif', width:140 }}>{label}</td>
                    <td style={{ padding:'10px 0', fontSize:14, color:'#374151', fontFamily:'Inter,sans-serif' }}>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Filter */}
          <div className="rounded-xl border border-gray-200 p-5">
            <p style={{ fontSize:16, fontWeight:700, color:'#111827', fontFamily:'Inter,sans-serif', marginBottom:14 }}>Filter</p>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <tbody>
                <tr style={{ borderBottom:'1px solid #F3F4F6' }}>
                  <td style={{ padding:'10px 0', fontSize:14, fontWeight:600, color:'#374151', fontFamily:'Inter,sans-serif', width:140, verticalAlign:'top' }}>Search string*</td>
                  <td style={{ padding:'10px 0', fontSize:14, color:'#374151', fontFamily:'Inter,sans-serif' }}>
                    {row.search}
                    <div style={{ fontSize:12, color:'#9CA3AF', marginTop:4, fontStyle:'italic' }}>*Search string not stored for client-side geocoded requests. In this case we're guessing it using reverse geocoding</div>
                  </td>
                </tr>
                {[['Type', row.type], ['Space type', row.spaceType]].map(([label, value]) => (
                  <tr key={label} style={{ borderBottom:'1px solid #F3F4F6' }}>
                    <td style={{ padding:'10px 0', fontSize:14, fontWeight:600, color:'#374151', fontFamily:'Inter,sans-serif', width:140 }}>{label}</td>
                    <td style={{ padding:'10px 0', fontSize:14, color:'#374151', fontFamily:'Inter,sans-serif' }}>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ borderTop:'1px solid #E5E7EB', marginTop:12, paddingTop:12 }}>
              {[['Distance','41667'],['Specificity','City'],['Duration','an hour']].map(([label, value]) => (
                <div key={label} style={{ display:'grid', gridTemplateColumns:'140px 1fr', marginBottom:8 }}>
                  <span style={{ fontSize:14, fontStyle:'italic', color:'#6B7280', fontFamily:'Inter,sans-serif' }}>{label}</span>
                  <span style={{ fontSize:14, fontStyle:'italic', color:'#6B7280', fontFamily:'Inter,sans-serif' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="rounded-xl border border-gray-200 p-5">
            <p style={{ fontSize:16, fontWeight:700, color:'#111827', fontFamily:'Inter,sans-serif', marginBottom:12 }}>Results ({row.results.toLocaleString()})</p>
            <p style={{ fontSize:13, color:'#6B7280', fontFamily:'Inter,sans-serif', marginBottom:8 }}>First page</p>
            <ol style={{ paddingLeft:20, margin:0 }}>
              {results.map((r, i) => (
                <li key={i} style={{ fontSize:13, fontFamily:'Inter,sans-serif', color:'#005B94', marginBottom:4 }}>{r}</li>
              ))}
            </ol>
          </div>

          {/* Insights */}
          <div className="rounded-xl border border-gray-200 p-5">
            <p style={{ fontSize:16, fontWeight:700, fontStyle:'italic', color:'#111827', fontFamily:'Inter,sans-serif', marginBottom:14 }}>Insights</p>
            {[
              ['IP',          '172.56.127.238'],
              ['Search from', '(34.113; −118.1888)'],
              ['Device',      'Api'],
              ['UA',          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36'],
              ['SourceType',  'SavedSearch'],
            ].map(([label, value]) => (
              <div key={label} style={{ display:'grid', gridTemplateColumns:'120px 1fr', marginBottom:10 }}>
                <span style={{ fontSize:14, fontStyle:'italic', color:'#6B7280', fontFamily:'Inter,sans-serif' }}>{label}</span>
                <span style={{ fontSize:14, fontStyle:'italic', color:'#6B7280', fontFamily:'Inter,sans-serif', wordBreak:'break-word' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface WorkplaceSearchesProps {
  onAIAssistantOpen?: () => void;
  isAIDrawerOpen?: boolean;
}

export function WorkplaceSearches({ onAIAssistantOpen = () => {}, isAIDrawerOpen = false }: WorkplaceSearchesProps) {
  const [selectedTeam, setSelectedTeam] = useState('All Teams');
  const [selectedDate, setSelectedDate] = useState('July 1, 2026 – July 31, 2026');
  const [searchValue, setSearchValue] = useState('');
  const [showSystemSearches, setShowSystemSearches] = useState(false);
  const [detailRow, setDetailRow] = useState<typeof SEARCHES[0] | null>(null);

  const filtered = SEARCHES.filter(r =>
    !searchValue ||
    r.member.toLowerCase().includes(searchValue.toLowerCase()) ||
    r.search.toLowerCase().includes(searchValue.toLowerCase()) ||
    r.team.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor:'var(--surface-page,#F9FAFB)' }}>
      <PageHeader
        icon={<Activity className="h-7 w-7" />}
        title="Searches"
        subtitle="Track and report on search activity across your teams."
        onAIAssistantOpen={onAIAssistantOpen}
        isAIDrawerOpen={isAIDrawerOpen}
        hideAIButton
      >
        <HeaderDropdown value={selectedTeam} options={TEAMS} onChange={setSelectedTeam} />
        <HeaderDropdown value={selectedDate} options={DATE_RANGES} onChange={setSelectedDate} icon={<Calendar className="h-3.5 w-3.5" style={{ marginRight:2 }} />} />
      </PageHeader>

      <div style={{ padding:'24px', maxWidth:1280, margin:'0 auto' }}>
        {/* Chart */}
        <div className="rounded-2xl border border-gray-200 bg-white" style={{ padding:24, marginBottom:24 }}>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={CHART_DATA} margin={{ top:8, right:8, left:0, bottom:0 }}>
              <defs>
                <linearGradient id="searchGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize:12, fontFamily:'Inter,sans-serif', fill:'#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:12, fontFamily:'Inter,sans-serif', fill:'#9CA3AF' }} axisLine={false} tickLine={false} domain={[0,6000]} tickFormatter={v => v.toLocaleString()} />
              <Tooltip
                contentStyle={{ borderRadius:8, border:'1px solid #E5E7EB', fontSize:13, fontFamily:'Inter,sans-serif' }}
                formatter={(v: number) => [v.toLocaleString(), 'Searches']}
              />
              <Area type="monotone" dataKey="searches" stroke="#3B82F6" strokeWidth={2.5} fill="url(#searchGradient)" dot={{ r:4, fill:'#3B82F6', strokeWidth:0 }} activeDot={{ r:5 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
          <div style={{ padding:24 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', gap:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, fontFamily:'Inter,sans-serif', color:'#374151' }}>
                  Show
                  <select style={{ border:'1px solid #D1D5DB', borderRadius:6, padding:'5px 8px', fontSize:13, fontFamily:'Inter,sans-serif', color:'#374151', cursor:'pointer', outline:'none' }}>
                    <option>10</option><option>25</option><option>50</option>
                  </select>
                  entries
                </div>
                <label style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, fontFamily:'Inter,sans-serif', color:'#374151', cursor:'pointer' }}>
                  <input type="checkbox" checked={showSystemSearches} onChange={e => setShowSystemSearches(e.target.checked)} style={{ width:14, height:14, cursor:'pointer' }} />
                  Show System Searches
                </label>
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
                  {['Date','Member','Team','Search','Type','Capacity','Space Type','Results',''].map((h,i) => (
                    <TableHead key={i} style={{ fontSize:11, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'0.06em', fontFamily:'Inter,sans-serif', whiteSpace:'nowrap' }}>{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(r => (
                  <TableRow key={r.id} className="hover:bg-gray-50 transition-colors" style={{ borderColor:'#F3F4F6' }}>
                    <TableCell style={{ ...S.cell, whiteSpace:'nowrap' }}>{r.date}</TableCell>
                    <TableCell style={{ ...S.cell, fontWeight:500 }}>{r.member}</TableCell>
                    <TableCell style={{ ...S.cell, color:'#6B7280', maxWidth:140 }}>
                      <span style={{ display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.team}</span>
                    </TableCell>
                    <TableCell style={{ ...S.cell, whiteSpace:'nowrap' }}>{r.search}</TableCell>
                    <TableCell style={S.cell}>{r.type}</TableCell>
                    <TableCell style={{ ...S.cell, color:'#9CA3AF' }}>{r.capacity}</TableCell>
                    <TableCell style={S.cell}>{r.spaceType}</TableCell>
                    <TableCell style={{ ...S.cell, fontWeight:600 }}>{r.results.toLocaleString()}</TableCell>
                    <TableCell style={{ ...S.cell, textAlign:'right' }}>
                      <RowMenu items={[{ label:'View Details', onClick: () => setDetailRow(r) }]} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div style={{ marginTop:12, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <p style={{ fontSize:13, color:'#9CA3AF', fontFamily:'Inter,sans-serif' }}>Showing 1 to {filtered.length} of {SEARCHES.length} entries</p>
            </div>
          </div>
        </div>
      </div>

      {detailRow && <SearchDetailsModal row={detailRow} onClose={() => setDetailRow(null)} />}
    </div>
  );
}

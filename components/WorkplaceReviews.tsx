import React, { useState, useRef, useEffect } from 'react';
import { PageHeader } from './PageHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Activity, Calendar, ChevronDown, MoreHorizontal, Search, Star } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { toast } from './ui/toast';

// ─── Mock data ────────────────────────────────────────────────────────────────

const CHART_DATA = [
  { month: 'Jul 25', reviews: 26 },
  { month: 'Aug 25', reviews: 32 },
  { month: 'Sep 25', reviews: 43 },
  { month: 'Oct 25', reviews: 20 },
  { month: 'Nov 25', reviews: 22 },
  { month: 'Dec 25', reviews: 26 },
  { month: 'Jan 26', reviews: 30 },
  { month: 'Feb 26', reviews: 21 },
  { month: 'Mar 26', reviews: 13 },
  { month: 'Apr 26', reviews: 15 },
  { month: 'May 26', reviews: 28 },
  { month: 'Jun 26', reviews: 40 },
  { month: 'Jul 26', reviews: 20 },
];

const REVIEWS = [
  {
    id:'1', date:'07/02/2026', member:'Maite Cirauqui Diaz', memberEmail:'maite.cirauquidiaz@airbnb.com', team:'50+ Mile Members (Global)',
    venue:'Regus | Madrid Jose Abascal 41 – Day Desk', venueAddress:'Madrid, MD, ES', rating:5,
    comment:'Good space and very quick to confirm',
    reservationDate:'Tue, Jun 23, 2026 from 10:00 AM – 3:00 PM RDT', createdDate:'Thu, Jul 2, 2026 2:19 AM', source:'SYS',
  },
  {
    id:'2', date:'07/02/2026', member:'Monica May', memberEmail:'monica.may@airbnb.com', team:'50+ Mile Members (Global)',
    venue:'Trick Hat Workway – Day Pass: Open Desk', venueAddress:'Austin, TX, US', rating:5,
    comment:"Really enjoyed this space! The amenities and snacks available were great; since this place is right next to the town lake trail, a wonderful perk is that they have a shower; you can get some exercise, rinse off and have a full work day undisrupted.",
    reservationDate:'Mon, Jun 30, 2026 from 8:00 AM – 5:00 PM CDT', createdDate:'Thu, Jul 2, 2026 9:14 AM', source:'SYS',
  },
  {
    id:'3', date:'07/01/2026', member:'Jordan Meeker', memberEmail:'jordan.meeker@airbnb.com', team:'Los Angeles Metro Area',
    venue:'BLANKSPACES Venice – WorkCafé Desk', venueAddress:'Los Angeles, CA, US', rating:5,
    comment:'Great spot, easy to book and very comfortable.',
    reservationDate:'Fri, Jun 27, 2026 from 9:00 AM – 5:00 PM PDT', createdDate:'Wed, Jul 1, 2026 8:00 AM', source:'SYS',
  },
  {
    id:'4', date:'06/30/2026', member:'Tyler Brooks', memberEmail:'tyler.brooks@airbnb.com', team:'New York Metro Area',
    venue:'Industrious | Bryant Park – Private Office', venueAddress:'New York, NY, US', rating:4,
    comment:'Nice office with a great view. Could use more natural light but overall solid.',
    reservationDate:'Mon, Jun 23, 2026 from 9:00 AM – 6:00 PM EDT', createdDate:'Mon, Jun 30, 2026 10:30 AM', source:'SYS',
  },
  {
    id:'5', date:'06/28/2026', member:'Maria Chen', memberEmail:'maria.chen@airbnb.com', team:'Chicago Metro Area',
    venue:'WeWork | 1 N Dearborn – Hot Desk', venueAddress:'Chicago, IL, US', rating:4,
    comment:'Good location downtown. The space was clean and well organized.',
    reservationDate:'Thu, Jun 26, 2026 from 8:00 AM – 4:00 PM CDT', createdDate:'Sat, Jun 28, 2026 7:45 AM', source:'SYS',
  },
];

const TEAMS = ['All Teams', 'Los Angeles Metro Area', '50+ Mile Members (Global)', 'Chicago Metro Area', 'New York Metro Area', 'Bay Area', 'Seattle Metro Area'];
const DATE_RANGES = ['July 1, 2026 – July 31, 2026', 'June 1, 2026 – June 30, 2026', 'Q2 2026 (Apr–Jun)', 'Last 12 months'];

// ─── Shared styles ────────────────────────────────────────────────────────────

const S = {
  input: { fontSize: 14, fontFamily: 'Inter, sans-serif', borderRadius: 8, border: '1px solid #D1D5DB', padding: '9px 12px', width: '100%', outline: 'none', color: '#374151', backgroundColor: '#fff' } as React.CSSProperties,
  cell: { paddingTop: 13, paddingBottom: 13, fontSize: 14, fontFamily: 'Inter, sans-serif', color: '#374151' } as React.CSSProperties,
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display:'flex', gap:2 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} className="h-4 w-4" style={{ fill: i<=rating ? '#F59E0B' : 'none', color: i<=rating ? '#F59E0B' : '#D1D5DB' }} />
      ))}
    </div>
  );
}

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
            <button key={o} onClick={() => { onChange(o); setOpen(false); }} style={{ display:'block', width:'100%', textAlign:'left', padding:'10px 14px', fontSize:13, fontFamily:'Inter,sans-serif', color:o===value?'#005B94':'#374151', fontWeight:o===value?600:400, background:'none', border:'none', cursor:'pointer' }} className="hover:bg-gray-50">{o}</button>
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
            <button key={item.label} onClick={() => { setOpen(false); item.onClick(); }} style={{ display:'block', width:'100%', textAlign:'left', padding:'9px 14px', fontSize:13, fontFamily:'Inter,sans-serif', color:'#374151', background:'none', border:'none', cursor:'pointer' }} className="hover:bg-gray-50">{item.label}</button>
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

// ─── Review Details Modal ─────────────────────────────────────────────────────

function ReviewDetailsModal({ review, onClose }: { review: typeof REVIEWS[0]; onClose: () => void }) {
  return (
    <div style={{ position:'fixed', inset:0, zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'rgba(0,0,0,0.45)' }} onClick={onClose}>
      <div style={{ width:640, maxHeight:'88vh', borderRadius:12, overflow:'hidden', display:'flex', flexDirection:'column', backgroundColor:'#fff' }} onClick={e => e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'18px 24px', borderBottom:'1px solid #E5E7EB', flexShrink:0 }}>
          <h2 style={{ fontSize:18, fontWeight:700, color:'#111827', fontFamily:'Inter,sans-serif', margin:0 }}>Review details</h2>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'#9CA3AF', cursor:'pointer', fontSize:20, lineHeight:1 }}>✕</button>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:24, display:'flex', flexDirection:'column', gap:16 }}>
          {/* Member */}
          <div className="rounded-xl border border-gray-200 p-5">
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <tbody>
                {[
                  ['Member name',  review.member],
                  ['Member email', review.memberEmail],
                  ['Team',         review.team],
                ].map(([label, value]) => (
                  <tr key={label} style={{ borderBottom:'1px solid #F3F4F6' }}>
                    <td style={{ padding:'10px 0', fontSize:14, fontWeight:600, color:'#374151', fontFamily:'Inter,sans-serif', width:140, verticalAlign:'top' }}>{label}</td>
                    <td style={{ padding:'10px 0', fontSize:14, color:'#374151', fontFamily:'Inter,sans-serif' }}>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Review details */}
          <div className="rounded-xl border border-gray-200 p-5">
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <tbody>
                <tr style={{ borderBottom:'1px solid #F3F4F6' }}>
                  <td style={{ padding:'10px 0', fontSize:14, fontWeight:600, color:'#374151', fontFamily:'Inter,sans-serif', width:140 }}>Created date</td>
                  <td style={{ padding:'10px 0', fontSize:14, color:'#374151', fontFamily:'Inter,sans-serif' }}>{review.createdDate}</td>
                </tr>
                <tr style={{ borderBottom:'1px solid #F3F4F6' }}>
                  <td style={{ padding:'10px 0', fontSize:14, fontWeight:600, color:'#374151', fontFamily:'Inter,sans-serif', verticalAlign:'middle' }}>Rating</td>
                  <td style={{ padding:'10px 0' }}><StarRating rating={review.rating} /></td>
                </tr>
                {[
                  ['Comment',          review.comment],
                  ['Reservation Date', review.reservationDate],
                  ['Location name',    review.venue],
                  ['Venue address',    review.venueAddress],
                  ['Source',           review.source],
                ].map(([label, value]) => (
                  <tr key={label} style={{ borderBottom:'1px solid #F3F4F6' }}>
                    <td style={{ padding:'10px 0', fontSize:14, fontWeight:600, color:'#374151', fontFamily:'Inter,sans-serif', width:140, verticalAlign:'top' }}>{label}</td>
                    <td style={{ padding:'10px 0', fontSize:14, color:'#374151', fontFamily:'Inter,sans-serif' }}>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface WorkplaceReviewsProps {
  onAIAssistantOpen?: () => void;
  isAIDrawerOpen?: boolean;
}

export function WorkplaceReviews({ onAIAssistantOpen = () => {}, isAIDrawerOpen = false }: WorkplaceReviewsProps) {
  const [selectedTeam, setSelectedTeam] = useState('All Teams');
  const [selectedDate, setSelectedDate] = useState('July 1, 2026 – July 31, 2026');
  const [searchValue, setSearchValue] = useState('');
  const [detailReview, setDetailReview] = useState<typeof REVIEWS[0] | null>(null);

  const filtered = REVIEWS.filter(r =>
    !searchValue ||
    r.member.toLowerCase().includes(searchValue.toLowerCase()) ||
    r.venue.toLowerCase().includes(searchValue.toLowerCase()) ||
    r.team.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor:'var(--surface-page,#F9FAFB)' }}>
      <PageHeader
        icon={<Activity className="h-7 w-7" />}
        title="Reviews"
        subtitle="Track and report on review activity across your teams."
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
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={CHART_DATA} margin={{ top:8, right:8, left:0, bottom:0 }}>
              <defs>
                <linearGradient id="reviewGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize:12, fontFamily:'Inter,sans-serif', fill:'#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:12, fontFamily:'Inter,sans-serif', fill:'#9CA3AF' }} axisLine={false} tickLine={false} domain={[0,60]} />
              <Tooltip
                contentStyle={{ borderRadius:8, border:'1px solid #E5E7EB', fontSize:13, fontFamily:'Inter,sans-serif' }}
                formatter={(v: number) => [v, 'Reviews']}
              />
              <Area type="monotone" dataKey="reviews" stroke="#3B82F6" strokeWidth={2.5} fill="url(#reviewGradient)" dot={{ r:4, fill:'#3B82F6', strokeWidth:0 }} activeDot={{ r:5 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
          <div style={{ padding:24 }}>
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
                  {['Date','Member','Team','Venue','Rating','Comment',''].map((h,i) => (
                    <TableHead key={i} style={{ fontSize:11, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'0.06em', fontFamily:'Inter,sans-serif' }}>{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(r => (
                  <TableRow key={r.id} className="hover:bg-gray-50 transition-colors" style={{ borderColor:'#F3F4F6' }}>
                    <TableCell style={{ ...S.cell, whiteSpace:'nowrap' }}>{r.date}</TableCell>
                    <TableCell style={{ ...S.cell, fontWeight:500, whiteSpace:'nowrap' }}>{r.member}</TableCell>
                    <TableCell style={{ ...S.cell, color:'#6B7280', maxWidth:140 }}>
                      <span style={{ display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.team}</span>
                    </TableCell>
                    <TableCell style={{ ...S.cell, maxWidth:180 }}>
                      <span style={{ display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.venue}</span>
                    </TableCell>
                    <TableCell style={S.cell}>{r.rating}</TableCell>
                    <TableCell style={{ ...S.cell, color:'#6B7280', maxWidth:260 }}>
                      <span style={{ display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{r.comment}</span>
                    </TableCell>
                    <TableCell style={{ ...S.cell, textAlign:'right' }}>
                      <RowMenu items={[{ label:'View Details', onClick: () => setDetailReview(r) }]} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div style={{ marginTop:12 }}>
              <p style={{ fontSize:13, color:'#9CA3AF', fontFamily:'Inter,sans-serif' }}>Showing 1 to {filtered.length} of {REVIEWS.length} entries</p>
            </div>
          </div>
        </div>
      </div>

      {detailReview && <ReviewDetailsModal review={detailReview} onClose={() => setDetailReview(null)} />}
    </div>
  );
}

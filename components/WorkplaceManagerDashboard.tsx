import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, CartesianGrid, PieChart, Pie, ReferenceLine,
} from 'recharts';
import {
  Users, Activity, DollarSign, Star, ChevronDown,
  ArrowUpRight, ArrowDownRight, Minus, TrendingUp, Filter,
  Building2, Lightbulb, Database, LayoutDashboard,
} from 'lucide-react';
import { PageHeader } from './PageHeader';
import USActivityHeatmap from './USActivityHeatmap';
import { AIAssistant, SummaryButton } from './copilot';
import rawMetros from './data/allstate-metros.json';

// ─── Palette ──────────────────────────────────────────────────────────────────

const C = {
  navy:    '#0C2340',
  blue:    '#1D6FB8',
  teal:    '#0D9488',
  amber:   '#F59E0B',
  slate:   '#9CA3AF',
  primary: '#005B94',
  accent:  '#F59E0B',
};

// ─── Real Allstate data (seeded from HourlyDailyReservations.parquet) ─────────

const ALLSTATE_METROS = rawMetros as Array<{
  city: string; state: string; reservations: number; total_spend: number; venues: number; members: number;
}>;

const TOTAL_RESERVATIONS = ALLSTATE_METROS.reduce((s, m) => s + m.reservations, 0);
const TOTAL_SPEND        = ALLSTATE_METROS.reduce((s, m) => s + m.total_spend,  0);
const TOTAL_VENUES       = ALLSTATE_METROS.reduce((s, m) => s + m.venues,       0);
const TOTAL_MEMBERS      = ALLSTATE_METROS.reduce((s, m) => s + m.members,      0);
const AVG_COST_PER_RES   = Math.round(TOTAL_SPEND / TOTAL_RESERVATIONS);

// Lat/lon lookup for the top Allstate metros (Albers-compatible coordinates)
const METRO_LATLON: Record<string, [number, number]> = {
  'Atlanta-GA':           [33.75, -84.39],
  'New York-NY':          [40.71, -74.00],
  'Columbia-MD':          [39.20, -76.86],
  'Tampa-FL':             [27.94, -82.46],
  'Los Angeles-CA':       [34.05, -118.24],
  'Pleasanton-CA':        [37.66, -121.87],
  'Austin-TX':            [30.27,  -97.74],
  'Columbus-OH':          [39.96,  -82.99],
  'Roseville-CA':         [38.75, -121.29],
  'Nashville-TN':         [36.17,  -86.78],
  'Orlando-FL':           [28.54,  -81.38],
  'San Ramon-CA':         [37.78, -121.98],
  'Philadelphia-PA':      [39.95,  -75.17],
  'Roanoke-VA':           [37.27,  -79.94],
  'Houston-TX':           [29.76,  -95.37],
  'Washington-DC':        [38.90,  -77.04],
  'Denver-CO':            [39.74, -104.98],
  'Bellevue-WA':          [47.61, -122.20],
  'Minneapolis-MN':       [44.98,  -93.27],
  'Carmel-IN':            [39.97,  -86.12],
  'Seattle-WA':           [47.61, -122.33],
  'Portland-OR':          [45.52, -122.68],
  'Bridgewater-NJ':       [40.59,  -74.61],
  'Richmond-VA':          [37.54,  -77.43],
  'Chicago-IL':           [41.85,  -87.65],
  'Sandy-UT':             [40.57, -111.88],
  'Fort Lauderdale-FL':   [26.12,  -80.14],
  'Sioux Falls-SD':       [43.55,  -96.73],
  'Saint Charles-MO':     [38.79,  -90.50],
};

// Build USActivityHeatmap metros from real data
const MAP_METROS = ALLSTATE_METROS
  .map(m => {
    const key = `${m.city}-${m.state}`.replace(/\s+/g, ' ');
    const latlon = METRO_LATLON[key];
    if (!latlon) return null;
    const tier =
      m.total_spend >= 50000 ? 'very-high' :
      m.total_spend >= 20000 ? 'high'      :
      m.total_spend >= 10000 ? 'moderate'  :
      m.total_spend >=  5000 ? 'low-moderate' : 'low';
    return {
      city: m.city, state: m.state,
      lat: latlon[0], lon: latlon[1],
      util: Math.round((m.total_spend / TOTAL_SPEND) * 1000), // relative utilization
      spaces: m.reservations,
      tier,
    };
  })
  .filter(Boolean) as Array<{ city: string; state: string; lat: number; lon: number; util: number; spaces: number; tier: string }>;

// ─── Data ─────────────────────────────────────────────────────────────────────

const TEAMS = [
  { team: 'Allstate Enterprise',            rate: 99.2, accepted: 4820, invited: 4860, spend: 2341892, trend:  1.8 },
  { team: 'BU Funded – Technology',          rate: 82.4, accepted:  145, invited:  176, spend:  487219, trend:  8.3 },
  { team: 'BU Funded – Finance & Risk',      rate: 67.1, accepted:  114, invited:  170, spend:  362445, trend: -3.2 },
  { team: 'BU Funded – Legal & Compliance',  rate:100.0, accepted:   52, invited:   52, spend:  198773, trend:  0.0 },
  { team: 'BU Funded – HR & People',         rate: 74.6, accepted:  213, invited:  285, spend:  521664, trend:  5.7 },
];

const TREND_DATA = [
  { month: 'Oct 2024', adoption: 70, engagement: 62, spend: 2.9 },
  { month: 'Nov 2024', adoption: 71, engagement: 63, spend: 3.0 },
  { month: 'Dec 2024', adoption: 72, engagement: 64, spend: 3.1 },
  { month: 'Jan 2025', adoption: 73, engagement: 65, spend: 3.2 },
  { month: 'Feb 2025', adoption: 74, engagement: 66, spend: 3.3 },
  { month: 'Mar 2025', adoption: 75, engagement: 67, spend: 3.4 },
  { month: 'Apr 2025', adoption: 77, engagement: 68, spend: 3.5 },
  { month: 'May 2025', adoption: 78, engagement: 70, spend: 3.7 },
  { month: 'Jun 2025', adoption: 79, engagement: 71, spend: 3.8 },
  { month: 'Jul 2025', adoption: 81, engagement: 72, spend: 3.9 },
  { month: 'Aug 2025', adoption: 83, engagement: 74, spend: 4.0 },
  { month: 'Sep 2025', adoption: 84, engagement: 76, spend: 4.1 },
];

// Map summary stats derived from trend data
const _TD_ADOPTIONS = TREND_DATA.map(d => d.adoption);
const MAP_PERIOD_AVG = parseFloat((_TD_ADOPTIONS.reduce((s, v) => s + v, 0) / _TD_ADOPTIONS.length).toFixed(1));
const MAP_PEAK_VALUE = Math.max(..._TD_ADOPTIONS);
const MAP_GROWTH     = parseFloat(((_TD_ADOPTIONS[_TD_ADOPTIONS.length - 1] - _TD_ADOPTIONS[0]) / _TD_ADOPTIONS[0] * 100).toFixed(1));

const EMPLOYEES = [
  { rank: 1, name: 'JENNIFER MARTINEZ', team: 'Claims',       bookings:  12, spend: 924455 },
  { rank: 2, name: 'DAVID CHEN',         team: 'Claims',       bookings:  11, spend: 786312 },
  { rank: 3, name: 'SARAH ANDERSON',     team: 'Technology',   bookings: 454, spend: 203891 },
  { rank: 4, name: 'MICHAEL RODRIGUEZ',  team: 'Underwriting', bookings: 454, spend: 234561 },
  { rank: 5, name: 'LISA JOHNSON',       team: 'BU Funded',    bookings:   9, spend: 612443 },
];

// Top 5 markets by total spend — real data from allstate-metros.json
const MARKETS = [...ALLSTATE_METROS]
  .sort((a, b) => b.total_spend - a.total_spend)
  .slice(0, 5)
  .map(m => {
    const regionMap: Record<string, string> = {
      GA:'Southeast', NY:'Northeast', MD:'Mid-Atlantic', FL:'Southeast',
      CA:'West', TX:'South', OH:'Midwest', IN:'Midwest', VA:'Mid-Atlantic',
    };
    return {
      name: `${m.city}, ${m.state}`,
      region: regionMap[m.state] ?? m.state,
      trendPct: parseFloat(((m.reservations / TOTAL_RESERVATIONS) * 100).toFixed(1)),
      res: m.reservations,
      avg: Math.round(m.total_spend / m.reservations),
      total: Math.round(m.total_spend),
    };
  });

// Booking status split derived from real reservation total (seed data = completed+cancellation policy)
const _COMPLETED  = Math.round(TOTAL_RESERVATIONS * 0.943);
const _ACTIVE     = Math.round(TOTAL_RESERVATIONS * 0.016);
const _SCHEDULED  = Math.round(TOTAL_RESERVATIONS * 0.028);
const _CANCELLED  = TOTAL_RESERVATIONS - _COMPLETED - _ACTIVE - _SCHEDULED;
const BOOKING_STATUS = [
  { name: 'Completed', value: _COMPLETED,  color: C.navy,  pct: 94.3, trend:  1.8 },
  { name: 'Active',    value: _ACTIVE,     color: C.blue,  pct:  1.6, trend: 12.0 },
  { name: 'Scheduled', value: _SCHEDULED,  color: C.teal,  pct:  2.8, trend: -3.0 },
  { name: 'Cancelled', value: _CANCELLED,  color: C.amber, pct:  1.2, trend: -8.0 },
];

const WEEKLY_USAGE = [
  { day: 'Mon', bookings: 7200, color: C.navy,  trend: -3.1 },
  { day: 'Tue', bookings: 9100, color: C.blue,  trend: 15.7 },
  { day: 'Wed', bookings: 8400, color: C.teal,  trend:  4.2 },
  { day: 'Thu', bookings: 8900, color: C.amber, trend: 11.4 },
  { day: 'Fri', bookings: 6100, color: C.slate, trend: -8.9 },
];
const WEEKLY_AVG = Math.round(WEEKLY_USAGE.reduce((s, d) => s + d.bookings, 0) / WEEKLY_USAGE.length);

const SPACE_TYPES = [
  { type: 'Meeting Room',    bookings: 423, pct: 38, color: C.navy  },
  { type: 'Private Office',  bookings: 312, pct: 28, color: C.blue  },
  { type: 'Hot Desk',        bookings: 198, pct: 18, color: C.teal  },
  { type: 'Focus Room',      bookings: 134, pct: 12, color: C.amber },
  { type: 'Conference Room', bookings:  53, pct:  5, color: C.slate },
];

const GATHERING_TYPES = [
  { name: 'Individual Work',     value: 58, color: C.navy  },
  { name: 'Small Group (2–4)',   value: 27, color: C.blue  },
  { name: 'Team Meeting (5–10)', value: 14, color: C.teal  },
  { name: 'Large Event (11+)',   value:  1, color: C.amber },
];

const METRIC_CARDS = [
  {
    key: 'adoption', icon: <Users style={{ width:15, height:15, color:C.primary }} />, iconBg:'#E3F2FD',
    label:'Adoption', trend:12.5,
    mainVal:'6,840', mainLabel:'Joined',
    subLabel:'Adoption rate', subVal:84, subSuffix:'%',
    progressVal:84, footnote:'6,840 of 8,148 invited',
  },
  {
    key:'engagement', icon:<Activity style={{ width:15, height:15, color:'#7C3AED' }} />, iconBg:'#EDE9FE',
    label:'Engagement', trend:8.3,
    mainVal:'5,198', mainLabel:'Active',
    subLabel:'Monthly active users', subVal:76, subSuffix:'%',
    progressVal:76, footnote:'5,198 of 6,840 employees',
  },
  {
    key:'spend', icon:<DollarSign style={{ width:15, height:15, color:'#059669' }} />, iconBg:'#E8F5E8',
    label:'Spend', trend:23.1,
    mainVal:'$' + (TOTAL_SPEND / 1000).toFixed(0) + 'K', mainLabel:'Total',
    subLabel:'Top market (Atlanta) share', subVal: Math.round((83007 / TOTAL_SPEND) * 100), subSuffix:'%',
    progressVal: Math.round((83007 / TOTAL_SPEND) * 100), footnote:`$${AVG_COST_PER_RES} per reservation`,
  },
  {
    key:'reviews', icon:<Star style={{ width:15, height:15, color:C.amber }} />, iconBg:'#FFF3E0',
    label:'Reviews', trend:0.2,
    mainVal:'4.5', mainLabel:'Rating',
    subLabel:'Sentiment breakdown', subVal:null, subSuffix:'',
    progressVal:null, footnote:'4.5 avg rating',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtFull(n: number) { return '$' + n.toLocaleString(); }
function fmtK(n: number) { return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n); }

function TrendBadge({ value }: { value: number }) {
  if (value > 0) return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'2px', padding:'2px 8px', borderRadius:'9999px', fontSize:'12px', fontWeight:600, backgroundColor:'#DCFCE7', color:'#15803D', whiteSpace:'nowrap' }}>
      <ArrowUpRight style={{ width:12, height:12 }} />+{Math.abs(value).toFixed(1)}%
    </span>
  );
  if (value < 0) return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'2px', padding:'2px 8px', borderRadius:'9999px', fontSize:'12px', fontWeight:600, backgroundColor:'#FEE2E2', color:'#DC2626', whiteSpace:'nowrap' }}>
      <ArrowDownRight style={{ width:12, height:12 }} />{value.toFixed(1)}%
    </span>
  );
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'2px', padding:'2px 8px', borderRadius:'9999px', fontSize:'12px', fontWeight:500, backgroundColor:'#F3F4F6', color:'#6B7280', whiteSpace:'nowrap' }}>
      <Minus style={{ width:12, height:12 }} />0.0%
    </span>
  );
}

function FilterPill({ label, value }: { label: string; value: string }) {
  return (
    <button style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'7px 14px', borderRadius:'8px', background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.22)', color:'#fff', fontSize:'13px', fontWeight:500, cursor:'pointer', whiteSpace:'nowrap', fontFamily:'Inter, sans-serif' }}>
      <span style={{ color:'rgba(255,255,255,0.65)' }}>{label}:</span>
      <span style={{ fontWeight:600 }}>{value}</span>
      <ChevronDown style={{ width:13, height:13, opacity:0.7 }} />
    </button>
  );
}

function SCard({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ backgroundColor:'#fff', borderRadius:'12px', border:'1px solid #E5E7EB', boxShadow:'0 1px 3px rgba(0,0,0,0.06)', overflow:'hidden', ...style }}>
      {children}
    </div>
  );
}

function AccentCard({ title, subtitle, children, right }: { title: string; subtitle: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <SCard>
      <div style={{ display:'flex', height:'100%' }}>
        <div style={{ width:'4px', backgroundColor:C.accent, flexShrink:0 }} />
        <div style={{ flex:1, padding:'20px 22px' }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'16px', marginBottom:'18px', flexWrap:'wrap' }}>
            <div>
              <div style={{ fontSize:'16px', fontWeight:700, color:'#111827', marginBottom:'2px' }}>{title}</div>
              <div style={{ fontSize:'13px', color:'#6B7280' }}>{subtitle}</div>
            </div>
            {right && <div style={{ flexShrink:0 }}>{right}</div>}
          </div>
          {children}
        </div>
      </div>
    </SCard>
  );
}

function IconCard({ icon, iconBg, title, subtitle, children, topRight }: { icon: React.ReactNode; iconBg: string; title: string; subtitle: string; children: React.ReactNode; topRight?: React.ReactNode }) {
  return (
    <SCard style={{ padding:'20px 22px' }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'16px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ width:36, height:36, borderRadius:'9px', backgroundColor:iconBg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{icon}</div>
          <div>
            <div style={{ fontSize:'15px', fontWeight:700, color:'#111827' }}>{title}</div>
            <div style={{ fontSize:'12px', color:'#6B7280', marginTop:'1px' }}>{subtitle}</div>
          </div>
        </div>
        {topRight && <div style={{ flexShrink:0 }}>{topRight}</div>}
      </div>
      {children}
    </SCard>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface WorkplaceManagerDashboardProps {
  isAIDrawerOpen?: boolean;
  onAIAssistantOpen?: () => void;
}

export function WorkplaceManagerDashboard({ isAIDrawerOpen = false, onAIAssistantOpen = () => {} }: WorkplaceManagerDashboardProps) {
  const [activeMetric, setActiveMetric] = useState('adoption');
  const [trendMetric, setTrendMetric] = useState<'adoption'|'engagement'|'spend'>('adoption');
  const [trendPeriod, setTrendPeriod] = useState('Last 12 Months');
  const [teamFilter, setTeamFilter] = useState('');
  const [perPage, setPerPage] = useState(5);

  const filteredTeams = TEAMS.filter(t => !teamFilter || t.team.toLowerCase().includes(teamFilter.toLowerCase())).slice(0, perPage);

  const trendColor = { adoption:'#0D9488', engagement:'#7C3AED', spend:'#059669' }[trendMetric];
  const trendKey = trendMetric;
  const last = TREND_DATA[TREND_DATA.length - 1][trendKey] as number;
  const prev = TREND_DATA[TREND_DATA.length - 2][trendKey] as number;
  const latestDiff = (last - prev).toFixed(1);

  const periodAvg = (TREND_DATA.reduce((s, d) => s + (d[trendKey] as number), 0) / TREND_DATA.length).toFixed(1);
  const peak = Math.max(...TREND_DATA.map(d => d[trendKey] as number)).toFixed(1);
  const growth = ((last - (TREND_DATA[0][trendKey] as number)) / (TREND_DATA[0][trendKey] as number) * 100).toFixed(1);

  const totalBookings = BOOKING_STATUS.reduce((s, b) => s + b.value, 0);

  const inputStyle: React.CSSProperties = {
    height:'34px', borderRadius:'8px', border:'1px solid #E5E7EB',
    padding:'0 10px', fontSize:'13px', fontFamily:'Inter, sans-serif',
    color:'#374151', backgroundColor:'#F9FAFB', outline:'none',
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle, paddingRight:'26px', appearance:'none' as const,
    backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat:'no-repeat', backgroundPosition:'right 7px center', cursor:'pointer',
  };

  return (
    <div style={{ minHeight:'100vh', backgroundColor:'#F1F4F9', fontFamily:'Inter, sans-serif' }}>

      <PageHeader
        icon={<LayoutDashboard style={{ width:22, height:22, color:'#fff' }} />}
        title="Dashboard"
        subtitle="Monitor adoption, engagement, and spend across your workplace portfolio."
        onAIAssistantOpen={onAIAssistantOpen}
        isAIDrawerOpen={isAIDrawerOpen}
        hideAIButton
      >
        <FilterPill label="Region" value="US" />
        <FilterPill label="Team" value="All" />
        <FilterPill label="Period" value="This Month" />
        <SummaryButton onClick={() => {}} isLoading={false} />
      </PageHeader>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth:1440, margin:'0 auto', padding:'24px 32px 48px', display:'flex', flexDirection:'column', gap:20 }}>
        <AIAssistant context="dashboard">

        {/* ── Stat Cards ─────────────────────────────────────────────────── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:16 }}>
          {[
            { val: TOTAL_MEMBERS.toLocaleString(),            label:'Active Team Members' },
            { val: TOTAL_RESERVATIONS.toLocaleString(),       label:'Total Reservations' },
            { val: '$' + AVG_COST_PER_RES.toLocaleString(),   label:'Cost Per Reservation' },
            { val: TOTAL_VENUES.toLocaleString(),             label:'Active Venues' },
          ].map(({ val, label }) => (
            <SCard key={label} style={{ padding:'22px 24px' }}>
              <div style={{ fontSize:32, fontWeight:700, color:'#111827', lineHeight:1.1, marginBottom:6 }}>{val}</div>
              <div style={{ fontSize:13, color:'#6B7280' }}>{label}</div>
            </SCard>
          ))}
        </div>

        {/* ── Metric Cards ───────────────────────────────────────────────── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:16 }}>
          {METRIC_CARDS.map(m => {
            const isActive = activeMetric === m.key;
            return (
              <div key={m.key} onClick={() => setActiveMetric(m.key)} style={{ backgroundColor:'#fff', borderRadius:12, border: isActive ? '2px solid #005B94' : '1px solid #E5E7EB', boxShadow: isActive ? '0 0 0 3px rgba(0,91,148,0.08)' : '0 1px 3px rgba(0,0,0,0.06)', padding:'18px 20px', cursor:'pointer', display:'flex', flexDirection:'column', gap:10, transition:'border-color 150ms, box-shadow 150ms' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ width:28, height:28, borderRadius:7, backgroundColor:m.iconBg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{m.icon}</div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:'#111827' }}>{m.label}</div>
                    </div>
                  </div>
                  <TrendBadge value={m.trend} />
                </div>
                <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
                  <span style={{ fontSize:26, fontWeight:700, color:'#111827' }}>{m.mainVal}</span>
                  <span style={{ fontSize:13, color:'#6B7280' }}>{m.mainLabel}</span>
                </div>
                {m.subVal !== null ? (
                  <>
                    <div style={{ display:'flex', justifyContent:'space-between' }}>
                      <span style={{ fontSize:12, color:'#6B7280' }}>{m.subLabel}</span>
                      <span style={{ fontSize:12, fontWeight:600, color:'#374151' }}>{m.subVal}{m.subSuffix}</span>
                    </div>
                    <div style={{ height:6, backgroundColor:'#E5E7EB', borderRadius:'9999px', overflow:'hidden' }}>
                      <div style={{ width:`${m.progressVal}%`, height:'100%', backgroundColor:C.primary, borderRadius:'9999px' }} />
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize:12, color:'#6B7280' }}>{m.subLabel}</div>
                    <div style={{ height:6, borderRadius:'9999px', overflow:'hidden', display:'flex', gap:2 }}>
                      <div style={{ flex:3, backgroundColor:'#28A745', borderRadius:3 }} />
                      <div style={{ flex:1, backgroundColor:C.amber, borderRadius:3 }} />
                      <div style={{ flex:0.4, backgroundColor:'#EF4444', borderRadius:3 }} />
                    </div>
                  </>
                )}
                <div style={{ fontSize:11, color:'#9CA3AF' }}>{m.footnote}</div>
              </div>
            );
          })}
        </div>

        {/* ── Team Adoption Breakdown ─────────────────────────────────────── */}
        <AccentCard
          title="Team Adoption Breakdown"
          subtitle="User adoption and team activation metrics"
          right={
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ position:'relative' }}>
                <Filter style={{ position:'absolute', left:9, top:'50%', transform:'translateY(-50%)', width:13, height:13, color:'#9CA3AF' }} />
                <input style={{ ...inputStyle, paddingLeft:28, width:160 }} placeholder="Filter teams..." value={teamFilter} onChange={e => setTeamFilter(e.target.value)} />
              </div>
              <select style={{ ...selectStyle, width:150 }} value={perPage} onChange={e => setPerPage(Number(e.target.value))}>
                <option value={5}>5 entries per page</option>
                <option value={10}>10 entries per page</option>
              </select>
            </div>
          }
        >
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead>
              <tr style={{ borderBottom:'1px solid #E5E7EB' }}>
                {['Team ↕', 'Activation Rate ↕', 'Accepted / Invited', 'Current Spend ↕', 'Activation Trend'].map(h => (
                  <th key={h} style={{ padding:'9px 12px', textAlign:'left', fontSize:12, fontWeight:600, color:'#6B7280', letterSpacing:'0.03em', whiteSpace:'nowrap', cursor:'pointer' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredTeams.map((row, i) => (
                <tr key={row.team} style={{ borderBottom: i < filteredTeams.length-1 ? '1px solid #F3F4F6' : 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor='#F9FAFB')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor='transparent')}
                >
                  <td style={{ padding:'13px 12px', fontWeight:500, color:'#111827' }}>{row.team}</td>
                  <td style={{ padding:'13px 12px', color:'#374151' }}>{row.rate.toFixed(1)}%</td>
                  <td style={{ padding:'13px 12px', color:'#374151' }}>{row.accepted.toLocaleString()} / {row.invited.toLocaleString()}</td>
                  <td style={{ padding:'13px 12px', fontWeight:600, color:'#374151' }}>{fmtFull(row.spend)}</td>
                  <td style={{ padding:'13px 12px' }}><TrendBadge value={row.trend} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </AccentCard>

        {/* ── Trends Over Time ────────────────────────────────────────────── */}
        <AccentCard
          title="Trends Over Time"
          subtitle="Explore historical performance across key KPIs"
          right={
            <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap', justifyContent:'flex-end' }}>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ fontSize:12, color:'#6B7280' }}>Metric:</span>
                <select style={selectStyle} value={trendMetric} onChange={e => setTrendMetric(e.target.value as typeof trendMetric)}>
                  <option value="adoption">Adoption</option>
                  <option value="engagement">Engagement</option>
                  <option value="spend">Spend</option>
                </select>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ fontSize:12, color:'#6B7280' }}>Period:</span>
                <select style={selectStyle} value={trendPeriod} onChange={e => setTrendPeriod(e.target.value)}>
                  <option>Last 12 Months</option>
                  <option>Last 6 Months</option>
                  <option>Last 3 Months</option>
                </select>
              </div>
              <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'5px 12px', borderRadius:8, fontSize:12, fontWeight:600, backgroundColor:'#DCFCE7', color:'#15803D' }}>
                <span style={{ fontSize:11 }}>Latest Month</span>
                <span>+{latestDiff}%</span>
              </span>
            </div>
          }
        >
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={TREND_DATA} margin={{ top:8, right:8, left:0, bottom:0 }}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={trendColor} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={trendColor} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="month" tick={{ fontSize:11, fill:'#9CA3AF', fontFamily:'Inter, sans-serif' }} axisLine={false} tickLine={false} interval={1} angle={-30} textAnchor="end" height={45} />
              <YAxis tick={{ fontSize:11, fill:'#9CA3AF', fontFamily:'Inter, sans-serif' }} axisLine={false} tickLine={false} width={38}
                tickFormatter={v => trendMetric === 'spend' ? `$${v}M` : `${v}%`}
                domain={trendMetric === 'spend' ? [2, 5] : [50, 100]}
              />
              <Tooltip
                formatter={(val: number) => [trendMetric === 'spend' ? `$${val}M` : `${val}%`, trendMetric.charAt(0).toUpperCase() + trendMetric.slice(1)]}
                contentStyle={{ borderRadius:8, border:'1px solid #E5E7EB', fontSize:12, fontFamily:'Inter, sans-serif' }}
              />
              <Area type="monotone" dataKey={trendMetric} stroke={trendColor} strokeWidth={2.5} fill="url(#areaGrad)" dot={{ r:4, fill:trendColor, strokeWidth:2, stroke:'#fff' }} activeDot={{ r:6 }} />
            </AreaChart>
          </ResponsiveContainer>
          {/* Stats below chart */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', borderTop:'1px solid #F3F4F6', marginTop:12 }}>
            {[
              { label:'Period Avg',  val:`${periodAvg}${trendMetric==='spend'?'M':'%'}`, color:'#111827' },
              { label:'Peak Value',  val:`${peak}${trendMetric==='spend'?'M':'%'}`,   color:'#111827' },
              { label:'Total Growth',val:`+${growth}%`,                                 color:'#15803D' },
            ].map(({ label, val, color }, i) => (
              <div key={label} style={{ padding:'14px 16px', textAlign:'center', borderLeft: i > 0 ? '1px solid #F3F4F6' : 'none' }}>
                <div style={{ fontSize:12, color:'#6B7280', marginBottom:4 }}>{label}</div>
                <div style={{ fontSize:20, fontWeight:700, color }}>{val}</div>
              </div>
            ))}
          </div>
        </AccentCard>

        {/* ── US Activity Heatmap ─────────────────────────────────────────── */}
        <SCard style={{ padding:'20px 24px' }}>
          <div style={{ borderLeft:`4px solid ${C.accent}`, paddingLeft:16 }}>
            <USActivityHeatmap
              metros={MAP_METROS}
              stats={{ periodAvg: MAP_PERIOD_AVG, peakValue: MAP_PEAK_VALUE, totalGrowth: MAP_GROWTH }}
            />
          </div>
        </SCard>

        {/* ── Most Engaged + Top Markets ──────────────────────────────────── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>

          {/* Most Engaged */}
          <IconCard
            icon={<Users style={{ width:18, height:18, color:C.primary }} />} iconBg="#E3F2FD"
            title="Most Engaged" subtitle="Most engaged employees"
            topRight={<div style={{ textAlign:'right' }}><div style={{ fontSize:22, fontWeight:700, color:'#111827' }}>{TOTAL_MEMBERS.toLocaleString()}</div><div style={{ fontSize:11, color:'#6B7280' }}>Total Users</div></div>}
          >
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead>
                <tr style={{ borderBottom:'1px solid #E5E7EB' }}>
                  {['RANK','EMPLOYEE','Bookings ↕','Spend ↕'].map(h => (
                    <th key={h} style={{ padding:'7px 10px', textAlign:'left', fontSize:11, fontWeight:600, color:'#9CA3AF', letterSpacing:'0.06em', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {EMPLOYEES.map((e, i) => (
                  <tr key={e.rank} style={{ borderBottom: i < EMPLOYEES.length-1 ? '1px solid #F3F4F6' : 'none' }}
                    onMouseEnter={ev => (ev.currentTarget.style.backgroundColor='#F9FAFB')}
                    onMouseLeave={ev => (ev.currentTarget.style.backgroundColor='transparent')}
                  >
                    <td style={{ padding:'11px 10px' }}>
                      <div style={{ width:24, height:24, borderRadius:'50%', backgroundColor:C.primary, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700 }}>{e.rank}</div>
                    </td>
                    <td style={{ padding:'11px 10px' }}>
                      <div style={{ fontSize:12, fontWeight:700, color:'#111827', letterSpacing:'0.04em' }}>{e.name}</div>
                      <div style={{ fontSize:11, color:'#9CA3AF' }}>Team: {e.team}</div>
                    </td>
                    <td style={{ padding:'11px 10px', color:'#374151', fontWeight:500 }}>{e.bookings}</td>
                    <td style={{ padding:'11px 10px', color:'#374151', fontWeight:500 }}>{fmtFull(e.spend)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button style={{ marginTop:12, fontSize:13, color:C.primary, background:'none', border:'none', cursor:'pointer', padding:0, fontFamily:'Inter, sans-serif', fontWeight:500 }}>
              View All Employees →
            </button>
          </IconCard>

          {/* Top Markets */}
          <IconCard
            icon={<Building2 style={{ width:18, height:18, color:C.primary }} />} iconBg="#E3F2FD"
            title="Top Markets" subtitle="Top 5 of 10 markets by total spending"
            topRight={<div style={{ textAlign:'right' }}><div style={{ fontSize:22, fontWeight:700, color:'#111827' }}>$2.5M</div><div style={{ fontSize:11, color:'#6B7280' }}>Total Investment</div></div>}
          >
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead>
                <tr style={{ borderBottom:'1px solid #E5E7EB' }}>
                  {['MARKET','RESERVATIONS','TOTAL COST'].map(h => (
                    <th key={h} style={{ padding:'7px 10px', textAlign:'left', fontSize:11, fontWeight:600, color:'#9CA3AF', letterSpacing:'0.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MARKETS.map((m, i) => (
                  <tr key={m.name} style={{ borderBottom: i < MARKETS.length-1 ? '1px solid #F3F4F6' : 'none' }}
                    onMouseEnter={ev => (ev.currentTarget.style.backgroundColor='#F9FAFB')}
                    onMouseLeave={ev => (ev.currentTarget.style.backgroundColor='transparent')}
                  >
                    <td style={{ padding:'11px 10px' }}>
                      <div style={{ fontSize:12, fontWeight:600, color:'#111827' }}>{m.name} (Metro)</div>
                      <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:2 }}>
                        <span style={{ fontSize:11, color:'#9CA3AF' }}>{m.region}</span>
                        <span style={{ fontSize:11, color:'#15803D', fontWeight:600 }}>↗ +{m.trendPct}%</span>
                      </div>
                    </td>
                    <td style={{ padding:'11px 10px' }}>
                      <div style={{ fontSize:13, fontWeight:700, color:'#111827' }}>{m.res.toLocaleString()}</div>
                      <div style={{ fontSize:11, color:'#9CA3AF' }}>${m.avg} avg</div>
                    </td>
                    <td style={{ padding:'11px 10px', fontSize:13, fontWeight:600, color:'#111827' }}>{fmtFull(m.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button style={{ marginTop:12, fontSize:13, color:C.primary, background:'none', border:'none', cursor:'pointer', padding:0, fontFamily:'Inter, sans-serif', fontWeight:500 }}>
              View All Markets →
            </button>
          </IconCard>
        </div>

        {/* ── Bookings by Status + Weekly Usage ──────────────────────────── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>

          {/* Bookings by Status */}
          <IconCard
            icon={<Activity style={{ width:18, height:18, color:C.primary }} />} iconBg="#E3F2FD"
            title="Bookings by Status"
            subtitle={`${totalBookings.toLocaleString()} total bookings • Last 30 Days`}
            topRight={<button style={{ ...inputStyle, display:'inline-flex', alignItems:'center', gap:6, padding:'5px 12px', cursor:'pointer' }}>Last 30 Days <ChevronDown style={{ width:12, height:12 }} /></button>}
          >
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={BOOKING_STATUS} margin={{ top:4, right:4, left:0, bottom:0 }}>
                <XAxis dataKey="name" tick={{ fontSize:11, fill:'#9CA3AF', fontFamily:'Inter, sans-serif' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:10, fill:'#9CA3AF' }} axisLine={false} tickLine={false} width={34} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : String(v)} />
                <Tooltip contentStyle={{ borderRadius:8, border:'1px solid #E5E7EB', fontSize:12, fontFamily:'Inter, sans-serif' }} />
                <Bar dataKey="value" radius={[4,4,0,0]}>
                  {BOOKING_STATUS.map(b => <Cell key={b.name} fill={b.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginTop:8, paddingTop:12, borderTop:'1px solid #F3F4F6' }}>
              {BOOKING_STATUS.map(b => (
                <div key={b.name} style={{ display:'flex', alignItems:'center', gap:6, flex:1, minWidth:90 }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', backgroundColor:b.color, flexShrink:0 }} />
                  <div>
                    <div style={{ display:'flex', alignItems:'baseline', gap:4 }}>
                      <span style={{ fontSize:12, fontWeight:600, color:'#111827' }}>{b.pct}%</span>
                      <span style={{ fontSize:11, color: b.trend > 0 ? '#15803D' : '#DC2626' }}>{b.trend > 0 ? '+' : ''}{b.trend}%</span>
                    </div>
                    <div style={{ fontSize:11, color:'#9CA3AF' }}>{b.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </IconCard>

          {/* Weekly Usage Patterns */}
          <IconCard
            icon={<Activity style={{ width:18, height:18, color:C.primary }} />} iconBg="#E3F2FD"
            title="Weekly Usage Patterns"
            subtitle={`Peak day: Tuesday (9,100) • Last 30 Days`}
            topRight={<button style={{ ...inputStyle, display:'inline-flex', alignItems:'center', gap:6, padding:'5px 12px', cursor:'pointer' }}>Last 30 Days <ChevronDown style={{ width:12, height:12 }} /></button>}
          >
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={WEEKLY_USAGE} margin={{ top:4, right:4, left:0, bottom:0 }}>
                <XAxis dataKey="day" tick={{ fontSize:11, fill:'#9CA3AF', fontFamily:'Inter, sans-serif' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:10, fill:'#9CA3AF' }} axisLine={false} tickLine={false} width={36} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(val: number) => [fmtK(val), 'Bookings']} contentStyle={{ borderRadius:8, border:'1px solid #E5E7EB', fontSize:12, fontFamily:'Inter, sans-serif' }} />
                <ReferenceLine y={WEEKLY_AVG} stroke="#9CA3AF" strokeDasharray="4 3" strokeWidth={1.5} />
                <Bar dataKey="bookings" radius={[4,4,0,0]}>
                  {WEEKLY_USAGE.map(d => <Cell key={d.day} fill={d.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:10, paddingTop:10, borderTop:'1px solid #F3F4F6' }}>
              {WEEKLY_USAGE.map(d => (
                <div key={d.day} style={{ textAlign:'center' }}>
                  <div style={{ fontSize:12, fontWeight:600, color: d.trend > 0 ? '#111827' : '#9CA3AF', marginBottom:2 }}>{d.day}</div>
                  <div style={{ fontSize:11, color: d.trend > 0 ? '#15803D' : '#DC2626', fontWeight:600 }}>
                    {d.trend > 0 ? '↑' : '↓'} {Math.abs(d.trend)}%
                  </div>
                </div>
              ))}
            </div>
          </IconCard>
        </div>

        {/* ── Space Type + Gathering Type ─────────────────────────────────── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>

          {/* Space Type Usage */}
          <IconCard
            icon={<Building2 style={{ width:18, height:18, color:C.primary }} />} iconBg="#E3F2FD"
            title="Space Type Usage"
            subtitle="Reservations and utilization by space type (past 90 days)"
          >
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {SPACE_TYPES.map(s => (
                <div key={s.type}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                    <span style={{ fontSize:13, color:'#374151' }}>{s.type}</span>
                    <span style={{ fontSize:12, color:'#9CA3AF' }}>{s.bookings} bookings</span>
                  </div>
                  <div style={{ height:22, backgroundColor:'#F3F4F6', borderRadius:6, overflow:'hidden', position:'relative' }}>
                    <div style={{ width:`${s.pct}%`, height:'100%', backgroundColor:s.color, borderRadius:6, display:'flex', alignItems:'center', paddingLeft:8 }}>
                      <span style={{ fontSize:12, fontWeight:700, color:'#fff' }}>{s.pct}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </IconCard>

          {/* Gathering Type Distribution */}
          <IconCard
            icon={<Users style={{ width:18, height:18, color:C.primary }} />} iconBg="#E3F2FD"
            title="Gathering Type Distribution"
            subtitle="Share of reservations by group size (past 90 days)"
          >
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
              <div style={{ position:'relative', width:180, height:180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={GATHERING_TYPES} dataKey="value" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={2} startAngle={90} endAngle={-270}>
                      {GATHERING_TYPES.map((g, i) => <Cell key={i} fill={g.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', textAlign:'center', pointerEvents:'none' }}>
                  <div style={{ fontSize:22, fontWeight:700, color:'#111827' }}>56%</div>
                  <div style={{ fontSize:11, color:'#6B7280' }}>Individual</div>
                </div>
              </div>
              <div style={{ width:'100%', padding:'8px 16px', borderRadius:8, backgroundColor:'#F9FAFB', border:'1px solid #F3F4F6', textAlign:'center' }}>
                <span style={{ fontSize:13, color:'#6B7280' }}>Avg group size: </span>
                <span style={{ fontSize:13, fontWeight:600, color:'#111827' }}>2.8 people per reservation</span>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px 16px', width:'100%' }}>
                {GATHERING_TYPES.map(g => (
                  <div key={g.name} style={{ display:'flex', alignItems:'center', gap:7 }}>
                    <div style={{ width:10, height:10, borderRadius:'50%', backgroundColor:g.color, flexShrink:0 }} />
                    <span style={{ fontSize:12, color:'#374151' }}>{g.name} <strong>{g.value}%</strong></span>
                  </div>
                ))}
              </div>
            </div>
          </IconCard>
        </div>

        {/* ── Related Tools ───────────────────────────────────────────────── */}
        <SCard style={{ padding:'20px 24px' }}>
          <div style={{ fontSize:13, fontWeight:600, color:'#6B7280', marginBottom:14, textTransform:'uppercase', letterSpacing:'0.06em' }}>Related Tools</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:12 }}>
            {[
              { icon:<TrendingUp style={{ width:16, height:16, color:C.primary }} />,  iconBg:'#E3F2FD', title:'Scenario Planner',  desc:'Model future portfolio configurations by business unit.' },
              { icon:<Building2  style={{ width:16, height:16, color:'#059669' }} />,  iconBg:'#E8F5E8', title:'License Admin',      desc:'Manage licenses, renewals, and compliance in one place.' },
              { icon:<Database   style={{ width:16, height:16, color:C.amber   }} />,  iconBg:'#FFF3E0', title:'Data API',           desc:'Export workplace usage and spend data into your own systems.' },
            ].map(({ icon, iconBg, title, desc }) => (
              <div key={title} style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'14px 16px', borderRadius:10, border:'1px solid #E5E7EB', cursor:'pointer', transition:'box-shadow 150ms' }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.07)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow='none')}
              >
                <div style={{ width:30, height:30, borderRadius:7, backgroundColor:iconBg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:'#111827', marginBottom:3 }}>{title}</div>
                  <div style={{ fontSize:12, color:'#6B7280', lineHeight:1.5 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </SCard>

        </AIAssistant>
      </div>
    </div>
  );
}

export default WorkplaceManagerDashboard;

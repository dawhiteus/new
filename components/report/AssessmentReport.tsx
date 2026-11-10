/// <reference types="vite/client" />
// PDF report of a collection assessment, built with @react-pdf/renderer.
// Loaded on demand (see downloadAssessmentReport.ts) so the PDF engine stays out of the main bundle.
import React from 'react';
import { Document, Page, View, Text, Link, Svg, Defs, LinearGradient, Stop, Rect, Font, StyleSheet } from '@react-pdf/renderer';
import inter400 from '@fontsource/inter/files/inter-latin-400-normal.woff?url';
import inter500 from '@fontsource/inter/files/inter-latin-500-normal.woff?url';
import inter600 from '@fontsource/inter/files/inter-latin-600-normal.woff?url';
import inter700 from '@fontsource/inter/files/inter-latin-700-normal.woff?url';

Font.register({
  family: 'Inter',
  fonts: [
    { src: inter400, fontWeight: 400 },
    { src: inter500, fontWeight: 500 },
    { src: inter600, fontWeight: 600 },
    { src: inter700, fontWeight: 700 },
  ],
});
// Keep words whole: no automatic hyphenation.
Font.registerHyphenationCallback((word) => [word]);

// ── Data the modal hands over ─────────────────────────────────────────────────────────────────────────────────────
export interface ReportCell { value: string; miss: boolean; unknown?: boolean; note?: string }
export interface ReportRow { title: string; venue: string; listing: string; cells: Record<string, ReportCell> }
export interface ReportData {
  collection: string;
  requirement: string;
  company: string;
  assessedOn: string;
  link: string;
  meet: number;
  total: number;
  thinBelow: number;
  criteria: { key: string; label: string; n: number; rule: string }[];
  insight: { title: string; text: string } | null;
  stated: { k: string; v: string }[];
  searched: { k: string; v: string; why?: string; prov: 'Provided' | 'Derived' | 'Assumed' }[];
  columns: { key: string; label: string; sub: string; width: number }[];
  groups: { name: string; summary: string; rows: ReportRow[] }[];
  notAssessed: string[];
}

// ── LiquidSpace Design System v4 tokens ───────────────────────────────────────────────────────────────────────────
const C = {
  ls500: '#005b94', ls50: '#e6f1f8', lsBorder: '#cce3f1', ls700: '#003f66', lsText: '#004d7d',
  headerStart: '#004a7c', headerEnd: '#0071b8',
  text: '#374151', muted: '#6b7280', disabled: '#9ca3af', border: '#e5e7eb', hair: '#f3f4f6', page: '#f8f9fa',
  success: '#28a745', warning: '#ffa500', danger: '#dc3545',
  amberBg: '#fffbeb', amberBorder: '#fde68a', amberText: '#b45309',
};
const rag = (p: number) => (p >= 0.7 ? C.success : p >= 0.4 ? C.warning : C.danger);
const PROV = {
  Provided: { backgroundColor: C.ls50, borderColor: C.lsBorder, color: C.lsText },
  Derived: { backgroundColor: C.hair, borderColor: C.border, color: C.muted },
  Assumed: { backgroundColor: C.amberBg, borderColor: C.amberBorder, color: C.amberText },
};

const s = StyleSheet.create({
  page: { fontFamily: 'Inter', fontSize: 9, color: C.text, paddingTop: 48, paddingBottom: 60, lineHeight: 1.45 },
  body: { paddingHorizontal: 40 },
  eyebrow: { fontSize: 7, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase', color: C.muted },
  h2: { fontSize: 12, fontWeight: 600, color: C.text },
  card: { borderWidth: 1, borderColor: C.border, borderRadius: 8 },
  footText: { fontSize: 7, color: C.muted },
});

// ── Pieces ────────────────────────────────────────────────────────────────────────────────────────────────────────
const Cover = ({ d }: { d: ReportData }) => (
  <View style={{ position: 'relative', height: 168, marginTop: -48, marginBottom: 24 }}>
    <Svg width={612} height={168} style={{ position: 'absolute', top: 0, left: 0 }}>
      <Defs>
        <LinearGradient id="hdr" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={C.headerStart} />
          <Stop offset="0.6" stopColor={C.ls500} />
          <Stop offset="1" stopColor={C.headerEnd} />
        </LinearGradient>
      </Defs>
      <Rect x={0} y={0} width={612} height={168} fill="url(#hdr)" />
    </Svg>
    <View style={{ paddingHorizontal: 40, paddingTop: 30 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', letterSpacing: -0.2 }}>LiquidSpace</Text>
        <View style={{ flexGrow: 1 }} />
        <Text style={{ fontSize: 8, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: '#cce3f1' }}>Collection Assessment</Text>
      </View>
      <Text style={{ marginTop: 50, fontSize: 24, fontWeight: 600, lineHeight: 1.2, color: '#ffffff', letterSpacing: -0.3 }}>{d.collection}</Text>
      <Text style={{ fontSize: 10, color: '#e6f1f8', marginTop: 6 }}>
        {[d.company && `Prepared for ${d.company}`, `${d.requirement} requirement`, `Assessed ${d.assessedOn}`].filter(Boolean).join('  ·  ')}
      </Text>
    </View>
  </View>
);

const Scorecard = ({ d }: { d: ReportData }) => (
  <View style={[s.card, { flexDirection: 'row', overflow: 'hidden' }]}>
    <View style={{ width: 150, padding: 14, backgroundColor: C.page, borderRightWidth: 1, borderRightColor: C.border }}>
      <Text style={s.eyebrow}>Meet every criterion</Text>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginTop: 6 }}>
        <Text style={{ fontSize: 28, fontWeight: 700, lineHeight: 1, color: d.meet >= d.thinBelow ? C.success : d.meet === 0 ? C.danger : C.text }}>{d.meet}</Text>
        <Text style={{ fontSize: 10, fontWeight: 500, marginLeft: 4, marginBottom: 2 }}>of {d.total} spaces</Text>
      </View>
      <Text style={{ fontSize: 8, color: C.muted, marginTop: 6 }}>Thin below {d.thinBelow} confirmed spaces</Text>
    </View>
    {d.criteria.map((k, i) => {
      const p = d.total ? k.n / d.total : 0;
      return (
        <View key={k.key} style={{ flex: 1, padding: 14, borderRightWidth: i < d.criteria.length - 1 ? 1 : 0, borderRightColor: C.border }}>
          <Text style={s.eyebrow}>{k.label}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginTop: 6 }}>
            <Text style={{ fontSize: 18, fontWeight: 600, lineHeight: 1 }}>{k.n}</Text>
            <Text style={{ fontSize: 9, color: C.muted, marginLeft: 3, marginBottom: 1 }}>of {d.total}</Text>
          </View>
          <View style={{ height: 4, borderRadius: 2, backgroundColor: C.hair, marginTop: 8 }}>
            <View style={{ height: 4, borderRadius: 2, width: `${Math.round(p * 100)}%`, backgroundColor: rag(p) }} />
          </View>
          <Text style={{ fontSize: 8, color: C.muted, marginTop: 6 }}>{k.rule}</Text>
        </View>
      );
    })}
  </View>
);

const Insight = ({ i }: { i: { title: string; text: string } }) => (
  <View style={{ flexDirection: 'row', marginTop: 12, padding: 10, borderRadius: 6, backgroundColor: C.amberBg, borderWidth: 1, borderColor: C.amberBorder }}>
    <View style={{ width: 3, borderRadius: 2, backgroundColor: C.amberText, marginRight: 8 }} />
    <Text style={{ flex: 1 }}><Text style={{ fontWeight: 600 }}>{i.title} </Text>{i.text}</Text>
  </View>
);

const Ledger = ({ d }: { d: ReportData }) => (
  <View style={[s.card, { marginTop: 18 }]}>
    <View style={{ flexDirection: 'row', padding: 12 }}>
      <Text style={[s.eyebrow, { width: 110, paddingTop: 2 }]}>Requirement details</Text>
      <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
        {d.stated.map((x) => (
          <View key={x.k} style={{ width: '33.3%', marginBottom: 6 }}>
            <Text style={{ fontSize: 7.5, color: C.muted }}>{x.k}</Text>
            <Text style={{ fontWeight: x.v ? 600 : 400, color: x.v ? C.text : C.muted }}>{x.v || 'Not stated'}</Text>
          </View>
        ))}
      </View>
    </View>
    <View style={{ flexDirection: 'row', padding: 12, backgroundColor: C.page, borderTopWidth: 1, borderTopColor: C.hair, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
      <Text style={[s.eyebrow, { width: 110, paddingTop: 2 }]}>Agent searched</Text>
      <View style={{ flex: 1 }}>
        {d.searched.map((x) => (
          <View key={x.k} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Text style={{ width: 44, fontSize: 7.5, color: C.muted }}>{x.k}</Text>
            <Text style={{ fontWeight: 600 }}>{x.v}</Text>
            {x.why ? <Text style={{ color: C.muted, marginLeft: 4 }}>· {x.why}</Text> : null}
            <View style={[{ marginLeft: 6, paddingHorizontal: 5, paddingTop: 1.5, paddingBottom: 1, borderRadius: 6, borderWidth: 1 }, PROV[x.prov]]}>
              <Text style={{ fontSize: 6.5, fontWeight: 600, lineHeight: 1, color: PROV[x.prov].color }}>{x.prov}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  </View>
);

const SpacesTable = ({ d, g }: { d: ReportData; g: ReportData['groups'][number] }) => (
  <View style={{ marginTop: 20 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }} wrap={false}>
      <Text style={s.h2}>{g.name}</Text>
      <View style={{ marginLeft: 6, backgroundColor: C.ls50, borderWidth: 1, borderColor: C.lsBorder, borderRadius: 8, paddingHorizontal: 5, paddingTop: 2, paddingBottom: 1.5 }}>
        <Text style={{ fontSize: 8, fontWeight: 600, lineHeight: 1, color: C.lsText }}>{g.rows.length}</Text>
      </View>
      <View style={{ flexGrow: 1 }} />
      <Text style={{ fontSize: 8, color: C.muted }}>{g.summary}</Text>
    </View>
    <View>
      <View style={{ flexDirection: 'row', paddingVertical: 7, paddingHorizontal: 12, backgroundColor: C.page, borderRadius: 6 }} fixed>
        <Text style={[s.eyebrow, { flex: 1 }]}>Space</Text>
        {d.columns.map((c) => (
          <View key={c.key} style={{ width: c.width }}>
            <Text style={s.eyebrow}>{c.label}</Text>
            <Text style={{ fontSize: 7.5, color: C.muted }}>{c.sub}</Text>
          </View>
        ))}
      </View>
      {g.rows.map((r, i) => (
        <View key={i} wrap={false} style={{ flexDirection: 'row', paddingVertical: 9, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: C.border }}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={{ fontWeight: 600 }}>{r.title}</Text>
            <Text style={{ fontSize: 8, color: C.muted }}>{r.venue}</Text>
            <Text style={{ fontSize: 7.5, color: C.disabled }}>{r.listing}</Text>
          </View>
          {d.columns.map((c) => {
            const v = r.cells[c.key];
            return (
              <View key={c.key} style={{ width: c.width }}>
                <Text style={{ color: v.unknown ? C.muted : v.miss ? C.danger : C.text, fontWeight: v.miss ? 600 : 400 }}>{v.value}</Text>
                {v.note ? <Text style={{ fontSize: 7.5, color: C.muted }}>{v.note}</Text> : null}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  </View>
);

// Fixed, absolutely placed pieces repeat on every page. Kept as separate elements and anchored from the top
// (Letter is 792pt tall): react-pdf drops a render-prop Text inside a fixed View or anchored by `bottom`.
const Footer = ({ d }: { d: ReportData }) => (
  <>
    <View fixed style={{ position: 'absolute', left: 40, right: 40, bottom: 40, height: 1, backgroundColor: C.border }} />
    <Text fixed style={[s.footText, { position: 'absolute', left: 40, top: 756 }]}>LiquidSpace  ·  {d.collection}  ·  Pulse data may lag up to 24h</Text>
    <Text fixed style={[s.footText, { position: 'absolute', left: 40, right: 40, top: 756, textAlign: 'right' }]} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
  </>
);

const RunningHeader = ({ d }: { d: ReportData }) => (
  <Text fixed style={{ position: 'absolute', top: 22, left: 40, right: 40, fontSize: 7, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase', color: C.muted }}
    render={({ pageNumber }) => (pageNumber > 1 ? `${d.collection}  ·  Collection Assessment` : '')} />
);

// ── Document ──────────────────────────────────────────────────────────────────────────────────────────────────────
export function AssessmentReport({ d }: { d: ReportData }) {
  return (
    <Document title={`${d.collection} — Collection Assessment`} author="LiquidSpace" subject={`${d.requirement} requirement`} creator="LiquidSpace Transaction Manager">
      <Page size="LETTER" style={s.page}>
        <Cover d={d} />
        <View style={s.body}>
          <Scorecard d={d} />
          {d.insight ? <Insight i={d.insight} /> : null}
          <Ledger d={d} />
          {d.groups.map((g) => <SpacesTable key={g.name} d={d} g={g} />)}
          <Text style={{ fontSize: 8, color: C.muted, marginTop: 8 }}>Values in red don’t meet the requirement.</Text>
          {d.notAssessed.length > 0 && (
            <View style={{ marginTop: 16 }} wrap={false}>
              <Text style={[s.eyebrow, { marginBottom: 4 }]}>Not assessed</Text>
              {d.notAssessed.map((t) => <Text key={t} style={{ color: C.muted }}>{t}</Text>)}
            </View>
          )}
          <View wrap={false} style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 8, backgroundColor: C.ls50, borderWidth: 1, borderColor: C.lsBorder }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 10, fontWeight: 600, color: C.lsText }}>See photos, favorite spaces and request tours online</Text>
              <Link src={d.link} style={{ marginTop: 2, color: C.ls500, textDecoration: 'none' }}>{d.link.replace(/^https?:\/\//, '')}</Link>
            </View>
          </View>
        </View>
        <RunningHeader d={d} />
        <Footer d={d} />
      </Page>
    </Document>
  );
}

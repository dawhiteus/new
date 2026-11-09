import { describe, it, expect } from 'vitest';
import { parseRequirement } from '../components/data/requirementParser';
import { CASES as BASE } from './fixtures/emails';
import { CASES2 } from './fixtures/emails2';
const CASES = [...BASE, ...CASES2];

const TODAY = '2026-11-09';

describe('Requirement Agent: reading customer correspondence', () => {
  for (const c of CASES) {
    it(`${c.id}: ${c.title}`, () => {
      const res = parseRequirement(c.text, { today: c.today ?? TODAY, answerMode: c.answerMode });
      const scopes = res.scopes;
      expect(scopes.length, `scopes for ${c.id}`).toBe(c.expect.length);
      c.expect.forEach((e, i) => {
        const sc = scopes[i];
        expect(sc.city, `${c.id}[${i}] city`).toBe(e.city);
        const f = sc.data.fields as Record<string, string | undefined>;
        for (const [k, v] of Object.entries(e.fields ?? {})) expect(f[k], `${c.id}[${i}].${k}`).toBe(v);
        for (const k of e.empty ?? []) expect(f[k] ?? '', `${c.id}[${i}].${k} must stay empty`).toBe('');
        for (const [k, subs] of Object.entries(e.contains ?? {})) for (const s of subs) expect((f[k] ?? '').toLowerCase(), `${c.id}[${i}].${k} contains`).toContain(s.toLowerCase());
        for (const [k, kind] of Object.entries(e.prov ?? {})) expect((sc.data.prov as any)[k]?.kind, `${c.id}[${i}].${k} provenance`).toBe(kind);
        for (const k of e.approx ?? []) expect((sc.data.approx as any)[k], `${c.id}[${i}].${k} approx`).toBe(true);
        for (const k of e.target ?? []) expect((sc.data.target as any)[k], `${c.id}[${i}].${k} target`).toBe(true);
        for (const k of e.ambiguous ?? []) expect(sc.data.ambiguities.some((a) => a.field === k), `${c.id}[${i}] ambiguity on ${k}`).toBe(true);
        for (const n of e.notes ?? []) expect(sc.data.notes.join(' | '), `${c.id}[${i}] notes`).toContain(n);
      });
    });
  }

  it('never fills a field it has no evidence for (every populated field has provenance)', () => {
    for (const c of CASES) {
      const res = parseRequirement(c.text, { today: TODAY, answerMode: c.answerMode });
      res.scopes.forEach((s) => {
        Object.entries(s.data.fields).forEach(([k, v]) => {
          if (v) expect((s.data.prov as any)[k], `${c.id}.${k} has a source note`).toBeTruthy();
        });
      });
    }
  });

  it('rejects implausible values instead of storing them', () => {
    const r = parseRequirement('We need an office in Denver for 90000 people starting 1/1/2099.', { today: TODAY });
    const d = r.scopes[0].data;
    expect(d.fields.capacity ?? '').toBe('');
    expect(d.fields.startDate ?? '').toBe('');
  });

  it('handles empty and malformed input without throwing', () => {
    expect(parseRequirement('', { today: TODAY }).empty).toBe(true);
    expect(parseRequirement('   \n\n  ', { today: TODAY }).empty).toBe(true);
    expect(parseRequirement('@@@ ### %%%', { today: TODAY }).empty).toBe(true);
    expect(() => parseRequirement('<html><body>' + 'x'.repeat(50000) + '</body></html>', { today: TODAY })).not.toThrow();
  });

  it('is deterministic for repeated submissions', () => {
    const t = CASES[0].text;
    expect(JSON.stringify(parseRequirement(t, { today: TODAY }))).toBe(JSON.stringify(parseRequirement(t, { today: TODAY })));
  });
});

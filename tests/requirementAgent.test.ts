import { describe, it, expect } from 'vitest';
import { runIntake, summarize, openQuestions, proposeUpdate, applyChanges, emptyFields, SAMPLE_EMAIL, SAMPLE_RENEWAL, SAMPLE_RENEWAL_LICENSE, type IntakeFields } from '../components/data/intakeAgent';
import { CASES } from './fixtures/emails';

const TODAY = '2026-11-09';
const case_ = (id: string) => CASES.find((c) => c.id === id)!.text;
const fieldsOf = (text: string, i = 0) => runIntake(text, '', { today: TODAY }).drafts[i];

// A saved requirement, as the Details screen would hold it.
const saved = (over: Partial<IntakeFields> = {}): IntakeFields => ({ ...emptyFields(), company: 'Slalom', name: 'Slalom - Lisbon - 25 seats', location: 'Lisbon', capacity: '25', workspaceType: 'Private Office', startDate: '2026-12-01', termLength: '12', budget: '30000', programNeeds: 'Private offices.', amenityNeeds: 'Phone booths and reception.', otherFunctional: 'Preferred area: Saldanha, Avenidas Novas.', ...over });

describe('Agent summary and questions', () => {
  it('summarizes the real extracted requirement, consistent with the fields', () => {
    const d = fieldsOf(SAMPLE_EMAIL, 0);
    const s = summarize(d.fields, d.prov);
    expect(s.text).toContain('private office requirement for Slalom in Lisbon for about 25 people');
    expect(s.text).toContain('Oct 1, 2026');
    expect(s.text).toContain('12-month term');
    expect(s.text).toContain('$30,000 a month');
    expect(s.text).not.toMatch(/filled \d+ of/);
    expect(s.needed).toEqual([]);
  });

  it('flags what is still needed and does not ask about what was answered', () => {
    const d = fieldsOf(case_('short-incomplete'));
    const crit = d.open!.filter((q) => q.tier === 'critical').map((q) => q.field);
    expect(crit).toEqual(['budget', 'startDate']);
    expect(d.open!.some((q) => q.field === 'capacity' || q.field === 'location')).toBe(false);
    expect(summarize(d.fields, d.prov).needed).toEqual(['a monthly budget', 'a start date']);
  });

  it('orders critical questions before useful ones and never asks for optional fields', () => {
    const d = fieldsOf(case_('short-incomplete'));
    const tiers = d.open!.map((q) => q.tier);
    expect(tiers.indexOf('useful')).toBeGreaterThan(tiers.lastIndexOf('critical'));
    expect(d.open!.some((q) => ['closeDate', 'amenityNeeds', 'configuration'].includes(q.field))).toBe(false);
  });

  it('offers a disclosed size estimate but never fills it', () => {
    const d = fieldsOf(case_('short-incomplete'));
    expect(d.fields.size).toBe('');
    const q = d.open!.find((x) => x.field === 'size')!;
    expect(q.suggest?.value).toBe('1800');
  });

  it('treats a contradiction as a question, not a guess', () => {
    const d = fieldsOf(case_('contradiction'));
    expect(d.fields.capacity).toBe('');
    expect(d.questions.some((q) => /25 and 40|25 and 40 people/.test(q))).toBe(true);
  });

  it('reads the two-market sample as two requirements with their own questions', () => {
    const r = runIntake(SAMPLE_EMAIL, '', { today: TODAY });
    expect(r.drafts.map((d) => d.label)).toEqual(['Lisbon', 'Porto']);
    expect(r.drafts[1].questions.some((q) => /budget/.test(q) && /Porto/.test(q))).toBe(true);
    expect(r.drafts[0].questions.some((q) => /budget|start date|many people/i.test(q))).toBe(false);
  });

  it('reports no requirement when the text has none', () => {
    expect(runIntake('Thanks for lunch last week, the tacos were great.', '', { today: TODAY }).found).toBe(false);
    expect(runIntake('', '', { today: TODAY }).found).toBe(false);
  });

  it('still drafts a renewal from a license plus text', () => {
    const r = runIntake(SAMPLE_RENEWAL, SAMPLE_RENEWAL_LICENSE, { today: TODAY });
    const f = r.drafts[0].fields;
    expect(r.license?.licenseId).toBe('TT-2023-003');
    expect(f.location).toBe('New York');
    expect(f.startDate).toBe('2027-04-01');
    expect(f.capacity).toBe('25');
    expect(f.company).toBe('Tel Tech Corporation');
  });

  it('openQuestions is a pure function of the fields', () => {
    const q = openQuestions({ ...emptyFields(), location: 'Denver', capacity: '10' });
    expect(q.filter((x) => x.tier === 'critical').map((x) => x.field)).toEqual(['budget', 'startDate']);
  });
});

describe('Update from text', () => {
  const today = TODAY;
  it('proposes one changed field with before and after, and leaves the rest alone', () => {
    const p = proposeUpdate(saved(), 'Update: we are now at 35 people for Lisbon.', { today });
    expect(p.changes.map((c) => c.field)).toEqual(['capacity', 'name']);
    expect(p.changes[0]).toMatchObject({ field: 'capacity', from: '25', to: '35', kind: 'changed' });
    const a = applyChanges(p.changes, today);
    expect(Object.keys(a.fields)).toEqual(['capacity', 'name']);
    expect(a.fields.budget).toBeUndefined();
  });

  it('proposes several changes together', () => {
    const p = proposeUpdate(saved(), 'Change of plan: we need 30 people, starting March 1, 2027, and the budget is now $34,000 per month.', { today });
    expect(p.changes.map((c) => c.field).sort()).toEqual(['budget', 'capacity', 'name', 'startDate']);
    expect(p.changes.find((c) => c.field === 'budget')).toMatchObject({ from: '30000', to: '34000' });
  });

  it('fills fields that were missing', () => {
    const p = proposeUpdate(saved({ size: '', closeDate: '' }), 'We need about 5,000 sq ft and we plan to sign by December 18.', { today });
    expect(p.changes.map((c) => [c.field, c.kind])).toEqual(expect.arrayContaining([['size', 'new'], ['closeDate', 'new']]));
  });

  it('recognizes an email that only repeats what is recorded', () => {
    const p = proposeUpdate(saved(), 'Just confirming: 25 people in Lisbon, $30,000 per month, 12 months.', { today });
    expect(p.changes).toEqual([]);
    expect(p.unchanged).toEqual(expect.arrayContaining(['capacity', 'budget', 'termLength']));
    expect(p.found).toBe(true);
  });

  it('finds nothing in an email with no requirement details', () => {
    const p = proposeUpdate(saved(), 'Thanks for the call yesterday. Talk next week!', { today });
    expect(p.changes).toEqual([]);
    expect(p.found).toBe(false);
  });

  it('keeps the existing value when the new text is unsure', () => {
    const p = proposeUpdate(saved(), 'We might need 40 people, not sure yet.', { today });
    expect(p.changes.find((c) => c.field === 'capacity')).toBeUndefined();
    expect(p.unclear.join(' ')).toMatch(/40/);
  });

  it('does not apply a conflicting statement inside the update', () => {
    const p = proposeUpdate(saved(), 'We need 30 people. The team will be 45 people.', { today });
    expect(p.changes.find((c) => c.field === 'capacity')).toBeUndefined();
    expect(p.unclear.length).toBeGreaterThan(0);
  });

  it('a newer instruction in a thread supersedes the earlier one', () => {
    const t = `Make it 28 people.\n\nOn Mon, Nov 2, 2026 at 9:00 AM Maria <m@slalom.com> wrote:\n> We need 22 people.`;
    const p = proposeUpdate(saved(), t, { today });
    expect(p.changes.find((c) => c.field === 'capacity')).toMatchObject({ to: '28' });
  });

  it('adds new amenities without dropping existing ones', () => {
    const p = proposeUpdate(saved(), 'Please also include parking and bike storage.', { today });
    const c = p.changes.find((x) => x.field === 'amenityNeeds')!;
    expect(c.kind).toBe('added');
    expect(c.to).toContain('Phone booths');
    expect(c.to.toLowerCase()).toContain('parking');
  });

  it('replaces only the area line of other requirements', () => {
    const p = proposeUpdate(saved({ otherFunctional: 'Preferred area: Saldanha. Needs step-free access.' }), 'We would now prefer to be in Parque das Nações.', { today });
    const c = p.changes.find((x) => x.field === 'otherFunctional')!;
    expect(c.to).toContain('Parque das Nações');
    expect(c.to).toContain('Needs step-free access.');
    expect(c.to).not.toContain('Saldanha');
  });

  it('warns about sourcing consequences without touching the collection', () => {
    const p = proposeUpdate(saved(), 'We are now 40 people.', { today, hasCollection: true });
    expect(p.consequence).toMatch(/Collection is not changed automatically/);
    const none = proposeUpdate(saved(), 'Please include parking.', { today, hasCollection: true });
    expect(none.consequence).toBeNull();
  });

  it('refuses to apply a different location silently', () => {
    const p = proposeUpdate(saved(), 'Actually we want Porto, for 12 people.', { today });
    expect(p.changes.find((c) => c.field === 'location')?.note).toMatch(/different location/);
  });

  it('applyChanges records provenance and keeps untouched fields out', () => {
    const p = proposeUpdate(saved(), 'We need about 30 people.', { today });
    const a = applyChanges(p.changes, today);
    expect(a.prov.capacity).toMatchObject({ kind: 'source', approx: true });
    expect(a.fields.budget).toBeUndefined();
  });

  it('answers to open questions use the same path', () => {
    const p = proposeUpdate(saved({ budget: '' }), '$25k a month', { today });
    expect(p.changes[0]).toMatchObject({ field: 'budget', to: '25000', kind: 'new' });
    const short = proposeUpdate(saved({ budget: '' }), '$25k', { today });
    expect(short.changes[0]).toMatchObject({ field: 'budget', to: '25000', inferred: true });
  });

  it('cancelling leaves the record exactly as it was (proposals are pure)', () => {
    const before = saved();
    const snapshot = JSON.stringify(before);
    proposeUpdate(before, 'We need 99 people and $90,000 a month starting June 1.', { today });
    expect(JSON.stringify(before)).toBe(snapshot);
  });

  it('handles empty and malformed updates', () => {
    expect(proposeUpdate(saved(), '', { today }).found).toBe(false);
    expect(proposeUpdate(saved(), '   ', { today }).changes).toEqual([]);
    expect(() => proposeUpdate(saved(), '\u0000\u0001 ???', { today })).not.toThrow();
  });
});

describe('Realistic follow-up email', () => {
  const today = TODAY;
  const current = saved({ location: 'Denver', capacity: '18', size: '3000', budget: '22000', startDate: '2027-01-15', termLength: '24', amenityNeeds: 'Phone booths.', otherCommercial: '', otherFunctional: 'Preferred area: LoDo, near Union Station.' });
  const email = `Hi Brent,

Quick update from Priya: the team is now 24 people, so we'll need more room, probably 4,000 sq ft. Budget moves up to $28,000 per month, and we'd like to start Feb 1, 2027 instead. Everything else stays the same. Also please make sure there is parking and bike storage.

Priya`;
  it('finds every change, keeps a hedge on only the field it applies to, and invents nothing', () => {
    const p = proposeUpdate(current, email, { today });
    const by = Object.fromEntries(p.changes.map((c) => [c.field, c]));
    expect(by.capacity).toMatchObject({ from: '18', to: '24' });
    expect(by.size).toMatchObject({ from: '3000', to: '4000', approx: true });
    expect(by.budget).toMatchObject({ from: '22000', to: '28000' });
    expect(by.startDate).toMatchObject({ from: '2027-01-15', to: '2027-02-01', target: true });
    expect(by.amenityNeeds.to).toBe('Phone booths, parking, bike storage.');
    expect(by.otherCommercial).toBeUndefined();
    expect(by.termLength).toBeUndefined();
    expect(by.location).toBeUndefined();
    expect(p.unclear).toEqual([]);
  });
});

describe('Names follow the headcount', () => {
  it('proposes a matching name change only when the name was generated from the old headcount', () => {
    const p = proposeUpdate(saved(), 'We are now 30 people.', { today: TODAY });
    expect(p.changes.find((c) => c.field === 'name')).toMatchObject({ from: 'Slalom - Lisbon - 25 seats', to: 'Slalom - Lisbon - 30 seats' });
    const custom = proposeUpdate(saved({ name: 'Lisbon expansion' }), 'We are now 30 people.', { today: TODAY });
    expect(custom.changes.find((c) => c.field === 'name')).toBeUndefined();
  });
});

describe('Create, save, reopen, update (state flow)', () => {
  it('carries a requirement from pasted email through two updates without losing or duplicating anything', () => {
    // 1. create from a pasted email
    const email = `Hi Brent, we're opening a Denver office for the Brightline Health sales team, about 18 people. Private offices please. We'd like to start March 1, 2027 on a 2 year term. Budget around $22k a month.\n\nThanks,\nPriya Shah\nVP Operations\nBrightline Health`;
    const draft = runIntake(email, '', { today: TODAY }).drafts[0];
    let record: IntakeFields = { ...draft.fields };
    expect(record).toMatchObject({ company: 'Brightline Health', location: 'Denver', capacity: '18', workspaceType: 'Private Office', startDate: '2027-03-01', termLength: '24', budget: '22000' });
    // 2. answer an open question
    const answer = proposeUpdate(record, 'About 3,500 sq ft', { today: TODAY });
    record = { ...record, ...applyChanges(answer.changes, TODAY).fields };
    expect(record.size).toBe('3500');
    // 3. reopen later and update from a follow-up
    const followUp = 'Update: we are now 22 people and would like to start April 1, 2027 instead.';
    const p1 = proposeUpdate(record, followUp, { today: TODAY });
    expect(p1.changes.map((c) => c.field).sort()).toEqual(['capacity', 'name', 'startDate']);
    const before = { ...record };
    record = { ...record, ...applyChanges(p1.changes, TODAY).fields };
    expect(record).toMatchObject({ capacity: '22', startDate: '2027-04-01', budget: '22000', size: '3500', location: 'Denver' });
    expect(record.company).toBe(before.company);
    // 4. the same email pasted again changes nothing
    const p2 = proposeUpdate(record, followUp, { today: TODAY });
    expect(p2.changes).toEqual([]);
    expect(p2.unchanged).toEqual(expect.arrayContaining(['capacity', 'startDate']));
    // 5. questions track the record
    expect(openQuestions(record).filter((q) => q.tier === 'critical')).toEqual([]);
  });
});

describe('Short, direct update instructions', () => {
  const cur = saved({ location: 'Madrid', capacity: '25', budget: '30000', termLength: '12', startDate: '2026-10-01', size: '3000' });
  const one = (text: string) => proposeUpdate(cur, text, { today: TODAY }).changes.filter((c) => c.field !== 'name').map((c) => [c.field, c.to]);
  it('reads the phrasings people actually type', () => {
    expect(one('Change capacity to 35. Keep other details the same')).toEqual([['capacity', '35']]);
    expect(one('Capacity should be 40')).toEqual([['capacity', '40']]);
    expect(one('Headcount: 40')).toEqual([['capacity', '40']]);
    expect(one('Make it 40 people')).toEqual([['capacity', '40']]);
    expect(one('Increase the headcount from 25 to 32')).toEqual([['capacity', '32']]);
    expect(one('Budget is now $35,000')).toEqual([['budget', '35000']]);
    expect(one('Budget to 35k')).toEqual([['budget', '35000']]);
    expect(one('Push the start date to May 1, 2027')).toEqual([['startDate', '2027-05-01']]);
    expect(one('Term should be 18 months')).toEqual([['termLength', '18']]);
    expect(one('Change the size to 5,000 sq ft')).toEqual([['size', '5000']]);
  });
  it('finds a contact name for the missing-details task', () => {
    const r = runIntake(case_('short-incomplete'), '', { today: TODAY });
    expect(r.found).toBe(true);
    const named = runIntake('We need space in Madrid for 25 people.\n\nThanks,\nMaria Alves\nSlalom', '', { today: TODAY });
    expect(named.contact).toBe('Maria Alves');
  });
});

import { describe, it, expect } from 'vitest';
import { AGREEMENT_TYPES, toAgreementType, mockLicenses } from '../components/data/trackerLicenses';
import { WORKSPACE_TYPES } from '../components/data/requirementParser';
import { LICENSE_REGISTRY } from '../components/data/licenseRegistry';

describe('License Administrator Agreement Types', () => {
  it('offers the five agreement types License Administrator records', () => {
    expect(AGREEMENT_TYPES).toEqual([
      'Dedicated (External License)', 'Dedicated (LiquidSpace)', 'Traditional Lease', 'Virtual Office', 'Managed Space',
    ]);
  });

  it('maps earlier labels to the current ones', () => {
    expect(toAgreementType('Dedicated (External)')).toBe('Dedicated (External License)');
    expect(toAgreementType('Dedicated (LiquidSpace License)')).toBe('Dedicated (LiquidSpace)');
    expect(toAgreementType('Flex (Hourly)')).toBe('On-Demand');
  });

  it('keeps an unrecognised value instead of re-labelling it', () => {
    expect(toAgreementType('Coworking Membership')).toBe('Coworking Membership');
  });

  it('every demo license already carries a current Agreement Type', () => {
    for (const l of mockLicenses) expect(AGREEMENT_TYPES).toContain(l.type);
  });

  it('the license registry reports Agreement Type separately from Contract Type', () => {
    for (const r of LICENSE_REGISTRY) {
      expect(AGREEMENT_TYPES).toContain(r.agreementType);
      expect(AGREEMENT_TYPES).not.toContain(r.contractType);
    }
  });

  it('Space Type (physical) is a separate vocabulary', () => {
    for (const t of WORKSPACE_TYPES) expect(AGREEMENT_TYPES).not.toContain(t);
  });
});

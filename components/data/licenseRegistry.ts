// Licenses as held in License Admin: customer, license ID, location, end date and notification date.
// Dates are relative to today so the demo always has licenses approaching their notification date.
const DAY = 86400000;
const iso = (offsetDays: number) => {
  const d = new Date(Date.now() + offsetDays * DAY);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export interface RegistryLicense {
  licenseId: string;
  customer: string;
  operator: string;
  city: string;
  state: string;
  seats: number;
  sizeSf: number;
  monthlyCost: number;
  contractType: string;
  renewalMechanism: string;
  notificationPeriod: string;
  /** ISO. The day the license ends. */
  termEnd: string;
  /** ISO. The day the customer must say what they intend to do (renew, exit, ...). */
  noticeDate: string;
}

const L = (licenseId: string, customer: string, operator: string, city: string, state: string, seats: number, sizeSf: number, monthlyCost: number,
  renewalMechanism: string, noticeDays: number, noticeIn: number): RegistryLicense => ({
  licenseId, customer, operator, city, state, seats, sizeSf, monthlyCost, contractType: 'Fixed-Term', renewalMechanism,
  notificationPeriod: `${noticeDays} Days`, noticeDate: iso(noticeIn), termEnd: iso(noticeIn + noticeDays),
});

export const LICENSE_REGISTRY: RegistryLicense[] = [
  L('SLA-2024-031', 'Northstar Foods', 'Regus', 'Minneapolis', 'MN', 30, 4600, 8100, 'Renewal by Mutual Agreement', 60, -12),
  L('SLA-2024-014', 'Brightline Health', 'Hays Office Properties', 'Minneapolis', 'MN', 28, 4200, 7200, 'Auto-Renewal', 90, 24),
  L('SLA-2023-007', 'Meridian Capital', 'Regus', 'Dallas', 'TX', 40, 5000, 11800, 'Renewal by Mutual Agreement', 60, 51),
  L('SLA-2024-022', 'Slalom', 'Industrious', 'Chicago', 'IL', 18, 2900, 9400, 'Renewal by Mutual Agreement', 90, 88),
  L('SLA-2025-003', 'Tel Tech Corporation', 'WeWork', 'Austin', 'TX', 12, 2100, 4900, 'Auto-Renewal', 60, 131),
  L('SLA-2025-011', 'Canary Group', 'IWG', 'Lisbon', 'PT', 22, 3300, 12600, 'Renewal by Mutual Agreement', 90, 171),
  L('SLA-2025-019', 'Halcyon Labs', 'Industrious', 'New York', 'NY', 55, 7800, 41000, 'Renewal by Mutual Agreement', 120, 290),
];

export const daysUntil = (isoDate: string) =>
  Math.round((new Date(isoDate + 'T00:00:00').getTime() - new Date(new Date().toDateString()).getTime()) / DAY);

/** Soonest notification date first (overdue ones lead). */
export const byNoticeDate = (a: RegistryLicense, b: RegistryLicense) => a.noticeDate.localeCompare(b.noticeDate);

/** Licenses whose notification date falls within the next `months` months (or has already passed). */
export const needingDecision = (months = 6) => LICENSE_REGISTRY.filter((l) => daysUntil(l.noticeDate) <= months * 30.5).sort(byNoticeDate);

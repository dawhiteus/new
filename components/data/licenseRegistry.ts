// Licenses as held in License Admin, read from the License Tracker rows: customer, license ID, location, end date and notification date.
import { mockLicenses, isISODate } from './trackerLicenses';
const DAY = 86400000;

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
  /** ISO. The day the license ends. Empty for auto-renewing licenses. */
  termEnd: string;
  /** ISO. The day the customer must say what they intend to do (renew, exit, ...). */
  noticeDate: string;
}

const toRegistry = (r: any): RegistryLicense => {
  const [city, state = ''] = String(r.location || r.city).split(',').map((x: string) => x.trim());
  const fixed = isISODate(r.endDate);
  return {
    licenseId: r.licenseId, customer: r.customer, operator: r.operator, city, state,
    seats: r.seats, sizeSf: r.squareFootage, monthlyCost: r.cost, contractType: r.type,
    renewalMechanism: fixed ? 'Renewal by Mutual Agreement' : 'Auto-Renewal',
    notificationPeriod: r.notificationPeriod, termEnd: fixed ? r.endDate : '', noticeDate: r.noticeDate,
  };
};

/** One row per tracker license that is still live (archived ones are left out). */
export const LICENSE_REGISTRY: RegistryLicense[] = mockLicenses.filter((r: any) => r.status !== 'Archived').map(toRegistry);
export const registryFor = (trackerId: number) => { const r = mockLicenses.find((x: any) => x.id === trackerId); return r ? toRegistry(r) : undefined; };

export const daysUntil = (isoDate: string) =>
  Math.round((new Date(isoDate + 'T00:00:00').getTime() - new Date(new Date().toDateString()).getTime()) / DAY);

/** Soonest notification date first (overdue ones lead). */
export const byNoticeDate = (a: RegistryLicense, b: RegistryLicense) => a.noticeDate.localeCompare(b.noticeDate);

/** Licenses whose notification date falls within the next `months` months (or has already passed). */
export const needingDecision = (months = 6) => LICENSE_REGISTRY.filter((l) => daysUntil(l.noticeDate) <= months * 30.5).sort(byNoticeDate);

// Information architecture + permission profiles.
// Single source of truth — import this everywhere, never duplicate the IA.

export interface NavItemDef {
  id: string;
  icon: string;
  label: string;
  url?: string;
  badge?: number | string;
  locked?: boolean;
  children?: NavItemDef[];
}

export interface NavGroup {
  id: string;
  label: string;
  internalOnly?: boolean;
  items: NavItemDef[];
}

export interface Product {
  id: string;
  label: string;
  icon: string;
  color: string;
  tagline: string;
  description: string;
  defaultPage: string;
  groups: NavGroup[];
}

export type ProductAccess =
  | { unlocked: true; items: '*' | string[] }
  | { unlocked: false; reason: string };

export interface Profile {
  key: string;
  label: string;
  shortLabel: string;
  role: string;
  name: string;
  initials: string;
  org: string;
  orgLogo: 'att' | null;
  products: Record<string, ProductAccess>;
  showInternal: boolean;
  notificationCount: number;
}

export interface RecentItem {
  id: string;
  product: string;
  icon: string;
  label: string;
}

export interface PageMeta extends NavItemDef {
  productId: string;
  productLabel: string;
  groupId: string;
  groupLabel: string;
}

// ── Information architecture ──────────────────────────────────────────

export const IA: Record<string, Product> = {
  ops: {
    id: 'ops',
    label: 'Workplace Operations',
    icon: 'briefcase',
    color: '#005b94',
    tagline: 'Run the workspace portfolio',
    description: 'Workplace inventory, licenses, payments, and deal flow.',
    defaultPage: 'license-tracker',
    groups: [
      {
        id: 'wm',
        label: 'Workplace Manager',
        items: [
          { id: 'dashboard',       icon: 'home',         label: 'Dashboard',  url: 'https://transaction-manager-git-main-david-4453s-projects.vercel.app/workplace/dashboard' },
          { id: 'teams',           icon: 'users',        label: 'Teams',      url: 'https://transaction-manager-git-main-david-4453s-projects.vercel.app/workplace/teams' },
          { id: 'locations',       icon: 'map-pinned',   label: 'Locations',  url: 'https://transaction-manager-git-main-david-4453s-projects.vercel.app/workplace/locations' },
          { id: 'activity',        icon: 'activity',     label: 'Activity',   children: [
            { id: 'reservations', icon: 'calendar', label: 'Reservations', url: 'https://transaction-manager-git-main-david-4453s-projects.vercel.app/workplace/activity/reservations' },
            { id: 'searches',     icon: 'search',   label: 'Searches',     url: 'https://transaction-manager-git-main-david-4453s-projects.vercel.app/workplace/activity/searches'     },
            { id: 'reviews',      icon: 'star',     label: 'Reviews',      url: 'https://transaction-manager-git-main-david-4453s-projects.vercel.app/workplace/activity/reviews'      },
          ]},
          { id: 'setup',           icon: 'settings',     label: 'Setup',      url: 'https://transaction-manager-git-main-david-4453s-projects.vercel.app/workplace/setup' },
          { id: 'branding',        icon: 'palette',      label: 'Branding',   url: 'https://transaction-manager-git-main-david-4453s-projects.vercel.app/workplace/branding' },
        ],
      },
      {
        id: 'la',
        label: 'License Administrator',
        items: [
          { id: 'license-tracker', icon: 'file',         label: 'License Tracker', url: 'https://transaction-manager-git-main-david-4453s-projects.vercel.app/license/tracker' },
          { id: 'payments',        icon: 'credit-card',  label: 'Payments',        url: 'https://transaction-manager-git-main-david-4453s-projects.vercel.app/license/payments' },
          { id: 'funding',         icon: 'dollar-sign',  label: 'Funding Sources', url: 'https://transaction-manager-git-main-david-4453s-projects.vercel.app/license/funding' },
          { id: 'tasks',           icon: 'check-square', label: 'Tasks',           url: 'https://transaction-manager-git-main-david-4453s-projects.vercel.app/license/tasks' },
        ],
      },
      {
        id: 'tm',
        label: 'Transaction Manager',
        items: [
          { id: 'transactions', icon: 'book-open',    label: 'Transactions', url: 'https://transaction-manager-git-main-david-4453s-projects.vercel.app/transactions/list' },
          { id: 'tm-tasks',     icon: 'check-square', label: 'Tasks',        url: 'https://transaction-manager-git-main-david-4453s-projects.vercel.app/transactions/tasks' },
        ],
      },
    ],
  },
  strategy: {
    id: 'strategy',
    label: 'Workplace Strategist',
    icon: 'bar-chart',
    color: '#00b8c4',
    tagline: 'Plan the portfolio',
    description: 'Portfolio analytics, spend modeling, hub planning.',
    defaultPage: 'portfolio-compiler',
    groups: [
      {
        id: 'tools',
        label: 'Workplace Strategist',
        items: [
          { id: 'portfolio-compiler', icon: 'layers',    label: 'Portfolio Compiler', url: 'https://workplacestrategist-internal.vercel.app/portfolio-compiler' },
          { id: 'scenario-modeler',   icon: 'sliders',   label: 'Scenario Modeler', url: 'https://workplacestrategist-internal.vercel.app/scenario-modeler' },
          { id: 'hub-locator',        icon: 'map',       label: 'Hub Locator',        url: 'https://workplacestrategist-internal.vercel.app/hub-locator' },
        ],
      },
    ],
  },
};

// Injected into Operations sidebar for LS admins only.
export const INTERNAL_OPS_GROUP: NavGroup = {
  id: 'internal-ops',
  label: 'Internal Tools',
  internalOnly: true,
  items: [
    { id: 'audit-log',     icon: 'shield',     label: 'Audit Log' },
    { id: 'agent-console', icon: 'bot',        label: 'Agent Console', badge: 'NEW' },
    { id: 'org-browser',   icon: 'building-2', label: 'Org Browser' },
  ],
};

// ── Permission profiles ───────────────────────────────────────────────

export const PROFILES: Record<string, Profile> = {
  internal: {
    key: 'internal',
    label: 'Internal LS Admin',
    shortLabel: 'Internal',
    role: 'Operations Admin · LiquidSpace',
    name: 'Daria Wallace',
    initials: 'DW',
    org: 'LiquidSpace HQ',
    orgLogo: null,
    products: {
      ops:      { unlocked: true, items: '*' },
      strategy: { unlocked: true, items: '*' },
    },
    showInternal: true,
    notificationCount: 7,
  },
  enterprise_admin: {
    key: 'enterprise_admin',
    label: 'Customer Admin (AT&T)',
    shortLabel: 'Cust. Admin',
    role: 'Workplace Admin · AT&T',
    name: 'David Whitehurst',
    initials: 'DW',
    org: 'AT&T',
    orgLogo: 'att',
    products: {
      ops:      { unlocked: true, items: '*' },
      strategy: { unlocked: true, items: '*' },
    },
    showInternal: false,
    notificationCount: 2,
  },
  enterprise_member: {
    key: 'enterprise_member',
    label: 'Customer Member',
    shortLabel: 'Member',
    role: 'Booker · AT&T',
    name: 'Patrick Henkel',
    initials: 'PH',
    org: 'AT&T',
    orgLogo: 'att',
    products: {
      ops:      { unlocked: true, items: ['dashboard', 'license-tracker', 'tasks', 'requirements'] },
      strategy: { unlocked: false, reason: 'Available to Workplace Admins' },
    },
    showInternal: false,
    notificationCount: 2,
  },
};

// ── Recently visited ──────────────────────────────────────────────────

export const RECENTS: RecentItem[] = [
  { id: 'license-tracker', product: 'ops',      icon: 'file',        label: 'License Tracker' },
  { id: 'hub-locator',     product: 'strategy', icon: 'map',         label: 'Hub Locator' },
  { id: 'payments',        product: 'ops',      icon: 'credit-card', label: 'Payments' },
];

// ── Helpers ───────────────────────────────────────────────────────────

export function visibleGroups(profile: Profile, productId: string): NavGroup[] {
  const product = IA[productId];
  if (!product) return [];
  const out: NavGroup[] = product.groups.map(g => ({
    ...g,
    items: g.items.map(it => ({
      ...it,
      locked: !pageAccessible(profile, productId, it.id),
      children: it.children?.map(child => ({
        ...child,
        locked: !pageAccessible(profile, productId, child.id),
      })),
    })),
  }));
  return out;
}

export function productAccessible(profile: Profile, productId: string): boolean {
  return !!(profile.products[productId]?.unlocked);
}

export function pageAccessible(profile: Profile, productId: string, pageId: string): boolean {
  const p = profile.products[productId];
  if (!p?.unlocked) return false;
  if (p.items === '*') return true;
  return (p.items as string[]).includes(pageId);
}

export function firstAccessiblePage(profile: Profile, productId: string): string | null {
  for (const g of visibleGroups(profile, productId)) {
    for (const it of g.items) {
      if (!it.locked) return it.id;
    }
  }
  return null;
}

export function findPageByUrlPath(pathname: string): { pageId: string; productId: string } | null {
  for (const productId of Object.keys(IA)) {
    for (const g of IA[productId].groups) {
      for (const item of g.items) {
        if (item.url) {
          try {
            const itemPath = new URL(item.url).pathname;
            if (itemPath === pathname) return { pageId: item.id, productId };
          } catch {}
        }
        for (const child of item.children ?? []) {
          if (child.url) {
            try {
              const childPath = new URL(child.url).pathname;
              if (childPath === pathname) return { pageId: child.id, productId };
            } catch {}
          }
        }
      }
    }
  }
  return null;
}

export function findItemById(productId: string, itemId: string): NavItemDef | null {
  for (const g of IA[productId]?.groups ?? []) {
    for (const item of g.items) {
      if (item.id === itemId) return item;
      const child = item.children?.find(c => c.id === itemId);
      if (child) return child;
    }
  }
  return null;
}

export function firstAccessibleProduct(profile: Profile): string | null {
  for (const id of Object.keys(IA)) {
    if (productAccessible(profile, id)) return id;
  }
  return null;
}

export function findPage(pageId: string): PageMeta | null {
  for (const productId of Object.keys(IA)) {
    for (const g of IA[productId].groups) {
      const it = g.items.find(i => i.id === pageId);
      if (it) {
        return {
          ...it,
          productId,
          productLabel: IA[productId].label,
          groupId: g.id,
          groupLabel: g.label,
        };
      }
    }
  }
  for (const it of INTERNAL_OPS_GROUP.items) {
    if (it.id === pageId) {
      return {
        ...it,
        productId: 'ops',
        productLabel: IA.ops.label,
        groupId: 'internal-ops',
        groupLabel: INTERNAL_OPS_GROUP.label,
      };
    }
  }
  return null;
}

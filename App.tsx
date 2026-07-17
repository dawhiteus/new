import React, { useState } from 'react';

import { SidebarA } from './nav/SidebarA';
import { ChromeHeader } from './nav/ChromeHeader';
import { PageHeaderBand, BandAction, ContextToolbar, type PageBandMeta } from './nav/PageHeaderBand';
import {
  IA,
  PROFILES,
  firstAccessibleProduct,
  firstAccessiblePage,
  pageAccessible,
  findItemById,
  type Profile,
  type NavItemDef,
} from './nav/nav-data';

const DEFAULT_PROFILE = PROFILES.enterprise_admin;

// ── Demo copy per page (subtitle + optional page action) ─────────────────

const PAGE_COPY: Record<string, { subtitle: string; action?: string }> = {
  'dashboard':          { subtitle: 'Monitor adoption, engagement, and spend across your workplace portfolio.' },
  'teams':              { subtitle: 'Manage team membership, permissions, budgets, and communication settings.' },
  'locations':          { subtitle: 'Manage the locations your members can access. Curate brands, set preferred locations, and add HQ and Hub locations.', action: '+ Add HQ' },
  'reservations':       { subtitle: 'Track on-demand and dedicated reservations across your portfolio.' },
  'searches':           { subtitle: 'See what your members are searching for and where.' },
  'reviews':            { subtitle: 'Member ratings and reviews from completed reservations.' },
  'setup':              { subtitle: 'Manage account details, admins, enrollment, and integrations.' },
  'branding':           { subtitle: 'Customize your members’ branded experience across web, portal, and email.' },
  'license-tracker':    { subtitle: 'View and manage all workspace licenses in one place.' },
  'payments':           { subtitle: 'Track payments, invoices, and billing activity.' },
  'funding':            { subtitle: 'Manage funding sources and payment methods.' },
  'tasks':              { subtitle: 'Stay on top of license administration tasks.', action: '+ Add Task' },
  'transactions':       { subtitle: 'Manage your workspace requirements and track opportunities.', action: '+ New Requirement' },
  'tm-tasks':           { subtitle: 'Tasks are the unit of work. Tasks can be completed by people or by agents.', action: '+ Add Task' },
};

// Find item + its group/product labels, searching children too.
function findMeta(productId: string, pageId: string): { item: NavItemDef; groupLabel: string; productLabel: string } | null {
  const product = IA[productId];
  if (!product) return null;
  for (const g of product.groups) {
    for (const item of g.items) {
      if (item.id === pageId) return { item, groupLabel: g.label, productLabel: product.label };
      const child = item.children?.find(c => c.id === pageId);
      if (child) return { item: child, groupLabel: g.label, productLabel: product.label };
    }
  }
  return null;
}

// ── Stub page — renders the correct header tier + placeholder canvas ─────

function StubPage({ productId, pageId }: { productId: string; pageId: string }) {
  const meta = findMeta(productId, pageId);
  if (!meta) return <div style={{ flex: 1, background: '#f8f9fa' }} />;

  const isWorkbench = productId === 'strategy';
  const copy = PAGE_COPY[pageId];

  const band: PageBandMeta = {
    icon: meta.item.icon,
    label: meta.item.label,
    subtitle: copy?.subtitle ?? `${meta.productLabel} · ${meta.groupLabel}`,
  };

  return (
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', background: '#f8f9fa', overflowY: 'auto' }}>
      {isWorkbench ? (
        <ContextToolbar
          pageLabel={meta.item.label}
          dataAsOf="Data as of Jul 17, 2026 · 12:05 PM"
        />
      ) : (
        <PageHeaderBand meta={band} action={copy?.action ? <BandAction label={copy.action} /> : undefined} />
      )}

      {/* Placeholder canvas — destination apps own this space */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <div style={{
          border: '2px dashed #d1d5db',
          borderRadius: 14,
          padding: '38px 54px',
          textAlign: 'center',
          color: '#9ca3af',
          fontSize: 13,
          lineHeight: 1.7,
        }}>
          <div style={{ fontWeight: 600, color: '#6b7280', fontSize: 14 }}>
            {meta.item.label} — destination app content
          </div>
          {isWorkbench
            ? 'Tier 2 header: slim context toolbar (analytical workbench)'
            : 'Tier 1 header: blue page header band (operational page)'}
          {meta.item.url && (
            <div style={{ marginTop: 10 }}>
              <a
                href={meta.item.url}
                target="_blank"
                rel="noreferrer"
                style={{ color: '#005b94', fontWeight: 500, textDecoration: 'none' }}
              >
                Open live page ↗
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [productId, setProductId] = useState<string>(
    () => firstAccessibleProduct(DEFAULT_PROFILE) ?? 'ops'
  );
  const [activeId, setActiveId] = useState<string>(() => {
    if (pageAccessible(DEFAULT_PROFILE, 'strategy', 'portfolio-compiler')) return 'portfolio-compiler';
    return firstAccessiblePage(DEFAULT_PROFILE, 'strategy') ?? 'license-tracker';
  });

  const profile: Profile = DEFAULT_PROFILE;

  const handleSelectPage = (pageId: string, overrideProductId?: string) => {
    const pid = overrideProductId ?? productId;
    if (!pageAccessible(profile, pid, pageId)) return;
    const item = findItemById(pid, pageId);
    // Parent items with children only toggle expansion in the sidebar
    if (item?.children?.length) return;
    if (overrideProductId && overrideProductId !== productId) setProductId(overrideProductId);
    setActiveId(pageId);
  };

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      color: '#374151',
      background: '#fff',
      overflow: 'hidden',
    }}>
      {/* Chrome header — customer logo first, "Powered by LiquidSpace" second */}
      <ChromeHeader profile={profile} showCoBrand />

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <SidebarA
          profile={profile}
          productId={productId}
          activeId={activeId}
          onSelectPage={handleSelectPage}
        />

        {/* In-prototype stub page: renders the correct page-header tier */}
        <StubPage productId={productId} pageId={activeId} />
      </div>
    </div>
  );
}

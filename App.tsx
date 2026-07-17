import React, { useState, useEffect } from 'react';

import { SidebarA } from './nav/SidebarA';
import {
  IA,
  PROFILES,
  firstAccessibleProduct,
  firstAccessiblePage,
  pageAccessible,
  findItemById,
  type Profile,
} from './nav/nav-data';

const DEFAULT_PROFILE = PROFILES.enterprise_admin;

export default function App() {
  const [productId, setProductId] = useState<string>(
    () => firstAccessibleProduct(DEFAULT_PROFILE) ?? 'ops'
  );
  const [activeId, setActiveId] = useState<string>(() => {
    if (pageAccessible(DEFAULT_PROFILE, 'ops', 'license-tracker')) return 'license-tracker';
    return firstAccessiblePage(DEFAULT_PROFILE, 'ops') ?? 'license-tracker';
  });

  const profile: Profile = DEFAULT_PROFILE;

  const handleSelectProduct = (nextProductId: string, nextPageId?: string) => {
    setProductId(nextProductId);
    setActiveId(nextPageId ?? firstAccessiblePage(profile, nextProductId) ?? 'license-tracker');
  };

  const handleSelectPage = (pageId: string, overrideProductId?: string) => {
    const pid = overrideProductId ?? productId;
    if (!pageAccessible(profile, pid, pageId)) return;
    const item = findItemById(pid, pageId);
    if (item?.url) window.open(item.url, '_blank');
    if (overrideProductId && overrideProductId !== productId) setProductId(overrideProductId);
    setActiveId(pageId);
  };

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      color: '#374151',
      background: '#fff',
      overflow: 'hidden',
    }}>
      <SidebarA
        profile={profile}
        productId={productId}
        activeId={activeId}
        onSelectPage={handleSelectPage}
      />

      {/* Content area — destination apps own this space */}
      <div style={{ flex: 1, background: '#f8f9fa', minWidth: 0 }} />
    </div>
  );
}

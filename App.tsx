import React, { useState, useEffect } from 'react';

import { ChromeHeader } from './nav/ChromeHeader';
import { AppSidebar } from './nav/AppSidebar';
import { SidebarA } from './nav/SidebarA';
import { SidebarC } from './nav/SidebarC';
import { ProfilePanel, type Variant } from './nav/ProfilePanel';
import {
  PROFILES,
  firstAccessibleProduct,
  firstAccessiblePage,
  productAccessible,
  pageAccessible,
  type Profile,
} from './nav/nav-data';

import { Toaster } from './components/ui/toast';

// ── Root app ──────────────────────────────────────────────────────────

const DEFAULT_PROFILE = PROFILES.enterprise_admin;

export default function App() {
  // Prototype controls
  const [profileKey, setProfileKey] = useState<string>('enterprise_admin');
  const [showCoBrand, setShowCoBrand] = useState(true);
  const [variant, setVariant]        = useState<Variant>('A');
  const profile: Profile = PROFILES[profileKey] ?? DEFAULT_PROFILE;

  // Nav state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [productId, setProductId] = useState<string>(
    () => firstAccessibleProduct(DEFAULT_PROFILE) ?? 'ops'
  );
  const [activeId, setActiveId] = useState<string>(() => {
    if (pageAccessible(DEFAULT_PROFILE, 'ops', 'license-tracker')) return 'license-tracker';
    return firstAccessiblePage(DEFAULT_PROFILE, 'ops') ?? 'license-tracker';
  });

  // Re-validate nav when profile changes
  useEffect(() => {
    if (!productAccessible(profile, productId)) {
      const next = firstAccessibleProduct(profile);
      if (next) {
        setProductId(next);
        setActiveId(firstAccessiblePage(profile, next) ?? 'license-tracker');
      }
    } else if (!pageAccessible(profile, productId, activeId)) {
      setActiveId(firstAccessiblePage(profile, productId) ?? 'license-tracker');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileKey]);

  const handleSelectProduct = (nextProductId: string, nextPageId?: string) => {
    setProductId(nextProductId);
    setActiveId(nextPageId ?? firstAccessiblePage(profile, nextProductId) ?? 'license-tracker');
  };

  const handleSelectPage = (pageId: string, overrideProductId?: string) => {
    const pid = overrideProductId ?? productId;
    if (!pageAccessible(profile, pid, pageId)) return;
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
      {/* Chrome header */}
      <ChromeHeader profile={profile} showCoBrand={showCoBrand} />

      {/* Body row: sidebar + content */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>

        {variant === 'A' && (
          <SidebarA
            profile={profile}
            productId={productId}
            activeId={activeId}
            onSelectPage={handleSelectPage}
          />
        )}
        {variant === 'B' && (
          <AppSidebar
            profile={profile}
            productId={productId}
            activeId={activeId}
            collapsed={sidebarCollapsed}
            onSelectProduct={handleSelectProduct}
            onSelectPage={handleSelectPage}
            onToggleCollapsed={() => setSidebarCollapsed(c => !c)}
          />
        )}
        {variant === 'C' && (
          <SidebarC
            profile={profile}
            productId={productId}
            activeId={activeId}
            onSelectProduct={handleSelectProduct}
            onSelectPage={handleSelectPage}
          />
        )}

        {/* Content area — destination apps own this space */}
        <div style={{ flex: 1, background: '#f8f9fa', minWidth: 0 }} />
      </div>

      {/* Prototype controls */}
      <ProfilePanel
        profile={profile}
        showCoBrand={showCoBrand}
        variant={variant}
        onProfileChange={setProfileKey}
        onCoBrandChange={setShowCoBrand}
        onVariantChange={setVariant}
      />

      <Toaster />
    </div>
  );
}

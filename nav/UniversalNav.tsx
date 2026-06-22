import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SidebarA } from './SidebarA';
import { PROFILES, IA, findPageByUrlPath } from './nav-data';

const PROFILE = PROFILES.enterprise_admin;

export function UniversalNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const urlMatch = findPageByUrlPath(location.pathname);
  const urlProductId = urlMatch?.productId ?? 'ops';
  const urlActiveId = urlMatch?.pageId ?? 'transactions';

  const [productId, setProductId] = useState(urlProductId);
  const [activeId, setActiveId] = useState(urlActiveId);

  // Keep in sync when URL changes (back/forward navigation)
  useEffect(() => {
    setProductId(urlProductId);
    setActiveId(urlActiveId);
  }, [location.pathname]);

  const handleSelectPage = (pageId: string, pid: string) => {
    for (const g of IA[pid]?.groups ?? []) {
      const item = g.items.find(i => i.id === pageId);
      if (item?.url) {
        if (pid === 'ops') {
          // Same app — use React Router (no page reload)
          navigate(new URL(item.url).pathname);
        } else {
          // Cross-app — open in new tab
          window.open(item.url, '_blank');
        }
        return;
      }
    }
    // No URL yet — track active state locally
    setActiveId(pageId);
    if (pid !== productId) setProductId(pid);
  };

  return (
    <SidebarA
      profile={PROFILE}
      productId={productId}
      activeId={activeId}
      onSelectPage={handleSelectPage}
    />
  );
}

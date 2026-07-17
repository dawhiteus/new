import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SidebarA } from './SidebarA';
import { PROFILES, IA, findPageByUrlPath, findItemById } from './nav-data';

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
    const item = findItemById(pid, pageId);
    if (item?.url) {
      const itemUrl = new URL(item.url);
      const isDev = window.location.hostname === 'localhost';
      const sameHost = isDev || itemUrl.hostname === window.location.hostname;
      if (sameHost) {
        navigate(itemUrl.pathname);
      } else {
        window.location.href = item.url;
      }
      return;
    }
    // Parent item with children or no URL — track active state locally
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

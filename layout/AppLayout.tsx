import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { UniversalNav } from '../nav/UniversalNav';
import { AIDrawerProvider, useAIDrawer } from '../context/AIDrawerContext';
import { AIDrawer } from '../components/ai-drawer';
import { Toaster } from '../components/ui/toast';

function LayoutInner() {
  const location = useLocation();
  const { isOpen, isExpanded, agentCard, dealContext, closeDrawer, toggleExpand } = useAIDrawer();

  const isFullscreen = location.pathname === '/workplace/liquid-ai';

  if (isFullscreen) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--surface-page)' }}>
        <Outlet />
        <Toaster />
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      fontFamily: 'Inter, sans-serif',
    }}>
      <UniversalNav />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          overflow: 'auto',
          paddingRight: isOpen ? 424 : 0,
          transition: 'padding-right 350ms cubic-bezier(0.23,1,0.32,1)',
          backgroundColor: 'var(--surface-page)',
        }}
      >
        <Outlet />
      </div>

      <AnimatePresence mode="wait">
        {isOpen && (
          <AIDrawer
            isOpen={isOpen}
            onClose={closeDrawer}
            isExpanded={isExpanded}
            onToggleExpand={toggleExpand}
            agentCard={agentCard}
            dealContext={dealContext}
          />
        )}
      </AnimatePresence>

      <Toaster />
    </div>
  );
}

export function AppLayout() {
  return (
    <AIDrawerProvider>
      <LayoutInner />
    </AIDrawerProvider>
  );
}

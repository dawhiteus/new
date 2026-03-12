import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { BrokerFlow } from './components/BrokerFlow';
import { LiquidAI } from './components/LiquidAI';
import { AIDrawer } from './components/ai-drawer';
import { AnimatePresence } from 'motion/react';
import type { AgentCard, Deal } from './components/BrokerFlow';
import { Toaster } from './components/ui/toast';

type ViewType = 'broker-flow' | 'liquid-ai';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('broker-flow');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false);
  const [isAIDrawerExpanded, setIsAIDrawerExpanded] = useState(false);
  const [dealToView, setDealToView] = useState<string | null>(null);

  // Agent card context passed from BrokerFlow into the AI Drawer
  const [activeAgentCard, setActiveAgentCard] = useState<AgentCard | null>(null);
  const [activeDealContext, setActiveDealContext] = useState<Deal | null>(null);

  const handleAgentCardOpen = (card: AgentCard, deal: Deal) => {
    setActiveAgentCard(card);
    setActiveDealContext(deal);
    setIsAIDrawerOpen(true);
    setIsAIDrawerExpanded(false);
  };

  const handleAIDrawerClose = () => {
    setIsAIDrawerOpen(false);
    setIsAIDrawerExpanded(false);
    // Keep agent context so the drawer can animate out gracefully
    setTimeout(() => {
      setActiveAgentCard(null);
      setActiveDealContext(null);
    }, 400);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'broker-flow':
        return (
          <BrokerFlow
            onAIAssistantOpen={handleAgentCardOpen}
            isAIDrawerOpen={isAIDrawerOpen}
            highlightedDealId={dealToView}
          />
        );
      case 'liquid-ai':
        return <LiquidAI />;
      default:
        return (
          <BrokerFlow
            onAIAssistantOpen={handleAgentCardOpen}
            isAIDrawerOpen={isAIDrawerOpen}
            highlightedDealId={dealToView}
          />
        );
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
      {/* Sidebar — hidden on Liquid AI view */}
      {currentView !== 'liquid-ai' && (
        <Sidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      )}

      {/* Main Content Area */}
      {currentView === 'liquid-ai' ? (
        <div>{renderCurrentView()}</div>
      ) : (
        <div
          className="transition-all duration-300"
          style={{ marginLeft: sidebarOpen ? '256px' : '64px' }}
        >
          {renderCurrentView()}
        </div>
      )}

      {/* AI Drawer — agent-aware */}
      <AnimatePresence mode="wait">
        {isAIDrawerOpen && (
          <AIDrawer
            isOpen={isAIDrawerOpen}
            onClose={handleAIDrawerClose}
            isExpanded={isAIDrawerExpanded}
            onToggleExpand={() => setIsAIDrawerExpanded(!isAIDrawerExpanded)}
            agentCard={activeAgentCard}
            dealContext={activeDealContext}
          />
        )}
      </AnimatePresence>

      {/* Toast notifications */}
      <Toaster />
    </div>
  );
}

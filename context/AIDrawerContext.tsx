import React, { createContext, useContext, useState, useCallback } from 'react';
import type { AgentCard, Deal } from '../components/BrokerFlow';

interface AIDrawerState {
  isOpen: boolean;
  isExpanded: boolean;
  agentCard: AgentCard | null;
  dealContext: Deal | null;
}

interface AIDrawerContextValue extends AIDrawerState {
  openDrawer: (card: AgentCard, deal: Deal) => void;
  openGeneric: () => void;
  closeDrawer: () => void;
  toggleExpand: () => void;
}

const AIDrawerContext = createContext<AIDrawerContextValue | null>(null);

export function AIDrawerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AIDrawerState>({
    isOpen: false,
    isExpanded: false,
    agentCard: null,
    dealContext: null,
  });

  const openDrawer = useCallback((card: AgentCard, deal: Deal) => {
    setState({ isOpen: true, isExpanded: false, agentCard: card, dealContext: deal });
  }, []);

  const openGeneric = useCallback(() => {
    setState((s) => ({ ...s, isOpen: true, isExpanded: false }));
  }, []);

  const closeDrawer = useCallback(() => {
    setState((s) => ({ ...s, isOpen: false, isExpanded: false }));
    setTimeout(() => {
      setState((s) => ({ ...s, agentCard: null, dealContext: null }));
    }, 400);
  }, []);

  const toggleExpand = useCallback(() => {
    setState((s) => ({ ...s, isExpanded: !s.isExpanded }));
  }, []);

  return (
    <AIDrawerContext.Provider value={{ ...state, openDrawer, openGeneric, closeDrawer, toggleExpand }}>
      {children}
    </AIDrawerContext.Provider>
  );
}

export function useAIDrawer() {
  const ctx = useContext(AIDrawerContext);
  if (!ctx) throw new Error('useAIDrawer must be used inside AIDrawerProvider');
  return ctx;
}

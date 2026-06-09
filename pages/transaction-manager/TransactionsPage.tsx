import React from 'react';
import { BrokerFlow } from '../../components/BrokerFlow';
import { useAIDrawer } from '../../context/AIDrawerContext';
import type { AgentCard, Deal } from '../../components/BrokerFlow';

export default function TransactionsPage() {
  const { openDrawer, isOpen } = useAIDrawer();

  const handleAgentCardOpen = (card: AgentCard, deal: Deal) => {
    openDrawer(card, deal);
  };

  return (
    <BrokerFlow
      onAIAssistantOpen={handleAgentCardOpen}
      isAIDrawerOpen={isOpen}
    />
  );
}

import React from 'react';
import { FundingSources } from '../../components/FundingSources';
import { useAIDrawer } from '../../context/AIDrawerContext';

export default function FundingSourcesPage() {
  const { openGeneric, isOpen } = useAIDrawer();
  return <FundingSources onAIAssistantOpen={openGeneric} isAIDrawerOpen={isOpen} />;
}

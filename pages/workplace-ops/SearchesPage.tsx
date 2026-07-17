import React from 'react';
import { WorkplaceSearches } from '../../components/WorkplaceSearches';
import { useAIDrawer } from '../../context/AIDrawerContext';

export default function SearchesPage() {
  const { openGeneric, isOpen } = useAIDrawer();
  return <WorkplaceSearches onAIAssistantOpen={openGeneric} isAIDrawerOpen={isOpen} />;
}

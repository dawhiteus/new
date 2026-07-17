import React from 'react';
import { WorkplaceTeams } from '../../components/WorkplaceTeams';
import { useAIDrawer } from '../../context/AIDrawerContext';

export default function TeamsPage() {
  const { openGeneric, isOpen } = useAIDrawer();
  return <WorkplaceTeams onAIAssistantOpen={openGeneric} isAIDrawerOpen={isOpen} />;
}
